import { type Faction } from '../plugin-config.js';

export interface SoundFile {
  filename: string;
  url: string;
  description: string;
  faction: Faction;
  subdirectory: 'alliance' | 'horde';
}

export interface SoundEntry {
  filename: string;
  path: string;
  description: string;
}
