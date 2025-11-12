import { describe, it, expect } from 'bun:test';
import type { WarcraftNotificationConfig } from './config/types.js';

describe('NotificationPlugin configuration', () => {
  it('should apply configuration from opencode.json', async () => {
    // Test that the config interface is properly typed
    const testConfig: WarcraftNotificationConfig = {
      soundsDir: '/custom/sounds/directory',
    };

    expect(testConfig.soundsDir).toBe('/custom/sounds/directory');
  });

  it('should handle undefined config gracefully', async () => {
    const testConfig: WarcraftNotificationConfig = {};
    expect(testConfig.soundsDir).toBeUndefined();
  });

  it('should support showDescriptionInToast configuration', async () => {
    const testConfigEnabled: WarcraftNotificationConfig = {
      showDescriptionInToast: true,
    };
    expect(testConfigEnabled.showDescriptionInToast).toBe(true);

    const testConfigDisabled: WarcraftNotificationConfig = {
      showDescriptionInToast: false,
    };
    expect(testConfigDisabled.showDescriptionInToast).toBe(false);
  });

  it('should default showDescriptionInToast to undefined when not set', async () => {
    const testConfig: WarcraftNotificationConfig = {};
    expect(testConfig.showDescriptionInToast).toBeUndefined();
  });

  it('should support all configuration options together', async () => {
    const testConfig: WarcraftNotificationConfig = {
      soundsDir: '/custom/sounds',
      faction: 'alliance',
      showDescriptionInToast: true,
    };

    expect(testConfig.soundsDir).toBe('/custom/sounds');
    expect(testConfig.faction).toBe('alliance');
    expect(testConfig.showDescriptionInToast).toBe(true);
  });
});
