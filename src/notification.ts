import type { Plugin } from "@opencode-ai/plugin"
import { getRandomSoundPath, soundExists } from "./sounds.js"
import { ensureSoundAvailable } from "./download.js"

/**
 * Notification idle plugin
 *
 * This plugin plays a random Warcraft II Alliance sound when the session becomes idle
 * and displays a notification with a short summary of the last message.
 *
 * The plugin downloads sounds on demand into `directory/.opencode-sounds` or `SOUNDS_DATA_DIR`.
 */
export const NotificationPlugin: Plugin = async ({ project: _project, client: _client, $, directory, worktree: _worktree }) => {
  // We'll download sounds on demand. Keep a simple cache flag to avoid repeated checks.
  const checkedSoundCache = new Map<string, boolean>();
  void _project; void _client; void _worktree;

  const ensureAndGetSoundPath = async () => {
    // Determine explicit data directory preference: plugin `directory` if available, otherwise env or default
    const explicitDataDir = directory ? `${directory}/.opencode-sounds` : process.env.SOUNDS_DATA_DIR;

    // Choose a random sound filename
    const soundPath = getRandomSoundPath(explicitDataDir);
    const filename = soundPath.split("/").pop() as string;

    // If we've already confirmed availability, return the path
    if (checkedSoundCache.get(filename) === true) return soundPath;

    try {
      // If file exists locally, mark and return
      const existsLocally = await soundExists(filename, explicitDataDir);
      if (existsLocally) {
        checkedSoundCache.set(filename, true);
        return soundPath;
      }

      // Otherwise attempt on-demand download via ensureSoundAvailable
      const ok = await ensureSoundAvailable(filename, undefined, undefined, explicitDataDir);
      if (ok) {
        checkedSoundCache.set(filename, true);
        return soundPath;
      }

      // If download failed, fall through to return original path (which may not exist)
      return soundPath;
    } catch (error) {
      console.error("Error ensuring sound available:", error);
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
      if (event.type === "message.part.updated" && event.properties.part.type === "text") {
        const { messageID, text } = event.properties.part;
        lastMessage = { messageID, text };
      }

      if (event.type === "session.idle") {
        const summary = getIdleSummary(lastMessage?.text) ?? "Idle";

        if (process.platform === "darwin") {
          // Ensure the randomly chosen sound is available (download on demand)
          const soundPath = await ensureAndGetSoundPath();
          const filename = soundPath.split("/").pop() as string;
          const existsLocally = await soundExists(filename);

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
    return text.slice(0, 80) + "...";
  }
  return text;
};

// Also see:
// https://opencode.ai/docs/plugins/
// https://github.com/sst/opencode/blob/857a3cd52221b820dbfd34dae8ff1d42bbb8c108/packages/sdk/js/src/gen/types.gen.ts#L1
