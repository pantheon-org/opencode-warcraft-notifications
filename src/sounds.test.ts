import { test, expect, describe, jest } from 'bun:test';
import { join } from 'path';
import {
  sounds,
  getAllSounds,
  getRandomSound,
  getRandomSoundFromCategory,
  soundExists,
  getSoundPath,
  getRandomSoundPath,
} from './sounds.ts';

describe('sounds data structure', () => {
  test('should have all expected categories', () => {
    const expectedCategories = [
      'humanSelected',
      'humanAcknowledge',
      'dwarfSelected',
      'dwarfAcknowledge',
      'elfSelected',
      'elfAcknowledge',
      'knightSelected',
      'knightAcknowledge',
      'mageSelected',
      'mageAcknowledge',
      'peasantSelected',
      'peasantAcknowledge',
      'shipSelected',
      'shipAcknowledge',
      'special',
    ];

    const actualCategories = Object.keys(sounds);
    expect(actualCategories.sort()).toEqual(expectedCategories.sort());
  });

  test('should have non-empty arrays for each category', () => {
    Object.entries(sounds).forEach(([_category, soundFiles]) => {
      void _category;
      expect(Array.isArray(soundFiles)).toBe(true);
      expect(soundFiles.length).toBeGreaterThan(0);
    });
  });

  test('should have wav file extensions', () => {
    Object.entries(sounds).forEach(([_category, soundFiles]) => {
      void _category;
      soundFiles.forEach((file: string) => {
        expect(file).toMatch(/\.wav$/);
      });
    });
  });
});

describe('getAllSounds()', () => {
  test('should return all sounds as flat array', () => {
    const allSounds = getAllSounds();
    const expectedCount = Object.values(sounds).reduce((count, arr) => count + arr.length, 0);

    expect(allSounds.length).toBe(expectedCount);
    expect(Array.isArray(allSounds)).toBe(true);
  });

  test('should contain sounds from all categories', () => {
    const allSounds = getAllSounds();

    // Check that sounds from each category are included
    Object.values(sounds).forEach((categorySounds: readonly string[]) => {
      categorySounds.forEach((sound: string) => {
        expect(allSounds).toContain(sound);
      });
    });
  });
});

describe('getRandomSound()', () => {
  test('should return a valid sound file', () => {
    const randomSound = getRandomSound();
    const allSounds = getAllSounds();

    expect(typeof randomSound).toBe('string');
    expect(allSounds).toContain(randomSound);
    expect(randomSound).toMatch(/\.wav$/);
  });

  test('should return different sounds across multiple calls', () => {
    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      results.add(getRandomSound());
    }

    expect(results.size).toBeGreaterThanOrEqual(2);
  });
});

describe('getRandomSoundFromCategory()', () => {
  test('should return sound from specified category', () => {
    const categories = Object.keys(sounds) as (keyof typeof sounds)[];

    const getRandomSoundTyped = <C extends keyof typeof sounds>(
      category: C,
    ): (typeof sounds)[C][number] => {
      return getRandomSoundFromCategory(category) as (typeof sounds)[C][number];
    };

    categories.forEach((category) => {
      const randomSound = getRandomSoundTyped(category);
      const categorySounds = sounds[category];

      expect(typeof randomSound).toBe('string');
      expect(categorySounds).toContain(randomSound);
    });
  });

  test('should handle categories with multiple items', () => {
    const getRandomSoundTyped = <C extends keyof typeof sounds>(
      category: C,
    ): (typeof sounds)[C][number] => {
      return getRandomSoundFromCategory(category) as (typeof sounds)[C][number];
    };

    const sound = getRandomSoundTyped('humanSelected');
    expect(sounds.humanSelected).toContain(sound);
  });
});

describe('getSoundPath()', () => {
  test('should return correct path structure', () => {
    const testFile = 'test.wav';
    const path = getSoundPath(testFile);

    expect(typeof path).toBe('string');
    expect(path).toContain('opencode');
    expect(path).toMatch(new RegExp(testFile + '$'));
  });

  test('should use correct base directory', () => {
    const testFile = 'human_selected1.wav' as const;
    const path = getSoundPath(testFile);

    // Should use ~/.config/opencode/sounds by default
    expect(path).toContain('.config/opencode/sounds');
    expect(path).toContain(testFile);
  });
});

describe('getRandomSoundPath()', () => {
  test('should return valid path to random sound', () => {
    const randomPath = getRandomSoundPath();
    const allSounds = getAllSounds();

    expect(typeof randomPath).toBe('string');
    expect(randomPath).toContain('opencode');
    expect(randomPath).toMatch(/\.wav$/);

    const filename = randomPath.split('/').pop()!;
    expect(allSounds).toContain(filename);
  });
});

describe('soundExists()', () => {
  test('should return boolean', async () => {
    const mockExists = jest.fn(() => Promise.resolve(true));

    const fsPromises = await import('fs/promises');
    type FsPromisesWithExists = { exists(path: string): Promise<boolean> };
    const fsWithExists = fsPromises as unknown as FsPromisesWithExists;
    const spyExists = jest.spyOn(fsWithExists, 'exists').mockImplementation(mockExists);

    try {
      const result = await soundExists('test.wav');
      expect(typeof result).toBe('boolean');
      expect(mockExists).toHaveBeenCalledTimes(1);
    } finally {
      spyExists.mockRestore();
    }
  });

  test('should call exists with correct path', async () => {
    const mockExists = jest.fn(() => Promise.resolve(false));

    const fsPromises = await import('fs/promises');
    type FsPromisesWithExists = { exists(path: string): Promise<boolean> };
    const fsWithExists = fsPromises as unknown as FsPromisesWithExists;
    const spyExists = jest.spyOn(fsWithExists, 'exists').mockImplementation(mockExists);

    try {
      const testFile = 'human_selected1.wav' as const;
      await soundExists(testFile);

      const expectedPath = getSoundPath(testFile);
      expect(mockExists).toHaveBeenCalledTimes(1);
      expect(mockExists).toHaveBeenCalledWith(expectedPath);
    } finally {
      spyExists.mockRestore();
    }
  });
});
