import { join } from 'path';
import { homedir } from 'os';
import { getPackageName } from './package.js';

/**
 * Get the appropriate config directory based on the operating system
 * @returns The config directory path
 *
 * @example
 * ```typescript
 * const configDir = getConfigDir();
 * // macOS: /Users/username/.config
 * // Linux: /home/username/.config (or XDG_CONFIG_HOME if set)
 * // Windows: C:\Users\username\AppData\Roaming (or APPDATA if set)
 * ```
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
 * Subdirectory name for sound files within the plugin storage
 */
export const SOUNDS_SUBDIR = 'sounds';

/**
 * Get the default sounds directory location
 * @returns Default sounds directory path
 *
 * @example
 * ```typescript
 * const soundsDir = getDefaultSoundsDir();
 * // macOS/Linux: ~/.local/share/opencode/storage/plugin/opencode-warcraft-notifications/sounds
 * // Windows: %APPDATA%\opencode\storage\plugin\opencode-warcraft-notifications\sounds
 * ```
 *
 * @example
 * ```typescript
 * // Override with environment variable
 * process.env.SOUNDS_DATA_DIR = '/custom/sounds/path';
 * const soundsDir = getDefaultDataDir();
 * console.log(soundsDir); // '/custom/sounds/path'
 * ```
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

  return join(baseDataDir, 'opencode', 'storage', 'plugin', pluginName, SOUNDS_SUBDIR);
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
