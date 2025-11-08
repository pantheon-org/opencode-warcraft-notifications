import { describe, it, expect } from 'bun:test';
import { join } from 'path';
import { getDefaultSoundsDir } from './plugin-config.ts';

// Unit test: simulate Windows behavior by calling getDefaultSoundsDir()
// directly after mutating process.platform and APPDATA. Avoid relying on
// module-level DEFAULT_DATA_DIR which may have been evaluated earlier.

describe('plugin-config Windows behavior [unit]', () => {
  it('uses APPDATA when on win32 platform', () => {
    const originalPlatform = process.platform;
    const originalAppData = process.env.APPDATA;

    try {
      // Simulate Windows
      // @ts-ignore - allow assignment for testing
      process.platform = 'win32';
      process.env.APPDATA = join('C:', 'Users', 'TestUser', 'AppData', 'Roaming');

      const dir = getDefaultSoundsDir();
      expect(typeof dir).toBe('string');

      const normalized = dir.replace(/\\/g, '/').toLowerCase();
      expect(normalized).toContain('appdata');
      expect(normalized).toContain('roaming');
      expect(normalized).toContain('opencode/storage/plugin');
    } finally {
      // Restore environment
      // @ts-ignore
      process.platform = originalPlatform;
      process.env.APPDATA = originalAppData;
    }
  });
});
