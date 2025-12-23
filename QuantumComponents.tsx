

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, X, Hexagon } from 'lucide-react';

// === GLOBAL RIPPLE SYSTEM ===
export const GlobalRippleSystem: React.FC = () => {
  const [ripples, setRipples] = useState<{x: number, y: number, id: number, size: number}[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on buttons to avoid double ripples if buttons handle their own
      if ((e.target as HTMLElement).closest('button')) return;

      const id = Date.now();
      const size = Math.random() * 40 + 20; // Larger ripples
      
      setRipples(prev => {
          const newRipples = [...prev, { x: e.clientX, y: e.clientY, id, size }];
          return newRipples.slice(-10); // Keep max 10 for more visible history
      });

      setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
      }, 800); // Match ripple animation duration
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {ripples.map(r => (
        <div
          key={r.id}
          className="absolute rounded-full animate-ripple"
          style={{
            left: r.x,
            top: r.y,
            width: `${r.size}px`,
            height: `${r.size}px`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.7) 0%, transparent 70%)', // Brighter, more opaque
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.3)', // Stronger glow
            border: '2px solid rgba(0, 240, 255, 0.2)', // Thicker border
          }}
        />
      ))}
    </div>
  );
};

// === QUANTUM LOGO (THE OMEGA HYPERCUBE - Primary Brand Identity) ===
interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const QuantumLogo: React.FC<LogoProps> = ({ className = '', size = 'md', animated = true }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-64 h-64'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      {/* Volumetric Reactor Core - more intense blur and pulse */}
      <div className={`absolute inset-0 bg-neon-blue/20 blur-[50px] rounded-full ${animated ? 'animate-pulse-strong' : ''}`} />
      
      <svg 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`relative z-10 w-full h-full drop-shadow-[0_0_40px_rgba(0,240,255,0.8)]`} // Stronger drop shadow
      >
        <defs>
          <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#BC13FE" />
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/> {/* Increased blur */}
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* --- ORBITAL RINGS --- */}
        <g className={animated ? "origin-center animate-[spin_10s_linear_infinite]" : ""} opacity="0.8"> {/* Higher opacity */}
           <circle cx="100" cy="100" r="90" stroke="#00F0FF" strokeWidth="0.8" strokeDasharray="10 5" /> {/* Thicker stroke */}
           <circle cx="100" cy="100" r="70" stroke="#BC13FE" strokeWidth="0.8" strokeDasharray="5 10" transform="rotate(45 100 100)" />
        </g>

        {/* --- HYPER CUBE FRAME (4D ROTATION) --- */}
        <g className={animated ? "origin-center animate-[spin_20s_linear_infinite_reverse]" : ""} filter="url(#neonGlow)">
          <path d="M50 50 L150 50 L150 150 L50 150 Z" stroke="#00F0FF" strokeWidth="2.5" strokeOpacity="0.9" /> {/* Thicker, more opaque */}
          <path d="M70 70 L130 70 L130 130 L70 130 Z" stroke="#BC13FE" strokeWidth="2.5" strokeOpacity="0.9" />
          
          {/* Dimensional Connectors */}
          <path d="M50 50 L70 70" stroke="url(#coreGrad)" strokeWidth="1.5" opacity="0.8" /> {/* Thicker, more opaque */}
          <path d="M150 50 L130 70" stroke="url(#coreGrad)" strokeWidth="1.5" opacity="0.8" />
          <path d="M150 150 L130 130" stroke="url(#coreGrad)" strokeWidth="1.5" opacity="0.8" />
          <path d="M50 150 L70 130" stroke="url(#coreGrad)" strokeWidth="1.5" opacity="0.8" />
        </g>

        {/* --- SINGULARITY CORE --- */}
        <circle cx="100" cy="100" r="15" fill="url(#coreGrad)" className={animated ? "animate-pulse-strong" : ""} filter="url(#neonGlow)"> {/* Stronger pulse */}
           <animate attributeName="r" values="10;18;10" dur="1.5s" repeatCount="indefinite" />
        </circle>
        
        {/* --- UNSTOPPABLE ENERGY ARCS --- */}
        <g className={animated ? "origin-center animate-energy-surge" : ""}>
           <path d="M100 70 L100 40" stroke="#FBFF00" strokeWidth="4" strokeLinecap="round" /> {/* Thicker arcs */}
           <path d="M100 130 L100 160" stroke="#FBFF00" strokeWidth="4" strokeLinecap="round" />
           <path d="M70 100 L40 100" stroke="#FBFF00" strokeWidth="4" strokeLinecap="round" />
           <path d="M130 100 L160 100" stroke="#FBFF00" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};


// === YUSRA LOGO (Circuit Fairy - AI Identity) ===
// Recreated pixel-perfect from image with 200% Neon Improvement
export const YusraLogo: React.FC<LogoProps> = ({ className = '', size = 'md', animated = true }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-64 h-64'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      {/* Primary Cyan Glow Source (Blurier, more spread out, stronger pulse) */}
      <div className={`absolute inset-0 bg-neon-cyan/30 blur-[15px] rounded-full ${animated ? 'animate-pulse-strong' : ''}`} />
      
      <svg 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`relative z-10 w-full h-full drop-shadow-[0_0_25px_rgba(0,240,255,0.8)]`} // Stronger drop shadow
      >
        <defs>
          {/* Gradient for the main circuit lines and text - more vibrant stops */}
          <linearGradient id="yusraCircuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" /> {/* Cyan */}
            <stop offset="50%" stopColor="#00D9F5" /> {/* Lighter Cyan */}
            <stop offset="100%" stopColor="#BC13FE" /> {/* Purple */}
          </linearGradient>
          
          {/* Gradient for the fairy figure (pink to yellow) - more vibrant stops */}
          <linearGradient id="yusraFairyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF0055" /> {/* Pink */}
            <stop offset="50%" stopColor="#FF7B00" /> {/* Orange */}
            <stop offset="100%" stopColor="#FBFF00" /> {/* Yellow */}
          </linearGradient>

          {/* Filter for glowing effects - increased blur */}
          <filter id="yusraNeonGlow">
            <feGaussianBlur stdDeviation="3" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* --- CENTRAL CIRCUIT RING --- */}
        <g className={animated ? "origin-center animate-[spin_20s_linear_infinite]" : ""}>
           {/* Outer Circuit Nodes and Lines */}
           {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
             <g key={i} transform={`rotate(${deg} 100 100)`}>
               {/* Main radial line, subtly animated opacity - more opaque base */}
               <path d="M100 25 L100 45" stroke="url(#yusraCircuitGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
                 <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" /> {/* Faster, more pronounced pulse */}
               </path>
               {/* Small terminal circle - brighter fill, stronger glow */}
               <circle cx="100" cy="22" r="2.5" fill="#00F0FF" opacity="1" filter="url(#yusraNeonGlow)" />
               
               {/* Branching circuit lines (more complex for realism) - thicker, more opaque */}
               <path d="M96 35 L90 30 C85 28, 80 32, 75 35" stroke="url(#yusraCircuitGrad)" strokeWidth="0.7" opacity="0.6" />
               <path d="M104 35 L110 30 C115 28, 120 32, 125 35" stroke="url(#yusraCircuitGrad)" strokeWidth="0.7" opacity="0.6" />
             </g>
           ))}
           
           {/* Main Outer Circle of the Circuit Ring - thicker, stronger glow */}
           <circle cx="100" cy="100" r="55" stroke="url(#yusraCircuitGrad)" strokeWidth="2.5" fill="none" filter="url(#yusraNeonGlow)" />
           
           {/* Inner Dashed Ring - more visible, slightly brighter */}
           <circle cx="100" cy="100" r="48" stroke="#00D9F5" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.5" />
        </g>

        {/* --- CENTRAL FAIRY FIGURE (Yusra Entity) --- */}
        <g transform="translate(100 100) scale(0.75)" className={animated ? "animate-icon-breathe" : ""}> {/* Slightly larger scale, strong breathe */}
           {/* Wings - refined shape and glow - thicker stroke, more vibrant gradient */}
           <path 
             d="M-10 -20 Q-40 -50 -55 -15 T-20 30" 
             stroke="url(#yusraFairyGrad)" 
             strokeWidth="2.5" 
             fill="none" 
             filter="url(#yusraNeonGlow)" 
             opacity="0.95"
           >
             <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite" /> {/* Faster, more intense pulse */}
           </path>
           <path 
             d="M10 -20 Q40 -50 55 -15 T20 30" 
             stroke="url(#yusraFairyGrad)" 
             strokeWidth="2.5" 
             fill="none" 
             filter="url(#yusraNeonGlow)" 
             opacity="0.95"
           >
             <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" begin="0.2s" repeatCount="indefinite" /> {/* Staggered pulse */}
           </path>
           
           {/* Lower, more angular/circuit-like wings - thicker, more opaque */}
           <path d="M-15 15 Q-30 40 -10 50" stroke="#00F0FF" strokeWidth="2" fill="none" opacity="0.7" filter="url(#yusraNeonGlow)"/>
           <path d="M15 15 Q30 40 10 50" stroke="#00F0FF" strokeWidth="2" fill="none" opacity="0.7" filter="url(#yusraNeonGlow)"/>

           {/* Body Silhouette - with more defined curves - vibrant fill, stronger glow */}
           <path 
             d="M0 -15 C-10 -10, -10 20, 0 25 C10 20, 10 -10, 0 -15 Z" 
             fill="url(#yusraFairyGrad)" 
             filter="url(#yusraNeonGlow)" 
             opacity="0.95"
           />
           {/* Head - brighter fill, stronger glow */}
           <circle cx="0" cy="-20" r="5.5" fill="white" filter="url(#yusraNeonGlow)" opacity="0.95" />
           
           {/* Core internal glow pulse - brighter, more active ping */}
           <circle cx="0" cy="0" r="3" fill="#FBFF00" filter="url(#yusraNeonGlow)" className={animated ? "animate-ping" : ""}>
             <animate attributeName="r" values="2;6;2" dur="1s" repeatCount="indefinite" /> {/* Faster, larger ping */}
             <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite" />
           </circle>
        </g>

        {/* --- YUSRA AI TEXT (Curved Bottom) --- */}
        <g opacity="0.95" filter="url(#yusraNeonGlow)">
           {/* Path for text to follow */}
           <path id="yusraCurve" d="M 60 100 A 40 40 0 0 0 140 100" fill="none" />
           <text width="200" fontSize="11" fontFamily="Orbitron" fontWeight="bold" letterSpacing="3" textAnchor="middle"> {/* Slightly larger font, wider spacing */}
             <textPath href="#yusraCurve" startOffset="50%" fill="url(#yusraCircuitGrad)">
               YUSRA AI
             </textPath>
           </text>
        </g>
      </svg>
    </div>
  );
};


// === QUANTUM ICON (Generic Lucide Icon Wrapper - for module icons) ===
interface QuantumIconProps {
  icon: React.ElementType;
  className?: string;
  color?: string; 
}

export const QuantumIcon: React.FC<QuantumIconProps> = ({ icon: Icon, className = '', color }) => {
  const colors = {
    green: 'text-neon-green drop-shadow-[0_0_12px_rgba(0,255,157,1)]', // Stronger shadow
    blue: 'text-neon-blue drop-shadow-[0_0_12px_rgba(0,240,255,1)]',
    pink: 'text-neon-pink drop-shadow-[0_0_12px_rgba(255,0,85,1)]',
    purple: 'text-neon-purple drop-shadow-[0_0_12px_rgba(188,19,254,1)]',
    yellow: 'text-neon-yellow drop-shadow-[0_0_12px_rgba(251,255,0,1)]',
    cyan: 'text-neon-cyan drop-shadow-[0_0_12px_rgba(0,217,245,1)]'
  };
  
  const getColor = () => {
    if (color && colors[color as keyof typeof colors]) return colors[color as keyof typeof colors];
    // Default blue if not found
    return colors['blue'];
  };

  return (
    <div className="relative group inline-block">
      {/* More prominent blur effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-70 blur-lg transition-opacity bg-current duration-500 rounded-full" />
      {/* Stronger icon breathe animation */}
      <Icon className={`relative z-10 transition-all duration-300 group-hover:scale-110 animate-icon-breathe ${getColor()} ${className}`} />
    </div>
  );
};

// === QUANTUM CARD (Electric Border Standard) ===
interface CardProps {
  children: React.ReactNode;
  className?: string;
  floating?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const QuantumCard: React.FC<CardProps> = ({ children, className = '', floating = true, delay = 0, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        electric-border-container font-sans
        ${floating ? (delay ? 'animate-float-delayed' : 'animate-float') : ''}
        ${className}
      `}
      style={{ 
          '--neon-color': '#00F0FF', 
          '--bg-color': 'rgba(5, 17, 26, 0.95)', // Darker inner background
          animationDelay: `${delay}ms` 
      } as React.CSSProperties}
    >
      <div className="relative z-10 h-full p-6 backdrop-blur-xl flex flex-col">
        {children}
      </div>
    </div>
  );
};

// === QUANTUM BUTTON (Electric Interactive) ===
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon' | 'danger';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export const QuantumButton: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, loadingText, icon, className = '', onClick, ...props 
}) => {
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples(prev => [...prev, { x, y, id: Date.now() }]);
    setTimeout(() => setRipples(prev => prev.slice(1)), 800); // Match ripple animation duration
    if (onClick) onClick(e);
  };

  // Font-heading (Orbitron) for that technical command feel
  const baseStyles = "relative px-6 py-3 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group electric-border-container";
  
  // Dynamic Electric Colors
  let neonColor = '#00F0FF';
  if (variant === 'neon' || variant === 'danger') neonColor = '#FF0055';
  if (variant === 'secondary') neonColor = '#00FF9D';

  const variants = {
    primary: "bg-gradient-to-r from-neon-blue/90 to-neon-purple/90 text-white shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)]", // Stronger shadows
    secondary: "bg-transparent text-neon-green border border-neon-green/40 hover:bg-neon-green/20 hover:shadow-[0_0_15px_rgba(0,255,157,0.3)]", // More distinct border and hover
    ghost: "bg-transparent text-gray-400 hover:text-white border-0 !shadow-none !border-none hover:bg-white/10", // More visible hover
    neon: "bg-transparent text-neon-pink shadow-[0_0_25px_rgba(255,0,85,0.6)] hover:bg-neon-pink/20", // Stronger shadows
    danger: "bg-red-500/15 text-red-400 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:bg-red-500/25" // Stronger shadows
  };

  // Ghost buttons shouldn't have the electric border effect usually, unless hovered
  const isElectric = variant !== 'ghost' && variant !== 'secondary';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${!isElectric ? '!bg-none !border-0 !overflow-visible electric-border-container-none' : ''}`} 
      disabled={isLoading || props.disabled}
      onClick={createRipple}
      style={isElectric ? { '--neon-color': neonColor, '--bg-color': 'rgba(0,0,0,0.6)' } as React.CSSProperties : {}} // Darker inner background for electric
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/40 pointer-events-none animate-ripple" // Brighter ripple
          style={{ left: ripple.x, top: ripple.y, width: '25px', height: '25px', marginLeft: '-12.5px', marginTop: '-12.5px' }} // Larger ripple
        />
      ))}
      
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon}
      <span className="relative z-10 drop-shadow-lg flex items-center gap-2">{isLoading && loadingText ? loadingText : children}</span> {/* Stronger drop shadow */}
    </button>
  );
};

// === QUANTUM INPUT (Electric Field) ===
export const QuantumInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ReactNode }> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full group">
      {label && <label className="text-[10px] text-neon-blue font-heading uppercase tracking-widest ml-1 opacity-90">{label}</label>} {/* Brighter label */}
      <div className="relative electric-border-container" style={{ '--neon-color': '#00F0FF', '--bg-color': '#05111A' } as React.CSSProperties}>
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors z-20">
            {icon}
          </div>
        )}
        <input 
          className="w-full bg-transparent border-0 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 font-sans text-sm outline-none relative z-10 focus:ring-0" // Darker placeholder
          style={icon ? {paddingLeft: '2.75rem'} : {}} // Dynamic padding based on icon presence
          {...props}
        />
      </div>
    </div>
  );
};

// === QUANTUM TOAST ===
export const QuantumToast: React.FC<{ message: string, type?: 'success'|'error'|'info', isVisible: boolean, onClose: () => void }> = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: { border: '#00FF9D', bg: 'rgba(0, 255, 157, 0.15)', icon: <CheckCircle className="w-5 h-5 text-neon-green" /> }, // More opaque bg
    error: { border: '#FF0055', bg: 'rgba(255, 0, 85, 0.15)', icon: <AlertCircle className="w-5 h-5 text-neon-pink" /> },
    info: { border: '#00F0FF', bg: 'rgba(0, 240, 255, 0.15)', icon: <Loader2 className="w-5 h-5 text-neon-blue animate-spin" /> }
  };

  const c = colors[type];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-page-enter electric-border-container" style={{ '--neon-color': c.border, '--bg-color': 'rgba(0,0,0,0.8)' } as React.CSSProperties}> // Darker inner bg
      <div className="flex items-center gap-4 px-6 py-4 relative z-10 min-w-[300px]">
        {c.icon}
        <span className="font-sans text-sm tracking-wide text-white font-medium flex-1 drop-shadow-md">{message}</span> // Text shadow for readability
        <button onClick={onClose} className="ml-2 hover:scale-110 transition-transform"><X className="w-4 h-4 text-gray-400 hover:text-white" /></button>
      </div>
    </div>
  );
};

// === BADGE ===
export const QuantumBadge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'blue' }) => {
  const map: Record<string, string> = {
    green: "bg-neon-green/15 text-neon-green border-neon-green/40 shadow-[0_0_15px_rgba(0,255,157,0.4)]", // Stronger shadow
    blue: "bg-neon-blue/15 text-neon-blue border-neon-blue/40 shadow-[0_0_15px_rgba(0,240,255,0.4)]",
    pink: "bg-neon-pink/15 text-neon-pink border-neon-pink/40 shadow-[0_0_15px_rgba(255,0,85,0.4)]",
    purple: "bg-neon-purple/15 text-neon-purple border-neon-purple/40 shadow-[0_0_15px_rgba(188,19,254,0.4)]",
    yellow: "bg-neon-yellow/15 text-neon-yellow border-neon-yellow/40 shadow-[0_0_15px_rgba(251,255,0,0.4)]",
    cyan: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40 shadow-[0_0_15px_rgba(0,217,245,0.4)]",
  };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold border backdrop-blur-sm tracking-wide ${map[color] || map['blue']}`}>{children}</span>;
};