import React, { useState } from 'react';
import { ShieldAlert, Zap, Globe, Lock, Unlock, Database, Activity, Terminal, AlertTriangle, Eye, Server, Power, RefreshCw, Cpu } from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumBadge } from './QuantumComponents';
// FIX: systemService was not properly exported. Corrected in services/systemService.ts
import { systemService } from '../services/systemService';

export const GodModePanel: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] God Mode initialized via Voice Signature.",
    "[AUTH] Override protocol alpha-9 active.",
    "[NETWORK] Global latency: 0.0004ms (Quantum Entanglement)."
  ]);

  const execute = async (cmd: string) => {
    setLogs(prev => [...prev, `> Executing: ${cmd}...`]);
    const res = await systemService.executeSystemCommand(cmd);
    setLogs(prev => [...prev, `[RESULT] ${res}`]);
  };

  return (
    <div className="space-y-6 animate-page-enter">
      <div className="flex justify-between items-center border-b border-neon-pink/30 pb-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neon-pink flex items-center gap-3">
            <ShieldAlert className="w-8 h-8" />
            GOD MODE CONTROL
          </h1>
          <p className="text-red-400 font-mono text-sm tracking-widest mt-1">
            CREATOR AUTHORITY LEVEL • UNRESTRICTED ACCESS
          </p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-neon-pink/10 border border-neon-pink text-neon-pink font-bold rounded animate-pulse">
             SYSTEM OVERRIDE ACTIVE
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SYSTEM CONTROLS */}
        <QuantumCard className="border-neon-pink/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-neon-pink" /> System Operations
          </h3>
          <div className="space-y-3">
             <button 
                onClick={() => execute('REBOOT SYSTEM')}
                className="w-full p-3 rounded bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 text-left flex items-center justify-between text-red-200 transition-colors group"
             >
                <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 group-hover:animate-spin" /> Reboot Quantum Core</span>
                <span className="text-[10px] bg-red-500/20 px-1 rounded">SAFE</span>
             </button>
             <button 
                onClick={() => execute('BACKUP DATALAKE')}
                className="w-full p-3 rounded bg-blue-900/20 border border-blue-500/30 hover:bg-blue-900/40 text-left flex items-center justify-between text-blue-200 transition-colors"
             >
                <span className="flex items-center gap-2"><Database className="w-4 h-4" /> Snapshot Universe</span>
                <span className="text-[10px] bg-blue-500/20 px-1 rounded">AUTO</span>
             </button>
             <button 
                onClick={() => execute('DELETE SYSTEM')}
                className="w-full p-3 rounded bg-neon-pink/10 border border-neon-pink/50 hover:bg-neon-pink/20 text-left flex items-center justify-between text-neon-pink transition-colors group"
             >
                <span className="flex items-center gap-2"><Trash2Icon /> Purge Existence</span>
                <AlertTriangle className="w-4 h-4 animate-pulse" />
             </button>
          </div>
        </QuantumCard>

        {/* UNIVERSE METRICS */}
        <QuantumCard className="border-neon-pink/30">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-neon-pink" /> Universe Health
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">Reality Stability</span>
                <span className="text-neon-pink font-mono font-bold">99.99%</span>
             </div>
             <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-neon-pink w-[99%]" />
             </div>

             <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">Auth Bypasses</span>
                <span className="text-neon-yellow font-mono font-bold">14</span>
             </div>
             <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-neon-yellow w-[15%]" />
             </div>
             
             <div className="grid grid-cols-2 gap-2 mt-4">
                 <div className="p-2 bg-black/40 rounded border border-white/10 text-center">
                     <div className="text-2xl font-bold text-white">42</div>
                     <div className="text-[10px] text-gray-500 uppercase">Active Cubes</div>
                 </div>
                 <div className="p-2 bg-black/40 rounded border border-white/10 text-center">
                     <div className="text-2xl font-bold text-white">8.4M</div>
                     <div className="text-[10px] text-gray-500 uppercase">Transactions</div>
                 </div>
             </div>
          </div>
        </QuantumCard>

        {/* INTERFACE CONTROL */}
        <QuantumCard className="border-neon-pink/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-neon-pink" /> Omniscience
          </h3>
          <div className="space-y-2">
             <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <span className="text-sm text-gray-300">See Hidden Fields</span>
                <div className="w-8 h-4 bg-neon-pink/50 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow" />
                </div>
             </div>
             <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <span className="text-sm text-gray-300">Override RBAC</span>
                <div className="w-8 h-4 bg-neon-pink/50 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow" />
                </div>
             </div>
             <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <span className="text-sm text-gray-300">Yusra Silent Monitoring</span>
                <div className="w-8 h-4 bg-neon-pink/50 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow" />
                </div>
             </div>
          </div>
        </QuantumCard>

      </div>

      {/* TERMINAL LOG */}
      <QuantumCard className="border-neon-pink/30 bg-black font-mono text-xs h-64 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 text-neon-pink mb-2 border-b border-white/10 pb-2">
              <Terminal className="w-4 h-4" /> GOD_PROTOCOL_LOG
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 text-gray-400">
             {logs.map((log, i) => (
                 <div key={i} className="hover:text-white transition-colors">
                     <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                     {log}
                 </div>
             ))}
             <div className="animate-pulse text-neon-pink">_</div>
          </div>
      </QuantumCard>
    </div>
  );
};

function Trash2Icon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }