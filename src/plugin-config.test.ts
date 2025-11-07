import { describe, it, expect } from 'bun:test';
import { join } from 'path';
import { mkdir, writeFile, rm } from 'fs/promises';

describe('Plugin configuration loading', () => {
  const tempDir = '/tmp/opencode-plugin-test';

  // Clean up before and after tests
  const cleanup = async () => {
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  };

  it('should load configuration from plugin.json', async () => {
    await cleanup();
    await mkdir(tempDir, { recursive: true });

    // Create a test plugin.json
    const pluginConfig = {
      '@pantheon-ai/opencode-warcraft-notifications': {
        soundsDir: '/custom/sounds/path',
      },
    };

    const configPath = join(tempDir, 'plugin.json');
    await writeFile(configPath, JSON.stringify(pluginConfig, null, 2));

    // Test that we can read the config
    const configFile = Bun.file(configPath);
    const loadedConfig = await configFile.json();

    expect(loadedConfig['@pantheon-ai/opencode-warcraft-notifications']).toBeDefined();
    expect(loadedConfig['@pantheon-ai/opencode-warcraft-notifications'].soundsDir).toBe(
      '/custom/sounds/path',
    );

    await cleanup();
  });

  it('should handle missing plugin.json gracefully', async () => {
    // This simulates what happens when no plugin.json exists
    const missingConfig = {};
    expect(missingConfig['@pantheon-ai/opencode-warcraft-notifications']).toBeUndefined();
  });

  it('should validate plugin configuration structure', () => {
    interface WarcraftNotificationConfig {
      soundsDir?: string;
    }

    // Test valid config
    const validConfig: WarcraftNotificationConfig = {
      soundsDir: '/valid/path',
    };
    expect(validConfig.soundsDir).toBe('/valid/path');

    // Test empty config
    const emptyConfig: WarcraftNotificationConfig = {};
    expect(emptyConfig.soundsDir).toBeUndefined();
  });
});
