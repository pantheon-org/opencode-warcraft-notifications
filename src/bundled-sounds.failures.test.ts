import { describe, it, expect } from 'bun:test';
import { createTempDir, removeTempDir, withCwd } from './test-utils';
import { installBundledSoundsIfMissing, soundExists } from './bundled-sounds';
import { join } from 'path';
import { writeFileSync, mkdirSync as fsMkdirSync } from 'fs';

describe('bundled-sounds failure and edge cases', () => {
  it('does not throw when repo data/ is missing', async () => {
    const temp = createTempDir('wc-nodata-');
    try {
      await withCwd(temp, async () => {
        // No data/ directory in this cwd; should be tolerated and not throw
        await installBundledSoundsIfMissing(temp);
      });
    } finally {
      removeTempDir(temp);
    }
  });

  it('copies only .wav files and tolerates copy failures for bad entries', async () => {
    const repoTemp = createTempDir('wc-repo-');
    const targetTemp = createTempDir('wc-target-');
    try {
      const dataDir = join(repoTemp, 'data');
      const allianceDir = join(dataDir, 'alliance');
      fsMkdirSync(allianceDir, { recursive: true });

      // Good .wav file
      writeFileSync(join(allianceDir, 'good.wav'), 'x');
      // Non-wav file which should be ignored
      writeFileSync(join(allianceDir, 'readme.txt'), 'txt');
      // Create a directory named like a .wav file to force copyFile to fail
      fsMkdirSync(join(allianceDir, 'bad.wav'), { recursive: true });

      await withCwd(repoTemp, async () => {
        await installBundledSoundsIfMissing(targetTemp);
      });

      const existsGood = await soundExists('good.wav', targetTemp);
      expect(existsGood).toBe(true);

      const existsReadme = await soundExists('readme.txt', targetTemp);
      expect(existsReadme).toBe(false);

      const existsBad = await soundExists('bad.wav', targetTemp);
      expect(existsBad).toBe(false);
    } finally {
      removeTempDir(repoTemp);
      removeTempDir(targetTemp);
    }
  });
});
