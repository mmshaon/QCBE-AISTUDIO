
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Shield, UserCog, Trash2, MoreVertical, 
  CheckCircle2, XCircle, BrainCircuit, Activity, Edit3, Save, X, Copy
} from 'lucide-react';
import { QuantumCard, QuantumButton, QuantumBadge, QuantumInput, QuantumToast } from './QuantumComponents';
import { databaseService } from '../services/database';
import { User } from '../types';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  
  const currentUser = databaseService.getCurrentUser();
  const hasAccess = currentUser?.role === 'admin' || currentUser?.role === 'god_mode';

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(u => 
        u.name.toLowerCase().includes(lower) || 
        u.email.toLowerCase().includes(lower) ||
        u.role.toLowerCase().includes(lower)
      ));
    }
  }, [searchQuery, users]);

  const loadUsers = () => {
    const allUsers = databaseService.getAllUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("User ID copied to clipboard", "success");
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      showToast("Security Protocol: Cannot delete active session user.", "error");
      return;
    }
    
    if (confirm("WARNING: Irreversible deletion of user entity. Confirm?")) {
      const success = databaseService.deleteUser(userId);
      if (success) {
        showToast("User entity successfully purged from registry.", "success");
        loadUsers();
      } else {
        showToast("Deletion failed. Target may be protected.", "error");
      }
    }
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    
    // Validation
    if (!editingUser.name || !editingUser.email) {
      showToast("Name and Email are mandatory fields.", "error");
      return;
    }

    const success = databaseService.updateUser(editingUser);
    if (success) {
      showToast("User profile synced with Quantum Registry.", "success");
      setEditingUser(null);
      loadUsers();
    } else {
      showToast("Update failed. Permission denied.", "error");
    }
  };

  if (!hasAccess) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <Shield className="w-24 h-24 text-gray-700" />
        <h2 className="text-2xl font-heading font-bold text-gray-500">ACCESS RESTRICTED</h2>
        <p className="text-gray-600">Administrative clearance required for User Management module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white neon-glow-pink">User Management</h1>
          <p className="text-gray-400">Administer identities, roles, and access permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <QuantumBadge color="blue">{users.length} Identities</QuantumBadge>
          <QuantumBadge color="green">{users.filter(u => u.role !== 'user').length} Admins</QuantumBadge>
        </div>
      </div>

      {/* Search & Toolbar */}
      <QuantumCard>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name, email, or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-glass-light border border-glass-border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-neon-pink transition-all"
          />
        </div>
      </QuantumCard>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-glass-border">
        <table className="w-full text-left border-collapse bg-quantum-midnight/60 backdrop-blur-md">
          <thead>
            <tr className="border-b border-glass-strong bg-white/5">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Identity</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User ID</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role & Access</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Voice Sig</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">AI Profile</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-light">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2 group/id">
                    <span className="font-mono text-xs text-gray-400">{user.id}</span>
                    <button 
                        onClick={() => copyToClipboard(user.id)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-neon-blue opacity-0 group-hover/id:opacity-100 transition-all"
                        title="Copy ID"
                    >
                        <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold w-fit border ${
                      user.role === 'god_mode' ? 'bg-neon-pink/10 text-neon-pink border-neon-pink/30' :
                      user.role === 'admin' ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/30' :
                      'bg-glass-light text-gray-400 border-gray-700'
                    }`}>
                      {user.role === 'god_mode' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  {user.voiceSignature ? (
                    <div className="flex items-center gap-1 text-neon-green text-xs">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500 text-xs opacity-50">
                      <XCircle className="w-3 h-3" /> Not Set
                    </div>
                  )}
                </td>

                <td className="p-4">
                  {user.learnedTraits ? (
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-1 text-xs text-neon-purple">
                          <BrainCircuit className="w-3 h-3" /> Active
                       </div>
                       <span className="text-[10px] text-gray-500">Tone: {user.learnedTraits.tone}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">--</span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2 rounded-lg bg-glass-light hover:bg-neon-blue/20 hover:text-neon-blue transition-colors"
                      title="Edit User"
                    >
                      <UserCog className="w-4 h-4" />
                    </button>
                    {user.role !== 'god_mode' && (
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 rounded-lg bg-glass-light hover:bg-red-500/20 hover:text-red-500 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-page-enter">
          <QuantumCard className="w-full max-w-lg border-neon-blue/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-glass-border">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-neon-blue" />
                Edit Profile: {editingUser.name}
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <img src={editingUser.avatar} className="w-16 h-16 rounded-full border border-gray-600" />
                <div>
                   <p className="text-xs text-gray-400">User ID</p>
                   <div className="flex items-center gap-2">
                       <p className="font-mono text-sm text-gray-300">{editingUser.id}</p>
                       <button onClick={() => copyToClipboard(editingUser.id)} className="text-gray-500 hover:text-white"><Copy className="w-3 h-3" /></button>
                   </div>
                </div>
              </div>

              <QuantumInput 
                label="Full Name" 
                value={editingUser.name}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
              />

              <QuantumInput 
                label="Email Address" 
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              />

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium ml-1">System Role</label>
                <div className="grid grid-cols-3 gap-2">
                   {['user', 'admin', 'god_mode'].map(role => (
                     <button
                        key={role}
                        onClick={() => {
                            // Security Check for assigning God Mode
                            if (role === 'god_mode') {
                                if (currentUser?.role !== 'god_mode') {
                                    showToast("Only Supreme Creator can assign God Mode.", "error");
                                    return;
                                }
                                // Strict Confirmation for God Mode assignment
                                if (!window.confirm("⚠️ CRITICAL SECURITY WARNING ⚠️\n\nYou are about to grant SUPREME CREATOR access (God Mode).\nThis user will have full control over the system, including database destruction.\n\nAre you absolutely sure you want to proceed?")) {
                                    return;
                                }
                            }
                            setEditingUser({...editingUser, role: role as any});
                        }}
                        className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all ${
                            editingUser.role === role 
                            ? (role === 'god_mode' ? 'bg-neon-pink/20 border-neon-pink text-neon-pink' : 'bg-neon-blue/20 border-neon-blue text-neon-blue')
                            : 'bg-glass-light border-glass-border text-gray-500 hover:bg-glass-medium'
                        }`}
                     >
                       {role.replace('_', ' ')}
                     </button>
                   ))}
                </div>
              </div>
              
              {editingUser.role === 'god_mode' && (
                  <div className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-lg text-xs text-neon-pink flex items-start gap-2">
                      <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                      Warning: God Mode grants unrestricted access to system core, database, and shutdown protocols.
                  </div>
              )}

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-glass-border">
                <QuantumButton variant="ghost" onClick={() => setEditingUser(null)}>Cancel</QuantumButton>
                <QuantumButton variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSaveEdit}>
                  Save Changes
                </QuantumButton>
              </div>
            </div>
          </QuantumCard>
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
