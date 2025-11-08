import os from 'os';
import { mkdtempSync, rmSync } from 'fs';
import { join } from 'path';

export type FetchImpl = (input: RequestInfo) => Promise<Response>;

export const makeFetchResponder = (status = 200, body = new Uint8Array([1, 2, 3])): FetchImpl => {
  return (async (_input: RequestInfo) => {
    void _input;
    return {
      ok: status >= 200 && status < 300,
      status,
      arrayBuffer: async () => body.buffer,
    } as unknown as Response;
  }) as FetchImpl;
};

export const createTempDir = (prefix = 'wc-sounds-') => mkdtempSync(join(os.tmpdir(), prefix));

export const removeTempDir = (dir: string) => {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    void e;
  }
};

export const silenceConsole = () => {
  const origLog = console.log;
  const origError = console.error;
  console.log = () => {};
  console.error = () => {};
  return () => {
    console.log = origLog;
    console.error = origError;
  };
};

export const setGlobalFetch = (fetchImpl: any) => {
  const orig = typeof globalThis !== 'undefined' ? (globalThis as any).fetch : undefined;
  if (typeof globalThis !== 'undefined') (globalThis as any).fetch = fetchImpl;
  return () => {
    if (typeof globalThis !== 'undefined') (globalThis as any).fetch = orig;
  };
};
