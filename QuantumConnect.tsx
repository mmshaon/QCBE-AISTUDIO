import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Phone, Video, Paperclip, Mic, Camera, Send, X, FileText, 
  Download, Sparkles, CheckSquare, Calendar, Zap, ShieldCheck, MicOff, 
  Hand, Cpu, Activity, Signal, Monitor, PhoneOff
} from 'lucide-react';
import { databaseService } from '../services/database';
import { TeamMessage, VideoParticipant, Language, Employee } from '../types';
import { voiceService } from '../services/voiceService';
import { geminiService } from '../services/geminiService';
// FIX: systemService was not properly exported. Corrected in services/systemService.ts
import { systemService } from '../services/systemService';
import { QuantumCard, QuantumButton, QuantumBadge, QuantumInput } from './QuantumComponents';

// MOCK_EMPLOYEES was erroneously placed here in the prompt.
// It is now defined in HumanResources.tsx, but QuantumConnect might still need similar mock data.

interface QuantumConnectProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const QuantumConnect: React.FC<QuantumConnectProps> = ({ showToast }) => {
  const [activeView, setActiveView] = useState<'chat' | 'video'>('chat');
  const [chatMessages, setChatMessages] = useState<TeamMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [participants, setParticipants] = useState<VideoParticipant[]>([]);
  const currentUser = databaseService.getCurrentUser();

  // Basic mock data if needed for display
  useEffect(() => {
    if (currentUser && chatMessages.length === 0) {
      setChatMessages([
        {
          id: '1',
          senderId: 'yusra-ai',
          senderName: 'Yusra AI',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yusra',
          content: 'Welcome to Quantum Connect! How can I assist your team collaboration today?',
          type: 'text',
          timestamp: Date.now() - 60000,
        },
      ]);
    }
    // Mock participants for video calls
    setParticipants([
      { id: 'usr1', name: 'Dr. Sarah Chen', role: 'Lead Quantum Physicist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', isMuted: false, isVideoOff: false, isSpeaking: true, isHandRaised: false, systemStats: { cpu: 20, ram: 40, network: 'Stable', battery: 80, activeApps: ['Quantum Connect'] }, status: 'active' },
      { id: 'usr2', name: 'Marcus Vance', role: 'Operations Director', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', isMuted: true, isVideoOff: false, isSpeaking: false, isHandRaised: false, systemStats: { cpu: 15, ram: 30, network: 'Stable', battery: 90, activeApps: ['Quantum Connect'] }, status: 'active' },
    ]);
  }, [currentUser, chatMessages.length]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentUser) return;

    const newMessage: TeamMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || '',
      content: messageInput,
      type: 'text',
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  const handleCallAction = (action: string) => {
    showToast(`Call action: ${action} (simulated)`, 'info');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-heading font-bold text-white neon-glow-purple">Quantum Connect</h1>
        <div className="flex bg-glass-medium p-1 rounded-xl border-2 border-glass-strong shadow-md">
          <button
            onClick={() => setActiveView('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'chat' ? 'bg-neon-blue text-quantum-deep shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <MessageSquare className="w-4 h-4 inline-block mr-2" /> Chat
          </button>
          <button
            onClick={() => setActiveView('video')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'video' ? 'bg-neon-purple text-quantum-deep shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Video className="w-4 h-4 inline-block mr-2" /> Video
          </button>
        </div>
      </div>

      <QuantumCard className="flex-1 p-0 overflow-hidden">
        {activeView === 'chat' ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                    msg.senderId === currentUser?.id ? 'bg-neon-blue/20 text-white rounded-br-none' : 'bg-glass-medium text-gray-100 rounded-bl-none'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full" />
                      <span className="font-semibold text-sm">{msg.senderName}</span>
                      <span className="text-xs text-gray-500 ml-auto">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-glass-strong flex items-center gap-3 bg-quantum-deep/70">
              <QuantumInput
                placeholder="Send a secure message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <QuantumButton onClick={handleSendMessage} icon={<Send className="w-4 h-4" />} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="relative flex-1 bg-black overflow-hidden">
              {/* Main video area */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                {/* Placeholder for main speaker */}
                <Video className="w-24 h-24 text-gray-700" />
                <span className="absolute bottom-4 left-4 text-white font-bold">Main Speaker Name</span>
              </div>
              {/* Participant grid */}
              <div className="absolute top-4 right-4 grid grid-cols-1 gap-2">
                {participants.map(p => (
                  <div key={p.id} className="relative w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border border-white/20">
                    {/* Placeholder for participant video */}
                    <Camera className="w-full h-full text-gray-600" />
                    <span className="absolute bottom-1 left-1 text-white text-xs">{p.name}</span>
                    {p.isMuted && <MicOff className="absolute top-1 right-1 text-red-500 w-4 h-4" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-glass-strong flex justify-center gap-4 bg-quantum-deep/70">
              <QuantumButton variant="secondary" icon={<Mic className="w-5 h-5" />} onClick={() => handleCallAction('Toggle Mic')} />
              <QuantumButton variant="secondary" icon={<Video className="w-5 h-5" />} onClick={() => handleCallAction('Toggle Video')} />
              <QuantumButton variant="danger" icon={<PhoneOff className="w-5 h-5" />} onClick={() => handleCallAction('End Call')} />
              <QuantumButton variant="primary" icon={<Hand className="w-5 h-5" />} onClick={() => handleCallAction('Raise Hand')} />
            </div>
          </div>
        )}
      </QuantumCard>
    </div>
  );
};