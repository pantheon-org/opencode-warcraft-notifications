import os from 'os';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export type FetchImpl = (input: RequestInfo) => Promise<Response>;

/**
 * Create a fetch-like responder used in tests.
 * @param status - HTTP status code to return
 * @param body - Body bytes returned by `arrayBuffer()`
 * @returns A fetch implementation matching `FetchImpl`
 */
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

/**
 * Create a temporary directory for tests.
 * @param prefix - Optional directory name prefix
 * @returns Path to the created temporary directory
 */
export const createTempDir = (prefix = 'wc-sounds-') => mkdtempSync(join(os.tmpdir(), prefix));

/**
 * Remove a temporary directory created for tests.
 * Ignores errors.
 * @param dir - Path to remove
 */
export const removeTempDir = (dir: string) => {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    void e;
  }
};

/**
 * Silence console.log and console.error for the duration of a test.
 * @returns A restore function to re-enable console output
 */
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

/**
 * Replace the global `fetch` implementation for tests.
 * @param fetchImpl - Implementation to set as `globalThis.fetch`
 * @returns A restore function to restore the previous fetch implementation
 */
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
    else delete (process as unknown as { platform?: string }).platform;
  }
};

/**
 * Write a temporary file into a faction subdirectory under `baseDir`.
 * Creates the faction directory if necessary.
 * @param baseDir - Base directory to write into
 * @param faction - Faction subdirectory name ('alliance' | 'horde')
 * @param filename - Filename to create
 * @param contents - File contents to write
 * @returns Path to the written file
 */
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
