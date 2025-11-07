import { describe, it, expect, beforeEach } from 'bun:test';
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

  beforeEach(() => {
    // Create an isolated temp directory per test
    tempDir = mkdtempSync(join(os.tmpdir(), 'wc-sounds-'));
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

    // Cleanup
    try {
      rmSync(tempDir, { recursive: true });
    } catch (e) {
      void e;
    }
  });

  it('returns false for unknown filename', async () => {
    const ok = await ensureSoundAvailable(
      'nonexistent-file.wav',
      makeFetchResponder(200),
      undefined,
      tempDir,
    );
    expect(ok).toBe(false);

    try {
      rmSync(tempDir, { recursive: true });
    } catch (e) {
      void e;
    }
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

    try {
      rmSync(tempDir, { recursive: true });
    } catch (e) {
      void e;
    }
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

    try {
      rmSync(tempDir, { recursive: true });
    } catch (e) {
      void e;
    }
  });

  it('returns false when HTTP response is not ok', async () => {
    const filename = 'work_completed.wav'; // known filename
    const fetchImpl = makeFetchResponder(404);
    const ok = await downloadSoundByFilename(filename, fetchImpl, undefined, tempDir);
    expect(ok).toBe(false);
    try {
      rmSync(tempDir, { recursive: true });
    } catch (e) {
      void e;
    }
  });

  it('returns false when fetch throws', async () => {
    const filename = 'work_completed.wav';
    const throwingFetch: FetchLike = async () => {
      throw new Error('network down');
    };
    const ok = await downloadSoundByFilename(filename, throwingFetch, undefined, tempDir);
    expect(ok).toBe(false);
    try {
      rmSync(tempDir, { recursive: true });
    } catch (e) {
      void e;
    }
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
    try {
      rmSync(tempDir, { recursive: true });
    } catch (e) {
      void e;
    }
  });

  it('downloadAllSounds reports failures when fetch returns errors', async () => {
    // Use fetch that always returns 500 to force failures
    const badFetch = makeFetchResponder(500);
    // Should complete without throwing
    await downloadAllSounds(badFetch, undefined, tempDir);
    try {
      rmSync(tempDir, { recursive: true });
    } catch (e) {
      void e;
    }
  });

  it('downloadSound handles write failures gracefully', async () => {
    // Simulate a Response that returns an ArrayBuffer but will fail when Bun.write is called
    const fakeFetch: FetchLike = async () =>
      ({
        ok: true,
        status: 200,
        arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
      }) as Response;

    // Monkeypatch Bun.write to throw
    // @ts-ignore
    const origWrite = Bun.write;
    // @ts-ignore
    Bun.write = async () => {
      throw new Error('disk full');
    };

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

    // restore Bun.write
    // @ts-ignore
    Bun.write = origWrite;
  });
});
