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
  /** Whether to show toast notifications when idle (default: true). When enabled, displays voice lines as toast title */
  showDescriptionInToast?: boolean;
}

/**
 * Plugin configuration file structure
 */
export interface PluginConfig {
  [pluginName: string]: unknown;
}
