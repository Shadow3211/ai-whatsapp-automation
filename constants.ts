import { VoiceName, VoiceOption } from './types';

export const AVAILABLE_VOICES: VoiceOption[] = [
  { 
    id: VoiceName.Puck, 
    name: "Puck", 
    gender: "Male", 
    description: "Soft, deeper, relaxed" 
  },
  { 
    id: VoiceName.Charon, 
    name: "Charon", 
    gender: "Male", 
    description: "Deep, resonant, authoritative" 
  },
  { 
    id: VoiceName.Kore, 
    name: "Kore", 
    gender: "Female", 
    description: "Calm, soothing, clear" 
  },
  { 
    id: VoiceName.Fenrir, 
    name: "Fenrir", 
    gender: "Male", 
    description: "Fast, energetic, bright" 
  },
  { 
    id: VoiceName.Zephyr, 
    name: "Zephyr", 
    gender: "Female", 
    description: "Standard, balanced, friendly" 
  },
];

export const DEFAULT_VOICE = VoiceName.Kore;
export const SAMPLE_RATE = 24000; // Gemini TTS standard output
