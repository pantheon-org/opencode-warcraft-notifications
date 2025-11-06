import { join } from "path";
import { exists } from "fs/promises";
import { getDataDirectory } from "./download.js";

/**
 * All available Warcraft II Alliance sound files
 */
export const sounds = {
  humanSelected: [
    "human_selected1.wav",
    "human_selected2.wav",
    "human_selected3.wav",
    "human_selected4.wav",
    "human_selected5.wav",
    "human_selected6.wav",
  ],
  humanAcknowledge: [
    "human_acknowledge1.wav",
    "human_acknowledge2.wav",
    "human_acknowledge3.wav",
    "human_acknowledge4.wav",
  ],
  dwarfSelected: ["dwarf_selected1.wav", "dwarf_selected2.wav"],
  dwarfAcknowledge: [
    "dwarf_acknowledge1.wav",
    "dwarf_acknowledge2.wav",
    "dwarf_acknowledge3.wav",
    "dwarf_acknowledge4.wav",
    "dwarf_acknowledge5.wav",
  ],
  elfSelected: [
    "elf_selected1.wav",
    "elf_selected2.wav",
    "elf_selected3.wav",
    "elf_selected4.wav",
  ],
  elfAcknowledge: [
    "elf_acknowledge1.wav",
    "elf_acknowledge2.wav",
    "elf_acknowledge3.wav",
    "elf_acknowledge4.wav",
  ],
  knightSelected: [
    "knight_selected1.wav",
    "knight_selected2.wav",
    "knight_selected3.wav",
    "knight_selected4.wav",
  ],
  knightAcknowledge: [
    "knight_acknowledge1.wav",
    "knight_acknowledge2.wav",
    "knight_acknowledge3.wav",
    "knight_acknowledge4.wav",
  ],
  mageSelected: ["mage_selected1.wav", "mage_selected2.wav", "mage_selected3.wav"],
  mageAcknowledge: ["mage_acknowledge1.wav", "mage_acknowledge2.wav", "mage_acknowledge3.wav"],
  peasantSelected: [
    "peasant_selected1.wav",
    "peasant_selected2.wav",
    "peasant_selected3.wav",
    "peasant_selected4.wav",
  ],
  peasantAcknowledge: [
    "peasant_acknowledge1.wav",
    "peasant_acknowledge2.wav",
    "peasant_acknowledge3.wav",
    "peasant_acknowledge4.wav",
  ],
  shipSelected: ["ship_selected1.wav", "ship_selected2.wav", "ship_selected3.wav", "ship_selected4.wav"],
  shipAcknowledge: ["ship_acknowledge1.wav", "ship_acknowledge2.wav", "ship_acknowledge3.wav"],
  special: ["work_completed.wav", "jobs_done.wav"],
} as const;

export const getAllSounds = (): string[] => Object.values(sounds).flat();

export const getRandomSound = (): string => {
  const allSounds = getAllSounds();
  return allSounds[Math.floor(Math.random() * allSounds.length)];
};

export const getRandomSoundFromCategory = (category: keyof typeof sounds): string => {
  const categorySounds = sounds[category];
  return categorySounds[Math.floor(Math.random() * categorySounds.length)];
};

export const soundExists = async (filename: string, dataDir?: string): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? getDataDirectory();
  const filePath = join(effectiveDataDir, filename);
  return await exists(filePath);
};

export const getSoundPath = (filename: string, dataDir?: string): string => {
  const effectiveDataDir = dataDir ?? getDataDirectory();
  return join(effectiveDataDir, filename);
};

export const getRandomSoundPath = (dataDir?: string): string => {
  const randomSound = getRandomSound();
  return getSoundPath(randomSound, dataDir);
};
