import type { Plugin } from "@opencode-ai/plugin"
import { getRandomSoundPath, soundExists } from "./sounds/index.js"
import { downloadAllSounds } from "./sounds/download.js"

/**
 * Notification idle plugin
 */
export const NotificationPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  // Check if sounds exist on plugin initialization, download if needed
  let soundsReady = false;
  
  const initializeSounds = async () => {
    if (soundsReady) return;
    
    try {
      // Check if at least one sound file exists
      const testSoundExists = await soundExists("human_selected1.wav");
      
      if (!testSoundExists) {
        console.log("Warcraft II Alliance sounds not found. Downloading...");
        await downloadAllSounds();
      }
      
      soundsReady = true;
    } catch (error) {
      console.error("Failed to initialize sounds:", error);
      // Continue without sounds rather than failing completely
    }
  };
  let lastMessage: { messageID: string | null; text: string | null } = {
    messageID: null,
    text: null,
  };

  return {
    event: async ({ event }) => {
      // Save message text for idle summary
      if (event.type === "message.part.updated") {
        if (event.properties.part.type === "text") {
          const { messageID, text } = event.properties.part;
          lastMessage = { messageID, text };
        }
      }

      if (event.type === "session.idle") {
        const summary = getIdleSummary(lastMessage?.text) ?? "Idle";
        if (process.platform === "darwin") {
          // Initialize sounds if needed
          await initializeSounds();
          
          if (soundsReady) {
            // Get a random Warcraft II Alliance sound from all available sounds
            const soundPath = getRandomSoundPath();
            await $`osascript -e 'do shell script "afplay ${soundPath}"'`;
          } else {
            // Fallback to system sound if download failed
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

const getIdleSummary = (text: string | null) => {
  if (!text) return;
  const idleMatch = text.match(/[_\*]Summary:[_\*]? (.*)[_\*]?$/m);
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