import { describe, it, expect, beforeEach } from "bun:test";
import { downloadSoundByFilename, ensureSoundAvailable, getSoundFileList } from "./download";
import { join } from "path";
import { unlink } from "fs/promises";
import { mkdtempSync, rmSync } from "fs";
import os from "os";

// Mock fetch implementation helper (typed)
import type { FetchLike } from "./download";

type FetchImpl = FetchLike;
const makeFetchResponder = (status = 200, body = new Uint8Array([1,2,3])): FetchImpl => {
  return (async (_input: RequestInfo) => {
    void _input;
    return {
      ok: status >= 200 && status < 300,
      status,
      arrayBuffer: async () => body.buffer,
    } as Response;
  }) as FetchImpl;
};

describe("sounds/download - on-demand API", () => {
  let tempDir: string;

  beforeEach(() => {
    // Create an isolated temp directory per test
    tempDir = mkdtempSync(join(os.tmpdir(), "wc-sounds-"));
  });

  it("downloads a single missing file successfully", async () => {
    const list = getSoundFileList();
    const filename = list.find(f => f.endsWith("work_completed.wav")) as string;

    // Ensure file is absent so download is triggered
    try {
      await unlink(join(tempDir, filename));
    } catch (e) {
      void e;
    }

    const fetchImpl = makeFetchResponder(200, new Uint8Array([0,1,2,3]));

    const ok = await downloadSoundByFilename(filename, fetchImpl, process.env.SOUNDS_BASE_URL, tempDir);
    expect(ok).toBe(true);

    // Cleanup
    try { rmSync(tempDir, { recursive: true }); } catch (e) { void e; }
  });

  it("returns false for unknown filename", async () => {
    const ok = await ensureSoundAvailable("nonexistent-file.wav", makeFetchResponder(200), undefined, tempDir);
    expect(ok).toBe(false);

    try { rmSync(tempDir, { recursive: true }); } catch (e) { void e; }
  });

  it("dedupes concurrent downloads for same filename", async () => {
    const list = getSoundFileList();
    const filename = list[0];

    let calls = 0;
    const fetchImpl: FetchImpl = async (_input: RequestInfo) => {
      void _input;
      calls++;
      // small delay to simulate network
      await new Promise(res => setTimeout(res, 10));
      return { ok: true, status: 200, arrayBuffer: async () => new Uint8Array([9,9,9]).buffer } as Response;
    };

    const p1 = downloadSoundByFilename(filename, fetchImpl, process.env.SOUNDS_BASE_URL, tempDir);
    const p2 = downloadSoundByFilename(filename, fetchImpl, process.env.SOUNDS_BASE_URL, tempDir);

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(true);
    expect(r2).toBe(true);
    expect(calls).toBe(1);

    try { rmSync(tempDir, { recursive: true }); } catch (e) { void e; }
  });
});
