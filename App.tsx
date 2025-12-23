import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  LayoutDashboard, Briefcase, FileText, Settings as SettingsIcon, Menu, Bell, 
  User as UserIcon, Users, Terminal, Target, Megaphone, Cpu, Scale, Truck, 
  ShieldCheck, Activity, Database, Globe, ChevronDown, Headphones, Layers, Archive, Box, BarChart3, Radio, Leaf, Lock, Zap,
  Key, Cloud, Share2, Workflow, DollarSign, PenTool, MessageSquare, Video, Mic, Grid, Sparkles,
  Fingerprint, Hexagon, CheckSquare, Package, HardDrive, FileSearch, Scroll, UploadCloud, Layout, Link, Plug, CreditCard, PieChart,
  Smartphone, Server, FileCode, Command, Search, UserCog, Monitor, Loader2, X 
} from 'lucide-react';

// === EAGER IMPORTS (Core) ===
import { Dashboard } from './components/Dashboard'; // Keep Dashboard eager for instant LCP
import { YusraAssistant } from './components/YusraAssistant';
import { Login } from './components/Login';
import { QuantumIcon, QuantumLogo, GlobalRippleSystem, QuantumCard, QuantumBadge, QuantumButton, QuantumInput, QuantumToast } from './components/QuantumComponents';
import { NavItem, User, Language } from './types';
import { databaseService } from './services/database';
// FIX: systemService was not properly exported. Corrected in services/systemService.ts
import { systemService } from './services/systemService';

// === LAZY IMPORTS (Performance Optimization) ===
const Planning = lazy(() => import('./components/Planning').then(module => ({ default: module.Planning })));
const Reports = lazy(() => import('./components/Reports').then(module => ({ default: module.Reports })));
const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const HumanResources = lazy(() => import('./components/HumanResources').then(module => ({ default: module.HumanResources })));
const UserManagement = lazy(() => import('./components/UserManagement').then(module => ({ default: module.UserManagement })));
const AccessControl = lazy(() => import('./components/AccessControl').then(module => ({ default: module.AccessControl })));
const GodModePanel = lazy(() => import('./components/GodModePanel').then(module => ({ default: module.GodModePanel })));
const CubeManagement = lazy(() => import('./components/CubeManagement').then(module => ({ default: module.CubeManagement })));
const Projects = lazy(() => import('./components/Projects').then(module => ({ default: module.Projects })));
const QuantumConnect = lazy(() => import('./components/QuantumConnect').then(module => ({ default: module.QuantumConnect })));

// === DYNAMIC MODULE ENGINE ===
const DynamicModule: React.FC<{ title: string; category: string; id: string }> = ({ title, category, id }) => {
  const isFinance = id.includes('fin') || id.includes('bill');
  const isSecurity = id.includes('auth') || id.includes('access') || id.includes('audit');
  const isProject = id.includes('proj') || id.includes('task');

  const metrics = isFinance 
    ? ['Revenue Flow', 'Net Profit', 'Outstanding', 'Tax Reserve']
    : isSecurity 
    ? ['Threat Level', 'Active Sessions', 'Failed Logins', 'Policy Health']
    : isProject
    ? ['Velocity', 'Burn Rate', 'Active Sprints', 'Completion %']
    : ['System Load', 'Uptime', 'Response Time', 'Error Rate'];

  const metricValue = (i: number) => {
    if (isFinance) return `$${(Math.random() * 100000).toFixed(2)}`;
    if (isSecurity) return i === 0 ? 'LOW' : Math.floor(Math.random() * 100);
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="space-y-6 animate-page-enter">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white neon-glow-blue">{title}</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs font-mono text-neon-blue uppercase tracking-widest">{category}</span>
             <span className="text-gray-500">•</span>
             <span className="text-gray-400 text-xs">Yusra Intelligence Integrated</span>
          </div>
        </div>
        <QuantumBadge color="purple">LIVE MODULE</QuantumBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <QuantumCard key={i}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">{metric}</span>
              <Activity className="w-4 h-4 text-neon-blue" />
            </div>
            <div className="text-2xl font-bold text-white">{metricValue(i)}{!isFinance && !isSecurity && '%'}</div>
            <div className="text-xs text-neon-green flex items-center mt-1">
              <Zap className="w-3 h-3 mr-1" /> +{Math.floor(Math.random() * 5 + 1)}% vs last cycle
            </div>
          </QuantumCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuantumCard className="lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-heading font-semibold text-white">Active Operations</h3>
             <QuantumButton variant="ghost" className="!py-1 !px-2 text-xs">View All</QuantumButton>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-neon-blue/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded bg-gradient-to-br ${i % 2 === 0 ? 'from-neon-blue/20 to-blue-900/50' : 'from-neon-purple/20 to-purple-900/50'} border border-white/10 flex items-center justify-center text-xs font-bold text-white`}>
                    {i}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">
                        {isFinance ? `Invoice #${4000+i} Processing` : isSecurity ? `Security Audit Scan Level ${i}` : `Protocol Sequence ${title.split(' ')[0]}-${i}`}
                    </div>
                    <div className="text-xs text-gray-500">Status: Running optimized sequence</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                    <QuantumBadge color={i % 3 === 0 ? 'blue' : 'green'}>{i % 3 === 0 ? 'QUEUED' : 'ACTIVE'}</QuantumBadge>
                    <span className="text-[10px] text-gray-600 mt-1 font-mono">T-minus {i*10}m</span>
                </div>
              </div>
            ))}
          </div>
        </QuantumCard>
      </div>
    </div>
  );
};

// === CINEMATIC LOADER ===
const SystemLoader = () => (
  <div className="h-full w-full flex flex-col items-center justify-center text-center p-12 min-h-[500px]">
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full animate-[spin_3s_linear_infinite]" />
      <div className="absolute inset-2 border-4 border-neon-purple/30 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    </div>
    <h2 className="text-xl font-heading font-bold text-white tracking-widest animate-pulse-strong">INITIALIZING MODULE</h2>
    <p className="text-xs text-neon-blue mt-2 font-mono">Establishing Secure Handshake...</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mod_dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [appLanguage, setAppLanguage] = useState<Language>(Language.EN);
  
  // App Toast State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
  };

  // God Mode System State
  const [systemState, setSystemState] = useState(systemService.getState()); // Use systemService.getState() to initialize

  useEffect(() => {
    const currentUser = databaseService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
    const unsub = systemService.subscribe(setSystemState);
    return unsub;
  }, []);

  const handleLoginSuccess = () => {
    const currentUser = databaseService.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    databaseService.logout();
    setUser(null);
  };

  const toggleModuleExpand = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // === QCBE 24-MODULE NAVIGATION TREE ===
  const navItems: NavItem[] = [
    { id: 'mod_dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    
    // --- 1. IDENTITY & SECURITY ---
    { id: 'mod_auth', label: 'Identity Core', icon: Fingerprint, subItems: [
        { id: 'auth_users', label: 'User Directory', path: '' },
        { id: 'auth_bio', label: 'Biometric Engine', path: '' },
        { id: 'auth_mfa', label: 'MFA Policies', path: '' },
    ]},
    { id: 'mod_access', label: 'Access Control', icon: ShieldCheck, subItems: [
        { id: 'access_rbac', label: 'RBAC Roles', path: '' },
        { id: 'access_abac', label: 'ABAC Policies', path: '' },
        { id: 'access_perms', label: 'Field Permissions', path: '' },
    ]},
    { id: 'mod_god', label: 'God Mode', icon: Zap, subItems: [
        { id: 'god_panel', label: 'Creator Console', path: '' },
        { id: 'god_uni', label: 'Universe Control', path: '' },
    ]},

    // --- 2. CORE OPERATIONS ---
    { id: 'mod_cube', label: 'Cube Manager', icon: Hexagon, subItems: [
        { id: 'cube_list', label: 'Active Cubes', path: '' },
        { id: 'cube_settings', label: 'Cube Config', path: '' },
    ]},
    { id: 'mod_proj', label: 'Projects', icon: Briefcase, subItems: [
        { id: 'proj_active', label: 'Active Projects', path: '' },
        { id: 'proj_plan', label: 'Strategic Planning', path: '' },
        { id: 'proj_timeline', label: 'Timelines', path: '' },
    ]},
    { id: 'mod_task', label: 'Task Force', icon: CheckSquare, subItems: [
        { id: 'task_board', label: 'Kanban Board', path: '' },
        { id: 'task_list', label: 'My Tasks', path: '' },
        { id: 'task_auto', label: 'Auto-Assignment', path: '' },
    ]},
    
    // --- 3. BUSINESS OPERATIONS ---
    { id: 'mod_fin', label: 'Finance', icon: DollarSign, subItems: [
        { id: 'fin_inv', label: 'Invoices', path: '' },
        { id: 'fin_cash', label: 'Cash Flow', path: '' },
        { id: 'fin_tax', label: 'Tax Engine', path: '' },
    ]},
    { id: 'mod_client', label: 'Clients', icon: Users, subItems: [
        { id: 'client_list', label: 'Client Directory', path: '' },
        { id: 'client_crm', label: 'CRM Profiles', path: '' },
    ]},
    { id: 'mod_asset', label: 'Assets', icon: Package, subItems: [
        { id: 'asset_reg', label: 'Asset Registry', path: '' },
        { id: 'asset_map', label: 'Geo-Tracking', path: '' },
    ]},

    // --- 4. CONTENT & DATA ---
    { id: 'mod_doc', label: 'Documents', icon: FileText, subItems: [
        { id: 'doc_vault', label: 'Secure Vault', path: '' },
        { id: 'doc_sign', label: 'E-Signatures', path: '' },
    ]},
    { id: 'mod_report', label: 'Analytics', icon: BarChart3, subItems: [
        { id: 'rep_dash', label: 'KPI Dashboard', path: '' },
        { id: 'rep_custom', label: 'Custom Reports', path: '' },
    ]},
    { id: 'mod_audit', label: 'Audit Logs', icon: Scroll, subItems: [
        { id: 'audit_sys', label: 'System Logs', path: '' },
        { id: 'audit_user', label: 'User Activity', path: '' },
    ]},

    // --- 5. COMMUNICATION SUITE ---
    { id: 'mod_comm', label: 'Messaging', icon: MessageSquare, subItems: [
        { id: 'comm_chat', label: 'Team Chat', path: '' },
        { id: 'comm_ext', label: 'External Gateway', path: '' },
    ]},
    { id: 'mod_voice', label: 'Voice Ops', icon: Mic, subItems: [
        { id: 'voice_rooms', label: 'Audio Rooms', path: '' },
        { id: 'voice_notes', label: 'Transcriptions', path: '' },
    ]},
    { id: 'mod_video', label: 'Video Rooms', icon: Video, subItems: [
        { id: 'video_meet', label: 'Meeting Rooms', path: '' },
        { id: 'video_rec', label: 'Recordings', path: '' },
    ]},
    { id: 'mod_world', label: 'Virtual Worlds', icon: Globe, subItems: [
        { id: 'world_office', label: 'Virtual Office', path: '' },
        { id: 'world_conf', label: 'Conference Hall', path: '' },
    ]},

    // --- 6. AUTOMATION & INTELLIGENCE ---
    { id: 'mod_yusra', label: 'Yusra AI', icon: Sparkles, subItems: [
        { id: 'yusra_core', label: 'Core Logic', path: '' },
        { id: 'yusra_learn', label: 'Learned Traits', path: '' },
    ]},
    { id: 'mod_auto', label: 'Automations', icon: Workflow, subItems: [
        { id: 'auto_workflow', label: 'Workflows', path: '' },
        { id: 'auto_triggers', label: 'Event Triggers', path: '' },
    ]},
    { id: 'mod_notif', label: 'Notifications', icon: Bell, subItems: [
        { id: 'notif_center', label: 'Alert Center', path: '' },
        { id: 'notif_rules', label: 'Routing Rules', path: '' },
    ]},

    // --- 7. PLATFORM & DISTRIBUTION ---
    { id: 'mod_dist', label: 'Distribution', icon: Share2, subItems: [
        { id: 'dist_web', label: 'Web Portal', path: '' },
        { id: 'dist_mobile', label: 'Mobile Apps', path: '' },
    ]},
    { id: 'mod_ui', label: 'Interface Control', icon: Layout, subItems: [
        { id: 'ui_layout', label: 'Layout Builder', path: '' },
        { id: 'ui_theme', label: 'Theme Engine', path: '' },
    ]},
    { id: 'mod_integ', label: 'Integrations', icon: Link, subItems: [
        { id: 'int_api', label: 'API Keys', path: '' },
        { id: 'int_webhooks', label: 'Webhooks', path: '' },
    ]},

    // --- 8. ADMINISTRATION ---
    { id: 'mod_bill', label: 'Billing', icon: CreditCard, subItems: [
        { id: 'bill_plan', label: 'Subscription', path: '' },
        { id: 'bill_usage', label: 'Usage Metrics', path: '' },
    ]},
    { id: 'mod_settings', label: 'Settings', icon: SettingsIcon, subItems: [
        { id: 'set_general', label: 'General Config', path: '' },
        { id: 'set_sec', label: 'Security Policy', path: '' },
    ]},
  ];

  const renderContent = () => {
    // Wrap dynamic content in Suspense for smooth loading
    return (
      <Suspense fallback={<SystemLoader />}>
        {renderModule()}
      </Suspense>
    );
  };

  const renderModule = () => {
    // 1. Core Component Mapping
    // DASHBOARD
    if (activeTab === 'mod_dashboard') return <Dashboard onNavigate={setActiveTab} />;
    
    // PROJECT MANAGEMENT
    if (activeTab.startsWith('mod_proj') || activeTab.startsWith('proj_')) {
        if (activeTab === 'proj_plan') return <Planning />;
        return <Projects />;
    }
    if (activeTab.startsWith('mod_task') || activeTab.startsWith('task_')) return <Projects />; // Reusing Project/Task view for now

    // FINANCE & REPORTING
    if (activeTab.startsWith('mod_fin') || activeTab.startsWith('fin_')) return <DynamicModule title="Finance Engine" category="Business Ops" id={activeTab} />;
    if (activeTab.startsWith('mod_report') || activeTab.startsWith('rep_')) return <Reports />;
    
    // SETTINGS
    // FIX: Corrected activeTab.Tab.startsWith to activeTab.startsWith
    if (activeTab.startsWith('mod_settings') || activeTab.startsWith('set_')) return <Settings />;
    
    // IDENTITY & USERS
    if (activeTab.startsWith('mod_auth') || activeTab.startsWith('auth_')) return <UserManagement />;
    
    // ACCESS CONTROL
    if (activeTab.startsWith('mod_access') || activeTab.startsWith('access_')) return <AccessControl />;
    
    // GOD MODE
    if (activeTab.startsWith('mod_god') || activeTab.startsWith('god_')) return <GodModePanel />;
    
    // CUBE MANAGEMENT
    if (activeTab.startsWith('mod_cube') || activeTab.startsWith('cube_')) return <CubeManagement />;
    
    // COMMUNICATION
    if (activeTab.startsWith('mod_comm') || activeTab.startsWith('comm_') || activeTab.startsWith('mod_video') || activeTab.startsWith('video_')) return <QuantumConnect showToast={showToast} />;
    
    // HR
    if (activeTab.startsWith('mod_client') || activeTab.startsWith('client_')) return <HumanResources />; // Using HR module for Client view demo

    // 2. Dynamic Module Fallback for everything else
    let activeItem: { label: string } | undefined = navItems.find(n => n.id === activeTab);
    let parentCategory = "Enterprise Module";
    
    if (!activeItem) {
        for (const item of navItems) {
            if (item.subItems) {
                const sub = item.subItems.find(s => s.id === activeTab);
                if (sub) {
                    activeItem = sub;
                    parentCategory = item.label;
                    break;
                }
            }
        }
    }

    return <DynamicModule title={activeItem?.label || 'Module'} category={parentCategory} id={activeTab} />;
  };

  if (isLoading) return <div className="min-h-screen bg-quantum-deep flex items-center justify-center"><div className="w-10 h-10 border-4 border-neon-green border-t-transparent rounded-full animate-spin" /></div>;
  
  if (!user) return <><GlobalRippleSystem /><Login onLoginSuccess={handleLoginSuccess} language={appLanguage} onLanguageChange={setAppLanguage} /></>;

  return (
    <div className={`min-h-screen font-sans text-white bg-quantum-deep transition-colors duration-1000 ${systemState.isGodModeActive ? 'filter grayscale-[0.8] sepia-[0.4] hue-rotate-[300deg] contrast-[1.5] saturation-[2]' : ''}`}> {/* Intensified God Mode filter */}
      <GlobalRippleSystem />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_rgba(2,16,24,1)_0%,_rgba(0,0,0,1)_100%)]">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-8" /> {/* More visible noise */}
         <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_340deg,rgba(0,240,255,0.1)_360deg)] animate-[spin_20s_linear_infinite]" /> {/* Stronger conic gradient */}
      </div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* === LEFT PANEL (SIDEBAR) === */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
          bg-quantum-midnight/90 backdrop-blur-xl border-r-2 border-glass-strong flex flex-col shadow-2xl lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}> {/* Darker, thicker border */}
          <div className="p-6 border-b-2 border-glass-strong flex items-center gap-3"> {/* Thicker border */}
            <QuantumLogo size="sm" animated={true} /> {/* Corrected: Uses QuantumLogo */}
            <div>
               <h1 className="text-xl font-heading font-bold text-white tracking-wider leading-none">
                QUANTUM<span className="text-neon-blue neon-glow-blue">.CUBE</span> {/* Text glow */}
              </h1>
              <span className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">Enterprise OS</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-400 hover:text-neon-pink transition-colors"> {/* Hover color */}
                <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || item.subItems?.some(s => s.id === activeTab);
              const isExpanded = expandedModules.includes(item.id);
              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => item.subItems ? toggleModuleExpand(item.id) : setActiveTab(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                      ${isActive ? 'bg-neon-blue/20 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/10'} {/* Stronger shadow, more visible hover */}
                    `}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-neon-blue shadow-[0_0_15px_#00F0FF] animate-pulse-fast" />} {/* Thicker, glowing indicator */}
                    <QuantumIcon icon={item.icon} className={`w-5 h-5 ${isActive ? 'text-neon-blue neon-glow-blue' : 'text-gray-500 group-hover:text-neon-blue'}`} /> {/* Icon glow */}
                    <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                    {item.subItems && <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-neon-blue' : ''}`} />} {/* Active chevron */}
                  </button>
                  
                  {item.subItems && (isExpanded || isActive) && (
                    <div className="ml-9 pl-3 border-l-2 border-white/20 space-y-1 mt-1 mb-2 animate-page-enter"> {/* Thicker border */}
                      {item.subItems.map(sub => (
                        <button 
                            key={sub.id} 
                            onClick={() => { setActiveTab(sub.id); setSidebarOpen(false); }} 
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${activeTab === sub.id ? 'text-neon-cyan bg-neon-cyan/10 font-bold shadow-[0_0_8px_rgba(0,217,245,0.2)]' : 'text-gray-500 hover:text-white'}`} {/* Stronger active state */}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          
          <div className="p-4 border-t-2 border-glass-strong bg-black/30"> {/* Thicker border, darker bg */}
             <div className="flex items-center gap-3">
                <img src={user.avatar} className="w-10 h-10 rounded-full border border-neon-blue/50 shadow-md" /> {/* Stronger border, shadow */}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-white drop-shadow-sm">{user.name}</p>
                  <p className="text-xs text-neon-green flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-strong" /> Online</p> {/* Stronger pulse */}
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                   <Lock className="w-4 h-4" />
                </button>
             </div>
          </div>
        </aside>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* TOP BAR (Global Status) */}
          <header className="h-16 flex items-center justify-between px-6 border-b-2 border-glass-strong bg-quantum-midnight/70 backdrop-blur-md sticky top-0 z-30"> {/* Thicker border, darker bg */}
             <div className="flex items-center gap-4 lg:hidden">
                <button onClick={() => setSidebarOpen(true)} className="text-white hover:text-neon-blue transition-colors"><Menu /></button>
                <QuantumLogo size="sm" /> {/* Corrected: Uses QuantumLogo */}
             </div>

             {/* Search Bar */}
             <div className="hidden lg:flex items-center relative w-96">
                <Search className="absolute left-3 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search modules, tasks, or entities..." 
                    className="w-full bg-black/30 border border-white/15 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors" /* Darker, more distinct border */
                />
             </div>

             <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-xs font-mono text-neon-blue tracking-wider">CUBE ALPHA</span>
                    <span className="text-[10px] text-gray-500">STABLE v2.5.0</span>
                </div>
                
                <QuantumButton variant="ghost" className="!p-2 rounded-full border border-white/15" icon={<Bell className="w-5 h-5" />} /> {/* Thicker border */}
                
                {systemState.isGodModeActive && (
                    <div className="px-3 py-1 rounded bg-neon-pink/15 border border-neon-pink/60 text-neon-pink text-xs font-bold animate-pulse-strong shadow-[0_0_15px_rgba(255,0,85,0.4)]"> {/* Stronger badge */}
                        GOD MODE
                    </div>
                )}
             </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth pb-24 relative">
            <div className="max-w-[1920px] mx-auto h-full">
              {renderContent()}
            </div>
          </div>

          <YusraAssistant parentLanguage={appLanguage} />
          
          <QuantumToast 
            isVisible={toast.visible} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
           />
        </main>
      </div>
    </div>
  );
};

export default App;