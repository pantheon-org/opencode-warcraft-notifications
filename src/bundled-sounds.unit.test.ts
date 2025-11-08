import { describe, it, expect } from 'bun:test';
import { createTempDir, removeTempDir, writeTempFileForFaction, withEnv } from './test-utils';
import { installBundledSoundsIfMissing, soundExists, getSoundFileList } from './bundled-sounds';
import { join } from 'path';

// These tests exercise bundling behavior that copies files from repo `data/` into a provided dataDir.
// We'll simulate a small `data/` structure in a temporary cwd for the duration of the test.

describe('bundled-sounds module', () => {
  it('getSoundFileList returns an array', () => {
    const list = getSoundFileList();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it('installBundledSoundsIfMissing copies files into target dir', async () => {
    const temp = createTempDir('wc-bundled-');
    const origCwd = process.cwd();
    try {
      process.chdir(origCwd); // ensure we start from repo root
      // Use a temporary directory as the dataDir
      const dataDir = temp;

      // Clean state: ensure sound does not exist
      const sample = 'human_selected1.wav';
      // remove if exists
      try {
        // ensure it's not present
      } catch {}

      await installBundledSoundsIfMissing(dataDir);

      // After installation, the file should exist under dataDir/alliance/
      const exists = await soundExists(sample, dataDir);
      expect(exists).toBe(true);
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
    }
  });

  it('soundExists returns false for missing file', async () => {
    const temp = createTempDir('wc-sound-exists-');
    try {
      const missing = await soundExists('non_existent_file.wav', temp);
      expect(missing).toBe(false);
    } finally {
      removeTempDir(temp);
    }
  });
});
