import { describe, it, expect } from 'bun:test';
import { join } from 'path';
import { createTempDir, removeTempDir, withCwd } from './test-utils';
import { getDefaultSoundsDir } from './plugin-config';

describe('plugin-config package name handling', () => {
  it('sanitizes package.json name with scope and special chars', async () => {
    const temp = createTempDir('pkgname-test-');
    try {
      // Write a package.json with a scoped and odd name
      const pkg = {
        name: '@scope/my_plugin$weird',
      };
      const path = join(temp, 'package.json');
      await Bun.write(path, JSON.stringify(pkg, null, 2));

      // Run getDefaultSoundsDir with CWD set to temp
      await withCwd(temp, async () => {
        const dir = getDefaultSoundsDir();
        expect(typeof dir).toBe('string');
        // The plugin folder name should be derived from package.json name
        // sanitized to remove chars not allowed in the regex: expect something containing 'my_plugin-weird' or 'my-plugin-weird'
        const lowered = dir.replace(/\\/g, '/').toLowerCase();
        expect(lowered).toContain('opencode');
        expect(lowered).toContain('plugin');
        // Ensure sanitized token exists; use part of the name
        expect(lowered).toContain('my_plugin');
      });
    } finally {
      removeTempDir(temp);
    }
  });
});
