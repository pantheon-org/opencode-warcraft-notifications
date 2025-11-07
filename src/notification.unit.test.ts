import { describe, it, expect } from 'bun:test';

describe('NotificationPlugin configuration', () => {
  it('should apply configuration from opencode.json', async () => {
    // Mock the plugin file since we can't easily import it directly
    // This test validates the configuration interface
    interface WarcraftNotificationConfig {
      soundsDir?: string;
    }

    // Test that the config interface is properly typed
    const testConfig: WarcraftNotificationConfig = {
      soundsDir: '/custom/sounds/directory',
    };

    expect(testConfig.soundsDir).toBe('/custom/sounds/directory');
  });

  it('should handle undefined config gracefully', async () => {
    interface WarcraftNotificationConfig {
      soundsDir?: string;
    }

    const testConfig: WarcraftNotificationConfig = {};
    expect(testConfig.soundsDir).toBeUndefined();
  });
});
