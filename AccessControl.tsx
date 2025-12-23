
import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Users, FileCode, Plus, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumBadge, QuantumInput } from './QuantumComponents';
import { Policy, Role } from '../types';

const MOCK_ROLES: Role[] = [
    { id: '1', name: 'Supreme Creator', level: 99, permissions: ['*'] },
    { id: '2', name: 'System Admin', level: 10, permissions: ['system.read', 'system.write', 'users.manage'] },
    { id: '3', name: 'Cube Manager', level: 5, permissions: ['cube.read', 'cube.write', 'project.manage'] },
    { id: '4', name: 'User', level: 1, permissions: ['self.read', 'self.write'] },
];

const MOCK_POLICIES: Policy[] = [
    { id: 'p1', name: 'GodMode_Override', description: 'Allows full system access if god_mode=true', effect: 'ALLOW', resource: '*', condition: 'user.role == "god_mode"', isActive: true },
    { id: 'p2', name: 'Finance_View_Restriction', description: 'Deny finance view if not in finance dept', effect: 'DENY', resource: 'module:finance', condition: 'user.dept != "finance"', isActive: true },
    { id: 'p3', name: 'Project_Edit_Own', description: 'Allow edit if owner', effect: 'ALLOW', resource: 'project:*', condition: 'resource.ownerId == user.id', isActive: true },
];

export const AccessControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rbac' | 'abac'>('rbac');
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [policies, setPolicies] = useState(MOCK_POLICIES);

  return (
    <div className="space-y-6 animate-page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white neon-glow-purple">Access Control</h1>
          <p className="text-gray-400">Manage RBAC roles and ABAC policy engines.</p>
        </div>
        <div className="flex bg-glass-medium p-1 rounded-xl">
            <button 
                onClick={() => setActiveTab('rbac')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'rbac' ? 'bg-neon-blue text-quantum-deep shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                RBAC (Roles)
            </button>
            <button 
                onClick={() => setActiveTab('abac')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'abac' ? 'bg-neon-purple text-quantum-deep shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                ABAC (Policies)
            </button>
        </div>
      </div>

      {activeTab === 'rbac' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map(role => (
                  <QuantumCard key={role.id} className="relative group hover:border-neon-blue/40">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className={`p-3 rounded-lg ${role.level > 50 ? 'bg-neon-pink/10 text-neon-pink' : 'bg-neon-blue/10 text-neon-blue'}`}>
                                 <ShieldCheck className="w-6 h-6" />
                             </div>
                             <div>
                                 <h3 className="font-bold text-white">{role.name}</h3>
                                 <span className="text-xs text-gray-500">Level {role.level} Clearance</span>
                             </div>
                          </div>
                          <button className="text-gray-500 hover:text-white"><Lock className="w-4 h-4" /></button>
                      </div>
                      
                      <div className="space-y-2">
                          <p className="text-xs font-bold text-gray-400 uppercase">Permissions</p>
                          <div className="flex flex-wrap gap-2">
                              {role.permissions.map((perm, i) => (
                                  <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                                      {perm}
                                  </span>
                              ))}
                          </div>
                      </div>
                  </QuantumCard>
              ))}
              <button className="border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center hover:border-neon-blue/40 hover:bg-white/5 transition-all p-8">
                  <div className="flex flex-col items-center gap-2">
                      <Plus className="w-6 h-6 text-gray-400" />
                      <span className="text-sm font-bold text-gray-400">Define New Role</span>
                  </div>
              </button>
          </div>
      ) : (
          <div className="space-y-4">
              <QuantumCard className="p-0 overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-white/5 text-xs text-gray-400 uppercase font-bold">
                          <tr>
                              <th className="p-4">Policy Name</th>
                              <th className="p-4">Effect</th>
                              <th className="p-4">Resource</th>
                              <th className="p-4">Condition (Logic)</th>
                              <th className="p-4 text-right">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                          {policies.map(policy => (
                              <tr key={policy.id} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4 font-bold text-white">
                                      {policy.name}
                                      <p className="text-[10px] text-gray-500 font-normal">{policy.description}</p>
                                  </td>
                                  <td className="p-4">
                                      <span className={`px-2 py-1 rounded text-xs font-bold ${policy.effect === 'ALLOW' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                          {policy.effect}
                                      </span>
                                  </td>
                                  <td className="p-4 font-mono text-gray-300">{policy.resource}</td>
                                  <td className="p-4 font-mono text-neon-blue">{policy.condition}</td>
                                  <td className="p-4 text-right">
                                      {policy.isActive ? (
                                          <span className="flex items-center justify-end gap-1 text-neon-green text-xs font-bold">
                                              <CheckCircle2 className="w-3 h-3" /> Active
                                          </span>
                                      ) : (
                                          <span className="text-gray-500 text-xs">Inactive</span>
                                      )}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <div className="p-4 border-t border-white/5 bg-black/20 flex justify-center">
                      <QuantumButton variant="ghost" icon={<Plus className="w-4 h-4" />}>Add Policy Rule</QuantumButton>
                  </div>
              </QuantumCard>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <QuantumCard>
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><FileCode className="w-4 h-4 text-neon-purple" /> JSON Definition</h3>
                      <pre className="text-[10px] text-gray-400 font-mono bg-black/40 p-3 rounded border border-white/5 overflow-x-auto">
{`{
  "Version": "2024-10-25",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "cube:Create",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "user:tier": "enterprise"
        }
      }
    }
  ]
}`}
                      </pre>
                  </QuantumCard>
                  <QuantumCard>
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-neon-yellow" /> Simulation</h3>
                      <div className="space-y-3">
                          <QuantumInput placeholder="User ID" className="text-xs" />
                          <QuantumInput placeholder="Action (e.g. cube:delete)" className="text-xs" />
                          <QuantumInput placeholder="Resource ID" className="text-xs" />
                          <QuantumButton variant="secondary" className="w-full">Test Permission</QuantumButton>
                      </div>
                  </QuantumCard>
              </div>
          </div>
      )}
    </div>
  );
};
