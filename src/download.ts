import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdir, exists } from "fs/promises";

export type FetchLike = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

/**
 * Build a list of sounds to download from the base URL.
 * @param baseUrl - Base URL that hosts sound files
 * @returns An array of SoundFile objects with filename, url and description
 */

// Get the current directory (was sounds directory)
const soundsDir = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_DIR = join(soundsDir, "..", "data");
const DEFAULT_BASE_URL = process.env.SOUNDS_BASE_URL ?? "https://www.thanatosrealms.com/war2/sounds/humans";

interface SoundFile {
  filename: string;
  url: string;
  description: string;
}

// Template of sound entries with relative paths (relative to base URL)
const soundEntries: Array<{ filename: string; path: string; description: string }> = [
  { filename: "human_selected1.wav", path: "basic-human-voices/selected1.wav", description: "Your command?" },
  { filename: "human_selected2.wav", path: "basic-human-voices/selected2.wav", description: "Your orders?" },
  { filename: "human_selected3.wav", path: "basic-human-voices/selected3.wav", description: "Yes, sire?" },
  { filename: "human_selected4.wav", path: "basic-human-voices/selected4.wav", description: "Yes?" },
  { filename: "human_selected5.wav", path: "basic-human-voices/selected5.wav", description: "My lord" },
  { filename: "human_selected6.wav", path: "basic-human-voices/selected6.wav", description: "At your service" },

  { filename: "human_acknowledge1.wav", path: "basic-human-voices/acknowledge1.wav", description: "Yes" },
  { filename: "human_acknowledge2.wav", path: "basic-human-voices/acknowledge2.wav", description: "Yes, My Lord" },
  { filename: "human_acknowledge3.wav", path: "basic-human-voices/acknowledge3.wav", description: "As you wish" },
  { filename: "human_acknowledge4.wav", path: "basic-human-voices/acknowledge4.wav", description: "At once, sire" },

  { filename: "dwarf_selected1.wav", path: "dwarven-demolition-squad/selected1.wav", description: "What do you want?" },
  { filename: "dwarf_selected2.wav", path: "dwarven-demolition-squad/selected2.wav", description: "Auch" },

  { filename: "dwarf_acknowledge1.wav", path: "dwarven-demolition-squad/acknowledge1.wav", description: "Aye, laddie" },
  { filename: "dwarf_acknowledge2.wav", path: "dwarven-demolition-squad/acknowledge2.wav", description: "Okay" },
  { filename: "dwarf_acknowledge3.wav", path: "dwarven-demolition-squad/acknowledge3.wav", description: "Alright" },
  { filename: "dwarf_acknowledge4.wav", path: "dwarven-demolition-squad/acknowledge4.wav", description: "Move out" },
  { filename: "dwarf_acknowledge5.wav", path: "dwarven-demolition-squad/acknowledge5.wav", description: "Yes sir" },

  { filename: "elf_selected1.wav", path: "elven-archer/selected1.wav", description: "Your eminence?" },
  { filename: "elf_selected2.wav", path: "elven-archer/selected2.wav", description: "Exalted one?" },
  { filename: "elf_selected3.wav", path: "elven-archer/selected3.wav", description: "My sovereign?" },
  { filename: "elf_selected4.wav", path: "elven-archer/selected4.wav", description: "Your wish?" },

  { filename: "elf_acknowledge1.wav", path: "elven-archer/acknowledge1.wav", description: "Yes" },
  { filename: "elf_acknowledge2.wav", path: "elven-archer/acknowledge2.wav", description: "By your command" },
  { filename: "elf_acknowledge3.wav", path: "elven-archer/acknowledge3.wav", description: "For the alliance" },
  { filename: "elf_acknowledge4.wav", path: "elven-archer/acknowledge4.wav", description: "Move out" },

  { filename: "knight_selected1.wav", path: "knight/selected1.wav", description: "Your majesty?" },
  { filename: "knight_selected2.wav", path: "knight/selected2.wav", description: "At your service" },
  { filename: "knight_selected3.wav", path: "knight/selected3.wav", description: "Sire?" },
  { filename: "knight_selected4.wav", path: "knight/selected4.wav", description: "What ho?" },

  { filename: "knight_acknowledge1.wav", path: "knight/acknowledge1.wav", description: "We move" },
  { filename: "knight_acknowledge2.wav", path: "knight/acknowledge2.wav", description: "In your name" },
  { filename: "knight_acknowledge3.wav", path: "knight/acknowledge3.wav", description: "For the king" },
  { filename: "knight_acknowledge4.wav", path: "knight/acknowledge4.wav", description: "Defending your honor" },

  { filename: "mage_selected1.wav", path: "mage/selected1.wav", description: "What is it?" },
  { filename: "mage_selected2.wav", path: "mage/selected2.wav", description: "Do you need assistance?" },
  { filename: "mage_selected3.wav", path: "mage/selected3.wav", description: "Your request?" },

  { filename: "mage_acknowledge1.wav", path: "mage/acknowledge1.wav", description: "As you wish" },
  { filename: "mage_acknowledge2.wav", path: "mage/acknowledge2.wav", description: "Very well" },
  { filename: "mage_acknowledge3.wav", path: "mage/acknowledge3.wav", description: "Alright" },

  { filename: "peasant_selected1.wav", path: "peasant/selected1.wav", description: "Yes?" },
  { filename: "peasant_selected2.wav", path: "peasant/selected2.wav", description: "My lord?" },
  { filename: "peasant_selected3.wav", path: "peasant/selected3.wav", description: "What is it?" },
  { filename: "peasant_selected4.wav", path: "peasant/selected4.wav", description: "Hello" },

  { filename: "peasant_acknowledge1.wav", path: "peasant/acknowledge1.wav", description: "Okay" },
  { filename: "peasant_acknowledge2.wav", path: "peasant/acknowledge2.wav", description: "Right-o" },
  { filename: "peasant_acknowledge3.wav", path: "peasant/acknowledge3.wav", description: "Alright" },
  { filename: "peasant_acknowledge4.wav", path: "peasant/acknowledge4.wav", description: "Yes, my lord" },

  { filename: "ship_selected1.wav", path: "ships/human1.wav", description: "Captain on the bridge" },
  { filename: "ship_selected2.wav", path: "ships/human2.wav", description: "Aye captain?" },
  { filename: "ship_selected3.wav", path: "ships/human3.wav", description: "Skipper?" },
  { filename: "ship_selected4.wav", path: "ships/human4.wav", description: "Set sail?" },

  { filename: "ship_acknowledge1.wav", path: "ships/acknowledge1.wav", description: "Aye aye sir" },
  { filename: "ship_acknowledge2.wav", path: "ships/acknowledge2.wav", description: "Aye captain" },
  { filename: "ship_acknowledge3.wav", path: "ships/acknowledge3.wav", description: "Under way" },

  { filename: "work_completed.wav", path: "basic-human-voices/work-completed.wav", description: "Work completed" },
  { filename: "jobs_done.wav", path: "peasant/work-complete.wav", description: "Jobs done" },
];

/**
 * Build a list of sounds to download from the base URL.
 * @param baseUrl - Base URL that hosts sound files
 * @returns An array of SoundFile objects with filename, url and description
 */
const buildSoundsToDownload = (baseUrl: string): SoundFile[] => {
  return soundEntries.map(e => ({ filename: e.filename, url: `${baseUrl}/${e.path}`, description: e.description }));
}

/**
 * Download a single sound file
 *
 * @param sound - SoundFile metadata describing the filename, url and description
 * @param fetchImpl - A fetch-like implementation used to retrieve the resource
 * @param dataDir - Optional local data directory to write the downloaded file
 * @returns true when the file is present locally (already existed or downloaded successfully)
 */
const downloadSound = async (sound: SoundFile, fetchImpl: FetchLike, dataDir?: string): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const filePath = join(effectiveDataDir, sound.filename);
  
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
    const response = await fetchImpl(sound.url) as Response;
    
    if (!response || !response.ok) {
      console.error(`HTTP error! status: ${response?.status ?? "no response"}`);
      return false;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Write file using Bun's built-in file operations
    await Bun.write(filePath, arrayBuffer);
    console.log(`✓ Downloaded ${sound.filename}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to download ${sound.filename}:`, error);
    return false;
  }
}

/**
 * Check if a sound file exists locally
 *
 * @param filename - Name of the sound file (e.g. "human_selected1.wav")
 * @param dataDir - Optional data directory override
 * @returns true if the file exists on disk
 */
export const soundExists = async (filename: string, dataDir?: string): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const filePath = join(effectiveDataDir, filename);
  return await exists(filePath);
}

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
export const downloadSoundByFilename = async (filename: string, fetchImpl?: FetchLike, baseUrl?: string, dataDir?: string): Promise<boolean> => {
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
      // Build sound list and find the matching entry
      const soundsToDownload = buildSoundsToDownload(effectiveBaseUrl);
      const sound = soundsToDownload.find(s => s.filename === filename);
      if (!sound) {
        console.error(`No sound entry found for filename: ${filename}`);
        resolveRef(false);
        return;
      }

      // If file exists already, resolve true
      const filePath = join(effectiveDataDir, filename);
      try {
        const fileExists = await exists(filePath);
        if (fileExists) {
          resolveRef(true);
          return;
        }
      } catch {
        // continue to attempt download
      }

      // Ensure data directory exists
      try {
        await mkdir(effectiveDataDir, { recursive: true });
      } catch (error) {
        console.error("Failed to create data directory:", error);
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
}

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
export const ensureSoundAvailable = async (filename: string, fetchImpl?: FetchLike, baseUrl?: string, dataDir?: string): Promise<boolean> => {
  return await downloadSoundByFilename(filename, fetchImpl, baseUrl, dataDir);
}

/**
 * Download all Warcraft II Alliance sounds
 *
 * @param fetchImpl - Optional fetch-like implementation used for downloads
 * @param baseUrl - Optional base URL to download from
 * @param dataDir - Optional local directory to store sounds
 */
export const downloadAllSounds = async (fetchImpl?: FetchLike, baseUrl?: string, dataDir?: string): Promise<void> => {
  const effectiveFetch = fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
  const effectiveBaseUrl = baseUrl ?? DEFAULT_BASE_URL;
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;

  console.log("Starting Warcraft II Alliance sounds download...");
  
  // Create data directory if it doesn't exist
  try {
    await mkdir(effectiveDataDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create data directory:", error);
    return;
  }

  const soundsToDownload = buildSoundsToDownload(effectiveBaseUrl);

  const results = await Promise.allSettled(
    soundsToDownload.map(sound => downloadSound(sound, effectiveFetch, effectiveDataDir))
  );

  const successful = results.filter(result => 
    result.status === 'fulfilled' && result.value === true
  ).length;
  
  const failed = results.length - successful;

  console.log(`\nDownload complete!`);
  console.log(`✓ Successful: ${successful}`);
  if (failed > 0) {
    console.log(`✗ Failed: ${failed}`);
  }
  console.log(`📂 Sounds saved to: ${effectiveDataDir}`);
}

/**
 * Get the list of all sound files that should be downloaded
 *
 * @returns list of filenames
 */
export const getSoundFileList = (): string[] => {
  return soundEntries.map(e => e.filename);
}

/**
 * Get the data directory path
 *
 * @returns Path to the sounds data directory
 */
export const getDataDirectory = (): string => {
  return process.env.SOUNDS_DATA_DIR ?? DEFAULT_DATA_DIR;
}
