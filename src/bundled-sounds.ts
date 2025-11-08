import { join } from 'path';
import { mkdir, exists, readdir, copyFile } from 'fs/promises';
import { DEFAULT_DATA_DIR } from './plugin-config.js';
import { getSoundFileList as dataGetSoundFileList } from './sound-data/index.js';
import { determineSoundFaction } from './sounds.js';

const DEBUG = Boolean(process.env.DEBUG_OPENCODE);

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

export const soundExists = async (filename: string, dataDir?: string): Promise<boolean> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const faction = determineSoundFaction(filename);
  const factionDir = join(effectiveDataDir, faction);
  const filePath = join(factionDir, filename);
  return await fileExists(filePath);
};

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
    if (DEBUG) console.warn('Failed to read bundled subdir:', subdirPath, err);
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

export const installBundledSoundsIfMissing = async (dataDir?: string): Promise<void> => {
  const effectiveDataDir = dataDir ?? DEFAULT_DATA_DIR;
  const bundledDataDir = join(process.cwd(), 'data');

  let entries;
  try {
    entries = await readdir(bundledDataDir, { withFileTypes: true });
  } catch (err) {
    if (DEBUG)
      console.warn('No bundled sounds installed (data/ directory missing or unreadable):', err);
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

export const getSoundFileList = (): string[] => {
  return dataGetSoundFileList();
};
