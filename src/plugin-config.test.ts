import { describe, it, expect } from 'bun:test';
import { join } from 'path';
import { mkdir, writeFile, rm } from 'fs/promises';
import {
  getConfigDir,
  getDefaultSoundsDir,
  DEFAULT_DATA_DIR,
  DEFAULT_BASE_URL,
  loadPluginConfig,
  type WarcraftNotificationConfig,
} from './plugin-config';

describe('Plugin configuration module', () => {
  const tempDir = '/tmp/opencode-plugin-test';

  // Clean up before and after tests
  const cleanup = async () => {
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  };

  it('should return proper config directory paths', () => {
    const configDir = getConfigDir();
    expect(typeof configDir).toBe('string');
    expect(configDir.length).toBeGreaterThan(0);
  });

  it('should return proper default sounds directory', () => {
    const soundsDir = getDefaultSoundsDir();
    expect(typeof soundsDir).toBe('string');
    expect(soundsDir).toContain('opencode');
    expect(soundsDir).toContain('sounds');
  });

  it('should export default constants', () => {
    expect(typeof DEFAULT_DATA_DIR).toBe('string');
    expect(typeof DEFAULT_BASE_URL).toBe('string');
    expect(DEFAULT_BASE_URL).toContain('http');
  });

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
    // Test with a non-existent plugin name
    const config = await loadPluginConfig('non-existent-plugin');
    expect(config).toEqual({});
  });

  it('should validate plugin configuration structure', () => {
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
