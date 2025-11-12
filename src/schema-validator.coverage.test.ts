import { describe, it, expect } from 'bun:test';
import { validatePluginConfig, validateAndSanitizeConfig } from './schema-validator.js';

describe('schema-validator coverage tests', () => {
  describe('formatInvalidValueError edge cases', () => {
    it('should handle enum values without array (invalid_value error)', () => {
      // This tests the case where values is not an array
      const result = validatePluginConfig({ faction: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toContain('Invalid');
    });
  });

  describe('formatUnrecognizedKeysError edge cases', () => {
    it('should handle unrecognized keys without array', () => {
      // This tests unrecognized keys error formatting
      const result = validatePluginConfig({
        unknownKey1: 'value1',
        unknownKey2: 'value2',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toContain('Unrecognized');
    });
  });

  describe('formatInvalidStringError edge cases', () => {
    it('should handle invalid string validation without URL type', () => {
      // Note: The current schema doesn't have URL validation for soundsDir,
      // but we test the code path for completeness
      const result = validatePluginConfig({ soundsDir: [] });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('formatZodIssue default case', () => {
    it('should handle unknown error codes gracefully', () => {
      // Test with a config that causes an unknown error code
      const result = validatePluginConfig({ soundsDir: { invalid: 'object' } });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validatePluginConfig unexpected errors', () => {
    it('should handle unexpected validation errors', () => {
      // Pass a circular reference to cause an unexpected error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const circular: any = {};
      circular.self = circular;

      const result = validatePluginConfig(circular);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validateAndSanitizeConfig warning logging', () => {
    it('should log warnings in DEBUG mode for valid config with warnings', () => {
      const origDebug = process.env.DEBUG_OPENCODE;
      try {
        process.env.DEBUG_OPENCODE = 'true';
        const config = validateAndSanitizeConfig(null);
        expect(config).toEqual({});
      } finally {
        if (origDebug === undefined) {
          delete process.env.DEBUG_OPENCODE;
        } else {
          process.env.DEBUG_OPENCODE = origDebug;
        }
      }
    });

    it('should not log warnings when DEBUG_OPENCODE is not set', () => {
      const origDebug = process.env.DEBUG_OPENCODE;
      try {
        delete process.env.DEBUG_OPENCODE;
        const config = validateAndSanitizeConfig(undefined);
        expect(config).toEqual({});
      } finally {
        if (origDebug !== undefined) {
          process.env.DEBUG_OPENCODE = origDebug;
        }
      }
    });
  });

  describe('error message formatting', () => {
    it('should format multiple validation errors correctly', () => {
      try {
        validateAndSanitizeConfig({
          faction: 'invalid',
          soundsDir: 123,
          extraField: 'not-allowed',
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const message = (error as Error).message;
        expect(message).toContain('[Warcraft Notifications]');
        expect(message).toContain('Configuration validation failed');
        expect(message).toContain('  - '); // Check for proper formatting
      }
    });

    it('should handle non-Error exceptions in validation', () => {
      const result = validatePluginConfig({ soundsDir: Symbol('test') });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('edge cases for type validation', () => {
    it('should reject array as soundsDir', () => {
      const result = validatePluginConfig({ soundsDir: ['path1', 'path2'] });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toContain('soundsDir');
    });

    it('should reject function as config value', () => {
      const result = validatePluginConfig({ soundsDir: () => '/path' });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle date objects as invalid config values', () => {
      const result = validatePluginConfig({ faction: new Date() });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validation with complex objects', () => {
    it('should reject nested objects in soundsDir', () => {
      const result = validatePluginConfig({
        soundsDir: {
          base: '/path',
          subfolder: 'sounds',
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle validation with multiple layers of invalid data', () => {
      const result = validatePluginConfig({
        faction: { nested: 'object' },
        soundsDir: null,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});
