

import { User, LearnedTraits, VoicePreferences, VoiceProfile } from '../types';

const STORAGE_KEYS = {
  USERS: 'quantum_users',
  CURRENT_USER: 'quantum_session',
  VOICE_SIGS: 'quantum_voice_signatures'
};

const GOD_MODE_USER: User = {
  id: 'supreme-001',
  name: 'Mohammad Maynul Hasan',
  email: 'shaoncmd@gmail.com',
  role: 'god_mode',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maynul',
  voiceSignature: true,
  voiceProfile: {
      isSet: true,
      accent: 'Creator/Original',
      frequency: '85Hz - 255Hz',
      toneParams: 'Authoritative, Distinct',
      lastVerified: Date.now()
  },
  learnedTraits: {
    tone: 'direct',
    frequentTopics: ['System Architecture', 'Global Strategy'],
    preferredResponseLength: 'short',
    communicationStyle: 'Executive summaries with technical depth',
    lastUpdated: Date.now()
  },
  voicePreferences: {
    rate: 1.1,
    pitch: 0.9,
    voiceURI: ''
  }
};

const GOD_MODE_ALTERNATE_EMAIL = 'shaoncmd@hotmail.com';
const GOD_MODE_TOKEN = 'BadSoul@1989';

class DatabaseService {
  constructor() {
    this.initialize();
  }

  private initialize() {
    // Self-Healing: Ensure God Mode user exists
    const users = this.getUsers();
    const godExists = users.some(u => u.email === GOD_MODE_USER.email);
    
    if (!godExists) {
      users.push(GOD_MODE_USER);
      this.saveUsers(users);
      console.log('⚡ GOD MODE: Creator credentials injected into quantum registry.');
    }
  }

  private getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // === PUBLIC USER MANAGEMENT ===

  getAllUsers(): User[] {
    return this.getUsers();
  }

  updateUser(updatedUser: User): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index === -1) return false;

    // Prevent downgrading the Creator
    if (users[index].role === 'god_mode' && updatedUser.role !== 'god_mode') {
      console.warn("Unauthorized attempt to downgrade Supreme Creator.");
      return false;
    }

    users[index] = updatedUser;
    this.saveUsers(users);

    // If updating current session user, sync session
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
        this.startSession(updatedUser);
    }

    return true;
  }

  deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) return false;
    if (user.role === 'god_mode') return false; // Cannot delete God Mode user

    const newUsers = users.filter(u => u.id !== userId);
    this.saveUsers(newUsers);
    return true;
  }

  // === AUTHENTICATION ===

  async login(email: string, passwordToken: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() || (email.toLowerCase() === GOD_MODE_ALTERNATE_EMAIL && u.id === GOD_MODE_USER.id));

    if (!user) {
      return { success: false, error: 'Identity not recognized in quantum registry.' };
    }

    // God Mode Check
    if (user.role === 'god_mode') {
      if (passwordToken === GOD_MODE_TOKEN) {
        this.startSession(user);
        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid Creator Token. Access Denied.' };
      }
    }

    // Standard User Check (Simulated password for demo purposes is 'password')
    if (passwordToken === 'password') {
      this.startSession(user);
      return { success: true, user };
    }

    return { success: false, error: 'Invalid security clearance.' };
  }

  async register(name: string, email: string, passwordToken: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = this.getUsers();
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Entity already exists in the system.' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      voiceSignature: false,
      learnedTraits: {
        tone: 'casual',
        frequentTopics: [],
        preferredResponseLength: 'detailed',
        communicationStyle: 'Standard',
        lastUpdated: Date.now()
      },
      voicePreferences: {
        rate: 1.0,
        pitch: 1.0,
        voiceURI: ''
      }
    };

    users.push(newUser);
    this.saveUsers(users);
    this.startSession(newUser);
    
    return { success: true, user: newUser };
  }

  // === BIOMETRIC & VOICE SIMULATION ===

  // Verify voice input against expected passphrase
  async verifyBiometric(spokenPhrase?: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!spokenPhrase) return false;

    // Normalize
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const input = normalize(spokenPhrase);

    // Exact Command for Login: "Open the Gate"
    if (input.includes("open the gate") || input.includes("open gate") || input.includes("open the gate yusra")) {
        return true;
    }
    
    return false;
  }

  async recordVoiceSignature(userId: string, audioBlob: any): Promise<boolean> {
    // In a real app, upload blob to MinIO/S3 and run analysis
    // Here we create a mock profile based on the "recording"
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockProfile: VoiceProfile = {
        isSet: true,
        accent: 'Analyzed: Humanoid/Standard',
        frequency: '110Hz - 210Hz',
        toneParams: 'Commanding',
        lastVerified: Date.now()
    };

    // Update user record
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].voiceSignature = true;
      users[userIndex].voiceProfile = mockProfile;
      this.saveUsers(users);
      
      // Update session if it's the current user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.voiceSignature = true;
        currentUser.voiceProfile = mockProfile;
        this.startSession(currentUser);
      }
    }
    
    return true;
  }

  async updateUserTraits(userId: string, traits: LearnedTraits): Promise<void> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].learnedTraits = traits;
      this.saveUsers(users);
      
      // Update session if it's the current user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.learnedTraits = traits;
        this.startSession(currentUser);
      }
    }
  }

  async updateVoicePreferences(userId: string, prefs: VoicePreferences): Promise<void> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].voicePreferences = prefs;
      this.saveUsers(users);
      
      // Update session if it's the current user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.voicePreferences = prefs;
        this.startSession(currentUser);
      }
    }
  }

  // === SESSION MANAGEMENT ===

  startSession(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export const databaseService = new DatabaseService();