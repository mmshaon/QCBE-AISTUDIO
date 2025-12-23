

import React, { useState, useEffect } from 'react';
import { Plus, Target, Zap, CheckCircle2, Circle, MoreHorizontal, BrainCircuit, Sparkles, Mic, MicOff, AlertTriangle, ShieldAlert, Cpu, Terminal, X, Globe, Languages, History, Clock } from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumBadge, QuantumInput, QuantumToast } from './QuantumComponents';
import { StrategyItem, Language, AnalysisHistoryItem } from '../types';
import { geminiService, SimulationResult } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { databaseService } from '../services/database';

export const Planning: React.FC = () => {
  const [goals, setGoals] = useState<StrategyItem[]>([
    { 
      id: '1', 
      title: 'Expand into Asian Markets', 
      category: 'Sales', 
      status: 'in-progress', 
      priority: 'high', 
      progress: 65,
      subtasks: ['Establish Singapore HQ', 'Hire regional sales director', 'Localize marketing assets'],
      subtaskAnalysis: 'Sequential execution required: HQ establishment must precede regional hiring to ensure legal compliance and operational readiness.',
      analysisHistory: []
    },
    { 
      id: '2', 
      title: 'Launch Quantum Mobile App', 
      category: 'Product', 
      status: 'planned', 
      priority: 'high', 
      progress: 10,
      analysisHistory: []
    },
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [isListeningInput, setIsListeningInput] = useState(false);
  const [inputLang, setInputLang] = useState<Language>(Language.EN);
  
  // Simulation State
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [showSimModal, setShowSimModal] = useState(false);

  // History State
  const [historyGoal, setHistoryGoal] = useState<StrategyItem | null>(null);
  
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const currentUser = databaseService.getCurrentUser();
  const isGodMode = currentUser?.role === 'god_mode';

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
  };

  const toggleInputLang = () => {
      const newLang = inputLang === Language.EN ? Language.BN : Language.EN;
      setInputLang(newLang);
      // Visual feedback via toast and sound
      showToast(newLang === Language.EN ? "Input Language: English (US)" : "ইনপুট ভাষা: বাংলা (বাংলাদেশ)", "success");
  }

  const handleVoiceInput = () => {
    if (isListeningInput) {
        voiceService.stopListening();
        setIsListeningInput(false);
    } else {
        setIsListeningInput(true);
        setNewGoalTitle(''); // Clear previous for fresh dictation
        voiceService.startListening(
            inputLang,
            (text) => {
                setNewGoalTitle(prev => prev + " " + text); // Append if using continuous partial results, or replace if final
                // Note: The service implementation usually sends final text. 
                setNewGoalTitle(text); 
                setIsListeningInput(false);
            },
            (err) => {
                console.error(err);
                setIsListeningInput(false);
                showToast("Voice capture failed. Check permissions.", 'error');
            },
            () => setIsListeningInput(false)
        );
    }
  };

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal: StrategyItem = {
      id: Date.now().toString(),
      title: newGoalTitle,
      category: 'Operations',
      status: 'planned',
      priority: 'medium',
      progress: 0,
      analysisHistory: []
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    showToast('Directive added to roadmap');
  };

  const optimizeGoal = async (id: string, title: string) => {
    setAnalyzingId(id);
    try {
      const analysis = await geminiService.decomposeStrategy(title);
      
      if (!analysis) {
          throw new Error("AI Optimization returned empty result");
      }

      setGoals(prev => prev.map(g => {
          if (g.id === id) {
              const historyItem: AnalysisHistoryItem = {
                  id: Date.now().toString(),
                  timestamp: Date.now(),
                  aiAnalysis: 'Optimized by Yusra Core',
                  subtasks: analysis.subtasks,
                  subtaskAnalysis: analysis.subtaskAnalysis,
                  riskAnalysis: analysis.riskAnalysis
              };
              
              return { 
                  ...g, 
                  subtasks: analysis.subtasks,
                  subtaskAnalysis: analysis.subtaskAnalysis,
                  riskAnalysis: analysis.riskAnalysis,
                  aiAnalysis: 'Optimized by Yusra Core',
                  analysisHistory: [historyItem, ...(g.analysisHistory || [])]
              };
          }
          return g;
      }));
      showToast('Strategy successfully optimized by Yusra AI', 'success');
      
    } catch (e) {
      console.error("Analysis Failed:", e);
      const errorMsg = inputLang === Language.BN 
        ? 'অপ্টিমাইজেশন সম্ভব হচ্ছে না। আমার নিউরাল পাথওয়ে সাময়িকভাবে ব্যস্ত।' 
        : 'Optimization unavailable. My neural pathways are currently recalibrating.';
      
      showToast(errorMsg, 'error');
      // Yusra voice feedback
      voiceService.speak(errorMsg, inputLang);
    } finally {
      setAnalyzingId(null);
    }
  };

  const runSimulation = async (id: string, title: string) => {
    setSimulatingId(id);
    setShowSimModal(true);
    setSimulationResult(null);

    try {
        const result = await geminiService.runQuantumSimulation(title);
        
        if (result) {
            setSimulationResult(result);
        } else {
            // If API returns null but no exception was thrown (e.e. JSON parse error handled in service)
            throw new Error("Simulation result invalid");
        }
    } catch (e) {
        console.error("Simulation Failed:", e);
        setShowSimModal(false);
        const errorMsg = inputLang === Language.BN 
            ? 'সিমুলেশন বাতিল করা হয়েছে। বাহ্যিক ডাটা সংযোগে সমস্যা হচ্ছে।'
            : 'Simulation aborted. External data streams are currently unstable.';
        
        showToast(errorMsg, 'error');
        // Yusra voice feedback
        voiceService.speak(errorMsg, inputLang);
    } finally {
        setSimulatingId(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white neon-glow-purple">Strategic Roadmap</h1>
          <p className="text-gray-400">Define, Analyze, and Execute high-level business directives.</p>
        </div>
        <QuantumButton variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => document.getElementById('new-goal-input')?.focus()}>
          New Directive
        </QuantumButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === KANBAN COLUMNS === */}
        {['planned', 'in-progress', 'completed'].map((status) => (
          <div key={status} className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-glass-strong"> {/* Thicker border */}
              <h3 className="font-heading font-semibold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${ /* Larger status dot */
                  status === 'planned' ? 'bg-neon-blue animate-pulse-strong' : 
                  status === 'in-progress' ? 'bg-neon-yellow animate-pulse-strong' : 'bg-neon-green'
                }`} />
                {status.replace('-', ' ')}
              </h3>
              <span className="text-gray-500 text-xs font-mono">
                {goals.filter(g => g.status === status).length}
              </span>
            </div>

            <div className="flex flex-col gap-4 min-h-[200px]">
              {goals.filter(g => g.status === status).map((goal) => (
                <QuantumCard key={goal.id} className="group hover:border-neon-purple/70 hover:scale-[1.02] transition-transform duration-300 shadow-lg hover:shadow-xl"> {/* Stronger hover effect, shadow */}
                  <div className="flex justify-between items-start mb-3">
                    <QuantumBadge color={goal.category === 'Sales' ? 'green' : goal.category === 'Product' ? 'blue' : 'pink'}>
                      {goal.category}
                    </QuantumBadge>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="text-white font-medium mb-2 leading-snug drop-shadow-md">{goal.title}</h4> {/* Text shadow */}
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-glass-strong rounded-full mb-3 overflow-hidden"> {/* Thicker progress bar */}
                    <div 
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-500" 
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>

                  {/* AI Subtasks & Analysis Section */}
                  {goal.subtasks && (
                    <div className="mb-4 space-y-3 animate-page-enter">
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Tactical Execution</p>
                         <div className="h-[1px] flex-1 bg-glass-border ml-3" />
                      </div>
                      
                      {/* Subtask Analysis Summary - ENHANCED */}
                      {goal.subtaskAnalysis && (
                          <div className="relative p-3 rounded-lg bg-gradient-to-r from-neon-blue/10 to-transparent border-2 border-neon-blue/40 animate-border-pulse shadow-[0_0_15px_rgba(0,240,255,0.3)]" style={{'--neon-color': '#00F0FF'} as React.CSSProperties}> {/* Thicker border, stronger shadow/pulse */}
                              <div className="absolute top-0 left-0 w-[3px] h-full bg-neon-blue" /> {/* Thicker indicator */}
                              <div className="flex items-start gap-2">
                                  <BrainCircuit className="w-4 h-4 text-neon-blue mt-0.5 shrink-0 neon-glow-blue" /> {/* Icon glow */}
                                  <div className="space-y-1">
                                      <span className="text-[10px] font-bold text-neon-blue uppercase drop-shadow-md">Yusra Strategic Insight</span> {/* Text shadow */}
                                      <p className="text-xs text-gray-300 leading-relaxed">
                                          {goal.subtaskAnalysis}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      )}

                      <div className="space-y-2 pl-2 border-l-2 border-glass-light ml-1"> {/* Thicker border */}
                        {goal.subtasks.map((task, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-300 group/task">
                            <div className={`w-2 h-2 rounded-full mt-1.5 transition-colors ${goal.status === 'completed' ? 'bg-neon-green' : 'bg-gray-600 group-hover/task:bg-neon-purple'}`} /> {/* Larger dot */}
                            <span className="leading-tight group-hover/task:text-white transition-colors">{task}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Analysis Section - ENHANCED */}
                  {goal.riskAnalysis && (
                    <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-neon-yellow/10 to-transparent border-2 border-neon-yellow/40 animate-page-enter animate-border-pulse shadow-[0_0_15px_rgba(251,255,0,0.3)]" style={{'--neon-color': '#FBFF00'} as React.CSSProperties}> {/* Thicker border, stronger shadow/pulse */}
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-4 h-4 ${goal.riskAnalysis.riskLevel === 'critical' ? 'text-neon-red animate-pulse-strong' : 'text-neon-yellow neon-glow-yellow'}`} /> {/* Stronger pulse/glow */}
                            <span className="text-[10px] uppercase font-bold text-gray-400">
                                Risk Assessment: <span className={goal.riskAnalysis.riskLevel === 'critical' ? 'text-neon-red neon-glow-pink' : 'text-neon-yellow neon-glow-yellow'}>{goal.riskAnalysis.riskLevel}</span> {/* Text glows */}
                            </span>
                        </div>
                        
                        <div className="pl-6 space-y-2">
                            <ul className="list-disc list-outside text-xs text-gray-400 space-y-1 ml-3">
                                {goal.riskAnalysis.risks.slice(0, 2).map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                            <div className="text-[10px] text-gray-500 border-t border-white/10 pt-2 flex gap-2"> {/* Thicker border */}
                                <ShieldAlert className="w-3 h-3 text-neon-blue shrink-0 neon-glow-blue" /> {/* Icon glow */}
                                <span><strong className="text-neon-blue">Mitigation:</strong> {goal.riskAnalysis.mitigation}</span>
                            </div>
                        </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-glass-light">
                    <div className="flex -space-x-2">
                       <div className="w-7 h-7 rounded-full bg-gray-700 border border-gray-800 flex items-center justify-center text-[10px] text-white">JD</div> {/* Larger avatars */}
                       <div className="w-7 h-7 rounded-full bg-gray-700 border border-gray-800 flex items-center justify-center text-[10px] text-white">AM</div>
                    </div>
                    
                    <div className="flex gap-2">
                        {/* VIEW HISTORY BUTTON */}
                        <button 
                            onClick={() => setHistoryGoal(goal)}
                            className="flex items-center gap-1 text-xs p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="View Analysis History"
                        >
                            <History className="w-3.5 h-3.5" />
                        </button>

                        {/* SIMULATION BUTTON */}
                        <button
                             onClick={() => runSimulation(goal.id, goal.title)}
                             disabled={simulatingId === goal.id}
                             className="flex items-center gap-1 text-xs text-neon-green neon-glow-green hover:text-white transition-colors disabled:opacity-50" {/* Text glow */}
                        >
                            {simulatingId === goal.id ? (
                                <Cpu className="w-3 h-3 animate-spin neon-glow-green" /> {/* Icon glow */}
                            ) : (
                                <Cpu className="w-3 h-3" />
                            )}
                            <span>Simulate</span>
                        </button>

                        {!goal.subtasks && status !== 'completed' && (
                        <button 
                            onClick={() => optimizeGoal(goal.id, goal.title)}
                            disabled={analyzingId === goal.id}
                            className="flex items-center gap-1 text-xs text-neon-purple neon-glow-purple hover:text-white transition-colors disabled:opacity-50" {/* Text glow */}
                        >
                            {analyzingId === goal.id ? (
                            <>
                                <BrainCircuit className="w-3 h-3 animate-spin neon-glow-purple" /> {/* Icon glow */}
                                <span>Thinking...</span>
                            </>
                            ) : (
                            <>
                                <Sparkles className="w-3 h-3" />
                                <span>Optimize</span>
                            </>
                            )}
                        </button>
                        )}
                    </div>
                  </div>
                </QuantumCard>
              ))}

              {status === 'planned' && (
                <div className="mt-2 animate-page-enter">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                        {/* LANGUAGE INDICATOR & INPUT */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1">
                            {inputLang === Language.BN ? (
                                <span className="text-[10px] font-bold text-neon-green bg-neon-green/20 px-1.5 py-0.5 rounded shadow-sm">BN</span> {/* More distinct badge */}
                            ) : (
                                <span className="text-[10px] font-bold text-neon-blue bg-neon-blue/20 px-1.5 py-0.5 rounded shadow-sm">EN</span>
                            )}
                        </div>
                        
                        <input 
                            id="new-goal-input"
                            placeholder={inputLang === Language.BN ? (isListeningInput ? "শুনছি..." : "        নতুন নির্দেশনা লিখুন...") : (isListeningInput ? "Listening..." : "        Add new strategic directive...")} 
                            value={newGoalTitle}
                            onChange={(e) => setNewGoalTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                            className={`w-full bg-glass-light border-2 rounded-xl pl-10 pr-10 py-3.5 text-white placeholder-gray-500 font-sans outline-none focus:border-neon-green text-sm transition-all duration-300 ${isListeningInput ? 'border-neon-red/70 shadow-[0_0_20px_rgba(255,77,109,0.4)] animate-pulse-strong' : 'border-glass-strong'}`} {/* Thicker border, stronger shadow/pulse */}
                        />
                        <button 
                            onClick={handleVoiceInput}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all duration-200 ${isListeningInput ? 'text-neon-red bg-neon-red/15 animate-pulse-fast shadow-[0_0_15px_rgba(255,77,109,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} {/* Larger button, stronger glow/pulse */}
                            title={isListeningInput ? "Stop Listening" : "Start Voice Input"}
                        >
                            {isListeningInput ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />} {/* Larger icons */}
                        </button>
                    </div>
                    
                    <button 
                        onClick={toggleInputLang}
                        className={`px-3.5 py-2.5 rounded-xl border-2 text-[10px] font-bold transition-all flex flex-col items-center justify-center min-w-[45px] shadow-sm ${inputLang === Language.BN ? 'border-neon-green text-neon-green bg-neon-green/15 shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'border-glass-strong text-gray-400 hover:text-white hover:border-white/40'}`} {/* Thicker border, stronger shadow */}
                        title="Switch Language (English / Bangla)"
                    >
                        <Languages className="w-4 h-4 mb-0.5" />
                    </button>

                    <QuantumButton variant="secondary" onClick={addGoal} className="px-3">
                      <Plus className="w-5 h-5" />
                    </QuantumButton>
                  </div>
                  {isListeningInput && (
                      <div className="flex items-center gap-2 mt-2 ml-1">
                          <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse-strong shadow-[0_0_10px_#FF2A2A]" /> {/* Larger, glowing pulse */}
                          <span className="text-xs text-neon-red font-medium drop-shadow-md">
                              {inputLang === Language.BN ? "ভয়েস রেকর্ড করা হচ্ছে..." : "Capturing voice input..."}
                          </span>
                      </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* HISTORY MODAL */}
      {historyGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-page-enter">
            <div className="w-full max-w-2xl bg-quantum-midnight border-2 border-glass-strong rounded-xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"> {/* Thicker border */}
                <div className="p-4 border-b-2 border-glass-strong flex justify-between items-center bg-quantum-deep"> {/* Thicker border */}
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-neon-blue neon-glow-blue" /> {/* Icon glow */}
                        <h3 className="font-heading font-semibold text-white">Analysis History: {historyGoal.title}</h3>
                    </div>
                    <button onClick={() => setHistoryGoal(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {!historyGoal.analysisHistory || historyGoal.analysisHistory.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                            <Clock className="w-12 h-12 mb-3 opacity-20" /> {/* Larger icon */}
                            <p>No AI analysis history available for this directive.</p>
                        </div>
                    ) : (
                        historyGoal.analysisHistory.map((item, index) => (
                            <div key={item.id} className="relative pl-6 pb-6 border-l-2 border-glass-border last:border-0 last:pb-0"> {/* Thicker border */}
                                {/* Timeline Dot - larger, stronger glow */}
                                <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_15px_rgba(0,212,255,0.7)] animate-pulse-fast" />
                                
                                <div className="bg-glass-light rounded-lg p-4 border-2 border-glass-border hover:border-neon-blue/50 transition-colors shadow-md"> {/* Thicker border, shadow */}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs text-neon-blue font-bold flex items-center gap-1 neon-glow-blue"> {/* Text glow */}
                                            <Sparkles className="w-3 h-3" /> Yusra Analysis #{historyGoal.analysisHistory!.length - index}
                                        </span>
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    {/* History Subtask Analysis Summary */}
                                    {item.subtaskAnalysis && (
                                        <div className="mb-3 p-2 bg-neon-blue/10 border-l-4 border-neon-blue text-xs text-gray-300 italic leading-relaxed shadow-sm"> {/* Thicker border, shadow */}
                                            "{item.subtaskAnalysis}"
                                        </div>
                                    )}

                                    {item.riskAnalysis && (
                                        <div className="mb-3 p-2 bg-black/30 rounded border-2 border-white/10 shadow-sm"> {/* Thicker border, shadow */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold uppercase ${item.riskAnalysis.riskLevel === 'critical' ? 'text-neon-red neon-glow-pink' : 'text-neon-yellow neon-glow-yellow'}`}> {/* Text glows */}
                                                    Risk: {item.riskAnalysis.riskLevel}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-1">{item.riskAnalysis.mitigation}</p>
                                            <ul className="list-disc list-inside text-[10px] text-gray-500">
                                                {item.riskAnalysis.risks.slice(0, 1).map((r, i) => (
                                                    <li key={i}>{r}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {item.subtasks && (
                                        <div className="space-y-1">
                                            {item.subtasks.slice(0, 3).map((task, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> {/* Larger dot */}
                                                    <span className="truncate">{task}</span>
                                                </div>
                                            ))}
                                            {item.subtasks.length > 3 && (
                                                <div className="text-[10px] text-gray-500 italic pl-3">
                                                    +{item.subtasks.length - 3} more tasks
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

      {/* STEALTH MODE SIMULATION MODAL */}
      {showSimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-page-enter">
            <div className="w-full max-w-2xl bg-black border-2 border-neon-green/50 rounded-lg overflow-hidden shadow-[0_0_60px_rgba(0,255,163,0.2)]"> {/* Thicker border, stronger shadow */}
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-neon-green/10 border-b-2 border-neon-green/30"> {/* Thicker border */}
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-neon-green neon-glow-green" /> {/* Icon glow */}
                        <span className="font-mono text-xs text-neon-green font-bold drop-shadow-md">YUSRA_STEALTH_CORE // V.9.0</span> {/* Text shadow */}
                    </div>
                    <button onClick={() => setShowSimModal(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                </div>

                <div className="p-6 font-mono text-sm h-[400px] overflow-y-auto relative">
                    {/* Background Grid - more visible */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,163,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,163,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    
                    {!simulationResult ? (
                        <div className="space-y-2 text-neon-green/90 relative z-10"> {/* Brighter text */}
                            <p>> INITIALIZING QUANTUM SIMULATION...</p>
                            <p>> LOADING MARKET DATASETS [################----] 80%</p>
                            <p>> ANALYZING COMPETITOR VECTORS...</p>
                            <p>> RUNNING 10,000 SCENARIO ITERATIONS...</p>
                            <div className="mt-8 flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-neon-green/50 border-t-neon-green rounded-full animate-spin shadow-[0_0_20px_rgba(0,255,157,0.5)]" /> {/* Stronger spinner, shadow */}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 relative z-10 animate-page-enter">
                            <div className="flex items-center gap-4">
                                <div className="w-28 h-28 rounded-full border-4 border-neon-green flex items-center justify-center relative shadow-[0_0_30px_rgba(0,255,157,0.6)]"> {/* Larger, stronger glow */}
                                    <span className="text-3xl font-bold text-white neon-glow-green">{simulationResult.successProbability}%</span> {/* Larger text, glow */}
                                    <span className="absolute -bottom-6 text-[10px] text-neon-green uppercase drop-shadow-md">Success Rate</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="p-3 bg-neon-green/10 border-l-4 border-neon-green shadow-sm"> {/* Thicker border, shadow */}
                                        <p className="text-gray-400 text-xs uppercase">Financial Impact</p>
                                        <p className="text-white font-bold text-lg">{simulationResult.financialImpact}</p>
                                    </div>
                                    <div className="p-3 bg-neon-blue/10 border-l-4 border-neon-blue shadow-sm"> {/* Thicker border, shadow */}
                                        <p className="text-gray-400 text-xs uppercase">Market Trend</p>
                                        <p className="text-neon-blue font-bold uppercase">{simulationResult.marketTrendPrediction}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-neon-red text-xs uppercase font-bold neon-glow-pink">> Competitor Intel</p> {/* Text glow */}
                                <p className="text-gray-300 border-2 border-neon-red/30 bg-neon-red/10 p-3 rounded shadow-sm"> {/* Thicker border, shadow */}
                                    {simulationResult.competitorReaction}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-neon-green text-xs uppercase font-bold neon-glow-green">> CEO Recommendation</p> {/* Text glow */}
                                <p className="text-white border-2 border-neon-green/30 bg-neon-green/10 p-3 rounded typing-effect shadow-sm"> {/* Thicker border, shadow */}
                                    {simulationResult.recommendation}
                                </p>
                            </div>
                            
                            {isGodMode && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-700 text-center">
                                    <button className="text-xs text-neon-pink hover:underline uppercase tracking-widest neon-glow-pink"> {/* Text glow */}
                                        [GOD MODE] Override Probability Matrix
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <QuantumToast 
        isVisible={toast.visible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />
    </div>
  );
};
