import { join, dirname } from 'path';
import { exists } from 'fs/promises';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { validateAndSanitizeConfig } from './schema-validator.js';

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
 * Get the directory containing this module
 * @returns Directory path of the current module
 */
const getModuleDir = (): string => {
  // In ES modules, we use import.meta.url to get the file path
  // This works reliably regardless of CWD
  try {
    const moduleUrl = import.meta.url;
    const modulePath = fileURLToPath(moduleUrl);
    return dirname(modulePath);
  } catch {
    // Fallback to process.cwd() if import.meta.url is not available
    return process.cwd();
  }
};

/**
 * Get the plugin root directory (parent of src/)
 * @returns Plugin root directory path
 */
const getPluginRootDir = (): string => {
  const moduleDir = getModuleDir();
  // If we're in src/, go up one level to the plugin root
  if (moduleDir.endsWith('src')) {
    return dirname(moduleDir);
  }
  return moduleDir;
};

/**
 * Try to read package.json from multiple locations
 * @returns package name or null if not found
 */
const getPackageName = (): string | null => {
  // Strategy:
  // 1. Try CWD first (for tests and development)
  // 2. Fall back to plugin root (for production when running from OpenCode)

  const locations = [
    join(process.cwd(), 'package.json'), // CWD (tests/development)
    join(getPluginRootDir(), 'package.json'), // Plugin root (production)
  ];

  for (const pkgPath of locations) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
        name?: string;
      };
      if (pkg && typeof pkg.name === 'string') {
        return pkg.name;
      }
    } catch {
      // Try next location
      continue;
    }
  }

  return null;
};

/**
 * Get the default sounds directory location
 * @returns Default sounds directory path
 */
export const getDefaultSoundsDir = (): string => {
  // Determine platform-specific base data dir
  let baseDataDir: string;
  if (process.platform === 'win32') {
    // Use APPDATA on Windows, fallback to %USERPROFILE%/AppData/Roaming
    baseDataDir = process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming');
  } else {
    // Use XDG_DATA_HOME when available, otherwise fall back to ~/.local/share
    baseDataDir = process.env.XDG_DATA_HOME ?? join(homedir(), '.local', 'share');
  }

  // Derive a plugin-specific storage folder name from package.json `name`
  let pluginName = 'opencode-plugin';
  const packageName = getPackageName();
  if (packageName) {
    const raw = packageName;
    pluginName = raw.includes('/') ? raw.split('/').pop()! : raw;
    // sanitize to a filesystem-friendly token
    pluginName = pluginName.replace(/[^a-zA-Z0-9._-]/g, '-');
  }

  return join(baseDataDir, 'opencode', 'storage', 'plugin', pluginName);
};

/**
 * Default data directory for sound files
 * Can be overridden by SOUNDS_DATA_DIR environment variable
 */
export const DEFAULT_DATA_DIR = process.env.SOUNDS_DATA_DIR ?? getDefaultSoundsDir();

/**
 * Default data dir computed at call time (honors env overrides)
 */
export const getDefaultDataDir = (): string => process.env.SOUNDS_DATA_DIR ?? getDefaultSoundsDir();

/**
 * Default base URL for downloading sound files
 * Can be overridden by SOUNDS_BASE_URL environment variable
 */
export const DEFAULT_BASE_URL =
  process.env.SOUNDS_BASE_URL ?? 'https://www.thanatosrealms.com/war2/sounds/humans';

/**
 * Return the default base URL computed at call time (honors env overrides)
 */
export const getDefaultBaseUrl = (): string =>
  process.env.SOUNDS_BASE_URL ?? 'https://www.thanatosrealms.com/war2/sounds/humans';

/**
 * Load plugin configuration from plugin.json files
 * Looks in:
 * 1. CWD/.opencode/plugin.json
 * 2. ~/.config/opencode/plugin.json
 *
 * Configuration is validated against the JSON schema. Invalid configurations
 * will throw an error with detailed validation messages.
 *
 * @param pluginName - Name of the plugin to load configuration for
 * @returns Plugin configuration object (validated and typed)
 * @throws Error If configuration validation fails
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
          // Validate the configuration before returning
          const rawConfig = configData[pluginName];
          try {
            const validatedConfig = validateAndSanitizeConfig(rawConfig);
            return validatedConfig;
          } catch (validationError) {
            // Re-throw validation errors with context about the config file location
            if (validationError instanceof Error) {
              throw new Error(`${validationError.message}\n  Configuration file: ${configPath}`);
            }
            throw validationError;
          }
        }
      }
    } catch (error: unknown) {
      // For validation errors, re-throw to notify the user immediately
      if (error instanceof Error && error.message.includes('Configuration validation failed')) {
        throw error;
      }

      // Only warn for other errors when explicit debug flag is set to avoid noisy logs during tests
      if (process.env.DEBUG_OPENCODE) {
        console.warn(`Failed to load plugin config from ${configPath}:`, error);
      }
    }
  }

  // Return empty config if no valid config found (empty config is valid)
  return validateAndSanitizeConfig({});
};
