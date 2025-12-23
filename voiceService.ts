

import { Language } from "../types";

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceConfig {
  voiceURI?: string;
  rate?: number;
  pitch?: number;
}

class VoiceService {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  // VAD Properties
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private vadInterval: any = null;
  private maxVolumeInSession: number = 0;
  
  // Refined Thresholds
  private vadThreshold: number = 20; // Default Noise Threshold
  private readonly MIN_SPEECH_LENGTH = 2; // Filter out single character noise glitches

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Initialize Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      if (this.recognition) {
        this.recognition.continuous = false; // We will manage restart manually if needed for better control
        this.recognition.interimResults = false;
      }
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }

  /**
   * Sets the Voice Activity Detection threshold (0-100).
   * Higher values mean louder speech is required to trigger.
   */
  setVadThreshold(val: number) {
    this.vadThreshold = val;
  }

  /**
   * Gets the current VAD threshold.
   */
  getVadThreshold() {
    return this.vadThreshold;
  }

  /**
   * Retrieves available voices filtered by the specified language.
   */
  getAvailableVoices(lang: Language): SpeechSynthesisVoice[] {
    const allVoices = this.synthesis.getVoices();
    const targetLangCode = lang.split('-')[0]; // 'en' from 'en-US'

    return allVoices.filter(v => 
      v.lang.toLowerCase().startsWith(targetLangCode)
    );
  }

  speak(text: string, lang: Language, config?: VoiceConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel current speech
      this.synthesis.cancel();

      // Clean text
      const cleanText = text.replace(/[*#_`]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      
      // Apply Configuration or Defaults
      utterance.rate = config?.rate ?? 1.0; 
      utterance.pitch = config?.pitch ?? 1.0;
      
      const voices = this.synthesis.getVoices();
      
      // Smart Voice Selection
      let selectedVoice = config?.voiceURI 
        ? voices.find(v => v.voiceURI === config.voiceURI) 
        : undefined;

      if (!selectedVoice) {
         selectedVoice = voices.find(v => {
          const voiceLang = v.lang.toLowerCase();
          const targetLang = lang.split('-')[0];
          if (!voiceLang.includes(targetLang)) return false;
          
          if (lang.startsWith('en')) {
             return v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Samantha');
          }
          if (lang.startsWith('bn')) {
            const isBD = v.name.includes('Bangladesh') || v.name.includes('Bangla') || v.lang.includes('BD');
            return isBD || v.name.includes('India');
          }
          return true;
        });
      }
      
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Starts VAD (Voice Activity Detection) monitoring.
   * Returns a function to stop the VAD.
   */
  async startVAD(onVolume: (vol: number) => void): Promise<() => void> {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.microphone.connect(this.analyser);
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      // Reset session volume tracking
      this.maxVolumeInSession = 0;

      this.vadInterval = setInterval(() => {
        if (!this.analyser || !this.dataArray) return;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += this.dataArray[i];
        }
        const average = sum / bufferLength;
        
        if (average > this.maxVolumeInSession) {
          this.maxVolumeInSession = average;
        }

        onVolume(average);
      }, 50);

      return () => {
        if (this.vadInterval) clearInterval(this.vadInterval);
        
        // Proper cleanup of tracks
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        // Disconnect nodes to prevent leaks
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        // Analyser reuse is fine, or we can disconnect it too, but we keep context alive
      };
    } catch (e) {
      console.error("VAD Setup Failed", e);
      return () => {};
    }
  }

  startListening(lang: Language, onResult: (text: string) => void, onError: (err: any) => void, onEnd: () => void) {
    if (!this.recognition) {
      onError("Speech recognition not supported");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    }

    this.recognition.lang = lang;
    
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      
      // === VAD LOGIC START ===
      
      // 1. Noise Gate Check
      // If the maximum volume detected during this session was below threshold, it's likely background noise/hum.
      // We check maxVolumeInSession which is populated by startVAD() running in parallel.
      if (this.maxVolumeInSession < this.vadThreshold) {
        console.warn(`VAD Filter: Input discarded. Max Volume (${this.maxVolumeInSession.toFixed(1)}) < Threshold (${this.vadThreshold})`);
        return; 
      }

      // 2. Length/Content Filter
      // Discard very short inputs which are often phantom detections (e.g. 'a', 'the', '.', ' ')
      // Exceptions made for short affirmative/negative commands
      const shortCommands = ['ok', 'no', 'hi', 'go', 'up', 'yes'];
      if (transcript.length < this.MIN_SPEECH_LENGTH && !shortCommands.includes(transcript.toLowerCase())) {
         console.warn(`VAD Filter: Input discarded. Transcript '${transcript}' too short.`);
         return;
      }

      // === VAD LOGIC END ===
      
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      // Ignore 'no-speech' errors which are common
      if (event.error === 'no-speech') return;
      console.error("Speech recognition error", event.error);
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      this.maxVolumeInSession = 0; // Reset for this utterance
    } catch (e) {
      console.error("Failed to start recognition", e);
      onError(e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async startAudioRecording(): Promise<void> {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  }

  stopAudioRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject("No active recording");
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        this.mediaRecorder = null;
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }
}

export const voiceService = new VoiceService();