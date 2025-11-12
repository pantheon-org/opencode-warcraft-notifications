// Re-export types
export type { SoundFile, SoundEntry } from './types.js';

// Re-export sound entries
export { allianceSoundEntries } from './alliance.js';
export { hordeSoundEntries } from './horde.js';

// Import for use in utility functions
import { allianceSoundEntries } from './alliance.js';
import { hordeSoundEntries } from './horde.js';
import type { SoundFile } from './types.js';

/**
 * Build the list of `SoundFile` objects for a specific faction
 * @param faction - The faction to build sounds for ('alliance' or 'horde')
 * @param baseUrl - Base URL to prepend to each entry's path
 * @returns Array of `SoundFile` objects ready for download
 */
/**
 * Transform sound entry to SoundFile object
 */
const transformToSoundFile = (
  entry: { filename: string; path: string; description: string },
  effectiveBaseUrl: string,
  faction: 'alliance' | 'horde',
): SoundFile => ({
  filename: entry.filename,
  url: `${effectiveBaseUrl}/${entry.path}`,
  description: entry.description,
  faction: faction,
  subdirectory: faction,
});

/**
 * Build the list of SoundFile objects for a specific faction
 * @param faction - The faction to build sounds for ('alliance' or 'horde')
 * @param baseUrl - Base URL to prepend to each entry's path
 * @returns Array of SoundFile objects ready for download
 */
export const buildSoundsToDownload = (
  faction: 'alliance' | 'horde',
  baseUrl: string,
): SoundFile[] => {
  const entries = faction === 'alliance' ? allianceSoundEntries : hordeSoundEntries;
  const hordeBaseUrl = 'https://www.thanatosrealms.com/war2/sounds/orcs';
  const effectiveBaseUrl = faction === 'horde' ? hordeBaseUrl : baseUrl;

  const result: SoundFile[] = [];
  for (const entry of entries) {
    result.push(transformToSoundFile(entry, effectiveBaseUrl, faction));
  }
  return result;
};

/**
 * Build the list of all `SoundFile` objects for both factions
 * @param allianceBaseUrl - Base URL for Alliance sounds
 * @returns Array of `SoundFile` objects for both factions
 */
export const buildAllSoundsToDownload = (allianceBaseUrl: string): SoundFile[] => {
  return [
    ...buildSoundsToDownload('alliance', allianceBaseUrl),
    ...buildSoundsToDownload('horde', allianceBaseUrl), // baseUrl not used for horde, they have their own
  ];
};

/**
 * Extract filename from sound entry
 */
const extractFilename = (e: { filename: string }): string => e.filename;

/**
 * Return the list of expected sound filenames for a specific faction
 * @param faction - The faction to get filenames for
 * @returns Array of sound filenames
 */
export const getSoundFileList = (faction?: 'alliance' | 'horde'): string[] => {
  if (faction === 'alliance') {
    return allianceSoundEntries.map(extractFilename);
  }
  if (faction === 'horde') {
    return hordeSoundEntries.map(extractFilename);
  }
  // Return all sounds if no faction specified
  return [...allianceSoundEntries, ...hordeSoundEntries].map(extractFilename);
};

/**
 * Get the count of sounds for each faction
 * @returns Object with counts for each faction
 */
export const getSoundCounts = () => {
  return {
    alliance: allianceSoundEntries.length,
    horde: hordeSoundEntries.length,
    total: allianceSoundEntries.length + hordeSoundEntries.length,
  };
};
