import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { exists } from "fs/promises";
import { getDataDirectory } from "./download.js";

// Get the current directory (sounds directory)
const soundsDir = dirname(fileURLToPath(import.meta.url));

/**
 * All available Warcraft II Alliance sound files
 */
export const sounds = {
  // Basic Human Voices - Selected
  humanSelected: [
    "human_selected1.wav",  // Your command?
    "human_selected2.wav",  // Your orders?
    "human_selected3.wav",  // Yes, sire?
    "human_selected4.wav",  // Yes?
    "human_selected5.wav",  // My lord
    "human_selected6.wav",  // At your service
  ],
  
  // Basic Human Voices - Acknowledge
  humanAcknowledge: [
    "human_acknowledge1.wav",  // Yes
    "human_acknowledge2.wav",  // Yes, My Lord
    "human_acknowledge3.wav",  // As you wish
    "human_acknowledge4.wav",  // At once, sire
  ],
  
  // Dwarven Demolition Squad - Selected
  dwarfSelected: [
    "dwarf_selected1.wav",  // What do you want?
    "dwarf_selected2.wav",  // Auch
  ],
  
  // Dwarven Demolition Squad - Acknowledge
  dwarfAcknowledge: [
    "dwarf_acknowledge1.wav",  // Aye, laddie
    "dwarf_acknowledge2.wav",  // Okay
    "dwarf_acknowledge3.wav",  // Alright
    "dwarf_acknowledge4.wav",  // Move out
    "dwarf_acknowledge5.wav",  // Yes sir
  ],
  
  // Elven Archer - Selected
  elfSelected: [
    "elf_selected1.wav",  // Your eminence?
    "elf_selected2.wav",  // Exalted one?
    "elf_selected3.wav",  // My sovereign?
    "elf_selected4.wav",  // Your wish?
  ],
  
  // Elven Archer - Acknowledge
  elfAcknowledge: [
    "elf_acknowledge1.wav",  // Yes
    "elf_acknowledge2.wav",  // By your command
    "elf_acknowledge3.wav",  // For the alliance
    "elf_acknowledge4.wav",  // Move out
  ],
  
  // Knight - Selected
  knightSelected: [
    "knight_selected1.wav",  // Your majesty?
    "knight_selected2.wav",  // At your service
    "knight_selected3.wav",  // Sire?
    "knight_selected4.wav",  // What ho?
  ],
  
  // Knight - Acknowledge
  knightAcknowledge: [
    "knight_acknowledge1.wav",  // We move
    "knight_acknowledge2.wav",  // In your name
    "knight_acknowledge3.wav",  // For the king
    "knight_acknowledge4.wav",  // Defending your honor
  ],
  
  // Mage - Selected
  mageSelected: [
    "mage_selected1.wav",  // What is it?
    "mage_selected2.wav",  // Do you need assistance?
    "mage_selected3.wav",  // Your request?
  ],
  
  // Mage - Acknowledge
  mageAcknowledge: [
    "mage_acknowledge1.wav",  // As you wish
    "mage_acknowledge2.wav",  // Very well
    "mage_acknowledge3.wav",  // Alright
  ],
  
  // Peasant - Selected
  peasantSelected: [
    "peasant_selected1.wav",  // Yes?
    "peasant_selected2.wav",  // My lord?
    "peasant_selected3.wav",  // What is it?
    "peasant_selected4.wav",  // Hello
  ],
  
  // Peasant - Acknowledge
  peasantAcknowledge: [
    "peasant_acknowledge1.wav",  // Okay
    "peasant_acknowledge2.wav",  // Right-o
    "peasant_acknowledge3.wav",  // Alright
    "peasant_acknowledge4.wav",  // Yes, my lord
  ],
  
  // Ships - Selected
  shipSelected: [
    "ship_selected1.wav",  // Captain on the bridge
    "ship_selected2.wav",  // Aye captain?
    "ship_selected3.wav",  // Skipper?
    "ship_selected4.wav",  // Set sail?
  ],
  
  // Ships - Acknowledge
  shipAcknowledge: [
    "ship_acknowledge1.wav",  // Aye aye sir
    "ship_acknowledge2.wav",  // Aye captain
    "ship_acknowledge3.wav",  // Under way
  ],
  
  // Special sounds
  special: [
    "work_completed.wav",  // Work completed
    "jobs_done.wav",      // Jobs done
  ],
} as const;

/**
 * Get all sound files as a flat array
 */
export function getAllSounds(): string[] {
  return Object.values(sounds).flat();
}

/**
 * Get a random sound file from all available sounds
 */
export function getRandomSound(): string {
  const allSounds = getAllSounds();
  const randomIndex = Math.floor(Math.random() * allSounds.length);
  return allSounds[randomIndex];
}

/**
 * Get a random sound from a specific category
 */
export function getRandomSoundFromCategory(category: keyof typeof sounds): string {
  const categorySounds = sounds[category];
  const randomIndex = Math.floor(Math.random() * categorySounds.length);
  return categorySounds[randomIndex];
}

/**
 * Check if a sound file exists locally
 */
export async function soundExists(filename: string, dataDir?: string): Promise<boolean> {
  const effectiveDataDir = dataDir ?? getDataDirectory();
  const filePath = join(effectiveDataDir, filename);
  return await exists(filePath);
}

/**
 * Get the full path to a sound file
 */
export function getSoundPath(filename: string, dataDir?: string): string {
  const effectiveDataDir = dataDir ?? getDataDirectory();
  return join(effectiveDataDir, filename);
}

/**
 * Get a random sound file with full path
 */
export function getRandomSoundPath(dataDir?: string): string {
  const randomSound = getRandomSound();
  return getSoundPath(randomSound, dataDir);
}
