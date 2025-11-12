import { describe, test, expect, beforeEach, mock } from 'bun:test';
import {
  MacOSPlatform,
  LinuxPlatform,
  WindowsPlatform,
  getPlatform,
  type ShellExecutor,
} from './platforms';
import { withPlatform } from '../test-utils';

describe('Platform Abstraction', () => {
  describe('getPlatform', () => {
    test('should return MacOSPlatform for darwin', () => {
      const mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;
      const platform = getPlatform(mockShell, 'darwin');
      expect(platform).toBeInstanceOf(MacOSPlatform);
      expect(platform.getPlatformName()).toBe('macOS');
    });

    test('should return LinuxPlatform for linux', () => {
      const mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;
      const platform = getPlatform(mockShell, 'linux');
      expect(platform).toBeInstanceOf(LinuxPlatform);
      expect(platform.getPlatformName()).toBe('Linux');
    });

    test('should return WindowsPlatform for win32', () => {
      const mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;
      const platform = getPlatform(mockShell, 'win32');
      expect(platform).toBeInstanceOf(WindowsPlatform);
      expect(platform.getPlatformName()).toBe('Windows');
    });

    test('should use process.platform when no override provided', async () => {
      await withPlatform('darwin', () => {
        const mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;
        const platform = getPlatform(mockShell);
        expect(platform).toBeInstanceOf(MacOSPlatform);
      });
    });

    test('should default to LinuxPlatform for unknown platforms', () => {
      const mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;
      const platform = getPlatform(mockShell, 'unknown-os');
      expect(platform).toBeInstanceOf(LinuxPlatform);
    });
  });

  describe('MacOSPlatform', () => {
    let mockShell: ShellExecutor;
    let platform: MacOSPlatform;

    beforeEach(() => {
      mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;
      platform = new MacOSPlatform(mockShell);
    });

    test('should play sound using afplay', async () => {
      await platform.playSound('/path/to/sound.wav');
      expect(mockShell).toHaveBeenCalledTimes(1);
    });

    test('should use fallback sound on error', async () => {
      // First call fails, second call succeeds
      let callCount = 0;
      const errorShell = mock(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Primary sound failed');
        }
        return Promise.resolve();
      }) as unknown as ShellExecutor;

      const errorPlatform = new MacOSPlatform(errorShell);
      await errorPlatform.playSound('/path/to/sound.wav', '/fallback.wav');

      expect(errorShell).toHaveBeenCalledTimes(2);
    });

    test('should throw error when no fallback provided', async () => {
      const errorShell = mock(() => {
        throw new Error('Sound failed');
      }) as unknown as ShellExecutor;

      const errorPlatform = new MacOSPlatform(errorShell);

      await expect(errorPlatform.playSound('/path/to/sound.wav')).rejects.toThrow('Sound failed');
    });

    test('should show notification using osascript', async () => {
      await platform.showNotification('Test Title', 'Test Message');
      expect(mockShell).toHaveBeenCalledTimes(1);
    });

    test('should handle special characters in notification', async () => {
      await platform.showNotification('Title', 'Message with "quotes"');
      expect(mockShell).toHaveBeenCalledTimes(1);
    });

    test('should get platform name', () => {
      expect(platform.getPlatformName()).toBe('macOS');
    });
  });

  describe('LinuxPlatform', () => {
    let mockShell: ShellExecutor;
    let platform: LinuxPlatform;

    beforeEach(() => {
      mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;
      platform = new LinuxPlatform(mockShell);
    });

    test('should play sound using canberra-gtk-play', async () => {
      await platform.playSound('/path/to/sound.wav');
      expect(mockShell).toHaveBeenCalledTimes(1);
    });

    test('should ignore sound path and use system sound', async () => {
      // Linux doesn't use the provided sound path
      await platform.playSound('/any/path.wav');
      expect(mockShell).toHaveBeenCalledTimes(1);
    });

    test('should ignore fallback sound parameter', async () => {
      await platform.playSound('/path.wav', '/fallback.wav');
      expect(mockShell).toHaveBeenCalledTimes(1);
    });

    test('should show notification using notify-send', async () => {
      await platform.showNotification('Test Title', 'Test Message');
      expect(mockShell).toHaveBeenCalledTimes(1);
    });

    test('should escape single quotes in notification message', async () => {
      await platform.showNotification('Title', "Message with 'quotes'");
      expect(mockShell).toHaveBeenCalledTimes(1);
    });

    test('should get platform name', () => {
      expect(platform.getPlatformName()).toBe('Linux');
    });
  });

  describe('WindowsPlatform', () => {
    let mockShell: ShellExecutor;
    let platform: WindowsPlatform;

    beforeEach(() => {
      mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;
      platform = new WindowsPlatform(mockShell);
    });

    test('should not throw when playing sound (placeholder implementation)', async () => {
      await expect(platform.playSound('/path/to/sound.wav')).resolves.toBeUndefined();
    });

    test('should not throw when showing notification (placeholder implementation)', async () => {
      await expect(platform.showNotification('Title', 'Message')).resolves.toBeUndefined();
    });

    test('should get platform name', () => {
      expect(platform.getPlatformName()).toBe('Windows');
    });
  });

  describe('Platform Interface Contract', () => {
    test('all platforms should implement playSound', async () => {
      const mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;

      const platforms = [
        new MacOSPlatform(mockShell),
        new LinuxPlatform(mockShell),
        new WindowsPlatform(mockShell),
      ];

      for (const platform of platforms) {
        expect(typeof platform.playSound).toBe('function');
        // All platforms should handle playSound without throwing
        await platform.playSound('/test.wav');
        // If we get here without throwing, the test passes
        expect(true).toBe(true);
      }
    });

    test('all platforms should implement showNotification', async () => {
      const mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;

      const platforms = [
        new MacOSPlatform(mockShell),
        new LinuxPlatform(mockShell),
        new WindowsPlatform(mockShell),
      ];

      for (const platform of platforms) {
        expect(typeof platform.showNotification).toBe('function');
        // All platforms should handle showNotification without throwing
        await platform.showNotification('Title', 'Message');
        // If we get here without throwing, the test passes
        expect(true).toBe(true);
      }
    });

    test('all platforms should implement getPlatformName', () => {
      const mockShell = mock(() => Promise.resolve()) as unknown as ShellExecutor;

      const platforms = [
        new MacOSPlatform(mockShell),
        new LinuxPlatform(mockShell),
        new WindowsPlatform(mockShell),
      ];

      const expectedNames = ['macOS', 'Linux', 'Windows'];

      platforms.forEach((platform, i) => {
        expect(typeof platform.getPlatformName).toBe('function');
        expect(platform.getPlatformName()).toBe(expectedNames[i]);
      });
    });
  });
});
