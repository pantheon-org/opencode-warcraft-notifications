import { join } from 'path';
import { exists } from 'fs/promises';
import { createLogger } from '../logger.js';
import { validateAndSanitizeConfig } from '../schema-validator.js';
import { getConfigDir } from './paths.js';
import type { WarcraftNotificationConfig, PluginConfig } from './types.js';

const log = createLogger({ module: 'opencode-plugin-warcraft-notifications' });
const DEBUG = Boolean(process.env.DEBUG_OPENCODE);

/**
 * Log debug message if DEBUG is enabled
 */
const debugLog = (message: string, context?: Record<string, unknown>): void => {
  if (DEBUG) {
    log.debug(message, context);
  }
};

/**
 * Log info message if DEBUG is enabled
 */
const debugInfo = (message: string, context?: Record<string, unknown>): void => {
  if (DEBUG) {
    log.info(message, context);
  }
};

/**
 * Attempt to load and validate configuration from a specific file
 */
const tryLoadFromPath = async (
  configPath: string,
  pluginName: string,
): Promise<WarcraftNotificationConfig | null> => {
  debugLog('Checking configuration path', { configPath });

  if (!(await exists(configPath))) {
    debugLog('Configuration file not found', { configPath });
    return null;
  }

  debugLog('Configuration file found', { configPath });

  const configFile = Bun.file(configPath);
  const configData: PluginConfig = await configFile.json();

  if (!configData[pluginName]) {
    debugLog('Configuration file exists but does not contain plugin configuration', {
      configPath,
      pluginName,
    });
    return null;
  }

  debugInfo('Loading plugin configuration', { configPath, pluginName });

  const rawConfig = configData[pluginName];
  try {
    const validatedConfig = validateAndSanitizeConfig(rawConfig);
    debugInfo('Configuration loaded successfully', {
      configPath,
      pluginName,
      config: validatedConfig,
    });
    return validatedConfig;
  } catch (validationError) {
    // Re-throw validation errors with context about the config file location
    if (validationError instanceof Error) {
      throw new Error(`${validationError.message}\n  Configuration file: ${configPath}`);
    }
    throw validationError;
  }
};

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
 *
 * @example
 * ```typescript
 * // Load configuration with defaults
 * const config = await loadPluginConfig('my-plugin');
 * console.log(config.faction); // 'both' (default)
 * console.log(config.soundsDir); // undefined or configured path
 * ```
 *
 * @example
 * ```typescript
 * // Configuration file at .opencode/plugin.json:
 * // {
 * //   "my-plugin": {
 * //     "faction": "alliance",
 * //     "soundsDir": "/custom/path/sounds"
 * //   }
 * // }
 *
 * const config = await loadPluginConfig('my-plugin');
 * console.log(config.faction); // 'alliance'
 * console.log(config.soundsDir); // '/custom/path/sounds'
 * ```
 *
 * @example
 * ```typescript
 * // Enable debug logging to see configuration discovery process
 * process.env.DEBUG_OPENCODE = '1';
 * const config = await loadPluginConfig('my-plugin');
 * // Logs will show:
 * // - Configuration search paths
 * // - Files checked and found
 * // - Loaded configuration details
 * ```
 */
export const loadPluginConfig = async (pluginName: string): Promise<WarcraftNotificationConfig> => {
  debugLog('Starting configuration discovery', { pluginName });

  const configPaths = [
    join(process.cwd(), '.opencode', 'plugin.json'),
    join(getConfigDir(), 'opencode', 'plugin.json'),
  ];

  debugLog('Configuration search paths', { configPaths });

  for (const configPath of configPaths) {
    try {
      const config = await tryLoadFromPath(configPath, pluginName);
      if (config) {
        return config;
      }
    } catch (error: unknown) {
      // For validation errors, re-throw to notify the user immediately
      if (error instanceof Error && error.message.includes('Configuration validation failed')) {
        throw error;
      }

      // Only warn for other errors when explicit debug flag is set
      if (DEBUG) {
        log.warn(`Failed to load plugin config from ${configPath}`, { error });
      }
    }
  }

  debugLog('No configuration found, using defaults', { pluginName });

  // Return empty config if no valid config found (empty config is valid)
  return validateAndSanitizeConfig({});
};
