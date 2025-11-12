import type { Plugin } from '@opencode-ai/plugin';
import { createLogger } from './logger.js';
import {
  getRandomSoundPathFromFaction,
  soundExists,
  determineSoundFaction,
} from './sounds/index.js';
import { ensureSoundAvailable, installBundledSoundsIfMissing } from './bundled-sounds.js';
import { loadPluginConfig } from './plugin-config.js';
/* eslint-disable jsdoc/require-param */

const log = createLogger({ module: 'opencode-plugin-warcraft-notifications' });

/**
 * Notification idle plugin
 *
 * This plugin plays a random Warcraft II sound (Alliance and/or Horde) when the session becomes idle
 * and displays a notification with a short summary of the last message.
 *
 * The plugin ensures bundled sounds are installed during first run and checks
 * for the presence of files on every subsequent call. It no longer attempts
 * to download wave files from the network.
 */
export const NotificationPlugin: Plugin = async (ctx) => {
  const { project: _project, client: _client, $, worktree: _worktree } = ctx;
  // Keep a simple cache flag to avoid repeated checks.
  const checkedSoundCache = new Map<string, boolean>();
  void _project;
  void _client;
  void _worktree;

  // Load plugin configuration from plugin.json
  const pluginName = '@pantheon-ai/opencode-warcraft-notifications';
  const pluginConfig = await loadPluginConfig(pluginName);

  // Install bundled sounds into the user's config on first run
  try {
    await installBundledSoundsIfMissing(pluginConfig.soundsDir);
  } catch (err) {
    if (process.env.DEBUG_OPENCODE)
      log.warn('installBundledSoundsIfMissing failed', { error: err });
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
    const filename = soundPath.split('/').pop() as string;
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

        if (process.platform === 'darwin') {
          const soundPath = await ensureAndGetSoundPath();
          const filename = soundPath.split('/').pop() as string;

          // Determine the faction for soundExists call and pass explicit data dir
          const fileSoundFaction = determineSoundFaction(filename);
          const existsLocally = await soundExists(
            filename,
            fileSoundFaction,
            pluginConfig.soundsDir,
          );

          if (existsLocally) {
            await $`osascript -e 'do shell script "afplay ${soundPath}"'`;
          } else {
            // Fallback to system sound if the file isn't available
            await $`osascript -e 'do shell script "afplay /System/Library/Sounds/Glass.aiff"'`;
          }

          await $`osascript -e 'display notification ${JSON.stringify(summary)} with title "opencode"'`;
        } else {
          await $`canberra-gtk-play --id=message`;
          await $`notify-send 'opencode' '${summary.replace(/'/g, "'\\''")}'`;
        }
      }
    },
  };
};

/**
 * Extract a last `*Summary:* ...` line at the end of the text
 */

/**
 * Extract a short idle summary from the end of a message text.
 *
 * If the text contains a line like `Summary: ...` it returns that; otherwise it
 * truncates the text to 80 characters.
 *
 * @param text - Message text to extract the summary from
 * @returns The extracted summary or `undefined` when no text is provided
 */
const getIdleSummary = (text: string | null) => {
  if (!text) return;
  const idleMatch = text.match(/[_*]Summary:[_*]? (.*)[_*]?$/m);
  if (idleMatch && idleMatch[1]) {
    return idleMatch[1].trim();
  }
  if (text.length > 80) {
    return text.slice(0, 80) + '...';
  }
  return text;
};

// Also see:
// https://opencode.ai/docs/plugins/
// https://github.com/sst/opencode/blob/857a3cd52221b820dbfd34dae8ff1d42bbb8c108/packages/sdk/js/src/gen/types.gen.ts#L1
