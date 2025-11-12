import { join, dirname } from 'path';
import { mkdir, exists, readdir, copyFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { createLogger } from './logger.js';
import { DEFAULT_DATA_DIR } from './plugin-config.js';
import { getSoundFileList as dataGetSoundFileList } from './sound-data/index.js';
import { determineSoundFaction } from './sounds.js';

const DEBUG = Boolean(process.env.DEBUG_OPENCODE);
const log = createLogger({ module: 'opencode-plugin-warcraft-notifications' });

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
    if (DEBUG) log.warn('Failed to create directory', { dir, error: err });
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
    if (DEBUG) log.info(`Installed bundled sound: ${filename}`, { targetPath });
  } catch (err) {
    if (DEBUG) log.error(`Failed to install bundled sound ${filename}`, { error: err });
  }
};

/**
 * Check whether a bundled sound file exists in the plugin data directory.
 * @param filename - Sound filename
 * @param dataDir - Optional override for the base data directory
 * @returns `true` when the file exists
 */
export const soundExists = async (filename: string, dataDir?: string): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const faction = determineSoundFaction(filename);
  const factionDir = join(effectiveDataDir, faction);
  const filePath = join(factionDir, filename);
  return await fileExists(filePath);
};

/**
 * Ensure the given bundled sound is available in the data directory.
 * Currently this simply checks if the file exists; future implementations may
 * attempt installation from bundled data when missing.
 * @param filename - Sound filename
 * @param dataDir - Optional override for the base data directory
 * @returns `true` when the sound is available
 */
export const ensureSoundAvailable = async (
  filename: string,
  dataDir?: string,
): Promise<boolean> => {
  return await soundExists(filename, dataDir);
};

const processBundledSubdir = async (
  bundledDataDir: string,
  subdir: string,
  effectiveDataDir: string,
) => {
  const subdirPath = join(bundledDataDir, subdir);
  let files: string[] = [];
  try {
    files = await readdir(subdirPath);
  } catch (err) {
    if (DEBUG) log.warn('Failed to read bundled subdir', { subdirPath, error: err });
    return;
  }

  for (const file of files) {
    if (!file.toLowerCase().endsWith('.wav')) continue;
    const source = join(subdirPath, file);
    const targetDir = join(effectiveDataDir, subdir);
    await copyIfMissing(source, targetDir, file);
  }
};

const processBundledRootFile = async (
  bundledDataDir: string,
  filename: string,
  effectiveDataDir: string,
) => {
  const source = join(bundledDataDir, filename);
  const faction = determineSoundFaction(filename);
  const targetDir = join(effectiveDataDir, faction);
  await copyIfMissing(source, targetDir, filename);
};

/**
 * Get the directory containing this module
 * @returns Directory path of the current module
 */
const getModuleDir = (): string => {
  try {
    const moduleUrl = import.meta.url;
    const modulePath = fileURLToPath(moduleUrl);
    return dirname(modulePath);
  } catch {
    return process.cwd();
  }
};

/**
 * Get the plugin root directory (parent of src/)
 * @returns Plugin root directory path
 */
const getPluginRootDir = (): string => {
  const moduleDir = getModuleDir();
  if (moduleDir.endsWith('src')) {
    return dirname(moduleDir);
  }
  return moduleDir;
};

/**
 * Find the bundled data directory, trying multiple locations
 * @returns Path to data/ directory or null if not found
 */
const findBundledDataDir = (): string | null => {
  // Strategy:
  // 1. Try CWD first (for tests and development)
  // 2. Fall back to plugin root (for production when running from OpenCode)

  const locations = [
    join(process.cwd(), 'data'), // CWD (tests/development)
    join(getPluginRootDir(), 'data'), // Plugin root (production)
  ];

  for (const dataPath of locations) {
    try {
      // Simple existence check - readdir will be done later
      return dataPath;
    } catch {
      continue;
    }
  }

  return null;
};

/**
 * Install bundled sounds from the repository `data/` directory into the
 * user's plugin data directory when missing. Non-.wav files are skipped and
 * existing files are not overwritten.
 * @param dataDir - Optional override for the base data directory
 */
export const installBundledSoundsIfMissing = async (dataDir?: string): Promise<void> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  // Try to find the bundled data directory
  const bundledDataDir = findBundledDataDir() ?? join(process.cwd(), 'data');

  let entries;
  try {
    entries = await readdir(bundledDataDir, { withFileTypes: true });
  } catch (err) {
    if (DEBUG)
      log.warn('No bundled sounds installed (data/ directory missing or unreadable)', {
        error: err,
      });
    return;
  }

  // Ensure base data directory exists
  if (!(await ensureDirExists(effectiveDataDir))) return;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await processBundledSubdir(bundledDataDir, entry.name, effectiveDataDir);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.wav')) {
      await processBundledRootFile(bundledDataDir, entry.name, effectiveDataDir);
    }
  }
};

/**
 * Return the list of known bundled sound filenames.
 * @returns Array of bundled sound filenames
 */
export const getSoundFileList = (): string[] => {
  return dataGetSoundFileList();
};
