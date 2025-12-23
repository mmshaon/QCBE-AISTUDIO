

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, 
  Calendar as CalendarIcon, Briefcase, CheckSquare, Layers, FileText, 
  MessageSquare, Globe, BarChart3, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { QuantumCard, QuantumBadge, QuantumIcon, QuantumButton } from './QuantumComponents';
import { BusinessMetric } from '../types';

// === MOCK DATA ===
const metrics: BusinessMetric[] = [
  { title: 'Active Projects', value: '14', change: 2.1, trend: 'up', period: 'vs last month' },
  { title: 'Open Tasks', value: '38', change: -5.4, trend: 'down', period: 'vs last week' },
  { title: 'Monthly Revenue', value: '$128k', change: 12.5, trend: 'up', period: 'vs last month' },
];

const moduleCards = [
  { id: 'mod_proj', title: 'Projects', icon: Briefcase, color: 'cyan', metric: '14 Active', sub: '3 Critical' },
  { id: 'mod_task', title: 'Tasks', icon: CheckSquare, color: 'green', metric: '38 Pending', sub: '94% On Track' },
  { id: 'mod_fin', title: 'Finance', icon: DollarSign, color: 'yellow', metric: '$128k Rev', sub: '+12.5% Growth' },
  { id: 'mod_client', title: 'Clients', icon: Users, color: 'pink', metric: '2.4k Total', sub: '12 New' },
  { id: 'mod_asset', title: 'Assets', icon: Layers, color: 'purple', metric: '430 Items', sub: '98% Operational' },
  { id: 'mod_doc', title: 'Documents', icon: FileText, color: 'blue', metric: '1.2k Files', sub: 'Secure Vault' },
  { id: 'mod_comm', title: 'Comms', icon: MessageSquare, color: 'pink', metric: '5 Unread', sub: 'Team Active' },
  { id: 'mod_world', title: 'Worlds', icon: Globe, color: 'purple', metric: '3 Spaces', sub: 'VR Meetings' },
  { id: 'mod_report', title: 'Reports', icon: BarChart3, color: 'cyan', metric: 'Analytics', sub: 'AI Insights' },
];

const data = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
];

// === SUB-COMPONENTS ===

const KPIStrip: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    {metrics.map((m, i) => (
      <QuantumCard key={i} className="group hover:scale-[1.03] transition-transform duration-300 shadow-md hover:shadow-lg" delay={i * 100}> {/* Stronger hover scale and shadow */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-gray-400 text-xs font-heading font-bold uppercase tracking-widest">{m.title}</span>
          {m.trend === 'up' 
            ? <TrendingUp className="w-5 h-5 text-neon-green group-hover:text-white transition-colors drop-shadow-md" /> /* Larger icon, shadow */
            : <Activity className="w-5 h-5 text-neon-pink group-hover:text-white transition-colors drop-shadow-md" />}
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-mono font-bold text-white tracking-wide text-glow">{m.value}</span> {/* Larger text, text glow */}
          <span className={`text-sm mb-1.5 font-mono ${m.trend === 'up' ? 'text-neon-green' : 'text-neon-pink'} group-hover:text-white transition-colors drop-shadow-md`}> {/* Larger, shadow */}
            {m.change > 0 ? '+' : ''}{m.change}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden"> {/* Thicker progress bar */}
           <div className={`h-full ${m.trend === 'up' ? 'bg-gradient-to-r from-neon-green to-emerald-500' : 'bg-gradient-to-r from-neon-pink to-red-500'} animate-[width_1.5s_ease-out]`} style={{width: `${Math.random() * 60 + 40}%`}} />
        </div>
      </QuantumCard>
    ))}
  </div>
);

const AnimatedCalendar: React.FC = () => {
  const days = Array.from({length: 30}, (_, i) => i + 1);
  return (
    <QuantumCard className="flex-1 flex flex-col min-h-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-neon-blue neon-glow-blue" /> {/* Icon glow */}
          Quantum Calendar
        </h3>
        <span className="text-xs text-gray-500 font-mono tracking-widest">OCTOBER 2054</span>
      </div>
      <div className="grid grid-cols-7 gap-2 flex-1 content-start">
        {['S','M','T','W','T','F','S'].map(d => (
          <div key={d} className="text-center text-[10px] text-gray-500 font-heading font-bold">{d}</div>
        ))}
        {days.map(d => (
          <div key={d} className={`
            relative aspect-square rounded-lg flex items-center justify-center text-sm font-mono transition-all duration-300 cursor-pointer group
            ${d === 14 ? 'bg-neon-cyan/30 text-white shadow-[0_0_20px_rgba(0,240,255,0.5)] border-2 border-neon-cyan animate-border-pulse' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'} {/* More intense active state */}
          `}>
            {d}
            {/* Event Dot - brighter, stronger glow */}
            {[3, 14, 22, 28].includes(d) && (
              <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_8px_#BC13FE] animate-pulse-fast" />
            )}
            {/* Hover Expansion */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-lg scale-110 transition-transform pointer-events-none" />
          </div>
        ))}
      </div>
    </QuantumCard>
  );
};

const ModuleGrid: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => (
  <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 h-full content-start">
    {moduleCards.map((mod, i) => (
      <div 
        key={mod.id}
        onClick={() => onNavigate(mod.id)}
        className="group relative bg-quantum-midnight/80 border border-glass-border rounded-xl p-4 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden active:scale-95 flex flex-col justify-between h-[130px] hover:shadow-[0_0_25px_var(--mod-neon-color)] hover:bg-white/10" /* Taller cards, stronger hover shadow and background */
        style={{ 
            animationDelay: `${i * 50}ms`,
            '--mod-neon-color': 
                mod.color === 'cyan' ? '#00D9F5' : 
                mod.color === 'green' ? '#00FF9D' : 
                mod.color === 'yellow' ? '#FBFF00' : 
                mod.color === 'pink' ? '#FF0055' : 
                mod.color === 'purple' ? '#BC13FE' : 
                '#00F0FF' 
        } as React.CSSProperties}
      >
        {/* Hover Spark - more visible */}
        <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-${mod.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-electric-pulse`} />
        
        <div className="flex justify-between items-start">
          <QuantumIcon icon={mod.icon} color={mod.color} className="w-7 h-7 group-hover:scale-110 transition-transform drop-shadow-lg" /> {/* Larger icon, drop shadow */}
          <div className={`w-2 h-2 rounded-full ${mod.metric.includes('Alert') ? 'bg-neon-red animate-pulse-strong' : 'bg-gray-600'}`} /> {/* Stronger pulse */}
        </div>
        
        <div>
            <h4 className="text-sm font-heading font-semibold text-gray-200 group-hover:text-white transition-colors mb-0.5 truncate drop-shadow-md">{mod.title}</h4> {/* Shadow */}
            <div className="text-xs text-white font-mono truncate">{mod.metric}</div>
            <div className={`text-[10px] truncate ${mod.sub.includes('+') ? 'text-neon-green' : 'text-gray-500'}`}>{mod.sub}</div>
        </div>
        
        {/* Background Graphic - more visible on hover */}
        <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <mod.icon className="w-24 h-24 text-gray-700/50" /> {/* Darker icon, more subtle */}
        </div>
      </div>
    ))}
  </div>
);

interface DashboardProps {
  onNavigate?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate = () => {} }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full pb-4">
      
      {/* CENTER COLUMN: KPIs & Calendar */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        <KPIStrip />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[350px]">
           <AnimatedCalendar />
           
           {/* Financial Mini Chart */}
           <QuantumCard className="flex flex-col min-h-[350px]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-heading font-bold text-white neon-glow-green">Revenue Flow</h3> {/* Text glow */}
                 <QuantumBadge color="green">+12.5%</QuantumBadge>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.6}/> {/* More opaque fill */}
                        <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} /> {/* Brighter grid */}
                    <XAxis dataKey="name" stroke="#ffffff80" fontSize={10} tickLine={false} axisLine={false} /> {/* Brighter axis */}
                    <YAxis stroke="#ffffff80" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(5, 17, 26, 0.95)', borderColor: '#00F0FF', borderRadius: '8px', fontFamily: 'Rajdhani', fontSize: '12px', color: '#00F0FF', boxShadow: '0 0 10px rgba(0,240,255,0.3)' }} /* Neon border & shadow */
                      itemStyle={{ color: '#00F0FF' }}
                      labelStyle={{ color: '#ffffff' }}
                      cursor={{ stroke: '#00F0FF', strokeWidth: 1.5, strokeDasharray: '5 5' }} /* Thicker cursor */
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#00F0FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" 
                          activeDot={{ r: 7, stroke: '#00F0FF', fill: '#00F0FF', strokeWidth: 3 }} /> {/* Larger, thicker active dot */}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </QuantumCard>
        </div>
      </div>

      {/* RIGHT COLUMN: Module Grid */}
      <div className="xl:col-span-1 h-full">
        <QuantumCard className="h-full flex flex-col border-neon-purple/30 min-h-[500px]">
           <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Layers className="w-5 h-5 text-neon-purple neon-glow-purple" /> {/* Icon glow */}
              <h3 className="text-lg font-heading font-bold text-white">System Modules</h3>
           </div>
           <ModuleGrid onNavigate={onNavigate} />
        </QuantumCard>
      </div>
    </div>
  );
};