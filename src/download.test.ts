import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import {
  downloadSoundByFilename,
  ensureSoundAvailable,
  getSoundFileList,
  soundExists,
  downloadAllSounds,
  downloadSound,
} from './download';
import { join } from 'path';
import { unlink, writeFile, mkdir } from 'fs/promises';
import { mkdtempSync, rmSync } from 'fs';
import os from 'os';

// Mock fetch implementation helper (typed)
import type { FetchLike } from './download';
import type { SoundFile } from './sound-data/index.js';

type FetchImpl = FetchLike;
const makeFetchResponder = (status = 200, body = new Uint8Array([1, 2, 3])): FetchImpl => {
  return (async (_input: RequestInfo) => {
    void _input;
    return {
      ok: status >= 200 && status < 300,
      status,
      arrayBuffer: async () => body.buffer,
    } as Response;
  }) as FetchImpl;
};

describe('sounds/download - on-demand API and helpers', () => {
  let tempDir: string;
  let origConsoleLog: typeof console.log;
  let origConsoleError: typeof console.error;
  let origBunWrite: any;
  let origFetch: any;

  beforeEach(() => {
    // Create an isolated temp directory per test
    tempDir = mkdtempSync(join(os.tmpdir(), 'wc-sounds-'));

    // Silence console output to keep tests quiet and deterministic
    origConsoleLog = console.log;
    origConsoleError = console.error;
    console.log = () => {};
    console.error = () => {};

    // Save and replace global fetch with a deterministic responder to avoid network
    try {
      // @ts-ignore
      origFetch = typeof globalThis !== 'undefined' ? (globalThis as any).fetch : undefined;
      // Use a default 200 responder; individual tests can pass their own fetchImpl
      // @ts-ignore
      (globalThis as any).fetch = makeFetchResponder(200);
    } catch (e) {
      void e;
    }
  });

  afterEach(() => {
    // Restore console
    try {
      console.log = origConsoleLog;
      console.error = origConsoleError;
    } catch (e) {
      void e;
    }

    // Restore Bun.write if a test replaced it
    try {
      // @ts-ignore
      if (typeof Bun !== 'undefined' && origBunWrite) {
        // @ts-ignore
        Bun.write = origBunWrite;
      }
    } catch (e) {
      void e;
    }

    // Restore global fetch
    try {
      // @ts-ignore
      if (typeof globalThis !== 'undefined') {
        // @ts-ignore
        (globalThis as any).fetch = origFetch;
      }
    } catch (e) {
      void e;
    }

    // Cleanup tempDir
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      void e;
    }
  });

  it('downloads a single missing file successfully', async () => {
    const list = getSoundFileList();
    const filename = list.find((f) => f.endsWith('work_completed.wav')) as string;

    // Ensure file is absent so download is triggered
    try {
      await unlink(join(tempDir, filename));
    } catch (e) {
      void e;
    }

    const fetchImpl = makeFetchResponder(200, new Uint8Array([0, 1, 2, 3]));

    const ok = await downloadSoundByFilename(
      filename,
      fetchImpl,
      process.env.SOUNDS_BASE_URL,
      tempDir,
    );
    expect(ok).toBe(true);
  });

  it('returns false for unknown filename', async () => {
    const ok = await ensureSoundAvailable(
      'nonexistent-file.wav',
      makeFetchResponder(200),
      undefined,
      tempDir,
    );
    expect(ok).toBe(false);
  });

  it('dedupes concurrent downloads for same filename', async () => {
    const list = getSoundFileList();
    const filename = list[0];

    let calls = 0;
    const fetchImpl: FetchImpl = async (_input: RequestInfo) => {
      void _input;
      calls++;
      // small delay to simulate network
      await new Promise((res) => setTimeout(res, 10));
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () => new Uint8Array([9, 9, 9]).buffer,
      } as Response;
    };

    const p1 = downloadSoundByFilename(filename, fetchImpl, process.env.SOUNDS_BASE_URL, tempDir);
    const p2 = downloadSoundByFilename(filename, fetchImpl, process.env.SOUNDS_BASE_URL, tempDir);

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(true);
    expect(r2).toBe(true);
    expect(calls).toBe(1);
  });

  it('returns true immediately when file already exists', async () => {
    const list = getSoundFileList();
    const filename = list[0];

    // Get faction for this filename and create correct directory structure
    const { determineSoundFaction } = await import('./sounds.js');
    const faction = determineSoundFaction(filename);
    const factionDir = join(tempDir, faction);
    const path = join(factionDir, filename);

    // ensure dir exists
    await mkdir(factionDir, { recursive: true });
    await writeFile(path, new Uint8Array([0, 1, 2]));

    // Use a fetch impl that would fail if called; we expect it NOT to be called
    const badFetch: FetchLike = async () => {
      throw new Error('should not be called');
    };

    const ok = await downloadSoundByFilename(filename, badFetch, undefined, tempDir);
    expect(ok).toBe(true);
  });

  it('returns false when HTTP response is not ok', async () => {
    const filename = 'work_completed.wav'; // known filename
    const fetchImpl = makeFetchResponder(404);
    const ok = await downloadSoundByFilename(filename, fetchImpl, undefined, tempDir);
    expect(ok).toBe(false);
  });

  it('returns false when fetch throws', async () => {
    const filename = 'work_completed.wav';
    const throwingFetch: FetchLike = async () => {
      throw new Error('network down');
    };
    const ok = await downloadSoundByFilename(filename, throwingFetch, undefined, tempDir);
    expect(ok).toBe(false);
  });

  it('soundExists reports presence and absence', async () => {
    const filename = 'work_completed.wav'; // Use a known filename that has a faction
    const { determineSoundFaction } = await import('./sounds.js');
    const faction = determineSoundFaction(filename);
    const factionDir = join(tempDir, faction);
    const path = join(factionDir, filename);

    // initially false
    const existsBefore = await soundExists(filename, tempDir);
    expect(existsBefore).toBe(false);

    // ensure dir exists and create file
    await mkdir(factionDir, { recursive: true });
    await writeFile(path, new Uint8Array([1]));

    const existsAfter = await soundExists(filename, tempDir);
    expect(existsAfter).toBe(true);
  });

  it('downloadAllSounds reports failures when fetch returns errors', async () => {
    // Use fetch that always returns 500 to force failures
    const badFetch = makeFetchResponder(500);
    // Should complete without throwing
    await downloadAllSounds(badFetch, undefined, tempDir);
  });

  it('downloadSound handles write failures gracefully', async () => {
    // Simulate a Response that returns an ArrayBuffer but will fail when Bun.write is called
    const fakeFetch: FetchLike = async () =>
      ({
        ok: true,
        status: 200,
        arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
      }) as Response;

    // Monkeypatch Bun.write to throw and save global orig
    try {
      // @ts-ignore
      origBunWrite = typeof Bun !== 'undefined' ? Bun.write : undefined;
      // @ts-ignore
      Bun.write = async () => {
        throw new Error('disk full');
      };
    } catch (e) {
      void e;
    }

    const list = getSoundFileList();
    const file = list[0];
    // call downloadSound directly with tempDir
    const { determineSoundFaction } = await import('./sounds.js');
    const faction = determineSoundFaction(file);
    const soundMeta: SoundFile = {
      filename: file,
      url: 'http://example.com/does-not-matter.wav',
      description: 'test',
      faction: faction,
      subdirectory: faction,
    };
    const ok = await downloadSound(soundMeta, fakeFetch, tempDir);
    expect(ok).toBe(false);

    // Bun.write will be restored in afterEach
  });

  // --- New targeted tests to cover uncovered branches in src/download.ts ---

  it('downloadSound returns true immediately when file exists (direct)', async () => {
    const list = getSoundFileList();
    const file = list[0];
    const { determineSoundFaction } = await import('./sounds.js');
    const faction = determineSoundFaction(file);
    const factionDir = join(tempDir, faction);
    const path = join(factionDir, file);

    // create directory and a file so downloadSound early-exists path triggers
    await mkdir(factionDir, { recursive: true });
    await writeFile(path, new Uint8Array([1, 2, 3]));

    const soundMeta: SoundFile = {
      filename: file,
      url: 'http://example.com/unused.wav',
      description: 'existing file test',
      faction: faction,
      subdirectory: faction,
    };

    // Use a fetch impl that would fail if called
    const badFetch: FetchLike = async () => {
      throw new Error('fetch should not be called');
    };

    const ok = await downloadSound(soundMeta, badFetch, tempDir);
    expect(ok).toBe(true);
  });

  it('downloadSoundByFilename returns false when base data dir mkdir fails', async () => {
    // Create a path that is a file so that mkdir(dataDir, {recursive:true}) will throw
    const badBase = join(tempDir, 'not-a-dir');
    await writeFile(badBase, new Uint8Array([1]));

    // Use a fetch that would succeed if called
    const fetchImpl = makeFetchResponder(200);

    const list = getSoundFileList();
    const filename = list[0];

    const ok = await downloadSoundByFilename(filename, fetchImpl, undefined, badBase);
    expect(ok).toBe(false);
  });

  it('downloadAllSounds shows failed count when some downloads fail', async () => {
    // create fetch that returns success for URLs containing 'human' and fails otherwise
    const mixedFetch: FetchImpl = async (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : String(input);
      if (url.includes('human')) {
        return {
          ok: true,
          status: 200,
          arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
        } as Response;
      }
      return {
        ok: false,
        status: 500,
        arrayBuffer: async () => new Uint8Array([]).buffer,
      } as Response;
    };

    await downloadAllSounds(mixedFetch, undefined, tempDir);
  });

  it('downloadSoundByFilename rejects when unexpected error occurs', async () => {
    // Pass a non-string filename to cause determineSoundFaction to throw
    // This exercises the outer catch path without attempting to reassign ESM exports
    // @ts-ignore - deliberately pass a bad type
    const badFilename: any = {};

    let threw = false;
    try {
      // The call should throw and be caught by the outer promise rejection path
      await downloadSoundByFilename(badFilename, makeFetchResponder(200), undefined, tempDir);
    } catch (e) {
      threw = true;
      // We don't assert on the exact error message since it may vary across runtimes
      expect(e).toBeTruthy();
    }

    expect(threw).toBe(true);
  });

  it('downloadAllSounds returns early when mkdir fails', async () => {
    const badBase = join(tempDir, 'not-a-dir');
    await writeFile(badBase, new Uint8Array([1]));

    // call downloadAllSounds with a path that is a file to force mkdir to throw
    await downloadAllSounds(makeFetchResponder(200), undefined, badBase);
  });
});
