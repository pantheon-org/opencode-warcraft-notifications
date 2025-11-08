import { join } from 'path';
import { mkdir, exists, readdir, copyFile } from 'fs/promises';
import { DEFAULT_DATA_DIR } from './plugin-config.js';
import { getSoundFileList as dataGetSoundFileList } from './sound-data/index.js';
import { determineSoundFaction } from './sounds.js';

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
    try {
      await mkdir(effectiveDataDir, { recursive: true });
    } catch (err) {
      // If we cannot create the base dir, bail out silently
      if (process.env.DEBUG_OPENCODE) console.warn('Failed to create data dir:', err);
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subdir = entry.name;
        const subdirPath = join(bundledDataDir, subdir);
        let files: string[] = [];
        try {
          files = await readdir(subdirPath);
        } catch (err) {
          if (process.env.DEBUG_OPENCODE)
            console.warn('Failed to read bundled subdir:', subdirPath, err);
          continue;
        }

        for (const file of files) {
          if (!file.toLowerCase().endsWith('.wav')) continue;
          const targetDir = join(effectiveDataDir, subdir);
          const targetPath = join(targetDir, file);
          try {
            // Ensure target directory exists before checking/copying
            try {
              await mkdir(targetDir, { recursive: true });
            } catch (err) {
              if (process.env.DEBUG_OPENCODE)
                console.warn('Failed to create target directory:', targetDir, err);
              // If unable to create the directory, skip this file
              continue;
            }

            if (await exists(targetPath)) continue;
          } catch {
            // proceed to copy (best-effort)
          }
          try {
            const source = join(subdirPath, file);
            await copyFile(source, targetPath);
            if (process.env.DEBUG_OPENCODE)
              console.log(`Installed bundled sound: ${file} -> ${targetPath}`);
          } catch (err) {
            if (process.env.DEBUG_OPENCODE)
              console.error(`Failed to install bundled sound ${file}:`, err);
          }
        }
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.wav')) {
        // file at repo data/ root: determine faction and copy into faction dir
        const filename = entry.name;
        const faction = determineSoundFaction(filename);
        const targetDir = join(effectiveDataDir, faction);
        const targetPath = join(targetDir, filename);
        try {
          // Ensure target directory exists before checking/copying
          try {
            await mkdir(targetDir, { recursive: true });
          } catch (err) {
            if (process.env.DEBUG_OPENCODE)
              console.warn('Failed to create target directory:', targetDir, err);
            // If unable to create the directory, skip this file
            continue;
          }

          if (await exists(targetPath)) continue;
        } catch {
          // proceed to copy (best-effort)
        }
        try {
          const source = join(bundledDataDir, filename);
          await copyFile(source, targetPath);
          if (process.env.DEBUG_OPENCODE)
            console.log(`Installed bundled sound: ${filename} -> ${targetPath}`);
        } catch (err) {
          if (process.env.DEBUG_OPENCODE)
            console.error(`Failed to install bundled sound ${filename}:`, err);
        }
      }
    }
  } catch (err) {
    // If the bundled directory doesn't exist or is unreadable, silently return
    if (process.env.DEBUG_OPENCODE) {
      console.warn('No bundled sounds installed (data/ directory missing or unreadable):', err);
    }
  }
};

export const getSoundFileList = (): string[] => {
  return dataGetSoundFileList();
};
