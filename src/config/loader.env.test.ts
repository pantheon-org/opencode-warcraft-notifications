import { describe, it, expect } from 'bun:test';
import { withEnv } from '../test-utils';

import * as pluginConfig from './index';

describe('plugin-config env overrides', () => {
  it('getDefaultDataDir honors SOUNDS_DATA_DIR env', async () => {
    await withEnv({ SOUNDS_DATA_DIR: '/tmp/sounds_override' }, async () => {
      // Call the runtime getter to respect env overrides
      expect(pluginConfig.getDefaultDataDir()).toBe('/tmp/sounds_override');
    });
  });
});
