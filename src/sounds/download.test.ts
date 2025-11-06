import { describe, it, expect, beforeEach } from "bun:test";
import { downloadSoundByFilename, ensureSoundAvailable, getSoundFileList } from "../download";
import { join } from "path";
import { unlink } from "fs/promises";
import { mkdtempSync, rmSync } from "fs";
import os from "os";

// Mock fetch implementation helper
function makeFetchResponder(status = 200, body = new Uint8Array([1,2,3])) {
  return async (url: string) => {
    return {
      ok: status >= 200 && status < 300,
      status,
      arrayBuffer: async () => body.buffer,
    } as any;
  };
}

describe("sounds/download - on-demand API", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(os.tmpdir(), "wc-sounds-"));
  });

  it("downloads a single missing file successfully", async () => {
    const list = getSoundFileList();
    const filename = list.find(f => f.endsWith("work_completed.wav")) as string;

    try { await unlink(join(tempDir, filename)); } catch {}

    const fetchImpl = makeFetchResponder(200, new Uint8Array([0,1,2,3]));

    const ok = await downloadSoundByFilename(filename, fetchImpl as any, process.env.SOUNDS_BASE_URL, tempDir);
    expect(ok).toBe(true);

    try { rmSync(tempDir, { recursive: true }); } catch {}
  });

  it("returns false for unknown filename", async () => {
    const ok = await ensureSoundAvailable("nonexistent-file.wav", makeFetchResponder(200) as any, undefined, tempDir);
    expect(ok).toBe(false);

    try { rmSync(tempDir, { recursive: true }); } catch {}
  });

  it("dedupes concurrent downloads for same filename", async () => {
    const list = getSoundFileList();
    const filename = list[0];

    let calls = 0;
    const fetchImpl = async (url: string) => {
      calls++;
      await new Promise(res => setTimeout(res, 10));
      return { ok: true, status: 200, arrayBuffer: async () => new Uint8Array([9,9,9]).buffer } as any;
    };

    const p1 = downloadSoundByFilename(filename, fetchImpl as any, process.env.SOUNDS_BASE_URL, tempDir);
    const p2 = downloadSoundByFilename(filename, fetchImpl as any, process.env.SOUNDS_BASE_URL, tempDir);

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(true);
    expect(r2).toBe(true);
    expect(calls).toBe(1);

    try { rmSync(tempDir, { recursive: true }); } catch {}
  });
});
