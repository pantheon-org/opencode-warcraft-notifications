import { join } from 'path';
import { mkdir, exists } from 'fs/promises';
import { DEFAULT_BASE_URL, DEFAULT_DATA_DIR } from './plugin-config.js';
import {
  SoundFile,
  buildSoundsToDownload,
  buildAllSoundsToDownload,
  getSoundFileList as dataGetSoundFileList,
} from './sound-data';
import { determineSoundFaction } from './sounds.js';

export type FetchLike = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

/**
 * Download a single sound file to faction-specific subdirectory
 *
 * @param sound - SoundFile metadata describing the filename, url and description
 * @param fetchImpl - A fetch-like implementation used to retrieve the resource
 * @param dataDir - Optional local data directory to write the downloaded file
 * @returns true when the file is present locally (already existed or downloaded successfully)
 */
export const downloadSound = async (
  sound: SoundFile,
  fetchImpl: FetchLike,
  dataDir?: string,
): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const factionDir = join(effectiveDataDir, sound.subdirectory);
  const filePath = join(factionDir, sound.filename);

  try {
    // Check if file already exists
    const fileExists = await exists(filePath);
    if (fileExists) {
      console.log(`✓ ${sound.filename} already exists`);
      return true;
    }
  } catch {
    // proceed to download
  }

  try {
    console.log(`Downloading ${sound.filename} (${sound.description})...`);
    const response = (await fetchImpl(sound.url)) as Response;

    if (!response || !response.ok) {
      console.error(`HTTP error! status: ${response?.status ?? 'no response'}`);
      return false;
    }

    const arrayBuffer = await response.arrayBuffer();

    // Ensure faction directory exists
    await mkdir(factionDir, { recursive: true });

    // Write file using Bun's built-in file operations
    await Bun.write(filePath, arrayBuffer);
    console.log(`✓ Downloaded ${sound.filename}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to download ${sound.filename}:`, error);
    return false;
  }
};

/**
 * Check if a sound file exists locally in faction-specific subdirectory
 *
 * @param filename - Name of the sound file (e.g. "human_selected1.wav")
 * @param dataDir - Optional data directory override
 * @returns true if the file exists on disk
 */
export const soundExists = async (filename: string, dataDir?: string): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const faction = determineSoundFaction(filename);
  const factionDir = join(effectiveDataDir, faction);
  const filePath = join(factionDir, filename);
  return await exists(filePath);
};

// Concurrency guard to prevent duplicate downloads for same filename
const downloadInProgress = new Map<string, Promise<boolean>>();

/**
 * Download a single sound by filename on demand.
 *
 * This function deduplicates concurrent requests for the same filename and
 * ensures the file is present locally after completion.
 *
 * @param filename - The target sound filename to download (e.g. "human_selected1.wav")
 * @param fetchImpl - Optional fetch-like implementation to use for retrieval
 * @param baseUrl - Optional base URL to download sounds from
 * @param dataDir - Optional local directory to store downloaded sounds
 * @returns true when the file exists locally (either pre-existing or downloaded successfully)
 */
export const downloadSoundByFilename = async (
  filename: string,
  fetchImpl?: FetchLike,
  baseUrl?: string,
  dataDir?: string,
): Promise<boolean> => {
  const effectiveFetch = fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
  const effectiveBaseUrl = baseUrl ?? DEFAULT_BASE_URL;
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;

  const mapKey = `${effectiveDataDir}:${filename}`;

  // If a download is already in progress for this file+dir, await it
  if (downloadInProgress.has(mapKey)) {
    return await downloadInProgress.get(mapKey)!;
  }

  // Create placeholder promise and set it immediately to prevent races
  let resolveRef!: (v: boolean) => void;
  let rejectRef!: (err: unknown) => void;
  const placeholder = new Promise<boolean>((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });
  downloadInProgress.set(mapKey, placeholder);

  (async () => {
    try {
      // Determine faction and build appropriate sound list
      const faction = determineSoundFaction(filename);
      const soundsToDownload = buildSoundsToDownload(faction, effectiveBaseUrl);
      const sound = soundsToDownload.find((s) => s.filename === filename);
      if (!sound) {
        console.error(`No sound entry found for filename: ${filename}`);
        resolveRef(false);
        return;
      }

      // If file exists already, resolve true
      const factionDir = join(effectiveDataDir, faction);
      const filePath = join(factionDir, filename);
      try {
        const fileExists = await exists(filePath);
        if (fileExists) {
          resolveRef(true);
          return;
        }
      } catch {
        // continue to attempt download
      }

      // Ensure base data directory exists
      try {
        await mkdir(effectiveDataDir, { recursive: true });
      } catch (error) {
        console.error('Failed to create data directory:', error);
        resolveRef(false);
        return;
      }

      const result = await downloadSound(sound, effectiveFetch, effectiveDataDir);
      resolveRef(result);
    } catch (err) {
      rejectRef(err);
    } finally {
      downloadInProgress.delete(mapKey);
    }
  })();

  return await placeholder;
};

/**
 * Ensure a sound is available locally (download on demand).
 *
 * Convenience wrapper around `downloadSoundByFilename`.
 *
 * @param filename - Target sound filename
 * @param fetchImpl - Optional fetch-like implementation
 * @param baseUrl - Optional base URL for downloads
 * @param dataDir - Optional local data directory
 * @returns true when the file exists locally
 */
export const ensureSoundAvailable = async (
  filename: string,
  fetchImpl?: FetchLike,
  baseUrl?: string,
  dataDir?: string,
): Promise<boolean> => {
  return await downloadSoundByFilename(filename, fetchImpl, baseUrl, dataDir);
};

/**
 * Download all Warcraft II sounds (both Alliance and Horde)
 *
 * @param fetchImpl - Optional fetch-like implementation used for downloads
 * @param baseUrl - Optional base URL to download from (used for Alliance sounds)
 * @param dataDir - Optional local directory to store sounds
 */
export const downloadAllSounds = async (
  fetchImpl?: FetchLike,
  baseUrl?: string,
  dataDir?: string,
): Promise<void> => {
  const effectiveFetch = fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
  const effectiveBaseUrl = baseUrl ?? DEFAULT_BASE_URL;
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;

  console.log('Starting Warcraft II sounds download...');

  // Create base data directory if it doesn't exist
  try {
    await mkdir(effectiveDataDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create data directory:', error);
    return;
  }

  const soundsToDownload = buildAllSoundsToDownload(effectiveBaseUrl);

  const results = await Promise.allSettled(
    soundsToDownload.map((sound) => downloadSound(sound, effectiveFetch, effectiveDataDir)),
  );

  const successful = results.filter(
    (result) => result.status === 'fulfilled' && result.value === true,
  ).length;

  const failed = results.length - successful;

  console.log(`\nDownload complete!`);
  console.log(`✓ Successful: ${successful}`);
  if (failed > 0) {
    console.log(`✗ Failed: ${failed}`);
  }
  console.log(`📂 Sounds saved to: ${effectiveDataDir}`);
};

/**
 * Get the list of all sound files that should be downloaded
 *
 * @returns list of filenames
 */
export const getSoundFileList = (): string[] => {
  return dataGetSoundFileList();
};
