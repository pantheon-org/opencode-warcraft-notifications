/**
 * Configuration module for OpenCode Warcraft Notifications plugin
 *
 * This module provides configuration loading, path resolution, and type definitions
 * for the plugin configuration system.
 */

// Re-export types
export type { Faction, WarcraftNotificationConfig, PluginConfig } from './types.js';

// Re-export path utilities
export {
  getConfigDir,
  getDefaultSoundsDir,
  getDefaultDataDir,
  DEFAULT_DATA_DIR,
  SOUNDS_SUBDIR,
} from './paths.js';

// Re-export package utilities
export { getPackageName } from './package.js';

// Re-export loader
export { loadPluginConfig } from './loader.js';
