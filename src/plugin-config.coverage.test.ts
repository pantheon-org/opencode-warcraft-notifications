import { describe, it, expect } from 'bun:test';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { loadPluginConfig } from './plugin-config';
import { createTempDir, removeTempDir } from './test-utils';

describe('Plugin configuration coverage tests', () => {
  it('loadPluginConfig throws validation errors with file path context', async () => {
    const cwdTemp = createTempDir('opencode-validation-error-');
    try {
      await mkdir(join(cwdTemp, '.opencode'), { recursive: true });

      const pluginConfig = {
        '@pantheon-ai/opencode-warcraft-notifications': {
          faction: 'invalid-faction',
          soundsDir: 123,
        },
      };
      const configPath = join(cwdTemp, '.opencode', 'plugin.json');
      await writeFile(configPath, JSON.stringify(pluginConfig, null, 2));

      const origCwd = process.cwd();
      try {
        process.chdir(cwdTemp);
        let errorThrown = false;
        try {
          await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
        } catch (error) {
          errorThrown = true;
          expect(error).toBeInstanceOf(Error);
          const message = (error as Error).message;
          expect(message).toContain('Configuration validation failed');
          expect(message).toContain('Configuration file:');
        }
        expect(errorThrown).toBe(true);
      } finally {
        process.chdir(origCwd);
      }
    } finally {
      removeTempDir(cwdTemp);
    }
  });

  it('loadPluginConfig logs warning in DEBUG mode for file errors', async () => {
    const cwdTemp = createTempDir('opencode-debug-error-');
    const origDebug = process.env.DEBUG_OPENCODE;

    try {
      process.env.DEBUG_OPENCODE = 'true';
      await mkdir(join(cwdTemp, '.opencode'), { recursive: true });

      // Write a file that exists but contains invalid validation config
      const pluginConfig = {
        '@pantheon-ai/opencode-warcraft-notifications': {
          faction: 'invalid-value',
        },
      };
      const configPath = join(cwdTemp, '.opencode', 'plugin.json');
      await writeFile(configPath, JSON.stringify(pluginConfig, null, 2));

      const origCwd = process.cwd();
      try {
        process.chdir(cwdTemp);
        let errorCaught = false;
        try {
          await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
        } catch {
          errorCaught = true;
        }
        expect(errorCaught).toBe(true);
      } finally {
        process.chdir(origCwd);
      }
    } finally {
      if (origDebug === undefined) {
        delete process.env.DEBUG_OPENCODE;
      } else {
        process.env.DEBUG_OPENCODE = origDebug;
      }
      removeTempDir(cwdTemp);
    }
  });
});
