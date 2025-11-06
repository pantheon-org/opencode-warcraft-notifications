import { describe, it, expect, beforeEach } from "bun:test";
import { downloadSoundByFilename, soundExists, downloadAllSounds, getSoundFileList, downloadSound } from "./download";
import { join } from "path";
import { writeFile } from "fs/promises";
import { mkdtempSync, rmSync } from "fs";
import os from "os";

import type { FetchLike } from "./download";

const makeFetchResponder = (status = 200, body = new Uint8Array([1,2,3])): FetchLike => {
  return (async (_input: RequestInfo) => {
    void _input;
    return {
      ok: status >= 200 && status < 300,
      status,
      arrayBuffer: async () => body.buffer,
    } as Response;
  }) as FetchLike;
};

describe("download - coverage helpers", () => {
  let tempDir: string;
  beforeEach(() => {
    tempDir = mkdtempSync(join(os.tmpdir(), "wc-sounds-"));
  });

  it("returns true immediately when file already exists", async () => {
    const list = getSoundFileList();
    const filename = list[0];
    const path = join(tempDir, filename);
    // ensure dir exists
    await writeFile(path, new Uint8Array([0,1,2]));

    // Use a fetch impl that would fail if called; we expect it NOT to be called
    const badFetch: FetchLike = async () => { throw new Error("should not be called"); };

    const ok = await downloadSoundByFilename(filename, badFetch, undefined, tempDir);
    expect(ok).toBe(true);

    try { rmSync(tempDir, { recursive: true }); } catch (e) { void e; }
  });

  it("returns false when HTTP response is not ok", async () => {
    const filename = "work_completed.wav"; // known filename
    const fetchImpl = makeFetchResponder(404);
    const ok = await downloadSoundByFilename(filename, fetchImpl, undefined, tempDir);
    expect(ok).toBe(false);
    try { rmSync(tempDir, { recursive: true }); } catch (e) { void e; }
  });

  it("returns false when fetch throws", async () => {
    const filename = "work_completed.wav";
    const throwingFetch: FetchLike = async () => { throw new Error("network down"); };
    const ok = await downloadSoundByFilename(filename, throwingFetch, undefined, tempDir);
    expect(ok).toBe(false);
    try { rmSync(tempDir, { recursive: true }); } catch (e) { void e; }
  });

  it("soundExists reports presence and absence", async () => {
    const filename = "exists-check.wav";
    const path = join(tempDir, filename);
    // initially false
    let existsBefore = await soundExists(filename, tempDir);
    expect(existsBefore).toBe(false);
    await writeFile(path, new Uint8Array([1]));
    let existsAfter = await soundExists(filename, tempDir);
    expect(existsAfter).toBe(true);
    try { rmSync(tempDir, { recursive: true }); } catch (e) { void e; }
  });

  it("downloadAllSounds reports failures when fetch returns errors", async () => {
    // Use fetch that always returns 500 to force failures
    const badFetch = makeFetchResponder(500);
    // Should complete without throwing
    await downloadAllSounds(badFetch, undefined, tempDir);
    try { rmSync(tempDir, { recursive: true }); } catch (e) { void e; }
  });

  it("downloadSound handles write failures gracefully", async () => {
    // Simulate a Response that returns an ArrayBuffer but will fail when Bun.write is called
    const fakeFetch: FetchLike = async () => ({ ok: true, status: 200, arrayBuffer: async () => new Uint8Array([1,2,3]).buffer } as Response);

    // Monkeypatch Bun.write to throw
    // @ts-ignore
    const origWrite = Bun.write;
    // @ts-ignore
    Bun.write = async () => { throw new Error("disk full"); };

    const list = getSoundFileList();
    const file = list[0];
    // call downloadSound directly with tempDir
    const soundMeta = { filename: file, url: "http://example.com/does-not-matter.wav", description: "test" } as any;
    const ok = await downloadSound(soundMeta, fakeFetch, tempDir);
    expect(ok).toBe(false);

    // restore Bun.write
    // @ts-ignore
    Bun.write = origWrite;
  });
});
