import { join } from 'path';
import { exists } from 'fs/promises';
import { homedir } from 'os';

/**
 * Faction type for Warcraft II sounds
 */
export type Faction = 'alliance' | 'horde' | 'both';

/**
 * Configuration interface for the warcraft notifications plugin
 */
export interface WarcraftNotificationConfig {
  /** Directory where sound files should be stored and cached */
  soundsDir?: string;
  /** Which faction sounds to use: 'alliance', 'horde', or 'both' (default: 'both') */
  faction?: Faction;
}

/**
 * Plugin configuration file structure
 */
interface PluginConfig {
  [pluginName: string]: unknown;
}

/**
 * Get the appropriate config directory based on the operating system
 * @returns The config directory path
 */
export const getConfigDir = (): string => {
  const home = homedir();

  switch (process.platform) {
    case 'darwin':
      return join(home, '.config');
    case 'win32':
      return process.env.APPDATA ?? join(home, 'AppData', 'Roaming');
    default: // Linux and other Unix-like systems
      return process.env.XDG_CONFIG_HOME ?? join(home, '.config');
  }
};

/**
 * Get the default sounds directory location
 * @returns Default sounds directory path
 */
export const getDefaultSoundsDir = (): string => {
  return join(getConfigDir(), 'opencode', 'sounds');
};

/**
 * Default data directory for sound files
 * Can be overridden by SOUNDS_DATA_DIR environment variable
 */
export const DEFAULT_DATA_DIR = process.env.SOUNDS_DATA_DIR ?? getDefaultSoundsDir();

/**
 * Default base URL for downloading sound files
 * Can be overridden by SOUNDS_BASE_URL environment variable
 */
export const DEFAULT_BASE_URL =
  process.env.SOUNDS_BASE_URL ?? 'https://www.thanatosrealms.com/war2/sounds/humans';

/**
 * Load plugin configuration from plugin.json files
 * Looks in:
 * 1. CWD/.opencode/plugin.json
 * 2. ~/.config/opencode/plugin.json
 *
 * @param pluginName - Name of the plugin to load configuration for
 * @returns Plugin configuration object
 */
export const loadPluginConfig = async (pluginName: string): Promise<WarcraftNotificationConfig> => {
  const configPaths = [
    join(process.cwd(), '.opencode', 'plugin.json'),
    join(getConfigDir(), 'opencode', 'plugin.json'),
  ];

  for (const configPath of configPaths) {
    try {
      if (await exists(configPath)) {
        const configFile = Bun.file(configPath);
        const configData: PluginConfig = await configFile.json();

        if (configData[pluginName]) {
          return configData[pluginName] as WarcraftNotificationConfig;
        }
      }
    } catch (error) {
      console.warn(`Failed to load plugin config from ${configPath}:`, error);
    }
  }

  return {}; // Return empty config if no valid config found
};
