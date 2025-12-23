

import React, { useState } from 'react';
import { 
  UserPlus, MoreVertical, Search, MessageSquare, Phone
} from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumToast, QuantumInput } from './QuantumComponents';
import { Employee } from '../types';
import { QuantumConnect } from './QuantumConnect';

// Mock Data
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Dr. Sarah Chen', role: 'Lead Quantum Physicist', department: 'R&D', status: 'online', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '2', name: 'Marcus Vance', role: 'Operations Director', department: 'Ops', status: 'busy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', isSpeaking: false }, // Added isSpeaking to match VideoParticipant
  { id: '3', name: 'Elena Rostova', role: 'AI Ethics Officer', department: 'Legal', status: 'offline', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
  { id: '4', name: 'Kenji Sato', role: 'Frontend Architect', department: 'Engineering', status: 'in-call', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji' },
];

export const HumanResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'connect'>('team');
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  // === SUB-COMPONENTS HANDLERS ===
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ visible: true, message: msg, type });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
            <h1 className="text-3xl font-heading font-bold text-white neon-glow-blue">Human Resources</h1>
            <p className="text-gray-400">Manage personnel and quantum-encrypted collaboration.</p>
        </div>
        <div className="flex bg-glass-medium p-1 rounded-xl border-2 border-glass-strong shadow-md"> {/* Thicker border, shadow */}
            <button 
                onClick={() => setActiveTab('team')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'team' ? 'bg-neon-blue text-quantum-deep shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                Team Grid
            </button>
            <button 
                onClick={() => setActiveTab('connect')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'connect' ? 'bg-neon-purple text-quantum-deep shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                Quantum Connect
            </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'team' ? (
            <TeamGrid employees={employees} onAdd={() => showToast('User invite sent to HR Admin', 'success')} />
        ) : (
            <QuantumConnect showToast={showToast} />
        )}
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

// ==========================================
// SUB-COMPONENT: TEAM MANAGEMENT
// ==========================================
const TeamGrid: React.FC<{ employees: Employee[], onAdd: () => void }> = ({ employees, onAdd }) => (
    <div className="space-y-4 animate-page-enter h-full overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex justify-between items-center bg-quantum-midnight/60 p-4 rounded-xl border-2 border-glass-strong shadow-lg sticky top-0 z-10 backdrop-blur-md"> {/* Darker bg, thicker border, shadow */}
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <QuantumInput type="text" placeholder="Search personnel..." className="!bg-glass-medium border-2 border-glass-border rounded-lg !pl-10 pr-4 !py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue" /> {/* Thicker border, larger padding */}
            </div>
            <QuantumButton icon={<UserPlus className="w-4 h-4" />} onClick={onAdd}>Add Member</QuantumButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {employees.map(emp => (
                <QuantumCard key={emp.id} className="hover:border-neon-blue/60 hover:scale-[1.02] transition-transform duration-300 shadow-lg hover:shadow-xl"> {/* Stronger hover effect, shadow */}
                    <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-3">
                             <div className="relative">
                                 <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-full bg-glass-medium border-2 border-glass-light p-0.5 shadow-md" /> {/* Larger avatar, thicker border, shadow */}
                                 <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-quantum-midnight ${ /* Larger status dot, thicker border */
                                     emp.status === 'online' ? 'bg-neon-green animate-pulse-strong shadow-[0_0_8px_#00FF9D]' : 
                                     emp.status === 'busy' ? 'bg-neon-red animate-pulse-strong shadow-[0_0_8px_#FF2A2A]' : 
                                     emp.status === 'in-call' ? 'bg-neon-purple animate-pulse-strong shadow-[0_0_8px_#BC13FE]' : 'bg-gray-500'
                                 }`} /> {/* Stronger pulse, shadow */}
                             </div>
                             <div>
                                 <h3 className="font-bold text-white text-lg drop-shadow-md">{emp.name}</h3> {/* Larger text, shadow */}
                                 <p className="text-xs text-neon-blue neon-glow-blue">{emp.role}</p> {/* Text glow */}
                             </div>
                         </div>
                         <button className="text-gray-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-glass-light"> {/* Thicker border */}
                        <span className="text-xs text-gray-400 bg-glass-medium px-2.5 py-1.5 rounded border border-glass-border shadow-sm">{emp.department}</span> {/* Larger padding, shadow */}
                        <div className="flex gap-2">
                            <button className="p-2.5 rounded-lg bg-glass-light hover:bg-neon-blue/30 hover:text-neon-blue transition-colors shadow-sm"> {/* Larger padding, darker hover, shadow */}
                                <MessageSquare className="w-5 h-5" /> {/* Larger icon */}
                            </button>
                            <button className="p-2.5 rounded-lg bg-glass-light hover:bg-neon-green/30 hover:text-neon-green transition-colors shadow-sm"> {/* Larger padding, darker hover, shadow */}
                                <Phone className="w-5 h-5" /> {/* Larger icon */}
                            </button>
                        </div>
                    </div>
                </QuantumCard>
            ))}
        </div>
    </div>
);