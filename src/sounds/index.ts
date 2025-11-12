import { join } from 'path';
import { exists } from 'fs/promises';
import { DEFAULT_DATA_DIR, type Faction } from '../config/index.js';
import { allianceSounds, hordeSounds, sounds } from './data/index.js';
import {
  allianceSoundDescriptions,
  hordeSoundDescriptions,
  soundDescriptions,
  getSoundDescription,
} from './descriptions.js';

// Re-export sound data for backward compatibility
export { allianceSounds, hordeSounds, sounds };

// Export sound descriptions
export {
  allianceSoundDescriptions,
  hordeSoundDescriptions,
  soundDescriptions,
  getSoundDescription,
};

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
  existsFn?: (path: string) => Promise<boolean>,
): Promise<boolean> => {
  const filePath = getSoundPath(filename, faction, dataDir);
  const checker = existsFn ?? exists;
  return await checker(filePath);
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
 * Get list of sound filenames for a specific faction or all factions
 * @param faction - Optional faction to filter by ('alliance' or 'horde')
 * @returns Array of sound filenames
 *
 * @example
 * ```typescript
 * // Get all sounds
 * const allSounds = getSoundFileList();
 *
 * // Get alliance sounds only
 * const allianceSounds = getSoundFileList('alliance');
 *
 * // Get horde sounds only
 * const hordeSounds = getSoundFileList('horde');
 * ```
 */
export const getSoundFileList = (faction?: 'alliance' | 'horde'): string[] => {
  if (faction === 'alliance') {
    return Object.values(allianceSounds).flat();
  }
  if (faction === 'horde') {
    return Object.values(hordeSounds).flat();
  }
  // Return all sounds if no faction specified
  return getAllSounds();
};

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
