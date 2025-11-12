import { describe, test, expect } from 'bun:test';
import {
  allianceSoundDescriptions,
  hordeSoundDescriptions,
  soundDescriptions,
  getSoundDescription,
} from './descriptions';
import { allianceSounds, hordeSounds } from './data/index';

describe('Sound Descriptions', () => {
  describe('allianceSoundDescriptions', () => {
    test('should have descriptions for all alliance sounds', () => {
      const allAllianceSounds = Object.values(allianceSounds).flat();
      const missingDescriptions: string[] = [];

      allAllianceSounds.forEach((filename) => {
        if (!allianceSoundDescriptions[filename]) {
          missingDescriptions.push(filename);
        }
      });

      expect(missingDescriptions).toEqual([]);
    });

    test('should have non-empty descriptions', () => {
      Object.entries(allianceSoundDescriptions).forEach(([_filename, description]) => {
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(0);
        expect(typeof description).toBe('string');
      });
    });

    test('should include common alliance quotes', () => {
      expect(allianceSoundDescriptions['human_selected1.wav']).toBe('Yes, milord?');
      expect(allianceSoundDescriptions['peasant_acknowledge1.wav']).toBe('Yes, milord.');
      expect(allianceSoundDescriptions['jobs_done.wav']).toBe("Job's done!");
    });
  });

  describe('hordeSoundDescriptions', () => {
    test('should have descriptions for all horde sounds', () => {
      const allHordeSounds = Object.values(hordeSounds).flat();
      const missingDescriptions: string[] = [];

      allHordeSounds.forEach((filename) => {
        if (!hordeSoundDescriptions[filename]) {
          missingDescriptions.push(filename);
        }
      });

      expect(missingDescriptions).toEqual([]);
    });

    test('should have non-empty descriptions', () => {
      Object.entries(hordeSoundDescriptions).forEach(([_filename, description]) => {
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(0);
        expect(typeof description).toBe('string');
      });
    });

    test('should include common horde quotes', () => {
      expect(hordeSoundDescriptions['orc_acknowledge3.wav']).toBe('Work, work.');
      expect(hordeSoundDescriptions['orc_work_completed.wav']).toBe('Work complete.');
      expect(hordeSoundDescriptions['troll_selected1.wav']).toBe('Yes, mon?');
    });
  });

  describe('soundDescriptions (combined)', () => {
    test('should include both alliance and horde descriptions', () => {
      // Check alliance sounds
      expect(soundDescriptions['human_selected1.wav']).toBe('Yes, milord?');
      expect(soundDescriptions['peasant_acknowledge1.wav']).toBe('Yes, milord.');

      // Check horde sounds
      expect(soundDescriptions['orc_acknowledge3.wav']).toBe('Work, work.');
      expect(soundDescriptions['troll_selected1.wav']).toBe('Yes, mon?');
    });

    test('should have more descriptions than either faction alone', () => {
      const allianceCount = Object.keys(allianceSoundDescriptions).length;
      const hordeCount = Object.keys(hordeSoundDescriptions).length;
      const combinedCount = Object.keys(soundDescriptions).length;

      expect(combinedCount).toBeGreaterThanOrEqual(allianceCount);
      expect(combinedCount).toBeGreaterThanOrEqual(hordeCount);
    });
  });

  describe('getSoundDescription', () => {
    test('should return description for valid filename', () => {
      expect(getSoundDescription('human_selected1.wav')).toBe('Yes, milord?');
      expect(getSoundDescription('orc_acknowledge3.wav')).toBe('Work, work.');
      expect(getSoundDescription('jobs_done.wav')).toBe("Job's done!");
    });

    test('should return undefined for invalid filename', () => {
      expect(getSoundDescription('nonexistent.wav')).toBeUndefined();
      expect(getSoundDescription('')).toBeUndefined();
      expect(getSoundDescription('invalid_sound.wav')).toBeUndefined();
    });

    test('should handle all known sound files', () => {
      const allAllianceSounds = Object.values(allianceSounds).flat();
      const allHordeSounds = Object.values(hordeSounds).flat();
      const allSounds = [...allAllianceSounds, ...allHordeSounds];

      allSounds.forEach((filename) => {
        const description = getSoundDescription(filename);
        expect(description).toBeTruthy();
        expect(typeof description).toBe('string');
      });
    });
  });

  describe('description quality', () => {
    test('should not have duplicate descriptions for different sounds', () => {
      const descriptions = Object.values(soundDescriptions);
      const uniqueDescriptions = new Set(descriptions);

      // Allow some duplication (e.g., "Yes?" appears multiple times) but not excessive
      const duplicationRatio = uniqueDescriptions.size / descriptions.length;
      expect(duplicationRatio).toBeGreaterThan(0.5); // At least 50% unique
    });

    test('should include punctuation in descriptions', () => {
      const descriptionsWithPunctuation = Object.values(soundDescriptions).filter((desc) =>
        desc.match(/[.!?]$/),
      );

      // Most descriptions should end with punctuation
      expect(descriptionsWithPunctuation.length).toBeGreaterThan(
        Object.values(soundDescriptions).length * 0.8,
      );
    });

    test('should not have excessively long descriptions', () => {
      Object.values(soundDescriptions).forEach((description) => {
        expect(description.length).toBeLessThan(100); // Reasonable max length
      });
    });
  });
});
