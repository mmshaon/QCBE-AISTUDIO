

import React, { useState, useEffect, useRef } from 'react';
import { Lock, User, ScanFace, Mic, ArrowRight, Globe } from 'lucide-react';
import { databaseService } from '../services/database';
import { QuantumButton, QuantumInput, QuantumToast, QuantumLogo } from './QuantumComponents';
import { Language } from '../types';
import { voiceService } from '../services/voiceService';

interface LoginProps {
  onLoginSuccess: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, language, onLanguageChange }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'password' | 'face' | 'voice'>('password');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  
  // Simulation Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micVolume, setMicVolume] = useState(0); // Added for voice auth visualizer
  const stopVadRef = useRef<(() => void) | null>(null); // Added for VAD in voice auth

  // Translations
  const t = {
    en: {
      title: "QUANTUM CUBE GATE",
      subtitle: "SECURE GATEWAY ACCESS",
      login: "Login",
      signup: "Initialize Identity",
      secureKey: "Secure Key",
      faceId: "Face ID",
      voiceSig: "Voice Sig",
      establishLink: "Establish Link",
      initIdentity: "Initialize Identity",
      authenticating: "Authenticating...",
      fullName: "Full Entity Name",
      emailPlaceholder: "Neural Link Email",
      passPlaceholder: "Security Token",
      positionFace: "Position your face within the neural scanner.",
      lighting: "Ensure optimal lighting conditions.",
      initiateScan: "Initiate Scan",
      scanning: "Scanning...",
      recitePhrase: "Voice Authorization Required:",
      accessCode: "Command: \"Open the Gate\"",
      startRecording: "Start Recording",
      listening: "Listening...",
      noId: "[ NO ID FOUND? CREATE IDENTITY ]",
      existingUser: "[ EXISTING USER? LOGIN ]",
    },
    bn: {
      title: "কোয়ান্টাম কিউব গেট",
      subtitle: "নিরাপদ গেটওয়ে এক্সেস",
      login: "লগইন",
      signup: "পরিচয় তৈরি করুন",
      secureKey: "গোপন চাবি",
      faceId: "ফেস আইডি",
      voiceSig: "ভয়েস সিগনেচার",
      establishLink: "লিংক স্থাপন করুন",
      initIdentity: "পরিচয় শুরু করুন",
      authenticating: "যাচাই করা হচ্ছে...",
      fullName: "পূর্ণ নাম",
      emailPlaceholder: "নিউরাল লিংক ইমেল",
      passPlaceholder: "সিকিউরিটি টোকেন",
      positionFace: "আপনার মুখ নিউরাল স্ক্যানারের মধ্যে রাখুন।",
      lighting: "পর্যাপ্ত আলো নিশ্চিত করুন।",
      initiateScan: "স্ক্যান শুরু করুন",
      scanning: "স্ক্যান হচ্ছে...",
      recitePhrase: "ভয়েস অনুমোদন প্রয়োজন:",
      accessCode: "বলুন: \"ওপেন দ্য গেট\"",
      startRecording: "রেকর্ডিং শুরু করুন",
      listening: "শুনছি...",
      noId: "[ কোনো আইডি নেই? পরিচয় তৈরি করুন ]",
      existingUser: "[ ইতিমধ্যে একাউন্ট আছে? লগইন ]",
    }
  };

  const strings = language === Language.BN ? t.bn : t.en;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const handleAuth = async () => {
    if (!email || !password) {
      showToast('Credentials required.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const res = await databaseService.register(name, email, password);
        if (res.success) {
          showToast(`Identity Created: Welcome, ${res.user?.name}`, 'success');
          setTimeout(onLoginSuccess, 1000);
        } else {
          showToast(res.error || 'Registration failed', 'error');
        }
      } else {
        const res = await databaseService.login(email, password);
        if (res.success) {
          showToast(`Access Granted: ${res.user?.role === 'god_mode' ? 'GOD MODE ACTIVATED' : 'Welcome Back'}`, 'success');
          setTimeout(onLoginSuccess, 1000);
        } else {
          showToast(res.error || 'Login failed', 'error');
        }
      }
    } catch (e) {
      showToast('System Error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const startFaceScan = async () => {
    setIsLoading(true);
    // Simulate Camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch(e) { console.error("Camera error", e); }
    }
    
    // Simulate Processing
    setTimeout(async () => {
      const success = await databaseService.verifyBiometric('open the gate'); // Mock pass
      setIsLoading(false);
      if (success) {
          // Mock login for demo biometric
          showToast('Biometric Match Confirmed (Simulated)', 'success');
          // In real app, this would exchange a token
          databaseService.login('shaoncmd@gmail.com', 'BadSoul@1989') // Auto log God Mode for demo fun
            .then(res => {
                if(res.success) setTimeout(onLoginSuccess, 1000);
            });
      }
    }, 3000);
  };

  const startVoiceAuth = async () => {
      setIsListening(true);
      // Start VAD for visualization
      if (!stopVadRef.current) {
          const stopVad = await voiceService.startVAD((vol) => {
              setMicVolume(vol);
          });
          stopVadRef.current = stopVad;
      }

      voiceService.startListening(
          language,
          async (text) => {
              setIsListening(false);
              setIsLoading(true);
              
              // Stop VAD after listening
              if (stopVadRef.current) {
                  stopVadRef.current();
                  stopVadRef.current = null;
                  setMicVolume(0);
              }

              // Verify Phrase
              const isValid = await databaseService.verifyBiometric(text);
              if (isValid) {
                  showToast('Voice Pattern Recognized: Gate Opening...', 'success');
                  // Login God Mode User if it matches
                  const res = await databaseService.login('shaoncmd@gmail.com', 'BadSoul@1989');
                  if(res.success) {
                      setTimeout(onLoginSuccess, 1000);
                  }
              } else {
                  showToast('Voice Signature Mismatch. Access Denied.', 'error');
              }
              setIsLoading(false);
          },
          (err) => {
              console.error(err);
              setIsListening(false);
              showToast('Microphone Access Failed', 'error');
              // Stop VAD on error
              if (stopVadRef.current) {
                  stopVadRef.current();
                  stopVadRef.current = null;
                  setMicVolume(0);
              }
          },
          () => {
            setIsListening(false);
            // Stop VAD on end
            if (stopVadRef.current) {
                stopVadRef.current();
                stopVadRef.current = null;
                setMicVolume(0);
            }
          }
      );
  };

  const toggleLanguage = () => {
    onLanguageChange(language === Language.EN ? Language.BN : Language.EN);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-quantum-deep font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-quantum-depth via-quantum-deep to-quantum-void">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-neon-blue/15 rounded-full blur-[150px] animate-pulse-fast" /> {/* Larger, more intense glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15" /> {/* More visible noise */}
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Language Switcher */}
        <div className="absolute top-0 right-0 p-6 z-20">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-medium border border-glass-border hover:border-neon-green hover:text-neon-green transition-all text-xs font-bold text-gray-400 backdrop-blur-md"
          >
            <Globe className="w-3 h-3" />
            {language === Language.EN ? 'EN' : 'BN'}
          </button>
        </div>

        <div className="text-center mb-10 animate-float">
            <div className="flex justify-center mb-6">
               <QuantumLogo size="xl" animated={true} />
            </div>
            <h1 className="text-5xl font-heading font-bold text-white tracking-widest text-glow uppercase"> {/* Larger text */}
                {strings.title}
            </h1>
            <p className="text-neon-blue/80 mt-2 font-mono text-sm tracking-[0.2em] uppercase">{strings.subtitle}</p> {/* Brighter, larger subtitle */}
        </div>

        <div className="bg-quantum-midnight/70 backdrop-blur-xl border-2 border-glass-strong rounded-2xl p-8 shadow-2xl relative overflow-hidden group animate-page-enter"> {/* Darker bg, thicker border, stronger shadow */}
            {/* Electric Border */}
            <div className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"> {/* More visible */}
                <div className="absolute inset-[-2px] rounded-2xl bg-[conic-gradient(from_0deg,transparent_0deg,transparent_340deg,#00F0FF_360deg)] animate-spark-spin opacity-40 blur-md" /> {/* Thicker, more blurred */}
            </div>

            {/* Auth Method Tabs */}
            <div className="relative z-10 flex mb-8 bg-glass-light p-1.5 rounded-xl border-2 border-glass-border"> {/* Thicker border, larger padding */}
                {[
                    { id: 'password', icon: Lock, label: strings.secureKey },
                    { id: 'face', icon: ScanFace, label: strings.faceId },
                    { id: 'voice', icon: Mic, label: strings.voiceSig }
                ].map(m => (
                    <button
                        key={m.id}
                        onClick={() => setAuthMethod(m.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${ /* Larger padding */
                            authMethod === m.id 
                            ? 'bg-neon-blue/15 text-neon-blue border-2 border-neon-blue/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]' /* Thicker border, stronger shadow */
                            : 'text-gray-500 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <m.icon className="w-5 h-5" /> {/* Larger icon */}
                        {m.label}
                    </button>
                ))}
            </div>

            {/* PASSWORD FORM */}
            {authMethod === 'password' && (
                <div className="relative z-10 space-y-4 animate-page-enter">
                    {mode === 'signup' && (
                         <QuantumInput 
                            placeholder={strings.fullName} 
                            icon={<User className="w-5 h-5" />} /* Larger icon */
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                         />
                    )}
                    <QuantumInput 
                        placeholder={strings.emailPlaceholder} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <QuantumInput 
                        type="password" 
                        placeholder={strings.passPlaceholder} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <QuantumButton 
                        className="w-full mt-4" 
                        onClick={handleAuth} 
                        isLoading={isLoading}
                        loadingText={strings.authenticating}
                        variant="primary"
                    >
                        {mode === 'login' ? strings.establishLink : strings.initIdentity} <ArrowRight className="w-4 h-4" />
                    </QuantumButton>
                </div>
            )}

            {/* FACE ID */}
            {authMethod === 'face' && (
                <div className="relative z-10 flex flex-col items-center justify-center py-6 animate-page-enter">
                    <div className="relative w-52 h-52 rounded-full border-2 border-neon-blue/40 overflow-hidden mb-6 bg-black shadow-[0_0_40px_rgba(0,240,255,0.3)]"> {/* Larger, thicker border, stronger shadow */}
                        {isLoading ? (
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" /> {/* Higher opacity */}
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ScanFace className="w-20 h-20 text-neon-blue/60" /> {/* Larger, brighter icon */}
                            </div>
                        )}
                        {isLoading && (
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/30 to-transparent animate-scan" /> {/* More opaque scan line */}
                        )}
                    </div>
                    <p className="text-center text-gray-300 text-sm mb-6"> {/* Brighter text */}
                        {strings.positionFace} <br/>
                        <span className="text-xs text-gray-500">{strings.lighting}</span>
                    </p>
                    <QuantumButton onClick={startFaceScan} isLoading={isLoading} loadingText={strings.scanning} variant="secondary">
                        {strings.initiateScan}
                    </QuantumButton>
                </div>
            )}

             {/* VOICE AUTH - ENHANCED */}
             {authMethod === 'voice' && (
                <div className="relative z-10 flex flex-col items-center justify-center py-6 animate-page-enter">
                    <div className={`w-40 h-40 rounded-full flex items-center justify-center mb-6 relative border-2 transition-all duration-300 ${isListening ? 'bg-neon-red/15 border-neon-red shadow-[0_0_40px_rgba(255,77,109,0.5)] animate-pulse-strong' : 'bg-neon-purple/15 border-neon-purple/40 shadow-[0_0_15px_rgba(188,19,254,0.3)]'}`}> {/* Larger, thicker border, stronger shadow/pulse */}
                         {isListening && (
                             <div className="absolute inset-0 rounded-full border-4 border-neon-red animate-ping" /> // Thicker ping
                         )}
                         {isLoading ? (
                             <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#BC13FE]" /> // Larger, thicker, glowing spinner
                         ) : (
                             <Mic className={`w-16 h-16 transition-colors drop-shadow-md ${isListening ? 'text-neon-red' : 'text-neon-purple'}`} /> {/* Larger, shadow */}
                         )}
                         {isListening && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex items-center justify-center gap-0.5 h-10 w-[70%]">
                                {[...Array(30)].map((_, i) => { // More bars for smoother visualizer
                                    const baseHeight = 15;
                                    const maxWaveHeight = 80;
                                    const height = baseHeight + (micVolume * 0.8) * (Math.sin(i * 0.1 + Date.now() / 100) * 0.5 + 0.5); // Dynamic wave based on micVolume
                                    const clampedHeight = Math.min(maxWaveHeight, Math.max(baseHeight, height));
                                    const opacity = Math.min(1, Math.max(0.3, (micVolume / 60) * 0.8));
                                    const shadowIntensity = Math.min(1, Math.max(0.2, (micVolume / 40) * 0.8));

                                    return (
                                        <div 
                                            key={i} 
                                            className="w-1 bg-gradient-to-t from-neon-red to-red-500 rounded-full animate-[audio-wave_0.8s_ease-in-out_infinite]" 
                                            style={{ height: `${clampedHeight}%`, animationDelay: `${i * 0.02}s`, opacity: opacity, boxShadow: `0 0 ${shadowIntensity * 10}px rgba(255,0,85,${opacity*0.8})` }} 
                                        />
                                    );
                                })}
                                </div>
                            </div>
                         )}
                    </div>
                    <p className="text-center text-gray-300 text-sm mb-6"> {/* Brighter text */}
                        {strings.recitePhrase}<br/>
                        <span className="text-neon-green font-mono drop-shadow-md">{strings.accessCode}</span> {/* Text shadow */}
                    </p>
                    <QuantumButton 
                        variant={isListening ? "danger" : "neon"} 
                        onClick={startVoiceAuth}
                        isLoading={isLoading}
                        loadingText="Analyzing Voice Pattern..."
                    >
                        {isListening ? strings.listening : strings.startRecording}
                    </QuantumButton>
                </div>
            )}

            <div className="mt-6 text-center">
                <button 
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-xs text-neon-blue/80 hover:text-neon-cyan transition-colors font-mono tracking-wide drop-shadow-sm" {/* Brighter, shadow */}
                >
                    {mode === 'login' ? strings.noId : strings.existingUser}
                </button>
            </div>
        </div>
      </div>
      
      <QuantumToast 
        isVisible={toast.visible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />
    </div>
  );
};