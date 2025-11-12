/**
 * Platform-specific notification and sound playback implementations
 *
 * This module provides an abstraction layer for platform-specific operations,
 * making the notification system testable and maintainable.
 */

import { createLogger } from '../logger.js';

const log = createLogger({ module: 'opencode-plugin-warcraft-notifications' });

/**
 * Type for the shell executor (Bun shell)
 * Simplified type that accepts any template literal arguments
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ShellExecutor = (strings: TemplateStringsArray, ...expressions: any[]) => any;

/**
 * Platform abstraction for notifications and sound playback
 *
 * @example
 * ```typescript
 * // Get the platform instance
 * const platform = getPlatform($);
 *
 * // Play a sound with fallback
 * await platform.playSound('/path/to/sound.wav', '/path/to/fallback.wav');
 *
 * // Show a notification
 * await platform.showNotification('OpenCode', 'Task completed');
 * ```
 */
export interface NotificationPlatform {
  /**
   * Play a sound file
   * @param soundPath - Absolute path to the sound file
   * @param fallbackSound - Optional fallback sound path if primary fails
   */
  playSound(soundPath: string, fallbackSound?: string): Promise<void>;

  /**
   * Show a system notification
   * @param title - Notification title
   * @param summary - Notification message
   */
  showNotification(title: string, summary: string): Promise<void>;

  /**
   * Get platform name for logging
   */
  getPlatformName(): string;
}

/**
 * macOS platform implementation using AppleScript
 */
export class MacOSPlatform implements NotificationPlatform {
  constructor(private readonly shell: ShellExecutor) {}

  async playSound(soundPath: string, fallbackSound?: string): Promise<void> {
    try {
      await this.shell`osascript -e 'do shell script "afplay ${soundPath}"'`;
    } catch (error) {
      if (fallbackSound) {
        log.warn('Failed to play primary sound, using fallback', { error, soundPath });
        await this.shell`osascript -e 'do shell script "afplay ${fallbackSound}"'`;
      } else {
        throw error;
      }
    }
  }

  async showNotification(title: string, summary: string): Promise<void> {
    await this
      .shell`osascript -e 'display notification ${JSON.stringify(summary)} with title ${JSON.stringify(title)}'`;
  }

  getPlatformName(): string {
    return 'macOS';
  }
}

/**
 * Linux platform implementation using canberra-gtk-play and notify-send
 */
export class LinuxPlatform implements NotificationPlatform {
  constructor(private readonly shell: ShellExecutor) {}

  async playSound(_soundPath: string, _fallbackSound?: string): Promise<void> {
    // Linux uses system sound instead of the provided WAV file
    // This is because canberra-gtk-play expects sound theme IDs, not file paths
    await this.shell`canberra-gtk-play --id=message`;
  }

  async showNotification(title: string, summary: string): Promise<void> {
    // Bun shell template literals handle escaping automatically
    // No manual escaping needed - the shell will properly quote the arguments
    await this.shell`notify-send ${title} ${summary}`;
  }

  getPlatformName(): string {
    return 'Linux';
  }
}

/**
 * Windows platform implementation (placeholder for future support)
 */
export class WindowsPlatform implements NotificationPlatform {
  constructor(private readonly _shell: ShellExecutor) {}

  async playSound(_soundPath: string, _fallbackSound?: string): Promise<void> {
    // Windows implementation would use PowerShell or similar
    // For now, just log a warning
    log.warn('Windows platform sound playback not yet implemented');
  }

  async showNotification(_title: string, _summary: string): Promise<void> {
    // Windows implementation would use PowerShell or similar
    log.warn('Windows platform notifications not yet implemented');
  }

  getPlatformName(): string {
    return 'Windows';
  }
}

/**
 * Factory function to get the appropriate platform implementation
 * @param shell - Shell instance for executing platform-specific commands
 * @param platformOverride - Optional platform override for testing
 * @returns Platform-specific implementation
 *
 * @example
 * ```typescript
 * import { $ } from 'bun';
 * import { getPlatform } from './platforms.js';
 *
 * // Get platform for current OS
 * const platform = getPlatform($);
 * await platform.playSound('/path/to/sound.wav');
 * ```
 *
 * @example
 * ```typescript
 * // Testing: override platform
 * const platform = getPlatform($, 'darwin');
 * // Returns MacOSPlatform regardless of actual OS
 * ```
 */
export const getPlatform = (
  shell: ShellExecutor,
  platformOverride?: string,
): NotificationPlatform => {
  const platform = platformOverride ?? process.platform;

  switch (platform) {
    case 'darwin':
      return new MacOSPlatform(shell);
    case 'win32':
      return new WindowsPlatform(shell);
    default:
      return new LinuxPlatform(shell);
  }
};
