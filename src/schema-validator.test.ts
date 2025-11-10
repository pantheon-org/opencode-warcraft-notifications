import { describe, it, expect } from 'bun:test';
import { validatePluginConfig, validateAndSanitizeConfig } from './schema-validator.js';

describe('schema-validator', () => {
  describe('validatePluginConfig', () => {
    describe('valid configurations', () => {
      it('should validate empty config as valid with warning', () => {
        const result = validatePluginConfig({});
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });

      it('should validate config with only faction', () => {
        const result = validatePluginConfig({ faction: 'alliance' });
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });

      it('should validate config with faction horde', () => {
        const result = validatePluginConfig({ faction: 'horde' });
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });

      it('should validate config with faction both', () => {
        const result = validatePluginConfig({ faction: 'both' });
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });

      it('should validate config with only soundsDir', () => {
        const result = validatePluginConfig({ soundsDir: '/path/to/sounds' });
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });

      it('should validate config with both faction and soundsDir', () => {
        const result = validatePluginConfig({
          faction: 'alliance',
          soundsDir: '/path/to/sounds',
        });
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });

      it('should handle null config with warning', () => {
        const result = validatePluginConfig(null);
        expect(result.valid).toBe(true);
        expect(result.warnings).toBeDefined();
        expect(result.warnings).toContain('No configuration provided. Using default values.');
      });

      it('should handle undefined config with warning', () => {
        const result = validatePluginConfig(undefined);
        expect(result.valid).toBe(true);
        expect(result.warnings).toBeDefined();
        expect(result.warnings).toContain('No configuration provided. Using default values.');
      });
    });

    describe('invalid configurations', () => {
      it('should reject invalid faction value', () => {
        const result = validatePluginConfig({ faction: 'night-elf' });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.length).toBeGreaterThan(0);
        expect(result.errors?.[0]).toContain('faction');
        expect(result.errors?.[0]).toContain('alliance');
        expect(result.errors?.[0]).toContain('horde');
        expect(result.errors?.[0]).toContain('both');
      });

      it('should reject numeric faction value', () => {
        const result = validatePluginConfig({ faction: 123 });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('faction');
      });

      it('should reject non-string soundsDir', () => {
        const result = validatePluginConfig({ soundsDir: 123 });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('soundsDir');
        expect(result.errors?.[0]).toContain('string');
      });

      it('should reject boolean soundsDir', () => {
        const result = validatePluginConfig({ soundsDir: true });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('soundsDir');
      });

      it('should reject object soundsDir', () => {
        const result = validatePluginConfig({ soundsDir: { path: '/some/path' } });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('soundsDir');
      });

      it('should reject non-object config', () => {
        const result = validatePluginConfig('string config');
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('must be an object');
        expect(result.errors?.[0]).toContain('string');
      });

      it('should reject number as config', () => {
        const result = validatePluginConfig(42);
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('must be an object');
        expect(result.errors?.[0]).toContain('number');
      });

      it('should reject boolean as config', () => {
        const result = validatePluginConfig(true);
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('must be an object');
      });

      it('should reject unrecognized keys', () => {
        const result = validatePluginConfig({
          faction: 'alliance',
          unknownKey: 'value',
        });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('Unrecognized');
        expect(result.errors?.[0]).toContain('unknownKey');
      });

      it('should reject multiple unrecognized keys', () => {
        const result = validatePluginConfig({
          faction: 'alliance',
          unknownKey1: 'value1',
          unknownKey2: 'value2',
        });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0]).toContain('Unrecognized');
      });

      it('should provide multiple errors for multiple issues', () => {
        const result = validatePluginConfig({
          faction: 'invalid-faction',
          soundsDir: 123,
          extraKey: 'extra',
        });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.length).toBeGreaterThan(1);
      });
    });

    describe('edge cases', () => {
      it('should handle array as config', () => {
        const result = validatePluginConfig([]);
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
      });

      it('should handle empty string faction', () => {
        const result = validatePluginConfig({ faction: '' });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
      });

      it('should allow empty string soundsDir (valid string)', () => {
        const result = validatePluginConfig({ soundsDir: '' });
        expect(result.valid).toBe(true);
      });

      it('should handle config with null faction', () => {
        const result = validatePluginConfig({ faction: null });
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
      });

      it('should handle config with undefined values', () => {
        const result = validatePluginConfig({
          faction: undefined,
          soundsDir: undefined,
        });
        // Undefined values should be treated as missing (optional fields)
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('validateAndSanitizeConfig', () => {
    it('should return typed config for valid configuration', () => {
      const config = validateAndSanitizeConfig({ faction: 'alliance' });
      expect(config).toEqual({ faction: 'alliance' });
      expect(config.faction).toBe('alliance');
    });

    it('should return empty object for null config', () => {
      const config = validateAndSanitizeConfig(null);
      expect(config).toEqual({});
    });

    it('should return empty object for undefined config', () => {
      const config = validateAndSanitizeConfig(undefined);
      expect(config).toEqual({});
    });

    it('should throw error for invalid faction', () => {
      expect(() => {
        validateAndSanitizeConfig({ faction: 'invalid' });
      }).toThrow('[Warcraft Notifications] Configuration validation failed');
    });

    it('should throw error with detailed messages', () => {
      try {
        validateAndSanitizeConfig({ faction: 'invalid', soundsDir: 123 });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const message = (error as Error).message;
        expect(message).toContain('[Warcraft Notifications] Configuration validation failed');
        expect(message).toContain('faction');
      }
    });

    it('should throw error for unrecognized keys', () => {
      expect(() => {
        validateAndSanitizeConfig({ faction: 'alliance', badKey: 'value' });
      }).toThrow('Unrecognized');
    });

    it('should return config with both fields', () => {
      const config = validateAndSanitizeConfig({
        faction: 'horde',
        soundsDir: '/custom/path',
      });
      expect(config.faction).toBe('horde');
      expect(config.soundsDir).toBe('/custom/path');
    });

    it('should preserve valid soundsDir paths', () => {
      const testPath = '~/.config/opencode/sounds';
      const config = validateAndSanitizeConfig({ soundsDir: testPath });
      expect(config.soundsDir).toBe(testPath);
    });

    it('should handle Windows-style paths', () => {
      const testPath = 'C:\\Users\\Username\\AppData\\Local\\OpenCode\\Sounds';
      const config = validateAndSanitizeConfig({ soundsDir: testPath });
      expect(config.soundsDir).toBe(testPath);
    });
  });

  describe('error message quality', () => {
    it('should provide specific error for invalid faction', () => {
      const result = validatePluginConfig({ faction: 'elves' });
      expect(result.errors?.[0]).toContain('Invalid');
      expect(result.errors?.[0]).toContain('faction');
    });

    it('should provide specific error for wrong type', () => {
      const result = validatePluginConfig({ soundsDir: 42 });
      expect(result.errors?.[0]).toContain('Expected string');
      expect(result.errors?.[0]).toContain('soundsDir');
    });

    it('should list all allowed faction values', () => {
      const result = validatePluginConfig({ faction: 'undead' });
      expect(result.errors?.[0]).toContain('alliance');
      expect(result.errors?.[0]).toContain('horde');
      expect(result.errors?.[0]).toContain('both');
    });
  });

  describe('performance', () => {
    it('should validate configuration quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        validatePluginConfig({ faction: 'alliance', soundsDir: '/path/to/sounds' });
      }
      const end = performance.now();
      const timePerValidation = (end - start) / 1000;

      // Should complete in less than 0.1ms per validation (100ms for 1000)
      expect(timePerValidation).toBeLessThan(0.1);
    });

    it('should fail validation quickly for invalid config', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        validatePluginConfig({ faction: 'invalid' });
      }
      const end = performance.now();
      const timePerValidation = (end - start) / 1000;

      // Should complete in less than 0.1ms per validation
      expect(timePerValidation).toBeLessThan(0.1);
    });
  });

  describe('backward compatibility', () => {
    it('should accept all valid faction values from schema', () => {
      const validFactions = ['alliance', 'horde', 'both'];

      for (const faction of validFactions) {
        const result = validatePluginConfig({ faction });
        expect(result.valid).toBe(true);
      }
    });

    it('should allow optional fields to be missing', () => {
      const result = validatePluginConfig({});
      expect(result.valid).toBe(true);
    });

    it('should allow partial configuration', () => {
      const result1 = validatePluginConfig({ faction: 'alliance' });
      expect(result1.valid).toBe(true);

      const result2 = validatePluginConfig({ soundsDir: '/path' });
      expect(result2.valid).toBe(true);
    });
  });
});
