import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, Globe, Settings, ShieldAlert, Play, Sliders, BrainCircuit, ScanFace, RotateCcw, ChevronDown, Gauge, Zap, MessageSquare, Trash2, Power, Move } from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumToast, QuantumIcon, QuantumInput, YusraLogo } from './QuantumComponents'; // Import YusraLogo
import { geminiService } from '../services/geminiService';
import { voiceService, VoiceConfig } from '../services/voiceService';
// FIX: systemService was not properly exported. Corrected in services/systemService.ts
import { systemService } from '../services/systemService';
import { databaseService } from '../services/database';
import { ChatMessage, Language, LearnedTraits } from '../types';

const VOICE_PRESETS = [
  { id: 'standard', label: 'Standard', rate: 1.0, pitch: 1.0 },
  { id: 'executive', label: 'Executive', rate: 0.9, pitch: 0.95 },
  { id: 'smart', label: 'Smart Speed', rate: 1.25, pitch: 1.0 },
  { id: 'deep', label: 'Deep Focus', rate: 0.85, pitch: 0.8 }
];

interface YusraProps {
  parentLanguage?: Language;
}

export const YusraAssistant: React.FC<YusraProps> = ({ parentLanguage = Language.EN }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inputMode, setInputMode] = useState<'vac' | 'ptt'>('vac');
  const [language, setLanguage] = useState<Language>(parentLanguage);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Floating / Dragging State
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  // Settings State
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedTone, setSelectedTone] = useState<LearnedTraits['tone']>('formal');
  const [vadThreshold, setVadThreshold] = useState(20);
  
  // Voice Settings State
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({ rate: 1.0, pitch: 1.0, voiceURI: '' });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // VAD Visualization State
  const [micVolume, setMicVolume] = useState(0);
  const stopVadRef = useRef<(() => void) | null>(null);

  // God Mode State & Critical Commands
  const [isGodMode, setIsGodMode] = useState(systemService.isGodMode());
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  
  const GOD_MODE_VOICE_TRIGGERS = [
      "god mode initialize yusra",
      "god mood initialize yusra",
      "god mode activate yusra",
      "god mood activate yusra",
      "ইউসরা গড মোড ইনিশিয়ালাইজ করো",
      "ইউসরা গড মোড চালু করো",
      "yusra boss activate god mode"
  ];

  // Learning State
  const [isLearning, setIsLearning] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: parentLanguage === Language.EN 
        ? "Hello! I am Yusra, your Virtual CEO. How can I accelerate your business today?"
        : "নমস্কার! আমি ইউসরা, আপনার ভার্চুয়াল সিইও। আজ আমি কীভাবে আপনার ব্যবসায় সাহায্য করতে পারি?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync with global language changes
    setLanguage(parentLanguage);
  }, [parentLanguage]);

  useEffect(() => {
    // Subscribe to system changes
    const unsub = systemService.subscribe((state) => {
        setIsGodMode(state.isGodModeActive);
    });
    
    // Handle Window Resize to keep icon in bounds
    const handleResize = () => {
        setPosition(prev => ({
            x: Math.min(prev.x, window.innerWidth - 80),
            y: Math.min(prev.y, window.innerHeight - 80)
        }));
    };
    window.addEventListener('resize', handleResize);

    return () => {
        unsub();
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  // DRAG LOGIC
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
      // Don't drag if clicking close or buttons inside (if we were dragging a panel)
      // For the floating bubble, entire thing is handle
      setIsDragging(true);
      setHasMoved(false);
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      dragStartRef.current = { x: clientX - position.x, y: clientY - position.y };
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      setHasMoved(true);
      
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      
      const newX = clientX - dragStartRef.current.x;
      const newY = clientY - dragStartRef.current.y;

      // Boundaries with padding
      const boundedX = Math.max(10, Math.min(window.innerWidth - 90, newX));
      const boundedY = Math.max(10, Math.min(window.innerHeight - 90, newY));

      setPosition({ x: boundedX, y: boundedY });
  };

  const handleDragEnd = () => {
      setIsDragging(false);
  };

  // Click handler only triggers if not dragged
  const handleIconClick = () => {
      if (!hasMoved) {
          toggleAssistant();
      }
  };

  // Load User Preferences on Mount
  useEffect(() => {
      const currentUser = databaseService.getCurrentUser();
      if (currentUser) {
          if (currentUser.voicePreferences) {
              setVoiceConfig(currentUser.voicePreferences);
          }
          if (currentUser.learnedTraits) {
              setSelectedTone(currentUser.learnedTraits.tone);
          }
      }
      setVadThreshold(voiceService.getVadThreshold());
  }, []);

  // Periodic Learning Trigger (Background Process)
  useEffect(() => {
    if (messages.length >= 10 && messages.length % 10 === 0) {
       triggerLearning();
    }
  }, [messages.length]);

  // FIX: Define triggerLearning function
  const triggerLearning = async () => {
    setIsLearning(true);
    try {
      const currentUser = databaseService.getCurrentUser();
      if (currentUser) {
        const learnedTraits = await geminiService.learnFromInteractions(messages);
        if (learnedTraits) {
          // Merge with existing traits, prioritize tone from settings if already set
          const existingTraits = currentUser.learnedTraits || {
            tone: selectedTone, // Default to current settings if no existing trait
            frequentTopics: [],
            preferredResponseLength: 'short',
            communicationStyle: 'Standard',
            lastUpdated: 0,
          };

          const newTraits: LearnedTraits = {
            ...existingTraits,
            ...learnedTraits, // Merge learned traits
            tone: existingTraits.tone, // Retain user-selected tone
            lastUpdated: Date.now(),
          };
          await databaseService.updateUserTraits(currentUser.id, newTraits);
        }
      }
    } catch (error) {
      console.error("Error during AI learning:", error);
    } finally {
      setIsLearning(false);
    }
  };

  // Load voices when language changes or window voices load
  useEffect(() => {
    const loadVoices = () => {
      const voices = voiceService.getAvailableVoices(language);
      
      // Sort voices: Premium/Natural voices first
      voices.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          const isPremiumA = aName.includes('google') || aName.includes('microsoft') || aName.includes('premium') || aName.includes('natural');
          const isPremiumB = bName.includes('google') || bName.includes('microsoft') || bName.includes('premium') || bName.includes('natural');
          
          if (isPremiumA && !isPremiumB) return -1;
          if (!isPremiumA && isPremiumB) return 1;
          return aName.localeCompare(bName);
      });

      setAvailableVoices(voices);
      
      // Set default voice if none selected or current selection is invalid for language
      const isCurrentVoiceValid = voices.some(v => v.voiceURI === voiceConfig.voiceURI);
      if ((!voiceConfig.voiceURI || !isCurrentVoiceValid) && voices.length > 0) {
        const defaultVoice = voices[0];
        setVoiceConfig(prev => ({ ...prev, voiceURI: defaultVoice.voiceURI }));
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleSaveSettings = async () => {
      const currentUser = databaseService.getCurrentUser();
      if (currentUser) {
          // Save Voice Preferences
          // FIX: Ensure voiceURI, rate, and pitch are always provided as string/numbers
          await databaseService.updateVoicePreferences(currentUser.id, {
            voiceURI: voiceConfig.voiceURI || '', // Provide default empty string if undefined
            rate: voiceConfig.rate ?? 1.0, // Provide default if undefined
            pitch: voiceConfig.pitch ?? 1.0, // Provide default if undefined
          });
          
          // Save Tone (Update Learned Traits)
          const currentTraits = currentUser.learnedTraits || {
              frequentTopics: [],
              preferredResponseLength: 'short',
              communicationStyle: 'Standard',
              lastUpdated: Date.now()
          };
          
          await databaseService.updateUserTraits(currentUser.id, {
              ...currentTraits,
              tone: selectedTone
          });

          showToast("Yusra configuration updated successfully.", 'success');
      }
      setShowSettings(false);
  };

  const resetVoiceConfig = () => {
      setVoiceConfig(prev => ({ ...prev, rate: 1.0, pitch: 1.0 }));
      setAutoSpeak(true);
      setSelectedTone('formal');
      updateVadThreshold(20);
      showToast("Assistant settings reset to default.", 'info');
  };

  const clearMemory = () => {
      setMessages([{
          id: Date.now().toString(),
          role: 'assistant',
          content: "Memory cleared. Starting fresh context.",
          timestamp: new Date()
      }]);
      showToast("Conversation context wiped.", 'info');
  };

  const applyPreset = (preset: typeof VOICE_PRESETS[0]) => {
      setVoiceConfig(prev => ({ ...prev, rate: preset.rate, pitch: preset.pitch }));
      // Optional: Speak a sample
      voiceService.speak("Voice parameters adjusted.", language, { ...voiceConfig, rate: preset.rate, pitch: preset.pitch });
  };

  // ADDED: testVoice function
  const testVoice = () => {
    showToast("Testing voice configuration...", "info");
    voiceService.speak("This is a voice test from Yusra. Configuration applied.", language, voiceConfig);
  };

  const toggleAssistant = () => setIsOpen(!isOpen);

  const toggleLanguage = () => {
    setLanguage(prev => prev === Language.EN ? Language.BN : Language.EN);
  };

  const updateVadThreshold = (val: number) => {
      setVadThreshold(val);
      voiceService.setVadThreshold(val);
  };

  const startListeningSession = async () => {
    setIsListening(true);
    
    // START VAD VISUALIZATION
    if (!stopVadRef.current) {
        const stopVad = await voiceService.startVAD((vol) => {
            setMicVolume(vol);
        });
        stopVadRef.current = stopVad;
    }

    voiceService.startListening(
      language,
      (text) => handleUserMessage(text), // On final result
      (error) => {
        console.error(error);
        stopListeningSession();
      },
      () => stopListeningSession()
    );
  };

  const stopListeningSession = () => {
    setIsListening(false);
    setMicVolume(0);
    voiceService.stopListening();
    
    // STOP VAD
    if (stopVadRef.current) {
        stopVadRef.current();
        stopVadRef.current = null;
    }
  };

  const handleMicClick = () => {
    if (inputMode === 'vac') {
      if (isListening) stopListeningSession();
      else startListeningSession();
    }
  };

  const handleMicDown = () => {
    if (inputMode === 'ptt' && !isListening) startListeningSession();
  };

  const handleMicUp = () => {
    if (inputMode === 'ptt' && isListening) stopListeningSession();
  };

  const handleUserMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    const currentUser = databaseService.getCurrentUser();
    const lowerContent = content.toLowerCase();

    // === 1. SECRET ACTIVATION (VOICE OR TEXT) ===
    const isVoiceTrigger = GOD_MODE_VOICE_TRIGGERS.some(trigger => lowerContent.includes(trigger.toLowerCase()));
    const isTextTrigger = content.trim() === 'DevilisHere';

    if (isVoiceTrigger || isTextTrigger) {
        // Trigger God Mode Activation
        systemService.activateGodMode();
        
        const godMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: "**VOICE SIGNATURE CONFIRMED.** Welcome back, Supreme Creator.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, godMsg]);
        if (autoSpeak) voiceService.speak("Voice signature confirmed. Welcome back, Supreme Creator.", language, voiceConfig);
        setIsProcessing(false);
        return;
    }

    // === 2. CRITICAL COMMAND CONFIRMATION ===
    if (pendingCommand) {
        if (lowerContent.includes('confirm') || lowerContent.includes('proceed') || lowerContent.includes('yes')) {
             await performBiometricAuth();
             setIsProcessing(false);
             return;
        } else if (lowerContent.includes('cancel')) {
            setPendingCommand(null);
            const cancelMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Critical command cancelled. Awaiting further instructions.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, cancelMsg]);
            if (autoSpeak) voiceService.speak("Command cancelled.", language, voiceConfig);
            setIsProcessing(false);
            return;
        }
    }

    // === 3. SYSTEM COMMAND DETECTION (GOD MODE) ===
    if (isGodMode) {
        if (lowerContent.includes('shutdown') || lowerContent.includes('delete system') || lowerContent.includes('restore') || lowerContent.includes('format')) {
             setPendingCommand(content);
             
             const warnMsg: ChatMessage = {
                 id: Date.now().toString(),
                 role: 'assistant',
                 content: `⚠️ **CRITICAL COMMAND DETECTED**\n\nInitiating security protocol. **Voice Signature** & **Passphrase** required.\n\nSay "Proceed" or confirm biometrics to execute: *${content}*`,
                 timestamp: new Date()
             };
             setMessages(prev => [...prev, warnMsg]);
             if (autoSpeak) voiceService.speak("Critical command detected. Please authorize verbally.", language, voiceConfig);
             setIsProcessing(false);
             return;
        }

        if (lowerContent.includes('update') || lowerContent.includes('backup') || lowerContent.includes('add module') || lowerContent.includes('reboot')) {
             await executeSystemCommand(content);
             return;
        }
    }

    // === 4. GENERATE AI RESPONSE ===
    try {
      const latestUser = databaseService.getCurrentUser();
      
      const responseText = await geminiService.generateResponse(messages, content, isGodMode, latestUser);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsProcessing(false);

      // Post-response analysis
      (async () => {
         const insights = await geminiService.analyzeResponseInsights(responseText);
         if (insights) {
             const freshUser = databaseService.getCurrentUser();
             if (freshUser) {
                 const existingTopics = freshUser.learnedTraits?.frequentTopics || [];
                 const uniqueTopics = Array.from(new Set([...existingTopics, ...insights.topics])).slice(-15);
                 
                 const newTraits: LearnedTraits = {
                     ...(freshUser.learnedTraits || { tone: 'formal', frequentTopics: [], preferredResponseLength: 'short', communicationStyle: 'Standard', lastUpdated: 0 }),
                     frequentTopics: uniqueTopics,
                     lastUpdated: Date.now(),
                     latestInteractionSentiment: insights.sentiment
                 };
                 
                 await databaseService.updateUserTraits(freshUser.id, newTraits);
             }
         }
      })();

      if (autoSpeak) {
        setIsSpeaking(true);
        await voiceService.speak(responseText, language, voiceConfig);
        setIsSpeaking(false);
      }

    } catch (error) {
      setIsProcessing(false);
      console.error("Yusra Error:", error);
    }
  };

  // Perform Biometric Check (Simulated Voice/Face)
  const performBiometricAuth = async () => {
      const success = await databaseService.verifyBiometric('open the gate'); // Mock check
      if (success && pendingCommand) {
          const cmd = pendingCommand;
          setPendingCommand(null);
          executeSystemCommand(cmd);
      } else {
          showToast("Biometric verification failed. Authorization denied.", 'error');
          voiceService.speak("Authorization failed.", language, voiceConfig);
      }
  };

  const executeSystemCommand = async (commandString: string) => {
     const sysResponse = await systemService.executeSystemCommand(commandString);
     const sysMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `\`\`\`system\n${sysResponse}\n\`\`\``,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, sysMsg]);
    if (autoSpeak) voiceService.speak("Command executed successfully.", language, voiceConfig);
    setIsProcessing(false);
  };

  const renderVoiceOptions = () => {
      if (availableVoices.length === 0) return <option>Scanning for neural voices...</option>;
      
      if (language === Language.EN) {
           const regions: {[key: string]: SpeechSynthesisVoice[]} = {
              'Premium': [], 'US': [], 'UK': [], 'Other': []
          };
          
          availableVoices.forEach(v => {
              if (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('premium') || v.name.includes('natural')) {
                  regions['Premium'].push(v);
              } else if (v.lang.includes('US')) {
                  regions['US'].push(v);
              } else if (v.lang.includes('GB') || v.lang.includes('UK')) {
                  regions['UK'].push(v);
              } else {
                  regions['Other'].push(v);
              }
          });

          return (
              <>
                  {regions['Premium'].length > 0 && (
                      <optgroup label="Neural / Premium">
                          {regions['Premium'].map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name.replace(/Microsoft|Google/g, '').trim()}</option>)}
                      </optgroup>
                  )}
                  {regions['US'].length > 0 && (
                      <optgroup label="United States">
                          {regions['US'].map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name.replace(/Microsoft|Google/g, '').trim()}</option>)}
                      </optgroup>
                  )}
                  {regions['UK'].length > 0 && (
                      <optgroup label="United Kingdom">
                          {regions['UK'].map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name.replace(/Microsoft|Google/g, '').trim()}</option>)}
                      </optgroup>
                  )}
                   {regions['Other'].length > 0 && (
                      <optgroup label="International">
                          {regions['Other'].map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name.replace(/Microsoft|Google/g, '').trim()}</option>)}
                      </optgroup>
                  )}
              </>
          );
      }

      return availableVoices.map(v => (
          <option key={v.voiceURI} value={v.voiceURI}>
              {v.name.replace(/Microsoft|Google/g, '').trim()} {v.name.includes('Google') || v.name.includes('Microsoft') ? '(Premium)' : ''}
          </option>
      ));
  };

  return (
    <>
      {/* === FLOATING DRAGGABLE TRIGGER BUTTON === */}
      {!isOpen && (
        <div
          style={{ 
              position: 'fixed', 
              left: `${position.x}px`, 
              top: `${position.y}px`, 
              zIndex: 9999,
              touchAction: 'none'
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onClick={handleIconClick}
          className="cursor-move"
        >
            <div className={`group flex items-center justify-center w-20 h-20 rounded-full shadow-[0_0_50px_rgba(0,212,255,0.6)] transition-transform hover:scale-110 hover:shadow-[0_0_80px_rgba(0,255,163,0.8)] ${isDragging ? 'cursor-grabbing scale-105' : 'animate-float'} ${isGodMode ? 'bg-gradient-to-r from-neon-pink to-red-600 border-2 border-neon-yellow' : 'bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-purple border border-white/20'}`}>
                {/* Inner Glowing Orb */}
                <div className="absolute inset-0 rounded-full bg-white opacity-15 animate-pulse-strong" /> {/* Stronger pulse */}
                <div className="absolute inset-2 rounded-full border border-white/40 animate-[spin_8s_linear_infinite]" /> {/* Faster spin, thicker border */}
                
                <YusraLogo size="md" animated={true} /> {/* Using new YusraLogo */}
                
                {/* Ripples - more pronounced */}
                <div className="absolute -inset-4 rounded-full border-2 border-neon-blue/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
            </div>
        </div>
      )}

      {/* === MAIN INTERFACE === */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-50 w-full md:w-[400px] h-full md:h-auto flex flex-col items-end animate-in fade-in slide-in-from-bottom-10 duration-300">
          <QuantumCard className={`w-full h-full md:h-[650px] flex flex-col shadow-2xl p-0 overflow-hidden rounded-none md:rounded-2xl ${isGodMode ? 'border-neon-pink/70 shadow-[0_0_40px_rgba(255,110,199,0.5)]' : 'border-neon-purple/50'}`}>
            {/* Header */}
            <div className={`p-4 border-b-2 border-glass-strong flex justify-between items-center backdrop-blur-md shrink-0 ${isGodMode ? 'bg-red-900/50' : 'bg-quantum-deep/90'}`}> {/* Thicker border, darker bg */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isGodMode ? 'bg-gradient-to-tr from-red-600 to-neon-pink' : 'bg-gradient-to-tr from-neon-purple to-neon-blue'}`}>
                  <YusraLogo size="sm" animated={true} /> {/* Using new YusraLogo */}
                </div>
                <div>
                  <h3 className={`font-heading font-bold tracking-wide ${isGodMode ? 'text-neon-pink neon-glow-pink' : 'text-white neon-glow-blue'}`}> {/* Text glows */}
                    {isGodMode ? 'YUSRA [GOD MODE]' : 'YUSRA'}
                  </h3>
                  <div className="flex items-center gap-2">
                     <p className="text-xs text-neon-blue font-mono">{isGodMode ? 'Ultra Assistant • UNLOCKED' : 'Virtual CEO • Online'}</p>
                     {isLearning && <BrainCircuit className="w-3 h-3 text-neon-green animate-pulse-strong" />} {/* Stronger pulse */}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${showSettings ? 'text-neon-blue drop-shadow-lg' : 'text-gray-400'} hover:text-white`}
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button onClick={toggleLanguage} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-neon-green text-xs font-bold flex items-center gap-1 font-mono">
                  <Globe className="w-3 h-3" />
                  {language === Language.EN ? 'EN' : 'BN'}
                </button>
                <button onClick={toggleAssistant} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="relative flex-1 overflow-hidden flex flex-col bg-quantum-midnight/90 backdrop-blur-md">
              {showSettings ? (
                // Settings Overlay
                <div className="absolute inset-0 z-10 bg-quantum-deep/95 backdrop-blur-md p-6 animate-page-enter flex flex-col overflow-y-auto custom-scrollbar">
                  <h4 className="text-white font-heading font-semibold mb-6 flex items-center gap-2 pb-2 border-b border-white/10">
                    <Settings className="w-5 h-5 text-neon-blue" />
                    Assistant Configuration
                  </h4>
                  
                  <div className="space-y-6 flex-1">
                    {/* General Behavior */}
                    <div>
                        <label className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-3 block">General Behavior</label>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-glass-light border border-glass-border">
                             <div className="flex items-center gap-2">
                                 <Volume2 className="w-4 h-4 text-neon-blue" />
                                 <span className="text-sm text-gray-200">Auto-Read Responses</span>
                             </div>
                             <div 
                                className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${autoSpeak ? 'bg-neon-green/30 border border-neon-green shadow-[0_0_10px_rgba(0,255,157,0.3)]' : 'bg-gray-700'}`}
                                onClick={() => setAutoSpeak(!autoSpeak)}
                             >
                                 <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform ${autoSpeak ? 'translate-x-5' : ''}`} />
                             </div>
                        </div>
                    </div>

                    {/* Personality Matrix - Tone Selection */}
                    <div>
                        <label className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-3 block">Personality Core</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'formal', label: 'Formal', desc: 'Professional' },
                                { id: 'casual', label: 'Casual', desc: 'Relaxed' },
                                { id: 'direct', label: 'Direct', desc: 'Concise' },
                                { id: 'technical', label: 'Technical', desc: 'Precise' }
                            ].map((tone) => (
                                <button
                                    key={tone.id}
                                    onClick={() => setSelectedTone(tone.id as any)}
                                    className={`p-2 rounded-lg text-left border transition-all ${
                                        selectedTone === tone.id
                                        ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                        : 'bg-glass-light border-glass-border text-gray-400 hover:bg-glass-medium'
                                    }`}
                                >
                                    <div className="text-xs font-bold capitalize mb-0.5">{tone.label}</div>
                                    <div className="text-[10px] opacity-70">{tone.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Mode */}
                    <div>
                      <label className="block text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-3">Microphone Mode</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setInputMode('vac')}
                          className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                            inputMode === 'vac'
                              ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_20px_rgba(0,212,255,0.4)]'
                              : 'bg-glass-light border-glass-border text-gray-400 hover:bg-glass-medium'
                          }`}
                        >
                          Voice Activity
                          <span className="block text-[10px] opacity-60 mt-1 font-normal font-sans">Tap to toggle</span>
                        </button>
                        <button
                          onClick={() => setInputMode('ptt')}
                          className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                            inputMode === 'ptt'
                              ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                              : 'bg-glass-light border-glass-border text-gray-400 hover:bg-glass-medium'
                          }`}
                        >
                          Push-to-Talk
                          <span className="block text-[10px] opacity-60 mt-1 font-normal font-sans">Hold to speak</span>
                        </button>
                      </div>
                    </div>

                    {/* VAD Sensitivity */}
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span className="font-heading font-bold uppercase tracking-widest text-[10px]">Noise Gate</span>
                            <span className="text-neon-blue font-mono">{vadThreshold}</span>
                        </div>
                        <div className="relative flex items-center gap-3">
                            <span className="text-[10px] text-gray-500 font-mono">SENSITIVE</span>
                            <input 
                                type="range" min="0" max="100" step="1"
                                value={vadThreshold}
                                onChange={(e) => updateVadThreshold(parseInt(e.target.value))}
                                className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue hover:accent-neon-green"
                            />
                            <span className="text-[10px] text-gray-500 font-mono">STRICT</span>
                        </div>
                    </div>

                    {/* Voice Synthesis Settings */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Volume2 className="w-4 h-4" /> Voice Synthesis
                            </label>
                            <button onClick={resetVoiceConfig} className="text-[10px] flex items-center gap-1 text-gray-500 hover:text-white">
                                <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                        </div>
                        
                        <div>
                            <span className="text-xs text-neon-blue mb-1 block font-mono">Voice Persona</span>
                            <div className="relative group">
                                <select 
                                    className="w-full bg-black/40 border border-glass-border rounded-lg p-3 text-sm text-white appearance-none focus:border-neon-blue focus:outline-none transition-colors group-hover:border-neon-blue/50"
                                    value={voiceConfig.voiceURI}
                                    onChange={(e) => setVoiceConfig({...voiceConfig, voiceURI: e.target.value})}
                                >
                                    {renderVoiceOptions()}
                                </select>
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500 group-hover:text-neon-blue transition-colors">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Voice Presets */}
                        <div>
                            <span className="text-[10px] text-gray-400 mb-2 block font-heading font-bold uppercase tracking-widest">Quick Presets</span>
                            <div className="grid grid-cols-2 gap-2">
                                {VOICE_PRESETS.map(preset => (
                                    <button
                                        key={preset.id}
                                        onClick={() => applyPreset(preset)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                                            voiceConfig.rate === preset.rate && voiceConfig.pitch === preset.pitch
                                            ? 'bg-neon-blue/20 border-neon-blue text-white'
                                            : 'bg-glass-light border-glass-border text-gray-400 hover:bg-glass-medium hover:text-white'
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-2">
                                <span>Speaking Rate</span>
                                <span className="text-neon-blue font-mono">{voiceConfig.rate.toFixed(1)}x</span>
                            </div>
                            <div className="relative flex items-center gap-3">
                                <span className="text-[10px] text-gray-500 font-mono">0.5x</span>
                                <input 
                                    type="range" min="0.5" max="2.0" step="0.1"
                                    value={voiceConfig.rate}
                                    onChange={(e) => setVoiceConfig({...voiceConfig, rate: parseFloat(e.target.value)})}
                                    className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue hover:accent-neon-green"
                                />
                                <span className="text-[10px] text-gray-500 font-mono">2.0x</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-2">
                                <span>Voice Pitch</span>
                                <span className="text-neon-purple font-mono">{voiceConfig.pitch.toFixed(1)}x</span>
                            </div>
                            <div className="relative flex items-center gap-3">
                                <span className="text-[10px] text-gray-500 font-mono">Low</span>
                                <input 
                                    type="range" min="0.5" max="2.0" step="0.1"
                                    value={voiceConfig.pitch}
                                    onChange={(e) => setVoiceConfig({...voiceConfig, pitch: parseFloat(e.target.value)})}
                                    className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-purple hover:accent-neon-pink"
                                />
                                <span className="text-[10px] text-gray-500 font-mono">High</span>
                            </div>
                        </div>

                        <button 
                            onClick={testVoice}
                            className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/10 hover:text-white hover:border-neon-green transition-all flex items-center justify-center gap-2 group"
                        >
                            <Play className="w-3 h-3 group-hover:text-neon-green" /> 
                            <span>Test Voice Configuration</span>
                        </button>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                         <h4 className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <Power className="w-4 h-4 text-neon-red" /> System Actions
                         </h4>
                         <button 
                            onClick={clearMemory}
                            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors text-xs font-bold"
                         >
                             <Trash2 className="w-3 h-3" /> Clear Conversation Memory
                         </button>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <QuantumButton variant="secondary" onClick={handleSaveSettings} className="!py-2 !px-4 text-sm w-full">
                        Save Configuration
                      </QuantumButton>
                    </div>
                  </div>
                </div>
              ) : (
                // Chat Messages
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg font-sans
                        ${msg.role === 'user' 
                          ? (isGodMode ? 'bg-neon-pink/15 border border-neon-pink/50 text-white rounded-br-none backdrop-blur-sm shadow-[0_0_10px_rgba(255,110,199,0.2)]' : 'bg-neon-blue/15 border border-neon-blue/40 text-white rounded-br-none backdrop-blur-sm shadow-[0_0_10px_rgba(0,240,255,0.2)]') // More distinct colors and shadows
                          : 'bg-glass-medium text-gray-100 rounded-bl-none border border-glass-border shadow-[0_0_5px_rgba(255,255,255,0.05)]'}
                      `}>
                        <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }} />
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && !pendingCommand && (
                    <div className="flex justify-start">
                      <div className="bg-glass-medium px-4 py-2.5 rounded-full flex items-center gap-2 border border-glass-border">
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isGodMode ? 'bg-neon-pink neon-glow-pink' : 'bg-neon-purple neon-glow-purple'}`} style={{ animationDelay: '0s' }} /> {/* More glow */}
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isGodMode ? 'bg-red-500 neon-glow-pink' : 'bg-neon-blue neon-glow-blue'}`} style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: '0.4s', backgroundColor: isGodMode ? '#FBFF00' : '#00FF9D' }} />
                      </div>
                    </div>
                  )}
                  
                  {/* Critical Command Confirmation UI */}
                  {pendingCommand && (
                      <div className="mx-4 mt-4 p-4 rounded-xl bg-red-500/10 border-2 border-red-500/70 flex flex-col items-center gap-3 animate-pulse-strong shadow-[0_0_30px_rgba(255,77,109,0.5)]"> {/* Thicker border, stronger shadow/pulse */}
                          <div className="flex items-center gap-2 text-red-500 neon-glow-pink font-heading font-bold uppercase tracking-widest text-sm">
                              <ShieldAlert className="w-5 h-5" />
                              Security Override Required
                          </div>
                          <p className="text-xs text-center text-gray-300">
                              Command: <span className="text-white font-mono">{pendingCommand}</span>
                          </p>
                          <div className="flex gap-2 w-full">
                              <button 
                                onClick={performBiometricAuth}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all text-xs text-red-400 font-bold uppercase"
                              >
                                  <ScanFace className="w-4 h-4" />
                                  Scan Biometrics
                              </button>
                              <button 
                                onClick={() => { setPendingCommand(null); }}
                                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-400"
                              >
                                  Cancel
                              </button>
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono text-center">
                              Say: <span className="text-neon-pink">[REDACTED: CREATOR PASSPHRASE]</span>
                          </div>
                      </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t border-glass-strong backdrop-blur-md shrink-0 ${isGodMode ? 'bg-red-900/30' : 'bg-quantum-deep/70'}`}> {/* Darker background */}
              {isListening && (
                <div className="h-16 w-full mb-3 bg-black/50 rounded-xl border-2 border-white/10 relative overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"> {/* Thicker border, shadow */}
                  {/* Background Pulse */}
                  <div className={`absolute inset-0 opacity-15 transition-opacity duration-100 ${isGodMode ? 'bg-neon-pink' : 'bg-neon-green'}`} style={{ opacity: Math.min(0.4, micVolume / 100) }} /> {/* Stronger pulse background */}
                  
                  {/* Visualizer Bars - Refined (more liquid neon effect) */}
                  <div className="flex items-center justify-center gap-0.5 h-10 w-full z-10">
                      {[...Array(40)].map((_, i) => { // Increased bars for smoother visualizer
                          const vol = micVolume || 0;
                          const baseHeight = 15; // Minimum height
                          const maxWaveHeight = 95; // Max height for wave
                          const waveFrequency = 0.08; // Controls how many waves
                          const waveOffset = Date.now() / 100; // Animates the wave over time - faster
                          
                          // Calculate position relative to center for symmetric falloff
                          const center = 20; // Center bar index
                          const distFromCenter = Math.abs(i - center); 
                          const falloff = 1 - (distFromCenter / center * 0.8); // 1 at center, 0 at edges, softer falloff
                          
                          // Combine volume, wave, and falloff
                          let height = baseHeight + (vol * 1.0) * Math.sin(i * waveFrequency + waveOffset) * falloff; // Stronger volume impact
                          height = Math.min(maxWaveHeight, Math.max(baseHeight, height)); // Ensure within bounds
                          
                          const opacity = Math.min(1, Math.max(0.3, (vol / 50) * falloff)); // Opacity based on volume and falloff - stronger base
                          const shadowIntensity = Math.min(1, Math.max(0.2, (vol / 40) * falloff));

                          return (
                            <div 
                                key={i} 
                                className={`w-1 rounded-full transition-all duration-75 ease-out origin-bottom animate-audio-wave`} 
                                style={{ 
                                    height: `${height}%`, 
                                    opacity: opacity,
                                    transform: `scaleY(1.08)`, // Subtle pump effect
                                    boxShadow: `0 0 ${shadowIntensity * 10}px ${isGodMode ? '#FF6EC7' : '#00FFA3'}`, // Dynamic shadow
                                    background: isGodMode ? `linear-gradient(to top, #FF0055, #FF6EC7)` : `linear-gradient(to top, #00FF9D, #00D4FF)` // Stronger gradients
                                }} 
                            />
                          );
                      })}
                  </div>
                  
                  {/* Threshold Line */}
                  <div 
                    className="absolute w-full border-t border-dashed border-white/50 z-0 pointer-events-none transition-all duration-300" // More visible
                    style={{ bottom: `${Math.min(100, vadThreshold * 1.5)}%` }} 
                  />
                  
                  {/* Status Text */}
                  <div className="absolute bottom-1 right-2 flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse-strong ${micVolume > vadThreshold ? (isGodMode ? 'bg-neon-pink' : 'bg-neon-green') : 'bg-gray-500'}`} /> {/* Stronger pulse */}
                      <span className={`text-[9px] font-mono tracking-wider drop-shadow-md ${micVolume > vadThreshold ? 'text-white' : 'text-gray-500'}`}>
                         {micVolume > vadThreshold ? 'RECEIVING INPUT' : 'LISTENING...'}
                      </span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <QuantumButton 
                  variant={isGodMode ? 'neon' : (isListening ? 'neon' : 'primary')}
                  className={`rounded-full w-14 h-14 p-0 flex-shrink-0 ${isListening ? 'animate-pulse-strong' : ''} ${inputMode === 'ptt' ? 'active:scale-90' : ''} shadow-lg`} // Larger button, stronger pulse, shadow
                  onClick={handleMicClick}
                  onMouseDown={handleMicDown}
                  onMouseUp={handleMicUp}
                  onMouseLeave={handleMicUp}
                  onTouchStart={handleMicDown}
                  onTouchEnd={handleMicUp}
                  title={inputMode === 'ptt' ? 'Hold to speak' : 'Click to listen'}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />} {/* Larger icons */}
                </QuantumButton>
                
                <QuantumInput 
                  placeholder={isGodMode ? "Command System..." : (language === Language.EN ? "Ask Yusra..." : "ইউসরাকে জিজ্ঞাসা করুন...")}
                  className={`flex-1 ${isGodMode ? 'focus:border-neon-pink placeholder-neon-pink/70' : 'focus:border-neon-purple placeholder-gray-500'}`} // Stronger focus border, more visible placeholder
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUserMessage(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  disabled={isListening}
                />
              </div>
            </div>
          </QuantumCard>
          
           <QuantumToast 
             isVisible={toast.visible} 
             message={toast.message} 
             type={toast.type} 
             onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
           />
        </div>
      )}
    </>
  );
};