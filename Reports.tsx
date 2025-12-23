

import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Download, Filter, FileText, ArrowUpRight, Activity, ShieldCheck } from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumBadge } from './QuantumComponents';
import { Transaction } from '../types';

const healthData = [
  { subject: 'Finance', A: 120, fullMark: 150 },
  { subject: 'Ops', A: 98, fullMark: 150 },
  { subject: 'Sales', A: 86, fullMark: 150 },
  { subject: 'Marketing', A: 99, fullMark: 150 },
  { subject: 'Innovation', A: 85, fullMark: 150 },
  { subject: 'Retention', A: 65, fullMark: 150 },
];

const trendData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 6890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const transactions: Transaction[] = [
  { id: 'TX-9874', entity: 'CyberDyne Systems', amount: '$12,450.00', type: 'credit', date: 'Just now', status: 'cleared' },
  { id: 'TX-9873', entity: 'AWS Infrastructure', amount: '$2,340.50', type: 'debit', date: '15m ago', status: 'cleared' },
  { id: 'TX-9872', entity: 'Global Marketing Campaign', amount: '$15,000.00', type: 'debit', date: '2h ago', status: 'pending' },
  { id: 'TX-9871', entity: 'Stark Industries', amount: '$54,200.00', type: 'credit', date: '5h ago', status: 'cleared' },
  { id: 'TX-9870', entity: 'Quantum Core Lic.', amount: '$99.00', type: 'debit', date: '1d ago', status: 'cleared' },
];

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6 animate-page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white neon-glow-blue">Intelligence Hub</h1>
          <p className="text-gray-400">Deep-dive analytics and financial telemetry.</p>
        </div>
        <div className="flex gap-2">
          <QuantumButton variant="ghost" icon={<Filter className="w-4 h-4" />}>Filter</QuantumButton>
          <QuantumButton variant="secondary" icon={<Download className="w-4 h-4" />}>Export Data</QuantumButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Health Radar */}
        <QuantumCard className="h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neon-green neon-glow-green" /> {/* Icon glow */}
              Business Health Radar
            </h3>
            <QuantumBadge color="green">OPTIMAL</QuantumBadge>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={healthData}>
                <PolarGrid stroke="#ffffff25" /> {/* Brighter grid */}
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'Rajdhani' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Current Status"
                  dataKey="A"
                  stroke="#00FFA3"
                  strokeWidth={2.5} /* Thicker stroke */
                  fill="#00FFA3"
                  fillOpacity={0.4} /* More opaque fill */
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 17, 26, 0.95)', borderColor: '#00FFA3', borderRadius: '8px', color: '#fff', fontFamily: 'Rajdhani', fontSize: '12px', boxShadow: '0 0 10px rgba(0,255,163,0.3)' }} /* Neon border & shadow */
                  itemStyle={{ color: '#00FFA3' }}
                  labelStyle={{ color: '#ffffff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </QuantumCard>

        {/* Real-time Trend */}
        <QuantumCard className="lg:col-span-2 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-neon-blue neon-glow-blue" /> {/* Icon glow */}
              Cashflow Velocity
            </h3>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-500 font-mono">Live Feed</span>
              <div className="w-2.5 h-2.5 rounded-full bg-neon-red animate-pulse-strong" /> {/* Stronger pulse */}
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff25" vertical={false} /> {/* Brighter grid */}
                <XAxis dataKey="name" stroke="#ffffff80" fontSize={10} tickLine={false} axisLine={false} fontFamily="Rajdhani" /> {/* Brighter axis */}
                <YAxis stroke="#ffffff80" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 17, 26, 0.95)', borderColor: '#00D4FF', borderRadius: '8px', color: '#fff', fontFamily: 'Rajdhani', fontSize: '12px', boxShadow: '0 0 10px rgba(0,212,255,0.3)' }} /* Neon border & shadow */
                  cursor={{stroke: '#00D4FF', strokeWidth: 2, strokeDasharray: '5 5'}} /* Thicker cursor */
                  itemStyle={{ color: '#00D4FF' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00D4FF" 
                  strokeWidth={3} 
                  dot={{fill: '#05111A', stroke: '#00D4FF', strokeWidth: 2, r: 5}} /* Larger dot */
                  activeDot={{r: 8, fill: '#00D4FF', strokeWidth: 3, stroke: '#FFFFFF'}} /* Larger, thicker active dot */
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </QuantumCard>
      </div>

      {/* Transaction Stream */}
      <QuantumCard>
        <h3 className="text-lg font-heading font-semibold text-white mb-6">Live Transaction Stream</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-glass-strong bg-white/10"> {/* Thicker border, darker bg */}
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Transaction ID</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Entity</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Date</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right font-mono">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider font-mono"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-light">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-mono text-neon-blue">{tx.id}</td>
                  <td className="p-4 text-sm text-white font-medium">{tx.entity}</td>
                  <td className="p-4 text-sm text-gray-400">{tx.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${ /* Larger padding, bolder text */
                      tx.status === 'cleared' ? 'bg-neon-green/20 text-neon-green animate-pulse-strong shadow-sm' : 'bg-neon-yellow/20 text-neon-yellow animate-pulse-strong shadow-sm'
                    }`}> {/* Stronger pulse, shadow */}
                      {tx.status}
                    </span>
                  </td>
                  <td className={`p-4 text-sm font-bold text-right ${tx.type === 'credit' ? 'text-neon-green' : 'text-white'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </QuantumCard>
    </div>
  );
};