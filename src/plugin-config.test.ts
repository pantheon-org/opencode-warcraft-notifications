import { describe, it, expect } from 'bun:test';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import {
  getConfigDir,
  getDefaultSoundsDir,
  DEFAULT_DATA_DIR,
  DEFAULT_BASE_URL,
  loadPluginConfig,
  type WarcraftNotificationConfig,
} from './plugin-config';
import { createTempDir, removeTempDir } from './test-utils';

describe('Plugin configuration module', () => {
  it('should load configuration from plugin.json (direct file read)', async () => {
    const tempDir = createTempDir('opencode-plugin-test-');
    try {
      // Create a test plugin.json
      const pluginConfig = {
        '@pantheon-ai/opencode-warcraft-notifications': {
          soundsDir: '/custom/sounds/path',
        },
      };

      const configPath = join(tempDir, 'plugin.json');
      await writeFile(configPath, JSON.stringify(pluginConfig, null, 2));

      // Test that we can read the config file directly
      const configFile = Bun.file(configPath);
      const loadedConfig = await configFile.json();

      expect(loadedConfig['@pantheon-ai/opencode-warcraft-notifications']).toBeDefined();
      expect(loadedConfig['@pantheon-ai/opencode-warcraft-notifications'].soundsDir).toBe(
        '/custom/sounds/path',
      );
    } finally {
      removeTempDir(tempDir);
    }
  });

  it('should return proper default sounds directory', () => {
    const soundsDir = getDefaultSoundsDir();
    expect(typeof soundsDir).toBe('string');
    expect(soundsDir).toContain('opencode');
    expect(soundsDir).toContain('storage');
    expect(soundsDir).toContain('plugin');
    expect(soundsDir).toContain('sounds');
  });

  it('should export default constants', () => {
    expect(typeof DEFAULT_DATA_DIR).toBe('string');
    expect(typeof DEFAULT_BASE_URL).toBe('string');
    expect(DEFAULT_BASE_URL).toContain('http');
  });

  it('should load configuration from CWD/.opencode/plugin.json via loadPluginConfig', async () => {
    const cwdTemp = createTempDir('opencode-plugin-cwd-');
    try {
      await mkdir(join(cwdTemp, '.opencode'), { recursive: true });

      const pluginConfig = {
        '@pantheon-ai/opencode-warcraft-notifications': {
          soundsDir: '/cwd/sounds/path',
          faction: 'horde' as const,
        },
      };
      const configPath = join(cwdTemp, '.opencode', 'plugin.json');
      await writeFile(configPath, JSON.stringify(pluginConfig, null, 2));

      const origCwd = process.cwd();
      try {
        process.chdir(cwdTemp);
        const loaded = await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
        expect(loaded).toBeDefined();
        expect(loaded.soundsDir).toBe('/cwd/sounds/path');
        expect(loaded.faction).toBe('horde');
      } finally {
        process.chdir(origCwd);
      }
    } finally {
      removeTempDir(cwdTemp);
    }
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

it('getConfigDir handles win32 and XDG overrides', () => {
  const origPlatform = process.platform;
  const origXdg = process.env.XDG_CONFIG_HOME;
  const origAppData = process.env.APPDATA;

  try {
    // Simulate win32
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'win32' });
    const winDir = getConfigDir();
    expect(typeof winDir).toBe('string');
    // On windows we expect AppData or AppData\\Roaming
    expect(winDir.toLowerCase()).toContain('appdata');

    // Simulate linux-like with XDG_CONFIG_HOME
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'linux' });
    const xdgTemp = createTempDir('opencode-xdg-config-');
    try {
      process.env.XDG_CONFIG_HOME = xdgTemp;
      const xdgDir = getConfigDir();
      expect(xdgDir).toBe(xdgTemp);
    } finally {
      removeTempDir(xdgTemp);
    }
  } finally {
    // restore
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: origPlatform });
    if (origXdg === undefined) delete process.env.XDG_CONFIG_HOME;
    else process.env.XDG_CONFIG_HOME = origXdg;
    if (origAppData === undefined) delete process.env.APPDATA;
    else process.env.APPDATA = origAppData;
  }
});

it('loadPluginConfig handles invalid JSON gracefully', async () => {
  const cwdTemp = createTempDir('opencode-invalid-json-');
  try {
    await mkdir(join(cwdTemp, '.opencode'), { recursive: true });

    const configPath = join(cwdTemp, '.opencode', 'plugin.json');
    // Write invalid JSON
    await writeFile(configPath, '{ invalid: , }');

    const origCwd = process.cwd();
    try {
      process.chdir(cwdTemp);
      const loaded = await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
      // Invalid JSON should be handled and result in empty config
      expect(loaded).toEqual({});
    } finally {
      process.chdir(origCwd);
    }
  } finally {
    removeTempDir(cwdTemp);
  }
});

it('loadPluginConfig throws validation errors with proper context', async () => {
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
      await expect(async () => {
        await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
      }).toThrow();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      const message = (error as Error).message;
      expect(message).toContain('Configuration validation failed');
      expect(message).toContain('Configuration file:');
    } finally {
      process.chdir(origCwd);
    }
  } finally {
    removeTempDir(cwdTemp);
  }
});

it('getConfigDir returns darwin path when platform is darwin', () => {
  const origPlatform = process.platform;
  try {
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    const dir = getConfigDir();
    // Should be a path containing .config on darwin
    expect(typeof dir).toBe('string');
    expect(dir).toContain('.config');
  } finally {
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: origPlatform });
  }
});

it('getConfigDir falls back to ~/.config when XDG_CONFIG_HOME is unset', () => {
  const origPlatform = process.platform;
  const origXdg = process.env.XDG_CONFIG_HOME;
  try {
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'linux' });
    delete process.env.XDG_CONFIG_HOME;
    const dir = getConfigDir();
    expect(typeof dir).toBe('string');
    expect(dir).toContain('.config');
  } finally {
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: origPlatform });
    if (origXdg === undefined) delete process.env.XDG_CONFIG_HOME;
    else process.env.XDG_CONFIG_HOME = origXdg;
  }
});

it('getConfigDir falls back to AppData\\Roaming when APPDATA is unset on win32', () => {
  const origPlatform = process.platform;
  const origAppData = process.env.APPDATA;
  try {
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'win32' });
    delete process.env.APPDATA;
    const dir = getConfigDir();
    expect(typeof dir).toBe('string');
    expect(dir).toContain('AppData');
  } finally {
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: origPlatform });
    if (origAppData === undefined) delete process.env.APPDATA;
    else process.env.APPDATA = origAppData;
  }
});

it('loadPluginConfig reads from XDG_CONFIG_HOME when present', async () => {
  const cwdTemp = createTempDir('opencode-xdg-config-');
  try {
    await mkdir(join(cwdTemp, 'opencode'), { recursive: true });

    const pluginConfig = {
      '@pantheon-ai/opencode-warcraft-notifications': {
        soundsDir: '/xdg/sounds/path',
        faction: 'alliance' as const,
      },
    };

    const configPath = join(cwdTemp, 'opencode', 'plugin.json');
    await writeFile(configPath, JSON.stringify(pluginConfig, null, 2));

    const origXdg = process.env.XDG_CONFIG_HOME;
    const origPlatform = process.platform;
    try {
      // Ensure linux behavior so XDG_CONFIG_HOME is honored
      // @ts-ignore
      Object.defineProperty(process, 'platform', { value: 'linux' });
      process.env.XDG_CONFIG_HOME = cwdTemp;
      const loaded = await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
      expect(loaded).toBeDefined();
      expect(loaded.soundsDir).toBe('/xdg/sounds/path');
      expect(loaded.faction).toBe('alliance');
    } finally {
      // restore platform and env
      // @ts-ignore
      Object.defineProperty(process, 'platform', { value: origPlatform });
      if (origXdg === undefined) delete process.env.XDG_CONFIG_HOME;
      else process.env.XDG_CONFIG_HOME = origXdg;
    }
  } finally {
    removeTempDir(cwdTemp);
  }
});

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
