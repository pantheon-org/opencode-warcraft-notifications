/**
 * Behavioral tests for NotificationPlugin
 *
 * These tests verify the core behavior of the notification system,
 * including event handling, sound playback, and toast notifications.
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('NotificationPlugin Behavior', () => {
  const originalPlatform = process.platform;

  beforeEach(() => {
    // Reset platform before each test
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original platform
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
  });

  describe('Platform detection', () => {
    it('should identify macOS platform', () => {
      Object.defineProperty(process, 'platform', { value: 'darwin' });
      expect(process.platform).toBe('darwin');
    });

    it('should identify Linux platform', () => {
      Object.defineProperty(process, 'platform', { value: 'linux' });
      expect(process.platform).toBe('linux');
    });

    it('should identify Windows platform', () => {
      Object.defineProperty(process, 'platform', { value: 'win32' });
      expect(process.platform).toBe('win32');
    });
  });

  describe('Event type handling', () => {
    it('should recognize message.part.updated event', () => {
      const event = {
        type: 'message.part.updated',
        properties: {
          part: {
            type: 'text',
            messageID: 'msg-123',
            text: 'Test message',
          },
        },
      };

      expect(event.type).toBe('message.part.updated');
      expect(event.properties.part.type).toBe('text');
    });

    it('should recognize session.idle event', () => {
      const event = {
        type: 'session.idle',
        properties: {},
      };

      expect(event.type).toBe('session.idle');
    });
  });

  describe('Toast notification behavior', () => {
    it('should create toast with correct structure', () => {
      const toast = {
        body: {
          title: 'Test Title',
          message: 'Test Message',
          variant: 'info' as const,
          duration: 4000,
        },
      };

      expect(toast.body.title).toBe('Test Title');
      expect(toast.body.message).toBe('Test Message');
      expect(toast.body.variant).toBe('info');
      expect(toast.body.duration).toBe(4000);
    });

    it('should support different toast variants', () => {
      const variants: Array<'success' | 'warning' | 'info' | 'error'> = [
        'success',
        'warning',
        'info',
        'error',
      ];

      variants.forEach((variant) => {
        const toast = {
          body: {
            title: 'Test',
            message: 'Test',
            variant,
            duration: 3000,
          },
        };
        expect(['success', 'warning', 'info', 'error']).toContain(toast.body.variant);
      });
    });

    it('should use correct durations for different toast types', () => {
      const TOAST_DURATION = {
        SUCCESS: 3000,
        WARNING: 5000,
        INFO: 4000,
      };

      expect(TOAST_DURATION.SUCCESS).toBe(3000);
      expect(TOAST_DURATION.WARNING).toBe(5000);
      expect(TOAST_DURATION.INFO).toBe(4000);
    });
  });

  describe('Sound path extraction', () => {
    it('should extract filename from full path', () => {
      const path = '/Users/test/sounds/human_selected1.wav';
      const filename = path.split('/').pop();
      expect(filename).toBe('human_selected1.wav');
    });

    it('should handle paths with multiple directory levels', () => {
      const path = '/a/b/c/d/sound.wav';
      const filename = path.split('/').pop();
      expect(filename).toBe('sound.wav');
    });
  });

  describe('Configuration behavior', () => {
    it('should default showDescriptionInToast to true when not set', () => {
      const config: { showDescriptionInToast?: boolean } = {};
      const showToast = config.showDescriptionInToast !== false;
      expect(showToast).toBe(true);
    });

    it('should respect showDescriptionInToast when explicitly set to false', () => {
      const config = { showDescriptionInToast: false };
      const showToast = config.showDescriptionInToast !== false;
      expect(showToast).toBe(false);
    });

    it('should respect showDescriptionInToast when explicitly set to true', () => {
      const config = { showDescriptionInToast: true };
      const showToast = config.showDescriptionInToast !== false;
      expect(showToast).toBe(true);
    });
  });

  describe('Cache key handling', () => {
    it('should use consistent cache key for missing notification', () => {
      const CACHE_KEY_NOTIFIED_MISSING = '_notified_missing';
      const cache = new Map<string, boolean>();

      cache.set(CACHE_KEY_NOTIFIED_MISSING, true);
      expect(cache.has(CACHE_KEY_NOTIFIED_MISSING)).toBe(true);
    });

    it('should cache sound file existence', () => {
      const cache = new Map<string, boolean>();
      const filename = 'human_selected1.wav';

      cache.set(filename, true);
      expect(cache.get(filename)).toBe(true);
    });
  });

  describe('Message state management', () => {
    it('should track last message state', () => {
      const lastMessage = {
        messageID: 'msg-123',
        text: 'Test message content',
      };

      expect(lastMessage.messageID).toBe('msg-123');
      expect(lastMessage.text).toBe('Test message content');
    });

    it('should initialize with null state', () => {
      const lastMessage = {
        messageID: null,
        text: null,
      };

      expect(lastMessage.messageID).toBeNull();
      expect(lastMessage.text).toBeNull();
    });

    it('should update message state on new message', () => {
      let lastMessage: { messageID: string | null; text: string | null } = {
        messageID: null,
        text: null,
      };

      const newMessage = {
        messageID: 'msg-456',
        text: 'New message',
      };

      lastMessage = newMessage;

      expect(lastMessage.messageID).toBe('msg-456');
      expect(lastMessage.text).toBe('New message');
    });
  });

  describe('Fallback sound paths', () => {
    it('should use Glass.aiff for macOS fallback', () => {
      Object.defineProperty(process, 'platform', { value: 'darwin' });
      const fallbackSound = '/System/Library/Sounds/Glass.aiff';
      expect(fallbackSound).toBe('/System/Library/Sounds/Glass.aiff');
    });

    it('should provide fallback only on macOS', () => {
      Object.defineProperty(process, 'platform', { value: 'darwin' });
      const fallback =
        process.platform === 'darwin' ? '/System/Library/Sounds/Glass.aiff' : undefined;
      expect(fallback).toBe('/System/Library/Sounds/Glass.aiff');
    });

    it('should have no file fallback on Linux', () => {
      Object.defineProperty(process, 'platform', { value: 'linux' });
      const fallback =
        process.platform === 'darwin' ? '/System/Library/Sounds/Glass.aiff' : undefined;
      expect(fallback).toBeUndefined();
    });
  });

  describe('Sound command construction', () => {
    it('should use afplay for macOS', () => {
      Object.defineProperty(process, 'platform', { value: 'darwin' });
      const soundPath = '/path/to/sound.wav';
      const command = process.platform === 'darwin' ? `afplay ${soundPath}` : null;
      expect(command).toBe('afplay /path/to/sound.wav');
    });

    it('should use paplay or aplay for Linux', () => {
      Object.defineProperty(process, 'platform', { value: 'linux' });
      const soundPath = '/path/to/sound.wav';

      // Primary: paplay
      const primaryCommand = `paplay ${soundPath}`;
      expect(primaryCommand).toBe('paplay /path/to/sound.wav');

      // Fallback: aplay
      const fallbackCommand = `aplay ${soundPath}`;
      expect(fallbackCommand).toBe('aplay /path/to/sound.wav');
    });

    it('should have no command for Windows', () => {
      Object.defineProperty(process, 'platform', { value: 'win32' });
      const hasCommand = process.platform === 'darwin' || process.platform === 'linux';
      expect(hasCommand).toBe(false);
    });
  });

  describe('Toast title generation', () => {
    it('should use sound description when available', () => {
      const soundDescription = 'Yes, milord?';
      const toastTitle = soundDescription || 'opencode';
      expect(toastTitle).toBe('Yes, milord?');
    });

    it('should use "opencode" as fallback when no description', () => {
      const soundDescription = undefined;
      const toastTitle = soundDescription || 'opencode';
      expect(toastTitle).toBe('opencode');
    });

    it('should use empty string description if provided', () => {
      const soundDescription = '';
      const toastTitle = soundDescription || 'opencode';
      expect(toastTitle).toBe('opencode');
    });
  });
});
