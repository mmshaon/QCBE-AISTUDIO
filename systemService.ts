import { User } from '../types';

type SystemAction = 'SHUTDOWN' | 'REBOOT' | 'BACKUP' | 'RESTORE' | 'UPDATE' | 'DELETE_SYSTEM' | 'ADD_MODULE' | 'NONE';

interface SystemState {
  isGodModeActive: boolean;
  systemAction: SystemAction; // Corrected: Completed the type definition
  actionProgress: number;
  actionMessage: string;
}

// Simple Custom Subject/Observer pattern
type Subscriber = (state: SystemState) => void;

class SystemService {
  private state: SystemState;
  private subscribers: Subscriber[] = [];

  constructor() {
    this.state = {
      isGodModeActive: false,
      systemAction: 'NONE',
      actionProgress: 0,
      actionMessage: '',
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(subscriber => subscriber(this.state));
  }

  subscribe(subscriber: Subscriber): () => void {
    this.subscribers.push(subscriber);
    subscriber(this.state); // Immediately send current state to new subscriber
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== subscriber);
    };
  }

  getState(): SystemState {
    return { ...this.state };
  }

  isGodMode(): boolean {
    return this.state.isGodModeActive;
  }

  activateGodMode() {
    this.state = {
      ...this.state,
      isGodModeActive: true,
      actionMessage: 'God Mode Activated. Creator access enabled.',
    };
    this.notifySubscribers();
  }

  deactivateGodMode() {
    this.state = {
      ...this.state,
      isGodModeActive: false,
      systemAction: 'NONE',
      actionProgress: 0,
      actionMessage: 'God Mode Deactivated. Standard protocols restored.',
    };
    this.notifySubscribers();
  }

  async executeSystemCommand(command: string): Promise<string> {
    this.state = {
      ...this.state,
      systemAction: this.mapCommandToAction(command),
      actionProgress: 0,
      actionMessage: `Executing: ${command}...`,
    };
    this.notifySubscribers();

    return new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        this.state = {
          ...this.state,
          actionProgress: progress,
          actionMessage: `Executing: ${command} (${progress}%)...`,
        };
        this.notifySubscribers();

        if (progress >= 100) {
          clearInterval(interval);
          this.state = {
            ...this.state,
            systemAction: 'NONE',
            actionProgress: 100,
            actionMessage: `${command} completed successfully.`,
          };
          this.notifySubscribers();
          resolve(`Command "${command}" executed successfully.`);
        }
      }, 300);
    });
  }

  private mapCommandToAction(command: string): SystemAction {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('shutdown')) return 'SHUTDOWN';
    if (lowerCommand.includes('reboot')) return 'REBOOT';
    if (lowerCommand.includes('backup')) return 'BACKUP';
    if (lowerCommand.includes('restore')) return 'RESTORE';
    if (lowerCommand.includes('update')) return 'UPDATE';
    if (lowerCommand.includes('delete system')) return 'DELETE_SYSTEM';
    if (lowerCommand.includes('add module')) return 'ADD_MODULE';
    return 'NONE';
  }
}

// Export a singleton instance
export const systemService = new SystemService();