import { join } from 'path';
import { mkdir, exists, readdir, copyFile } from 'fs/promises';
import { DEFAULT_DATA_DIR } from './plugin-config.js';
import { getSoundFileList as dataGetSoundFileList } from './sound-data/index.js';
import { determineSoundFaction } from './sounds.js';

const DEBUG = Boolean(process.env.DEBUG_OPENCODE);

/**
 * Ensure a directory exists by creating it recursively.
 * @param dir - Path to the directory
 * @returns `true` when the directory exists or was created successfully, otherwise `false`
 */
const ensureDirExists = async (dir: string): Promise<boolean> => {
  try {
    await mkdir(dir, { recursive: true });
    return true;
  } catch (err) {
    if (DEBUG) console.warn('Failed to create directory:', dir, err);
    return false;
  }
};

const fileExists = async (path: string): Promise<boolean> => {
  try {
    return await exists(path);
  } catch {
    return false;
  }
};

const copyIfMissing = async (
  sourcePath: string,
  targetDir: string,
  filename: string,
): Promise<void> => {
  const targetPath = join(targetDir, filename);

  // Ensure target directory
  if (!(await ensureDirExists(targetDir))) return;

  if (await fileExists(targetPath)) return;

  try {
    await copyFile(sourcePath, targetPath);
    if (DEBUG) console.log(`Installed bundled sound: ${filename} -> ${targetPath}`);
  } catch (err) {
    if (DEBUG) console.error(`Failed to install bundled sound ${filename}:`, err);
  }
};

/**
 * Check if a sound file exists locally in faction-specific subdirectory
 */
export const soundExists = async (filename: string, dataDir?: string): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const faction = determineSoundFaction(filename);
  const factionDir = join(effectiveDataDir, faction);
  const filePath = join(factionDir, filename);
  try {
    return await exists(filePath);
  } catch {
    return false;
  }
};

/**
 * Presence check for a sound. This function does not perform network downloads.
 * It simply returns whether the named file exists in the configured data dir.
 */
export const ensureSoundAvailable = async (
  filename: string,
  dataDir?: string,
): Promise<boolean> => {
  return await soundExists(filename, dataDir);
};

/**
 * Copy bundled sounds from the repository `data/` directory into the user's
 * configured sounds directory. The repository may organize sounds in
 * subdirectories such as `data/alliance` and `data/horde`.
 *
 * This function will:
 * - read the repository `data/` directory
 * - copy any `.wav` files found in the root or in one-level subdirectories
 *   into the target data directory under the same subdirectory name (or
 *   under the faction name when files are at repo root)
 * - skip files that already exist in the destination
 */
export const installBundledSoundsIfMissing = async (dataDir?: string): Promise<void> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const bundledDataDir = join(process.cwd(), 'data');

  try {
    const entries = await readdir(bundledDataDir, { withFileTypes: true });

    // Ensure base data directory exists
    if (!(await ensureDirExists(effectiveDataDir))) return;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subdir = entry.name;
        const subdirPath = join(bundledDataDir, subdir);
        let files: string[] = [];
        try {
          files = await readdir(subdirPath);
        } catch (err) {
          if (DEBUG) console.warn('Failed to read bundled subdir:', subdirPath, err);
          continue;
        }

        for (const file of files) {
          if (!file.toLowerCase().endsWith('.wav')) continue;
          const targetDir = join(effectiveDataDir, subdir);
          const source = join(subdirPath, file);
          await copyIfMissing(source, targetDir, file);
        }
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.wav')) {
        // file at repo data/ root: determine faction and copy into faction dir
        const filename = entry.name;
        const faction = determineSoundFaction(filename);
        const targetDir = join(effectiveDataDir, faction);
        const source = join(bundledDataDir, filename);
        await copyIfMissing(source, targetDir, filename);
      }
    }
  } catch (err) {
    // If the bundled directory doesn't exist or is unreadable, silently return
    if (DEBUG) {
      console.warn('No bundled sounds installed (data/ directory missing or unreadable):', err);
    }
  }
};

export const getSoundFileList = (): string[] => {
  return dataGetSoundFileList();
};
