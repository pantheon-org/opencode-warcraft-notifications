import type { Plugin } from '@opencode-ai/plugin';
import { createLogger } from './logger.js';
import {
  getRandomSoundPathFromFaction,
  soundExists,
  determineSoundFaction,
  getSoundDescription,
} from './sounds/index.js';
import { installBundledSoundsIfMissing } from './bundled-sounds.js';
import { loadPluginConfig } from './config/index.js';
import { extractFilename, getIdleSummary } from './notification-utils.js';
/* eslint-disable jsdoc/require-param */

const log = createLogger({ module: 'opencode-plugin-warcraft-notifications' });

// Constants for toast durations and cache keys
const TOAST_DURATION = {
  SUCCESS: 3000,
  WARNING: 5000,
  INFO: 4000,
} as const;

const CACHE_KEY_NOTIFIED_MISSING = '_notified_missing';

/**
 * Notification idle plugin
 *
 * This plugin plays a random Warcraft II sound (Alliance and/or Horde) when the session becomes idle
 * and displays a toast notification with the voice line and a short summary of the last message.
 *
 * The plugin ensures bundled sounds are installed during first run and checks
 * for the presence of files on every subsequent call. It no longer attempts
 * to download wave files from the network.
 */
export const NotificationPlugin: Plugin = async (ctx) => {
  const { project: _project, client, $, worktree: _worktree } = ctx;
  // Keep a simple cache flag to avoid repeated checks.
  const checkedSoundCache = new Map<string, boolean>();
  void _project;
  void _worktree;

  // Load plugin configuration from plugin.json
  const pluginName = '@pantheon-ai/opencode-warcraft-notifications';
  const pluginConfig = await loadPluginConfig(pluginName);

  // Install bundled sounds into the user's config on first run
  try {
    const installedCount = await installBundledSoundsIfMissing(pluginConfig.soundsDir);
    // Only notify user if files were actually installed
    if (installedCount > 0) {
      try {
        await client.tui.showToast({
          body: {
            title: 'Warcraft Sounds',
            message: `Installed ${installedCount} sound file${installedCount > 1 ? 's' : ''} successfully`,
            variant: 'success',
            duration: TOAST_DURATION.SUCCESS,
          },
        });
      } catch (toastErr) {
        // Silently ignore toast errors - not critical
        if (process.env.DEBUG_OPENCODE) log.debug('Toast notification failed', { error: toastErr });
      }
    }
  } catch (err) {
    if (process.env.DEBUG_OPENCODE)
      log.warn('installBundledSoundsIfMissing failed', { error: err });
    // Notify user of installation failure
    try {
      await client.tui.showToast({
        body: {
          title: 'Warcraft Sounds',
          message: 'Failed to install sound files. Using system sounds as fallback.',
          variant: 'warning',
          duration: TOAST_DURATION.WARNING,
        },
      });
    } catch (toastErr) {
      // Silently ignore toast errors - not critical
      if (process.env.DEBUG_OPENCODE) log.debug('Toast notification failed', { error: toastErr });
    }
  }

  const ensureAndGetSoundPath = async () => {
    // Determine explicit data directory preference:
    // 1. Environment override: `SOUNDS_DATA_DIR` if set
    // 2. Configuration from opencode.json: `soundsDir` property
    // 3. Default: `~/.config/opencode/sounds` (handled by DEFAULT_DATA_DIR)
    const explicitDataDir = pluginConfig.soundsDir || undefined; // Use configured directory or let DEFAULT_DATA_DIR handle fallback

    // Determine faction preference (default to 'both')
    const faction = pluginConfig.faction || 'both';

    // Choose a random sound filename from the specified faction(s)
    const soundPath = getRandomSoundPathFromFaction(faction, explicitDataDir);
    const filename = extractFilename(soundPath);
    const soundFaction = determineSoundFaction(filename);

    // If we've already confirmed availability, return the path
    if (checkedSoundCache.get(filename) === true) return soundPath;

    try {
      // If file exists locally, mark and return
      const existsLocally = await soundExists(filename, soundFaction, explicitDataDir);
      if (existsLocally) {
        checkedSoundCache.set(filename, true);
        return soundPath;
      }

      // No network downloads — just report availability
      return soundPath;
    } catch (error) {
      log.error('Error ensuring sound available', { error });
      return soundPath;
    }
  };

  /**
   * Show a toast notification about missing sound file
   */
  const showMissingSoundToast = async (filename: string) => {
    if (checkedSoundCache.has(CACHE_KEY_NOTIFIED_MISSING)) return;

    checkedSoundCache.set(CACHE_KEY_NOTIFIED_MISSING, true);
    try {
      await client.tui.showToast({
        body: {
          title: 'Warcraft Sounds',
          message: `Sound file not found: ${filename}. Using system sound as fallback.`,
          variant: 'info',
          duration: TOAST_DURATION.INFO,
        },
      });
    } catch (toastErr) {
      // Silently ignore toast errors - not critical
      if (process.env.DEBUG_OPENCODE) log.debug('Toast notification failed', { error: toastErr });
    }
  };

  /**
   * Handle playing sound with fallback
   *
   * @param soundPath - Full path to the sound file
   * @param existsLocally - Whether the sound file exists locally
   * @param filename - Name of the sound file
   */
  const playIdleSound = async (soundPath: string, existsLocally: boolean, filename: string) => {
    try {
      if (existsLocally) {
        // Play the sound using platform-specific commands
        if (process.platform === 'darwin') {
          await $`afplay ${soundPath}`;
        } else if (process.platform === 'linux') {
          // Try paplay first, fall back to aplay
          try {
            await $`paplay ${soundPath}`;
          } catch {
            await $`aplay ${soundPath}`;
          }
        } else if (process.platform === 'win32') {
          log.warn('Windows sound playback not yet supported', { soundPath });
        }
      } else {
        // Play fallback sound if primary sound is missing
        if (process.platform === 'darwin') {
          const fallbackSound = '/System/Library/Sounds/Glass.aiff';
          log.warn('Primary sound not found, using fallback', { soundPath, fallbackSound });
          await $`afplay ${fallbackSound}`;
        } else if (process.platform === 'linux') {
          log.warn('Primary sound not found, using system sound', { soundPath });
          await $`canberra-gtk-play --id=message`;
        } else if (process.platform === 'win32') {
          log.warn('Windows sound playback not yet supported', { soundPath });
        }
        await showMissingSoundToast(filename);
      }
    } catch (error) {
      log.error('Failed to play sound', { error, soundPath });
    }
  };

  /**
   * Handle session idle event
   *
   * @param summary - Short summary of the session activity
   */
  const handleSessionIdle = async (summary: string) => {
    const soundPath = await ensureAndGetSoundPath();
    const filename = extractFilename(soundPath);
    const fileSoundFaction = determineSoundFaction(filename);
    const existsLocally = await soundExists(filename, fileSoundFaction, pluginConfig.soundsDir);

    try {
      await playIdleSound(soundPath, existsLocally, filename);

      // Use sound description if available, otherwise use summary as title
      const soundDescription = getSoundDescription(filename);
      const toastTitle = soundDescription || 'opencode';
      const toastMessage = summary;

      // Show toast notification (enabled by default)
      const showToast = pluginConfig.showDescriptionInToast !== false;
      if (showToast) {
        try {
          await client.tui.showToast({
            body: {
              title: toastTitle,
              message: toastMessage,
              variant: 'info',
              duration: TOAST_DURATION.INFO,
            },
          });
        } catch (toastErr) {
          // Silently ignore toast errors - not critical
          if (process.env.DEBUG_OPENCODE)
            log.debug('Toast notification failed', { error: toastErr });
        }
      }
    } catch (error) {
      log.error('Failed to play sound or show notification', { error });
    }
  };

  let lastMessage: { messageID: string | null; text: string | null } = {
    messageID: null,
    text: null,
  };

  return {
    event: async ({ event }) => {
      // Save message text for idle summary
      if (event.type === 'message.part.updated' && event.properties.part.type === 'text') {
        const { messageID, text } = event.properties.part;
        lastMessage = { messageID, text };
      }

      if (event.type === 'session.idle') {
        const summary = getIdleSummary(lastMessage?.text) ?? 'Idle';
        await handleSessionIdle(summary);
      }
    },
  };
};

// Also see:
// https://opencode.ai/docs/plugins/
// https://github.com/sst/opencode/blob/857a3cd52221b820dbfd34dae8ff1d42bbb8c108/packages/sdk/js/src/gen/types.gen.ts#L1
