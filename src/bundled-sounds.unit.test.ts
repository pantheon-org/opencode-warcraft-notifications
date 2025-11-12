import { describe, it, expect } from 'bun:test';
import { createTempDir, removeTempDir, writeTempFileForFaction, withEnv } from './test-utils';
import {
  installBundledSoundsIfMissing,
  soundExists,
  getSoundFileList,
  ensureSoundAvailable,
} from './bundled-sounds';
import { join } from 'path';
import { mkdir, writeFile, chmod } from 'fs/promises';

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

  it('ensureSoundAvailable returns false when sound does not exist', async () => {
    const temp = createTempDir('wc-ensure-sound-');
    try {
      const available = await ensureSoundAvailable('non_existent.wav', temp);
      expect(available).toBe(false);
    } finally {
      removeTempDir(temp);
    }
  });

  it('ensureSoundAvailable returns true when sound exists', async () => {
    const temp = createTempDir('wc-ensure-sound-exists-');
    try {
      // Create the sound file
      await writeTempFileForFaction(temp, 'alliance', 'test_sound.wav', 'test data');
      const available = await ensureSoundAvailable('test_sound.wav', temp);
      expect(available).toBe(true);
    } finally {
      removeTempDir(temp);
    }
  });

  it('installBundledSoundsIfMissing handles missing bundled data directory', async () => {
    const temp = createTempDir('wc-no-bundled-');
    const origCwd = process.cwd();
    try {
      // Create a directory without data/ subdirectory
      const emptyDir = join(temp, 'empty');
      await mkdir(emptyDir, { recursive: true });
      process.chdir(emptyDir);

      const count = await installBundledSoundsIfMissing(temp);
      expect(count).toBe(0);
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
    }
  });

  it('installBundledSoundsIfMissing with DEBUG_OPENCODE logs warnings', async () => {
    await withEnv({ DEBUG_OPENCODE: 'true' }, async () => {
      const temp = createTempDir('wc-debug-');
      const origCwd = process.cwd();
      try {
        // Create a directory without data/ subdirectory
        const emptyDir = join(temp, 'empty');
        await mkdir(emptyDir, { recursive: true });
        process.chdir(emptyDir);

        const count = await installBundledSoundsIfMissing(temp);
        expect(count).toBe(0);
      } finally {
        process.chdir(origCwd);
        removeTempDir(temp);
      }
    });
  });

  it('installBundledSoundsIfMissing skips non-wav files in root', async () => {
    const temp = createTempDir('wc-non-wav-');
    const origCwd = process.cwd();

    try {
      // Create a fake bundled data directory with non-wav file
      const bundledData = join(temp, 'data');
      await mkdir(bundledData, { recursive: true });
      await writeFile(join(bundledData, 'readme.txt'), 'test');

      process.chdir(temp);
      const dataDir = join(temp, 'target');

      const count = await installBundledSoundsIfMissing(dataDir);
      // Should skip the non-wav file
      expect(count).toBe(0);
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
    }
  });

  it('installBundledSoundsIfMissing handles directory creation failure gracefully', async () => {
    const temp = createTempDir('wc-mkdir-fail-');
    const origCwd = process.cwd();

    try {
      // Create bundled data with a file
      const bundledData = join(temp, 'data');
      await mkdir(bundledData, { recursive: true });
      await writeFile(join(bundledData, 'test.wav'), 'test data');

      process.chdir(temp);

      // Try to install to a path that will fail
      // Use a read-only parent directory on Unix-like systems
      const readOnlyParent = join(temp, 'readonly');
      await mkdir(readOnlyParent, { recursive: true });

      if (process.platform !== 'win32') {
        // Make parent directory read-only
        await chmod(readOnlyParent, 0o444);
      }

      const dataDir = join(readOnlyParent, 'target');
      const count = await installBundledSoundsIfMissing(dataDir);

      // Should handle error and return 0
      expect(count).toBe(0);

      // Restore permissions for cleanup
      if (process.platform !== 'win32') {
        await chmod(readOnlyParent, 0o755);
      }
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
    }
  });

  it('installBundledSoundsIfMissing handles unreadable bundled subdirectory', async () => {
    const temp = createTempDir('wc-unreadable-subdir-');
    const origCwd = process.cwd();

    try {
      // Create bundled data with an unreadable subdirectory
      const bundledData = join(temp, 'data');
      const subdir = join(bundledData, 'alliance');
      await mkdir(subdir, { recursive: true });

      if (process.platform !== 'win32') {
        // Make subdirectory unreadable
        await chmod(subdir, 0o000);
      }

      process.chdir(temp);
      const dataDir = join(temp, 'target');

      const count = await installBundledSoundsIfMissing(dataDir);

      // Should handle the error gracefully
      expect(count).toBeGreaterThanOrEqual(0);

      // Restore permissions for cleanup
      if (process.platform !== 'win32') {
        await chmod(subdir, 0o755);
      }
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
    }
  });

  it('installBundledSoundsIfMissing skips non-wav files in subdirectories', async () => {
    const temp = createTempDir('wc-subdir-non-wav-');
    const origCwd = process.cwd();

    try {
      // Create bundled data with non-wav files in subdirectory
      const bundledData = join(temp, 'data');
      const subdir = join(bundledData, 'alliance');
      await mkdir(subdir, { recursive: true });
      await writeFile(join(subdir, 'readme.txt'), 'test');
      await writeFile(join(subdir, 'test.wav'), 'wav data');

      process.chdir(temp);
      const dataDir = join(temp, 'target');

      const count = await installBundledSoundsIfMissing(dataDir);

      // Should only count .wav files
      expect(count).toBe(1);
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
    }
  });

  it('installBundledSoundsIfMissing handles file copy errors', async () => {
    await withEnv({ DEBUG_OPENCODE: 'true' }, async () => {
      const temp = createTempDir('wc-copy-error-');
      const origCwd = process.cwd();

      try {
        // Create bundled data
        const bundledData = join(temp, 'data');
        await mkdir(bundledData, { recursive: true });
        await writeFile(join(bundledData, 'test.wav'), 'test data');

        process.chdir(temp);

        // Create target directory as read-only
        const dataDir = join(temp, 'target');
        await mkdir(dataDir, { recursive: true });

        if (process.platform !== 'win32') {
          await chmod(dataDir, 0o444);
        }

        const count = await installBundledSoundsIfMissing(dataDir);

        // Should handle copy errors gracefully
        expect(count).toBeGreaterThanOrEqual(0);

        // Restore permissions
        if (process.platform !== 'win32') {
          await chmod(dataDir, 0o755);
        }
      } finally {
        process.chdir(origCwd);
        removeTempDir(temp);
      }
    });
  });

  it('soundExists handles file access errors gracefully', async () => {
    const temp = createTempDir('wc-access-error-');

    try {
      // Test with invalid path that might throw
      const result = await soundExists('\0invalid\0path.wav', temp);
      expect(result).toBe(false);
    } finally {
      removeTempDir(temp);
    }
  });
});
