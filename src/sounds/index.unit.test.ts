import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import * as sounds from './index';
import { createTempDir, removeTempDir } from '../test-utils';

// Deterministic randomness helper
const withMathRandom = (value: number, fn: () => void) => {
  const orig = Math.random;
  // @ts-ignore
  Math.random = () => value;
  try {
    fn();
  } finally {
    Math.random = orig;
  }
};

describe('sounds module focused unit tests', () => {
  it('determineSoundFaction returns horde for orc_ prefix', () => {
    expect(sounds.determineSoundFaction('orc_selected1.wav')).toBe('horde');
    expect(sounds.determineSoundFaction('dragon_acknowledge1.wav')).toBe('horde');
  });

  it('determineSoundFaction returns alliance for other names', () => {
    expect(sounds.determineSoundFaction('human_selected1.wav')).toBe('alliance');
    expect(sounds.determineSoundFaction('peasant_acknowledge1.wav')).toBe('alliance');
  });

  it('getRandomSoundFromCategory returns a member of the category deterministically', () => {
    // Use value 0 to select first element
    withMathRandom(0, () => {
      const val = sounds.getRandomSoundFromCategory('humanSelected');
      expect(val).toBe('human_selected1.wav');
    });
    // Use value close to 1 to select last element
    withMathRandom(0.9999, () => {
      const val = sounds.getRandomSoundFromCategory('humanSelected');
      expect(val).toBe('human_selected6.wav');
    });
  });

  it('getRandomSoundPathFromFaction returns a path in provided dataDir', () => {
    const tmp = createTempDir('wc-sound-path-');
    try {
      // Use deterministic random to pick a sound
      withMathRandom(0, () => {
        const path = sounds.getRandomSoundPathFromFaction('alliance', tmp);
        expect(typeof path).toBe('string');
        expect(path).toContain(tmp);
      });
    } finally {
      removeTempDir(tmp);
    }
  });
});
