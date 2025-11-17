import { describe, it, expect } from 'bun:test';
import { join } from 'path';
import { createTempDir, removeTempDir, withCwd } from '../test-utils';
import { getDefaultSoundsDir } from './index';

describe('plugin-config package name handling', () => {
  it('uses expected package name when package.json name does not match', async () => {
    const temp = createTempDir('pkgname-test-');
    try {
      // Write a package.json with a different name (simulating wrong package.json being read)
      const pkg = {
        name: '@scope/my_plugin$weird',
      };
      const path = join(temp, 'package.json');
      await Bun.write(path, JSON.stringify(pkg, null, 2));

      // Run getDefaultSoundsDir with CWD set to temp
      // This simulates the plugin running in a user's project directory
      await withCwd(temp, async () => {
        const dir = getDefaultSoundsDir();
        expect(typeof dir).toBe('string');

        // Since the package name doesn't match our expected name,
        // it should fall back to the hardcoded expected name
        const lowered = dir.replace(/\\/g, '/').toLowerCase();
        expect(lowered).toContain('opencode');
        expect(lowered).toContain('plugin');
        // Should use our expected package name, not the wrong one
        expect(lowered).toContain('@pantheon-ai/opencode-warcraft-notifications');
        // Should NOT contain the wrong package name
        expect(lowered).not.toContain('my_plugin');
      });
    } finally {
      removeTempDir(temp);
    }
  });
});
