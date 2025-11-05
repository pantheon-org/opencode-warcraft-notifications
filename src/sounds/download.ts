import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdir, exists } from "fs/promises";

// Get the current directory (sounds directory)
const soundsDir = dirname(fileURLToPath(import.meta.url));
const dataDir = join(soundsDir, "data");
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

function buildSoundsToDownload(baseUrl: string): SoundFile[] {
  return soundEntries.map(e => ({ filename: e.filename, url: `${baseUrl}/${e.path}`, description: e.description }));
}

/**
 * Download a single sound file
 */
async function downloadSound(sound: SoundFile, fetchImpl: typeof fetch): Promise<boolean> {
  const filePath = join(dataDir, sound.filename);
  
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
 */
export async function soundExists(filename: string): Promise<boolean> {
  const filePath = join(dataDir, filename);
  return await exists(filePath);
}

/**
 * Download all Warcraft II Alliance sounds
 * Accepts optional fetch implementation and baseUrl for easier testing/config
 */
export async function downloadAllSounds(fetchImpl?: typeof fetch, baseUrl?: string): Promise<void> {
  const effectiveFetch = fetchImpl ?? (globalThis.fetch as typeof fetch);
  const effectiveBaseUrl = baseUrl ?? DEFAULT_BASE_URL;

  console.log("Starting Warcraft II Alliance sounds download...");
  
  // Create data directory if it doesn't exist
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create data directory:", error);
    return;
  }

  const soundsToDownload = buildSoundsToDownload(effectiveBaseUrl);

  const results = await Promise.allSettled(
    soundsToDownload.map(sound => downloadSound(sound, effectiveFetch))
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
  console.log(`📂 Sounds saved to: ${dataDir}`);
}

/**
 * Get the list of all sound files that should be downloaded
 */
export function getSoundFileList(): string[] {
  return soundEntries.map(e => e.filename);
}

/**
 * Get the data directory path
 */
export function getDataDirectory(): string {
  return dataDir;
}
