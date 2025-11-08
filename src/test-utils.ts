import os from 'os';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
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

export const setGlobalFetch = (fetchImpl: FetchImpl) => {
  const orig =
    typeof globalThis !== 'undefined'
      ? (globalThis as unknown as { fetch?: FetchImpl }).fetch
      : undefined;
  if (typeof globalThis !== 'undefined')
    (globalThis as unknown as { fetch?: FetchImpl }).fetch = fetchImpl;
  return () => {
    if (typeof globalThis !== 'undefined')
      (globalThis as unknown as { fetch?: FetchImpl }).fetch = orig;
  };
};

/**
 * Temporarily set environment variables for the duration of `fn`.
 * Restores previous values afterwards. Supports async `fn`.
 */
export const withEnv = async <T = unknown>(
  vars: Record<string, string | undefined>,
  fn: () => Promise<T> | T,
): Promise<T> => {
  const keys = Object.keys(vars);
  const original: Record<string, string | undefined> = {};
  for (const k of keys) original[k] = process.env[k];
  try {
    for (const k of keys) {
      const v = vars[k];
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    return await fn();
  } finally {
    for (const k of keys) {
      const v = original[k];
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
};

/**
 * Temporarily change working directory for the duration of `fn`.
 * Restores previous cwd afterwards. Supports async `fn`.
 */
export const withCwd = async <T = unknown>(dir: string, fn: () => Promise<T> | T): Promise<T> => {
  const orig = process.cwd();
  process.chdir(dir);
  try {
    return await fn();
  } finally {
    process.chdir(orig);
  }
};

/**
 * Temporarily override `process.platform` for the duration of `fn`.
 * Restores original descriptor afterwards. Supports async `fn`.
 */
export const withPlatform = async <T = unknown>(
  platform: string,
  fn: () => Promise<T> | T,
): Promise<T> => {
  const desc = Object.getOwnPropertyDescriptor(process, 'platform');
  Object.defineProperty(process, 'platform', { value: platform, configurable: true });
  try {
    return await fn();
  } finally {
    if (desc) Object.defineProperty(process, 'platform', desc);
    else delete (process as any).platform;
  }
};

export const writeTempFileForFaction = (
  baseDir: string,
  faction: string,
  filename: string,
  contents = 'x',
) => {
  const dir = join(baseDir, faction);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, filename);
  writeFileSync(path, contents);
  return path;
};
