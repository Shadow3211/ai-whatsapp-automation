export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface VoiceOption {
  id: VoiceName;
  name: string;
  gender: 'Male' | 'Female';
  description: string;
}

export interface GeneratedAudio {
  id: string;
  text: string;
  voice: VoiceName;
  blobUrl: string;
  timestamp: number;
}