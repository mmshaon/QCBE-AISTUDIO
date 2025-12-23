

export enum Language {
  EN = 'en-US',
  BN = 'bn-BD'
}

export interface LearnedTraits {
  tone: 'formal' | 'casual' | 'direct' | 'technical';
  frequentTopics: string[];
  preferredResponseLength: 'short' | 'detailed';
  communicationStyle: string;
  lastUpdated: number;
  latestInteractionSentiment?: string;
}

export interface VoicePreferences {
  voiceURI: string;
  rate: number;
  pitch: number;
}

export interface VoiceProfile {
  isSet: boolean;
  accent: string;
  frequency: string; // e.g., '120Hz - 180Hz'
  toneParams: string; // e.g., 'Authoritative, Deep'
  lastVerified: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'god_mode';
  avatar?: string;
  voiceSignature?: boolean;
  voiceProfile?: VoiceProfile; // Added this
  learnedTraits?: LearnedTraits;
  voicePreferences?: VoicePreferences;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

// === HR & COLLABORATION TYPES ===
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'online' | 'offline' | 'busy' | 'in-call';
  avatar: string;
  isSpeaking?: boolean;
}

export interface TeamMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string; // Text or URL for media
  type: 'text' | 'image' | 'file' | 'audio' | 'system_alert';
  fileName?: string;
  fileSize?: string;
  timestamp: number;
}

// === ADVANCED VIDEO TYPES ===
export interface SystemStats {
  cpu: number;
  ram: number;
  network: 'Stable' | 'Weak' | 'Critical';
  battery: number;
  activeApps: string[];
}

export interface VideoParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  isHandRaised: boolean;
  systemStats: SystemStats;
  status: 'active' | 'frozen' | 'rebooting' | 'disconnected';
}

export interface CallSession {
  isActive: boolean;
  participants: string[];
  startTime: number;
  type: 'video' | 'audio';
}

export interface NavItem {
  id: string;
  label: string;
  icon: any; // Lucide icon type
  path?: string;
  subItems?: {
    id: string;
    label: string;
    path: string;
  }[];
}

export interface BusinessMetric {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  period: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  aiAnalysis: string;
  subtasks?: string[];
  subtaskAnalysis?: string;
  riskAnalysis?: {
    riskLevel: 'low' | 'medium' | 'critical';
    risks: string[];
    mitigation: string;
  };
}

export interface StrategyItem {
  id: string;
  title: string;
  category: 'Marketing' | 'Product' | 'Sales' | 'Operations' | 'Innovation';
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  aiAnalysis?: string;
  subtasks?: string[];
  subtaskAnalysis?: string;
  riskAnalysis?: {
    riskLevel: 'low' | 'medium' | 'critical';
    risks: string[];
    mitigation: string;
  };
  analysisHistory?: AnalysisHistoryItem[];
}

export interface Transaction {
  id: string;
  entity: string;
  amount: string;
  type: 'credit' | 'debit';
  date: string;
  status: 'cleared' | 'pending';
}

// === MODULE 2: ACCESS CONTROL ===
export interface Policy {
  id: string;
  name: string;
  description: string;
  effect: 'ALLOW' | 'DENY';
  resource: string;
  condition: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  level: number;
  permissions: string[];
}

// === MODULE 4: CUBE MANAGEMENT ===
export interface Cube {
  id: string;
  name: string;
  type: 'Enterprise' | 'Startup' | 'DAO' | 'Personal';
  status: 'active' | 'frozen' | 'archived';
  members: number;
  securityLevel: 'Standard' | 'High' | 'Fort Knox';
  region: string;
  created: number;
}

// === MODULE 5: PROJECTS ===
export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'review' | 'done';
  lead: string;
  leadAvatar: string;
  budget: string;
  deadline: string;
  progress: number;
  teamSize: number;
  tags: string[];
}