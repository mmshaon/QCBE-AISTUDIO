

import React, { useState, useEffect, useRef } from 'react';
import { Save, Bell, Shield, Smartphone, Zap, LogOut, Volume2, Mic, Square, CheckCircle2, Fingerprint, Lock, Eye, EyeOff, AlertCircle, Radio, Sliders, Check, Activity } from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumInput, QuantumBadge } from './QuantumComponents';
import { databaseService } from '../services/database';
import { voiceService } from '../services/voiceService';
import { Language } from '../types';

export const Settings: React.FC = () => {
  const [quantumDensity, setQuantumDensity] = useState(50);
  const [notifications, setNotifications] = useState(true);
  const [currentUser, setCurrentUser] = useState(databaseService.getCurrentUser());
  const [showGodToken, setShowGodToken] = useState(false);
  
  // Voice Settings
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  
  // Voice Sig State
  const [isRecording, setIsRecording] = useState(false);
  const [isSavingVoice, setIsSavingVoice] = useState(false);
  const [voiceSigStatus, setVoiceSigStatus] = useState(currentUser?.voiceSignature);
  const [micVolume, setMicVolume] = useState(0); // Added for recording visualizer
  const stopVadRef = useRef<(() => void) | null>(null); // Added for VAD in recording

  // Sync state if user reloads or changes
  useEffect(() => {
    if (currentUser) {
        setVoiceSigStatus(currentUser.voiceSignature);
        if (currentUser.voicePreferences) {
            setVoiceRate(currentUser.voicePreferences.rate);
            setVoicePitch(currentUser.voicePreferences.pitch);
        }
    }
  }, [currentUser]);

  const handleStartRecording = async () => {
    try {
        await voiceService.startAudioRecording();
        setIsRecording(true);
        // Play start sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});

        // Start VAD for visualization during recording
        if (!stopVadRef.current) {
            const stopVad = await voiceService.startVAD((vol) => {
                setMicVolume(vol);
            });
            stopVadRef.current = stopVad;
        }

    } catch (e) {
        console.error("Failed to start recording", e);
    }
  };

  const handleStopRecording = async () => {
    try {
        const blob = await voiceService.stopAudioRecording();
        setIsRecording(false);
        setIsSavingVoice(true);
        
        // Stop VAD after recording
        if (stopVadRef.current) {
            stopVadRef.current();
            stopVadRef.current = null;
            setMicVolume(0);
        }

        // Play stop sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});

        if (currentUser) {
            await databaseService.recordVoiceSignature(currentUser.id, blob);
            
            // Refresh User
            const updatedUser = databaseService.getCurrentUser();
            setCurrentUser(updatedUser);
            setVoiceSigStatus(true);
        }
        setIsSavingVoice(false);
    } catch (e) {
        console.error("Failed to stop recording", e);
        setIsRecording(false);
        setIsSavingVoice(false);
    }
  };

  const handleSaveProfile = async () => {
      if (!currentUser) return;
      
      // Save Voice Preferences
      await databaseService.updateVoicePreferences(currentUser.id, {
          rate: voiceRate,
          pitch: voicePitch,
          voiceURI: currentUser.voicePreferences?.voiceURI || ''
      });
      
      // Could also update name etc here if we had inputs bound
      alert("System Configuration Updated Successfully");
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-page-enter">
      <h1 className="text-3xl font-heading font-bold text-white neon-glow-pink">System Core</h1>
      <p className="text-gray-400">Configure your quantum field parameters and identity protocols.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* === LEFT COLUMN: PROFILE & APPEARANCE === */}
        <div className="space-y-6">
            <QuantumCard>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue p-1.5 shadow-lg"> {/* Thicker border, shadow */}
                    <div className="w-full h-full rounded-full bg-quantum-deep flex items-center justify-center overflow-hidden">
                        <img src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} alt="Avatar" className="w-full h-full" />
                    </div>
                    </div>
                    <div>
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{currentUser.name}</h3> {/* Text shadow */}
                    <p className="text-neon-blue flex items-center gap-2">
                        {currentUser.role === 'god_mode' ? 'Supreme Creator' : 'System Administrator'}
                        {currentUser.role === 'god_mode' && <QuantumBadge color="pink">GOD MODE</QuantumBadge>}
                    </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <QuantumInput label="Display Name" defaultValue={currentUser.name} />
                    <QuantumInput label="Official Email" defaultValue={currentUser.email} disabled className="opacity-70" />
                    <QuantumInput label="Role Designation" defaultValue={currentUser.role.toUpperCase()} disabled className="opacity-70" />
                </div>

                <div className="mt-8 flex justify-end">
                    <QuantumButton variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSaveProfile}>
                    Update Profile
                    </QuantumButton>
                </div>
            </QuantumCard>

            <QuantumCard>
                <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-neon-yellow neon-glow-yellow" /> {/* Icon glow */}
                    Quantum Field
                </h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm text-gray-300">Interface Density</label>
                            <span className="text-xs text-neon-yellow font-mono">{quantumDensity}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={quantumDensity}
                            onChange={(e) => setQuantumDensity(parseInt(e.target.value))}
                            className="w-full h-2 bg-glass-strong rounded-lg appearance-none cursor-pointer accent-neon-yellow"
                        />
                    </div>

                    <div className="flex items-center justify-between border-b border-glass-light pb-4">
                        <div className="flex items-center gap-2 text-gray-300">
                            <Bell className="w-4 h-4" />
                            <span className="text-sm">Haptic Notifications</span>
                        </div>
                        <div 
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifications ? 'bg-neon-green/30 border border-neon-green/60 shadow-[0_0_10px_rgba(0,255,157,0.3)]' : 'bg-gray-700'}`} {/* Stronger glow */}
                            onClick={() => setNotifications(!notifications)}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6 bg-neon-green' : ''}`} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-neon-blue neon-glow-blue" /> Yusra Voice Config
                        </h4> {/* Icon glow */}
                        
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Speaking Rate</span>
                                <span className="text-neon-blue font-mono">{voiceRate}x</span>
                            </div>
                            <input 
                                type="range" min="0.5" max="2.0" step="0.1"
                                value={voiceRate}
                                onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Voice Pitch</span>
                                <span className="text-neon-purple font-mono">{voicePitch}</span>
                            </div>
                            <input 
                                type="range" min="0.5" max="2.0" step="0.1"
                                value={voicePitch}
                                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                            />
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button onClick={() => voiceService.speak("System voice check. Configuration applied.", Language.EN, { rate: voiceRate, pitch: voicePitch })} className="text-xs text-neon-green hover:underline flex items-center gap-1">
                                <Sliders className="w-3 h-3" /> Test Voice
                            </button>
                        </div>
                    </div>
                </div>
            </QuantumCard>
        </div>

        {/* === RIGHT COLUMN: SECURITY & IDENTITY === */}
        <div className="space-y-6">
           <QuantumCard className="border-neon-blue/50 h-full"> {/* Stronger border */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-neon-blue neon-glow-blue" /> {/* Icon glow */}
                        Security & Identity
                    </h3>
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-900/40 border border-green-500/40 shadow-sm"> {/* Darker bg, shadow */}
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse-strong shadow-[0_0_8px_#00FF9D]" /> {/* Stronger pulse, shadow */}
                        <span className="text-[10px] text-neon-green font-bold">SECURE</span>
                    </div>
                </div>
                
                {/* Voice Identity Section - "Perfectly Placed" */}
                <div className="bg-white/10 rounded-xl p-5 mb-6 border-2 border-white/10 relative overflow-hidden group shadow-lg"> {/* Stronger border, shadow */}
                    <div className="absolute top-0 right-0 p-2 opacity-15 group-hover:opacity-30 transition-opacity"> {/* More visible icon */}
                        <Fingerprint className="w-24 h-24 text-white" />
                    </div>
                    
                    <h4 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2 relative z-10">
                        <Mic className="w-4 h-4 text-neon-purple neon-glow-purple" /> {/* Icon glow */}
                        Voice Recognition Signature
                    </h4>
                    
                    {/* Verification Status Banner */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border-2 mb-5 relative z-10 transition-all duration-500 ${ /* Thicker border */
                        voiceSigStatus 
                        ? 'bg-neon-green/15 border-neon-green/50 shadow-[0_0_20px_rgba(0,255,163,0.3)]' 
                        : 'bg-neon-yellow/15 border-neon-yellow/50 animate-border-pulse shadow-[0_0_20px_rgba(251,255,0,0.3)]'
                    }`} style={voiceSigStatus ? {} : {'--neon-color': '#FBFF00'} as React.CSSProperties}> {/* Stronger glow/pulse */}
                         <div className="flex flex-col">
                             <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">Biometric Status</span>
                             <span className={`text-sm font-bold flex items-center gap-2 ${voiceSigStatus ? 'text-neon-green neon-glow-green' : 'text-neon-yellow neon-glow-yellow'}`}> {/* Text glows */}
                                 {voiceSigStatus ? (
                                     <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        VOICE PROFILE VERIFIED
                                     </>
                                 ) : (
                                     <>
                                        <AlertCircle className="w-4 h-4 animate-pulse-strong" /> {/* Stronger pulse */}
                                        SIGNATURE REQUIRED
                                     </>
                                 )}
                             </span>
                         </div>
                         <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${ /* Thicker border */
                             voiceSigStatus ? 'border-neon-green/50 bg-neon-green/20' : 'border-white/20 bg-black/40'
                         }`}>
                             {voiceSigStatus ? <Fingerprint className="w-5 h-5 text-neon-green" /> : <Mic className="w-5 h-5 text-gray-500" />}
                         </div>
                    </div>

                    {/* Display Voice Profile if Exists */}
                    {currentUser.voiceProfile && (
                        <div className="mb-4 relative z-10 bg-black/50 p-3 rounded-lg border-2 border-neon-blue/30 shadow-sm"> {/* Stronger border, shadow */}
                            <div className="flex items-center gap-2 mb-2 border-b border-white/15 pb-2"> {/* Thicker border */}
                                <Activity className="w-3 h-3 text-neon-blue neon-glow-blue" /> {/* Icon glow */}
                                <span className="text-[10px] font-bold text-neon-blue uppercase drop-shadow-md">Analysis Metrics</span> {/* Text shadow */}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-500 block text-[10px]">Frequency</span>
                                    <span className="text-white font-mono">{currentUser.voiceProfile.frequency}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[10px]">Tone</span>
                                    <span className="text-white font-mono">{currentUser.voiceProfile.toneParams}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-6 relative z-10 bg-black/30 p-3 rounded-lg border-2 border-white/10 shadow-sm"> {/* Stronger border, shadow */}
                         <p className="text-xs text-neon-blue font-bold mb-3 uppercase tracking-wider flex items-center gap-2 neon-glow-blue"> {/* Text glow */}
                            <Activity className="w-3 h-3" />
                            Configuration Protocol
                         </p>
                         <ul className="text-[11px] text-gray-400 space-y-2.5">
                             <li className="flex gap-3 items-start">
                                 <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-neon-blue border border-white/20">1</div> {/* Stronger border */}
                                 <span className="leading-snug">Ensure quiet environment (<span className="text-white">{'<40dB'}</span>). This allows Yusra to analyze accent and tone.</span>
                             </li>
                             <li className="flex gap-3 items-start">
                                 <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-neon-blue border border-white/20">2</div> {/* Stronger border */}
                                 <span className="leading-snug">Click <strong className="text-white">Record</strong>. Recite the phrase to generate your unique vocal hash.</span>
                             </li>
                         </ul>
                    </div>
                    
                    {/* Passphrase Display */}
                    <div className={`rounded-lg p-4 border-2 mb-4 relative z-10 transition-all duration-300 ${isRecording ? 'border-neon-red/80 bg-neon-red/15 shadow-[0_0_30px_rgba(255,77,109,0.5)] animate-border-pulse' : 'border-white/20 bg-black/50'}`} style={isRecording ? {'--neon-color': '#FF0055'} as React.CSSProperties : {}}> {/* Thicker border, stronger shadow/pulse */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Required Phrase</span>
                            {isRecording && <div className="flex items-center gap-2">
                                <span className="text-[10px] text-neon-red font-bold animate-pulse-strong drop-shadow-md">RECORDING</span> {/* Stronger pulse, shadow */}
                                <Radio className="w-3 h-3 text-neon-red animate-pulse-strong" /> {/* Stronger pulse */}
                            </div>}
                        </div>
                        <p className={`text-lg text-center font-mono tracking-wide font-bold transition-all duration-300 ${isRecording ? 'text-neon-red neon-glow-pink scale-105' : 'text-neon-green neon-glow-green'}`}> {/* Larger text, text glows, scale on recording */}
                            "Command: Open the Gate"
                        </p>
                    </div>

                    {isRecording ? (
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-full h-8 bg-black/30 rounded-full overflow-hidden flex items-center justify-center relative border-2 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"> {/* Stronger border, shadow */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                                    {[...Array(40)].map((_, i) => { // More bars for smoother visualizer
                                        const baseHeight = 10;
                                        const maxWaveHeight = 80;
                                        const height = baseHeight + (micVolume * 0.8) * (Math.sin(i * 0.1 + Date.now() / 100) * 0.5 + 0.5); // Dynamic wave based on micVolume
                                        const clampedHeight = Math.min(maxWaveHeight, Math.max(baseHeight, height));
                                        const opacity = Math.min(1, Math.max(0.2, (micVolume / 60) * 0.8));
                                        
                                        return (
                                            <div 
                                                key={i} 
                                                className="w-1 bg-gradient-to-t from-neon-red to-red-500 rounded-full animate-[audio-wave_0.8s_ease-in-out_infinite]" 
                                                style={{ height: `${clampedHeight}%`, animationDelay: `${i * 0.02}s`, opacity: opacity, boxShadow: `0 0 8px rgba(255,0,85,${opacity*0.8})` }} 
                                            />
                                        );
                                    })}
                                    </div>
                            </div>
                            <QuantumButton 
                                variant="neon" 
                                className="w-full border-neon-red text-neon-red hover:bg-neon-red/10" 
                                onClick={handleStopRecording}
                                isLoading={isSavingVoice}
                                loadingText="Analyzing Voice Pattern..."
                                icon={isSavingVoice ? undefined : <Square className="w-4 h-4 fill-current" />}
                            >
                                Stop Recording
                            </QuantumButton>
                        </div>
                    ) : (
                        <QuantumButton 
                            variant={voiceSigStatus ? "secondary" : "primary"} 
                            className="w-full relative z-10"
                            onClick={handleStartRecording}
                            isLoading={isSavingVoice}
                            loadingText="Analyzing Voice Pattern..."
                            icon={isSavingVoice ? undefined : <Mic className="w-4 h-4" />}
                        >
                            {voiceSigStatus ? "Re-calibrate Voice Signature" : "Record Voice Signature"}
                        </QuantumButton>
                    )}
                </div>

                {/* Credentials Section */}
                <div className="space-y-4">
                     <h4 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-neon-blue neon-glow-blue" /> {/* Icon glow */}
                        Access Credentials
                    </h4>
                    
                    <div className="bg-black/40 p-4 rounded-xl border-2 border-white/10 shadow-sm"> {/* Stronger border, shadow */}
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-gray-400">Primary Password</label>
                            <button className="text-[10px] text-neon-blue hover:underline">Change</button>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-sm text-gray-300">
                            <span>••••••••••••••••</span>
                        </div>
                    </div>

                    {/* God Mode Token Display - Only for God Mode User */}
                    {currentUser.role === 'god_mode' && (
                        <div className="bg-neon-pink/15 p-4 rounded-xl border-2 border-neon-pink/50 animate-border-pulse shadow-[0_0_20px_rgba(255,0,85,0.4)]" style={{'--neon-color': '#FF0055'} as React.CSSProperties}> {/* Stronger border, shadow/pulse */}
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs text-neon-pink font-bold flex items-center gap-1 neon-glow-pink"> {/* Text glow */}
                                    <Shield className="w-3 h-3" /> CREATOR TOKEN
                                </label>
                                <button 
                                    onClick={() => setShowGodToken(!showGodToken)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    {showGodToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                ></button>
                            </div>
                            <div className="font-mono text-lg tracking-wider text-white neon-glow-pink"> {/* Larger text, glow */}
                                {showGodToken ? "BadSoul@1989" : "••••••••••••"}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-glass-strong"> {/* Stronger border */}
                        <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 text-left transition-colors text-sm text-gray-300">
                            <span className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Active Sessions</span>
                            <span className="text-neon-blue">2 Devices</span>
                        </button>
                        
                        <button 
                            onClick={() => { databaseService.logout(); window.location.reload(); }}
                            className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 transition-colors text-sm font-bold border-2 border-red-500/30 shadow-[0_0_15px_rgba(255,0,85,0.3)]" {/* Stronger border, shadow */}
                        >
                            <LogOut className="w-4 h-4" /> Secure System Logout
                        </button>
                    </div>
                </div>
           </QuantumCard>
        </div>
      </div>
    </div>
  );
};