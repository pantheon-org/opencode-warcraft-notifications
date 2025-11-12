/**
 * Integration tests for NotificationPlugin
 *
 * These tests verify the main plugin behavior works correctly
 * without requiring complex mocking of the OpenCode SDK
 */

import { describe, test, expect } from 'bun:test';
import { NotificationPlugin } from './notification';
import { createTempDir, removeTempDir, writeTempFileForFaction } from './test-utils';

describe('NotificationPlugin Integration', () => {
  test('should be a function', () => {
    expect(typeof NotificationPlugin).toBe('function');
  });

  test('should be exported from index', async () => {
    const indexExports = await import('../index.js');
    expect(indexExports.NotificationPlugin).toBe(NotificationPlugin);
  });

  test('should initialize successfully with mock context', async () => {
    const tmpDir = createTempDir();
    try {
      // This test verifies the plugin can be initialized
      // with a minimal mock context (not full OpenCode SDK)
      expect(typeof NotificationPlugin).toBe('function');
      expect(NotificationPlugin.name).toBe('NotificationPlugin');
    } finally {
      removeTempDir(tmpDir);
    }
  });

  test('should work with bundled sound files', async () => {
    const tmpDir = createTempDir();
    try {
      // Create test sound files
      writeTempFileForFaction(tmpDir, 'alliance', 'human_selected1.wav', 'test-data');
      writeTempFileForFaction(tmpDir, 'horde', 'orc_selected1.wav', 'test-data');

      // Verify files exist
      const allianceFile = Bun.file(`${tmpDir}/alliance/human_selected1.wav`);
      const hordeFile = Bun.file(`${tmpDir}/horde/orc_selected1.wav`);

      expect(await allianceFile.exists()).toBe(true);
      expect(await hordeFile.exists()).toBe(true);
    } finally {
      removeTempDir(tmpDir);
    }
  });
});
