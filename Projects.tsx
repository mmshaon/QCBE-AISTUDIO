
import React, { useState } from 'react';
import { Layout, List, Calendar, Plus, MoreHorizontal, Clock, CheckSquare, Users, BarChart3, GanttChart, ChevronRight } from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumBadge } from './QuantumComponents';
import { Project } from '../types';

const MOCK_PROJECTS: Project[] = [
    { id: '1', name: 'Quantum Core v3', status: 'active', lead: 'Sarah Chen', leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', budget: '$1.2M', deadline: '2024-12-01', progress: 65, teamSize: 8, tags: ['R&D', 'Critical'] },
    { id: '2', name: 'Mobile App Launch', status: 'planning', lead: 'Marcus Vance', leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', budget: '$450k', deadline: '2025-01-15', progress: 15, teamSize: 4, tags: ['Mobile', 'Consumer'] },
    { id: '3', name: 'Security Audit', status: 'review', lead: 'Elena R', leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', budget: '$120k', deadline: '2024-10-30', progress: 90, teamSize: 3, tags: ['Security'] },
    { id: '4', name: 'Infrastructure Migration', status: 'active', lead: 'Kenji Sato', leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji', budget: '$300k', deadline: '2024-11-15', progress: 45, teamSize: 6, tags: ['Infra', 'Internal'] },
];

export const Projects: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  const renderTimeline = () => {
    // Simulated Timeline Configuration
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    
    return (
        <QuantumCard className="overflow-x-auto min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <GanttChart className="w-5 h-5 text-neon-blue neon-glow-blue" />
                    Project Timeline View
                </h3>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-neon-green" /> Active
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-neon-blue" /> Planning
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-neon-purple" /> Review
                    </div>
                </div>
            </div>

            <div className="min-w-[800px] relative flex-1">
                {/* Timeline Header (Months) */}
                <div className="grid grid-cols-6 border-b-2 border-glass-strong pb-2 mb-4 sticky top-0 bg-quantum-midnight/90 z-20 backdrop-blur-sm">
                    {months.map((m, i) => (
                        <div key={i} className="text-gray-400 text-xs font-mono font-bold border-l border-white/10 pl-2 uppercase tracking-widest">
                            {m} '24
                        </div>
                    ))}
                </div>

                {/* Grid Background Lines */}
                <div className="absolute inset-0 top-8 z-0 flex pointer-events-none">
                     {months.map((_, i) => (
                         <div key={i} className="flex-1 border-l border-white/5 h-full" />
                     ))}
                </div>

                {/* Project Rows */}
                <div className="space-y-6 relative z-10 py-2">
                    {projects.map((p, index) => {
                         // Mock calculations for demo positioning
                         // Assuming Start = Oct 1st as 0% and End = Mar 31st as 100% (6 months)
                         // Simple randomized visualization for demo purposes based on deadline month
                         
                         let startPercent = 0;
                         let widthPercent = 20;

                         if (p.deadline.includes('10-')) { startPercent = 5; widthPercent = 15; } // Oct
                         else if (p.deadline.includes('11-')) { startPercent = 15; widthPercent = 20; } // Nov
                         else if (p.deadline.includes('12-')) { startPercent = 25; widthPercent = 25; } // Dec
                         else if (p.deadline.includes('01-')) { startPercent = 40; widthPercent = 30; } // Jan
                         else { startPercent = 10; widthPercent = 40; }

                         const color = p.status === 'active' ? 'bg-neon-green' : p.status === 'planning' ? 'bg-neon-blue' : 'bg-neon-purple';
                         const neonColor = p.status === 'active' ? '#00FF9D' : p.status === 'planning' ? '#00F0FF' : '#BC13FE';

                         return (
                            <div key={p.id} className="relative h-14 flex items-center group">
                                {/* Row Label */}
                                <div className="absolute left-0 w-48 pr-6 z-20 flex items-center justify-between gap-3 bg-quantum-midnight/95 backdrop-blur-md h-full border-r border-glass-strong">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`w-1 h-8 rounded-full ${color} shadow-[0_0_8px_${neonColor}]`}></div>
                                        <div className="truncate">
                                            <div className="text-xs font-bold text-white truncate">{p.name}</div>
                                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <img src={p.leadAvatar} className="w-3 h-3 rounded-full" /> {p.lead}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </div>

                                {/* Timeline Bar Area */}
                                <div className="flex-1 relative h-full flex items-center ml-48 pl-2">
                                    
                                    {/* Progress Bar Container */}
                                    <div 
                                        className={`absolute h-8 rounded-lg ${color} bg-opacity-20 border border-white/10 group-hover:border-white/30 transition-all shadow-lg flex flex-col justify-center px-3 cursor-pointer overflow-hidden`}
                                        style={{ left: `${startPercent}%`, width: `${widthPercent}%`, '--neon-color': neonColor } as React.CSSProperties}
                                    >
                                        {/* Inner Fill based on actual progress */}
                                        <div 
                                            className={`absolute left-0 top-0 bottom-0 ${color} opacity-40`} 
                                            style={{ width: `${p.progress}%` }} 
                                        />
                                        
                                        <div className="relative z-10 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-white drop-shadow-md">{p.progress}%</span>
                                        </div>
                                    </div>
                                    
                                    {/* Deadline Marker */}
                                    <div 
                                        className="absolute top-1/2 -translate-y-1/2 w-px h-12 bg-neon-red/80 shadow-[0_0_10px_#FF2A2A] z-10 group-hover:h-full transition-all" 
                                        style={{ left: `${startPercent + widthPercent}%` }}
                                    >
                                        <div className="absolute -top-6 -translate-x-1/2 text-[9px] font-mono text-neon-red bg-black/80 px-1.5 py-0.5 rounded border border-neon-red/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            Due {p.deadline}
                                        </div>
                                    </div>
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
        </QuantumCard>
    );
  };

  return (
    <div className="space-y-6 animate-page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white neon-glow-green">Project Command</h1>
          <p className="text-gray-400">Tactical execution and resource allocation.</p>
        </div>
        <div className="flex gap-3">
            <div className="flex bg-glass-medium p-1 rounded-lg border border-glass-border">
                <button 
                    onClick={() => setView('grid')} 
                    className={`p-2 rounded transition-all ${view === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    title="Grid View"
                >
                    <Layout className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setView('list')} 
                    className={`p-2 rounded transition-all ${view === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    title="List View"
                >
                    <List className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setView('timeline')} 
                    className={`p-2 rounded transition-all ${view === 'timeline' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    title="Timeline View"
                >
                    <GanttChart className="w-4 h-4" />
                </button>
            </div>
            <QuantumButton variant="primary" icon={<Plus className="w-4 h-4" />}>New Project</QuantumButton>
        </div>
      </div>

      {view === 'timeline' ? renderTimeline() : (
        <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {projects.map(project => (
                <QuantumCard key={project.id} className="group hover:border-neon-green/40 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 ${
                                project.status === 'active' ? 'bg-neon-green/10 text-neon-green' :
                                project.status === 'planning' ? 'bg-neon-blue/10 text-neon-blue' :
                                'bg-neon-purple/10 text-neon-purple'
                            }`}>
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-neon-green transition-colors">{project.name}</h3>
                                <span className="text-xs text-gray-400">Lead: {project.lead}</span>
                            </div>
                        </div>
                        <QuantumBadge color={
                            project.status === 'active' ? 'green' :
                            project.status === 'planning' ? 'blue' : 'purple'
                        }>{project.status}</QuantumBadge>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {project.deadline}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {project.teamSize} Members</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-300">Progress</span>
                                <span className={`font-mono font-bold ${project.status === 'active' ? 'text-neon-green' : 'text-neon-blue'}`}>{project.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${project.status === 'active' ? 'bg-neon-green' : project.status === 'planning' ? 'bg-neon-blue' : 'bg-neon-purple'}`} 
                                    style={{width: `${project.progress}%`}} 
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex gap-2">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5 group-hover:border-white/20 transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <button className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>
                    </div>
                </QuantumCard>
            ))}
            
            {/* Add Project Card */}
            {view === 'grid' && (
                <button className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center min-h-[200px] hover:border-neon-green/40 hover:bg-white/5 transition-all group animate-page-enter" style={{animationDelay: '100ms'}}>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-neon-green" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white">Initialize Project</span>
                </button>
            )}
        </div>
      )}
    </div>
  );
};
