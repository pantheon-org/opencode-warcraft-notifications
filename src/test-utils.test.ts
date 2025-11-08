import { describe, it, expect } from 'bun:test';
import {
  makeFetchResponder,
  createTempDir,
  removeTempDir,
  setGlobalFetch,
  withEnv,
  withCwd,
  withPlatform,
  writeTempFileForFaction,
  silenceConsole,
} from './test-utils';
import { join } from 'path';

describe('test-utils helpers', () => {
  it('makeFetchResponder returns expected response', async () => {
    const fetch = makeFetchResponder(200, new Uint8Array([4, 5, 6]));
    const res = await fetch(new Request('http://example.test'));
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    const buf = await res.arrayBuffer();
    expect(new Uint8Array(buf)[0]).toBe(4);
  });

  it('setGlobalFetch restores original fetch', async () => {
    const orig = typeof globalThis !== 'undefined' ? (globalThis as any).fetch : undefined;
    const restore = setGlobalFetch(makeFetchResponder(201));
    try {
      const res = await (globalThis as any).fetch('http://x');
      expect(res.status).toBe(201);
    } finally {
      restore();
    }
    expect((globalThis as any).fetch === orig).toBe(true);
  });

  it('withEnv sets and restores environment variables', async () => {
    const key = 'OPENCODE_TEST_VAR';
    delete process.env[key];
    await withEnv({ [key]: 'v1' }, async () => {
      expect(process.env[key]).toBe('v1');
    });
    expect(process.env[key]).toBeUndefined();
  });

  it('withCwd restores cwd on success and error', async () => {
    const temp = createTempDir('wc-cwd-');
    const orig = process.cwd();
    try {
      await withCwd(temp, async () => {
        expect(process.cwd()).toBe(temp);
      });
      expect(process.cwd()).toBe(orig);

      // Throw inside and ensure restore
      try {
        await withCwd(temp, async () => {
          throw new Error('boom');
        });
      } catch (e) {
        // expected
      }
      expect(process.cwd()).toBe(orig);
    } finally {
      removeTempDir(temp);
    }
  });

  it('withPlatform overrides and restores platform', async () => {
    const orig = Object.getOwnPropertyDescriptor(process, 'platform');
    await withPlatform('linux', async () => {
      expect(process.platform).toBe('linux');
    });
    const finalDesc = Object.getOwnPropertyDescriptor(process, 'platform');
    // descriptor should be restored (either equal or undefined)
    if (orig) expect(finalDesc?.configurable).toBe(orig.configurable);
  });

  it('writeTempFileForFaction writes and returns path', () => {
    const temp = createTempDir('wc-write-');
    try {
      const p = writeTempFileForFaction(temp, 'alliance', 'x.wav', 'abc');
      expect(p.includes('alliance')).toBe(true);
    } finally {
      removeTempDir(temp);
    }
  });

  it('silenceConsole returns restore function', () => {
    const restore = silenceConsole();
    try {
      console.log('this should be silent');
      console.error('also silent');
    } finally {
      restore();
    }
  });
});
