import { join } from 'path';
import { exists } from 'fs/promises';
import { DEFAULT_DATA_DIR } from './plugin-config.js';

/**
 * All available Warcraft II sound files (Alliance and Horde)
 */
export const sounds = {
  // ALLIANCE SOUNDS
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
  
  // HORDE SOUNDS
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
  deathKnightSelected: [
    'death_knight_selected1.wav',
    'death_knight_selected2.wav',
  ],
  deathKnightAcknowledge: [
    'death_knight_acknowledge1.wav',
    'death_knight_acknowledge2.wav',
    'death_knight_acknowledge3.wav',
  ],
  dragonSelected: ['dragon_selected1.wav'],
  dragonAcknowledge: [
    'dragon_acknowledge1.wav',
    'dragon_acknowledge2.wav',
  ],
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
  ogreAcknowledge: [
    'ogre_acknowledge1.wav',
    'ogre_acknowledge2.wav',
    'ogre_acknowledge3.wav',
  ],
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
  trollSelected: [
    'troll_selected1.wav',
    'troll_selected2.wav',
    'troll_selected3.wav',
  ],
  trollAcknowledge: [
    'troll_acknowledge1.wav',
    'troll_acknowledge2.wav',
    'troll_acknowledge3.wav',
  ],
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
  
  // SPECIAL SOUNDS (both factions)
  special: ['work_completed.wav', 'jobs_done.wav', 'orc_work_completed.wav'],
} as const;

/**
 * Return a flat list of every known sound filename
 * @returns Array of sound filenames
 */
export const getAllSounds = (): string[] => Object.values(sounds).flat();

/**
 * Pick a random sound filename from the full set
 * @returns A sound filename
 */
export const getRandomSound = (): string => {
  const allSounds = getAllSounds();
  return allSounds[Math.floor(Math.random() * allSounds.length)];
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
 * Check whether a sound file exists in the data directory
 * @param filename - Name of the sound file
 * @param dataDir - Optional override data directory
 * @returns `true` when the file exists
 */
export const soundExists = async (filename: string, dataDir?: string): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const filePath = join(effectiveDataDir, filename);
  return await exists(filePath);
};

/**
 * Resolve the absolute path for a sound filename in the data directory
 * @param filename - Sound filename
 * @param dataDir - Optional override data directory
 * @returns Absolute path to the sound file
 */
export const getSoundPath = (filename: string, dataDir?: string): string => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  return join(effectiveDataDir, filename);
};

/**
 * Pick a random sound filename and return its resolved path
 * @param dataDir - Optional override data directory
 * @returns Absolute path to a random sound file
 */
export const getRandomSoundPath = (dataDir?: string): string => {
  const randomSound = getRandomSound();
  return getSoundPath(randomSound, dataDir);
};

/**
 * Get all Alliance sound categories
 * @returns Array of Alliance sound category keys
 */
export const getAllianceSoundCategories = (): (keyof typeof sounds)[] => {
  return [
    'humanSelected', 'humanAcknowledge',
    'dwarfSelected', 'dwarfAcknowledge',
    'elfSelected', 'elfAcknowledge',
    'knightSelected', 'knightAcknowledge',
    'mageSelected', 'mageAcknowledge',
    'peasantSelected', 'peasantAcknowledge',
    'shipSelected', 'shipAcknowledge'
  ];
};

/**
 * Get all Horde sound categories
 * @returns Array of Horde sound category keys
 */
export const getHordeSoundCategories = (): (keyof typeof sounds)[] => {
  return [
    'orcSelected', 'orcAcknowledge',
    'deathKnightSelected', 'deathKnightAcknowledge',
    'dragonSelected', 'dragonAcknowledge',
    'goblinSapperSelected', 'goblinSapperAcknowledge',
    'ogreSelected', 'ogreAcknowledge',
    'ogreMageSelected', 'ogreMageAcknowledge',
    'trollSelected', 'trollAcknowledge',
    'hordeShipSelected', 'hordeShipAcknowledge'
  ];
};

/**
 * Get sounds from a specific faction
 * @param faction - 'alliance', 'horde', or 'both'
 * @returns Array of sound filenames from the specified faction(s)
 */
export const getSoundsByFaction = (faction: 'alliance' | 'horde' | 'both'): string[] => {
  let categories: (keyof typeof sounds)[] = [];
  
  switch (faction) {
    case 'alliance':
      categories = getAllianceSoundCategories();
      break;
    case 'horde':
      categories = getHordeSoundCategories();
      break;
    case 'both':
      categories = [...getAllianceSoundCategories(), ...getHordeSoundCategories()];
      break;
  }
  
  // Add special sounds for all factions
  categories.push('special');
  
  return categories.flatMap(category => sounds[category]);
};

/**
 * Pick a random sound from a specific faction
 * @param faction - 'alliance', 'horde', or 'both'
 * @returns A random sound filename from the specified faction(s)
 */
export const getRandomSoundFromFaction = (faction: 'alliance' | 'horde' | 'both'): string => {
  const factionSounds = getSoundsByFaction(faction);
  return factionSounds[Math.floor(Math.random() * factionSounds.length)];
};

/**
 * Pick a random sound from a specific faction and return its resolved path
 * @param faction - 'alliance', 'horde', or 'both'
 * @param dataDir - Optional override data directory
 * @returns Absolute path to a random sound file from the specified faction(s)
 */
export const getRandomSoundPathFromFaction = (faction: 'alliance' | 'horde' | 'both', dataDir?: string): string => {
  const randomSound = getRandomSoundFromFaction(faction);
  return getSoundPath(randomSound, dataDir);
};
