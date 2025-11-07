import { join } from 'path';
import { exists } from 'fs/promises';
import { DEFAULT_DATA_DIR, type Faction } from './plugin-config.js';

/**
 * Alliance sound categories and their sound files
 */
export const allianceSounds = {
  humanSelected: [
    'human_selected1.wav',
    'human_selected2.wav',
    'human_selected3.wav',
    'human_selected4.wav',
    'human_selected5.wav',
    'human_selected6.wav',
  ],
  humanAcknowledge: [
    'human_acknowledge1.wav',
    'human_acknowledge2.wav',
    'human_acknowledge3.wav',
    'human_acknowledge4.wav',
  ],
  dwarfSelected: ['dwarf_selected1.wav', 'dwarf_selected2.wav'],
  dwarfAcknowledge: [
    'dwarf_acknowledge1.wav',
    'dwarf_acknowledge2.wav',
    'dwarf_acknowledge3.wav',
    'dwarf_acknowledge4.wav',
    'dwarf_acknowledge5.wav',
  ],
  elfSelected: ['elf_selected1.wav', 'elf_selected2.wav', 'elf_selected3.wav', 'elf_selected4.wav'],
  elfAcknowledge: [
    'elf_acknowledge1.wav',
    'elf_acknowledge2.wav',
    'elf_acknowledge3.wav',
    'elf_acknowledge4.wav',
  ],
  knightSelected: [
    'knight_selected1.wav',
    'knight_selected2.wav',
    'knight_selected3.wav',
    'knight_selected4.wav',
  ],
  knightAcknowledge: [
    'knight_acknowledge1.wav',
    'knight_acknowledge2.wav',
    'knight_acknowledge3.wav',
    'knight_acknowledge4.wav',
  ],
  mageSelected: ['mage_selected1.wav', 'mage_selected2.wav', 'mage_selected3.wav'],
  mageAcknowledge: ['mage_acknowledge1.wav', 'mage_acknowledge2.wav', 'mage_acknowledge3.wav'],
  peasantSelected: [
    'peasant_selected1.wav',
    'peasant_selected2.wav',
    'peasant_selected3.wav',
    'peasant_selected4.wav',
  ],
  peasantAcknowledge: [
    'peasant_acknowledge1.wav',
    'peasant_acknowledge2.wav',
    'peasant_acknowledge3.wav',
    'peasant_acknowledge4.wav',
  ],
  shipSelected: [
    'ship_selected1.wav',
    'ship_selected2.wav',
    'ship_selected3.wav',
    'ship_selected4.wav',
  ],
  shipAcknowledge: ['ship_acknowledge1.wav', 'ship_acknowledge2.wav', 'ship_acknowledge3.wav'],
  special: ['work_completed.wav', 'jobs_done.wav'],
} as const;

/**
 * Horde sound categories and their sound files
 */
export const hordeSounds = {
  orcSelected: [
    'orc_selected1.wav',
    'orc_selected2.wav',
    'orc_selected3.wav',
    'orc_selected4.wav',
    'orc_selected5.wav',
    'orc_selected6.wav',
  ],
  orcAcknowledge: [
    'orc_acknowledge1.wav',
    'orc_acknowledge2.wav',
    'orc_acknowledge3.wav',
    'orc_acknowledge4.wav',
  ],
  deathKnightSelected: ['death_knight_selected1.wav', 'death_knight_selected2.wav'],
  deathKnightAcknowledge: [
    'death_knight_acknowledge1.wav',
    'death_knight_acknowledge2.wav',
    'death_knight_acknowledge3.wav',
  ],
  dragonSelected: ['dragon_selected1.wav'],
  dragonAcknowledge: ['dragon_acknowledge1.wav', 'dragon_acknowledge2.wav'],
  goblinSapperSelected: [
    'goblin_sapper_selected1.wav',
    'goblin_sapper_selected2.wav',
    'goblin_sapper_selected3.wav',
    'goblin_sapper_selected4.wav',
  ],
  goblinSapperAcknowledge: [
    'goblin_sapper_acknowledge1.wav',
    'goblin_sapper_acknowledge2.wav',
    'goblin_sapper_acknowledge3.wav',
    'goblin_sapper_acknowledge4.wav',
  ],
  ogreSelected: [
    'ogre_selected1.wav',
    'ogre_selected2.wav',
    'ogre_selected3.wav',
    'ogre_selected4.wav',
  ],
  ogreAcknowledge: ['ogre_acknowledge1.wav', 'ogre_acknowledge2.wav', 'ogre_acknowledge3.wav'],
  ogreMageSelected: [
    'ogre_mage_selected1.wav',
    'ogre_mage_selected2.wav',
    'ogre_mage_selected3.wav',
    'ogre_mage_selected4.wav',
  ],
  ogreMageAcknowledge: [
    'ogre_mage_acknowledge1.wav',
    'ogre_mage_acknowledge2.wav',
    'ogre_mage_acknowledge3.wav',
  ],
  trollSelected: ['troll_selected1.wav', 'troll_selected2.wav', 'troll_selected3.wav'],
  trollAcknowledge: ['troll_acknowledge1.wav', 'troll_acknowledge2.wav', 'troll_acknowledge3.wav'],
  hordeShipSelected: [
    'horde_ship_selected1.wav',
    'horde_ship_selected2.wav',
    'horde_ship_selected3.wav',
    'horde_ship_selected4.wav',
  ],
  hordeShipAcknowledge: [
    'horde_ship_acknowledge1.wav',
    'horde_ship_acknowledge2.wav',
    'horde_ship_acknowledge3.wav',
  ],
  special: ['orc_work_completed.wav'],
} as const;

/**
 * Combined sounds object for backward compatibility
 */
export const sounds = {
  ...allianceSounds,
  ...hordeSounds,
} as const;

/**
 * Get sound path for a specific faction
 * @param filename - Sound filename
 * @param faction - Faction the sound belongs to
 * @param dataDir - Optional override data directory
 * @returns Absolute path to the sound file in faction subdirectory
 */
export const getSoundPath = (
  filename: string,
  faction: 'alliance' | 'horde',
  dataDir?: string,
): string => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  return join(effectiveDataDir, faction, filename);
};

/**
 * Check whether a sound file exists in the faction-specific data directory
 * @param filename - Name of the sound file
 * @param faction - Faction the sound belongs to
 * @param dataDir - Optional override data directory
 * @returns `true` when the file exists
 */
export const soundExists = async (
  filename: string,
  faction: 'alliance' | 'horde',
  dataDir?: string,
): Promise<boolean> => {
  const filePath = getSoundPath(filename, faction, dataDir);
  return await exists(filePath);
};

/**
 * Determine which faction a sound belongs to based on filename
 * @param filename - Sound filename
 * @returns The faction the sound belongs to
 */
export const determineSoundFaction = (filename: string): 'alliance' | 'horde' => {
  // Check if it's a Horde sound
  if (
    filename.startsWith('orc_') ||
    filename.startsWith('death_knight_') ||
    filename.startsWith('dragon_') ||
    filename.startsWith('goblin_sapper_') ||
    filename.startsWith('ogre_') ||
    filename.startsWith('troll_') ||
    filename.startsWith('horde_ship_')
  ) {
    return 'horde';
  }
  // Default to alliance
  return 'alliance';
};

/**
 * Get all sounds from a specific faction
 * @param faction - The faction to get sounds from
 * @returns Array of sound filenames from the specified faction
 */
export const getSoundsByFaction = (faction: Faction): string[] => {
  switch (faction) {
    case 'alliance':
      return Object.values(allianceSounds).flat();
    case 'horde':
      return Object.values(hordeSounds).flat();
    case 'both':
      return [...Object.values(allianceSounds).flat(), ...Object.values(hordeSounds).flat()];
  }
};

/**
 * Get all Alliance sound categories
 * @returns Array of Alliance sound category keys
 */
export const getAllianceSoundCategories = (): (keyof typeof allianceSounds)[] => {
  return Object.keys(allianceSounds) as (keyof typeof allianceSounds)[];
};

/**
 * Get all Horde sound categories
 * @returns Array of Horde sound category keys
 */
export const getHordeSoundCategories = (): (keyof typeof hordeSounds)[] => {
  return Object.keys(hordeSounds) as (keyof typeof hordeSounds)[];
};

/**
 * Pick a random sound from a specific faction
 * @param faction - 'alliance', 'horde', or 'both'
 * @returns A random sound filename from the specified faction(s)
 */
export const getRandomSoundFromFaction = (faction: Faction): string => {
  const factionSounds = getSoundsByFaction(faction);
  return factionSounds[Math.floor(Math.random() * factionSounds.length)];
};

/**
 * Pick a random sound from a specific faction and return its resolved path
 * @param faction - 'alliance', 'horde', or 'both'
 * @param dataDir - Optional override data directory
 * @returns Absolute path to a random sound file from the specified faction(s)
 */
export const getRandomSoundPathFromFaction = (faction: Faction, dataDir?: string): string => {
  const randomSound = getRandomSoundFromFaction(faction);
  const soundFaction = determineSoundFaction(randomSound);
  return getSoundPath(randomSound, soundFaction, dataDir);
};

/**
 * Pick a random sound from a named category
 * @param category - Key of the `sounds` map
 * @returns A sound filename from the category
 */
export const getRandomSoundFromCategory = (category: keyof typeof sounds): string => {
  const categorySounds = sounds[category];
  return categorySounds[Math.floor(Math.random() * categorySounds.length)];
};

/**
 * Return a flat list of every known sound filename (backward compatibility)
 * @returns Array of sound filenames
 */
export const getAllSounds = (): string[] => Object.values(sounds).flat();

/**
 * Pick a random sound filename from the full set (backward compatibility)
 * @returns A sound filename
 */
export const getRandomSound = (): string => {
  const allSounds = getAllSounds();
  return allSounds[Math.floor(Math.random() * allSounds.length)];
};

/**
 * Pick a random sound filename and return its resolved path (backward compatibility)
 * @param dataDir - Optional override data directory
 * @returns Absolute path to a random sound file
 */
export const getRandomSoundPath = (dataDir?: string): string => {
  const randomSound = getRandomSound();
  const soundFaction = determineSoundFaction(randomSound);
  return getSoundPath(randomSound, soundFaction, dataDir);
};
