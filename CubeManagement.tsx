
import React, { useState } from 'react';
import { Hexagon, Plus, Settings, Users, Shield, Activity, MoreHorizontal, Box, Globe } from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumBadge, QuantumInput } from './QuantumComponents';
import { Cube } from '../types';

const MOCK_CUBES: Cube[] = [
  { id: '1', name: 'Alpha Prime', type: 'Enterprise', status: 'active', members: 1240, securityLevel: 'Fort Knox', region: 'US-East', created: Date.now() },
  { id: '2', name: 'Neon Start', type: 'Startup', status: 'active', members: 12, securityLevel: 'Standard', region: 'EU-West', created: Date.now() },
  { id: '3', name: 'DAO Core', type: 'DAO', status: 'frozen', members: 5600, securityLevel: 'High', region: 'Global', created: Date.now() },
];

export const CubeManagement: React.FC = () => {
  const [cubes, setCubes] = useState<Cube[]>(MOCK_CUBES);

  return (
    <div className="space-y-6 animate-page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white neon-glow-blue">Cube Management</h1>
          <p className="text-gray-400">Instantiate, monitor, and configure dimensional workspaces.</p>
        </div>
        <QuantumButton variant="primary" icon={<Plus className="w-4 h-4" />}>
           Instantiate Cube
        </QuantumButton>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuantumCard className="flex flex-col justify-center items-center py-6">
              <Hexagon className="w-8 h-8 text-neon-blue mb-2" />
              <span className="text-2xl font-bold text-white">{cubes.length}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">Active Cubes</span>
          </QuantumCard>
          <QuantumCard className="flex flex-col justify-center items-center py-6">
              <Users className="w-8 h-8 text-neon-purple mb-2" />
              <span className="text-2xl font-bold text-white">6,852</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">Total Residents</span>
          </QuantumCard>
          <QuantumCard className="flex flex-col justify-center items-center py-6">
              <Activity className="w-8 h-8 text-neon-green mb-2" />
              <span className="text-2xl font-bold text-white">99.9%</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">Uptime</span>
          </QuantumCard>
          <QuantumCard className="flex flex-col justify-center items-center py-6">
              <Shield className="w-8 h-8 text-neon-pink mb-2" />
              <span className="text-2xl font-bold text-white">0</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">Breaches</span>
          </QuantumCard>
      </div>

      {/* CUBE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cubes.map(cube => (
              <div key={cube.id} className="group relative bg-quantum-midnight/60 border border-glass-border rounded-2xl overflow-hidden hover:border-neon-blue/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                  {/* Header Gradient */}
                  <div className={`h-24 bg-gradient-to-br ${
                      cube.type === 'Enterprise' ? 'from-blue-900 to-black' :
                      cube.type === 'Startup' ? 'from-green-900 to-black' :
                      'from-purple-900 to-black'
                  } relative`}>
                      <div className="absolute top-4 right-4">
                          <QuantumBadge color={cube.status === 'active' ? 'green' : 'blue'}>{cube.status}</QuantumBadge>
                      </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                      {/* Icon Hexagon */}
                      <div className="absolute -top-10 left-6 w-20 h-20 bg-quantum-deep border-4 border-quantum-midnight rounded-xl flex items-center justify-center shadow-lg">
                          <Hexagon className={`w-10 h-10 ${
                               cube.type === 'Enterprise' ? 'text-neon-blue' :
                               cube.type === 'Startup' ? 'text-neon-green' :
                               'text-neon-purple'
                          }`} />
                      </div>

                      <div className="mt-8">
                          <h3 className="text-xl font-bold text-white">{cube.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                              <span>{cube.type}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {cube.region}</span>
                          </div>

                          <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Security</span>
                                  <span className={`font-bold ${
                                      cube.securityLevel === 'Fort Knox' ? 'text-neon-pink' : 'text-white'
                                  }`}>{cube.securityLevel}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Members</span>
                                  <span className="text-white font-mono">{cube.members.toLocaleString()}</span>
                              </div>
                          </div>

                          <div className="mt-6 flex gap-2">
                              <QuantumButton variant="ghost" className="flex-1 border border-white/10 text-xs">Manage</QuantumButton>
                              <QuantumButton variant="ghost" className="flex-1 border border-white/10 text-xs">Settings</QuantumButton>
                          </div>
                      </div>
                  </div>
              </div>
          ))}

          {/* New Cube Placeholder */}
          <button className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center min-h-[300px] hover:border-neon-blue/50 hover:bg-white/5 transition-all group">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Plus className="w-8 h-8 text-gray-400 group-hover:text-neon-blue" />
               </div>
               <span className="text-gray-400 font-bold group-hover:text-white">Initialize New Cube</span>
          </button>
      </div>
    </div>
  );
};
