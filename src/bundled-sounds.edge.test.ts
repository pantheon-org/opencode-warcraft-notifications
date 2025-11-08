import { describe, it, expect } from 'bun:test';
import { createTempDir, removeTempDir, withCwd } from './test-utils';
import { join } from 'path';
import { installBundledSoundsIfMissing, soundExists } from './bundled-sounds';
import { writeFileSync, mkdirSync } from 'fs';

describe('bundled-sounds edge cases', () => {
  it('does not overwrite existing files when installing', async () => {
    const temp = createTempDir('wc-bundled-edge-');
    const origCwd = process.cwd();
    try {
      // Provide a dataDir with an existing file
      const sample = 'human_selected1.wav';
      const factionDir = join(temp, 'alliance');
      mkdirSync(factionDir, { recursive: true });
      const targetPath = join(factionDir, sample);
      writeFileSync(targetPath, 'original');

      // Install bundled sounds into the same dataDir
      await installBundledSoundsIfMissing(temp);

      // Ensure the original file was not overwritten (content check)
      const content = Bun.file(targetPath).text();
      const txt = await content;
      expect(txt).toBe('original');
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
    }
  });

  it('skips non-.wav files in data/ when installing', async () => {
    const temp = createTempDir('wc-bundled-edge2-');
    const origCwd = process.cwd();
    try {
      // We'll create a fake data folder in repo temp cwd containing non-wav file and a wav
      const fakeRepo = createTempDir('wc-fakerepo-');
      try {
        // Ensure repo data dir exists
        const dataDir = join(fakeRepo, 'data');
        mkdirSync(join(dataDir, 'alliance'), { recursive: true });
        // Create a .txt and .wav in root and subdir
        writeFileSync(join(dataDir, 'ignore_me.txt'), 'nope');
        writeFileSync(join(dataDir, 'alliance', 'fake_wav.wav'), 'wavdata');

        // Run installer with cwd pointing to fake repo
        await withCwd(fakeRepo, async () => {
          await installBundledSoundsIfMissing(temp);
        });

        // .txt file should not be copied
        const txtExists = await soundExists('ignore_me.txt', temp);
        expect(txtExists).toBe(false);

        // wav should be copied
        const wavExists = await soundExists('fake_wav.wav', temp);
        expect(wavExists).toBe(true);
      } finally {
        removeTempDir(fakeRepo);
      }
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
    }
  });

  it('handles missing repo data/ directory gracefully', async () => {
    // Create a temp dir and set CWD to another temp without a data/ folder
    const temp = createTempDir('wc-bundled-edge3-');
    const fakeRepo = createTempDir('wc-fakerepo2-');
    const origCwd = process.cwd();
    try {
      await withCwd(fakeRepo, async () => {
        // Ensure no data/ exists
        // Should not throw
        await installBundledSoundsIfMissing(temp);
      });
    } finally {
      process.chdir(origCwd);
      removeTempDir(temp);
      removeTempDir(fakeRepo);
    }
  });
});
