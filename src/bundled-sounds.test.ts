import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import {
  ensureSoundAvailable,
  getSoundFileList,
  soundExists,
  installBundledSoundsIfMissing,
} from './bundled-sounds';
import { join } from 'path';
import { unlink, writeFile, mkdir } from 'fs/promises';

import { createTempDir, removeTempDir, silenceConsole } from './test-utils';

// Integration tests: installer and filesystem behavior
describe('sounds/bundled-sounds [integration] - installer and filesystem behavior', () => {
  let tempDir: string;
  let restoreConsole: (() => void) | undefined;

  beforeEach(() => {
    tempDir = createTempDir();
    restoreConsole = silenceConsole();
  });

  afterEach(() => {
    try {
      if (restoreConsole) restoreConsole();
    } catch (e) {
      void e;
    }

    try {
      removeTempDir(tempDir);
    } catch (e) {
      void e;
    }
  });

  it('installs bundled sounds into a new data dir', async () => {
    const list = getSoundFileList();
    const filename = list.find((f) => f.endsWith('work_completed.wav')) as string;

    // Ensure file is absent
    try {
      await unlink(join(tempDir, filename));
    } catch (e) {
      void e;
    }

    // Install bundled sounds
    await installBundledSoundsIfMissing(tempDir);

    // The named file should now be present
    const ok = await ensureSoundAvailable(filename, tempDir);
    expect(ok).toBe(true);
  });

  it('returns false for unknown filename', async () => {
    const ok = await ensureSoundAvailable('nonexistent-file.wav', tempDir);
    expect(ok).toBe(false);
  });

  it('installBundledSoundsIfMissing is idempotent and safe to call concurrently', async () => {
    // Call installer twice concurrently and ensure it completes and files exist
    await Promise.all([
      installBundledSoundsIfMissing(tempDir),
      installBundledSoundsIfMissing(tempDir),
    ]);

    const list = getSoundFileList();
    // pick a few files and assert presence
    for (const f of list.slice(0, 3)) {
      const present = await ensureSoundAvailable(f, tempDir);
      expect(present).toBe(true);
    }
  });

  it('ensureSoundAvailable returns true immediately when file already exists', async () => {
    const list = getSoundFileList();
    const filename = list[0];

    const { determineSoundFaction } = await import('./sounds.js');
    const faction = determineSoundFaction(filename);
    const factionDir = join(tempDir, faction);
    const path = join(factionDir, filename);

    // create directory and a file so presence check triggers
    await mkdir(factionDir, { recursive: true });
    await writeFile(path, new Uint8Array([1, 2, 3]));

    const ok = await ensureSoundAvailable(filename, tempDir);
    expect(ok).toBe(true);
  });

  it('soundExists reports presence and absence', async () => {
    const filename = 'work_completed.wav';
    const { determineSoundFaction } = await import('./sounds.js');
    const faction = determineSoundFaction(filename);
    const factionDir = join(tempDir, faction);
    const path = join(factionDir, filename);

    const existsBefore = await soundExists(filename, tempDir);
    expect(existsBefore).toBe(false);

    await mkdir(factionDir, { recursive: true });
    await writeFile(path, new Uint8Array([1]));

    const existsAfter = await soundExists(filename, tempDir);
    expect(existsAfter).toBe(true);
  });

  it('installBundledSoundsIfMissing does not create files when base path is a file', async () => {
    // Create a path that is a file so that mkdir(effectiveDataDir, {recursive:true}) will throw
    const badBase = join(tempDir, 'not-a-dir');
    await writeFile(badBase, new Uint8Array([1]));

    // Call installer with the bad base; it should not throw but should not create expected files
    await installBundledSoundsIfMissing(badBase);

    const list = getSoundFileList();
    const filename = list[0];
    const present = await ensureSoundAvailable(filename, badBase);
    expect(present).toBe(false);
  });

  it('ensureSoundAvailable throws when passed an invalid filename type', async () => {
    // pass a non-string to exercise runtime type handling
    // @ts-ignore
    const badFilename: any = {};
    let threw = false;
    try {
      await ensureSoundAvailable(badFilename, tempDir);
    } catch (e) {
      threw = true;
      expect(e).toBeTruthy();
    }
    expect(threw).toBe(true);
  });

  it('installBundledSoundsIfMissing returns early when mkdir for target files fails', async () => {
    const badBase = join(tempDir, 'not-a-dir');
    await writeFile(badBase, new Uint8Array([1]));

    // call installer with a path that's a file to force internal mkdir to fail
    await installBundledSoundsIfMissing(badBase);
  });
});
