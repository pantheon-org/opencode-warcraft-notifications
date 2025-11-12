import { test, expect, describe } from 'bun:test';
import {
  sounds,
  allianceSounds,
  hordeSounds,
  getAllSounds,
  getRandomSound,
  getRandomSoundFromCategory,
  soundExists,
  getSoundPath,
  getRandomSoundPath,
  getAllianceSoundCategories,
  getHordeSoundCategories,
  getSoundsByFaction,
  getRandomSoundFromFaction,
  getRandomSoundPathFromFaction,
  getSoundFileList,
} from './index';

describe('sounds data structure', () => {
  test('should have all expected categories', () => {
    const expectedCategories = [
      // Alliance sounds
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
      // Horde sounds
      'orcSelected',
      'orcAcknowledge',
      'deathKnightSelected',
      'deathKnightAcknowledge',
      'dragonSelected',
      'dragonAcknowledge',
      'goblinSapperSelected',
      'goblinSapperAcknowledge',
      'ogreSelected',
      'ogreAcknowledge',
      'ogreMageSelected',
      'ogreMageAcknowledge',
      'trollSelected',
      'trollAcknowledge',
      'hordeShipSelected',
      'hordeShipAcknowledge',
      // Special sounds
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
    const faction = 'alliance';
    const path = getSoundPath(testFile, faction);

    expect(typeof path).toBe('string');
    expect(path).toContain('opencode');
    expect(path).toContain(faction);
    expect(path).toMatch(new RegExp(testFile + '$'));
  });

  test('should use correct base directory', () => {
    const testFile = 'human_selected1.wav' as const;
    const faction = 'alliance';
    const path = getSoundPath(testFile, faction);

    // Should use the default plugin storage path by default with sounds subdirectory
    expect(path).toContain('.local/share/opencode/storage/plugin');
    expect(path).toContain('/sounds/');
    expect(path).toContain(faction);
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
    let calledCount = 0;
    const fakeExists = async (_p: string) => {
      calledCount++;
      return true;
    };

    const result = await soundExists('test.wav', 'alliance', undefined, fakeExists);
    expect(typeof result).toBe('boolean');
    expect(calledCount).toBe(1);
  });

  test('should call exists with correct path', async () => {
    let calledCount = 0;
    let lastArg: string | undefined;
    const fakeExists = async (p: string) => {
      calledCount++;
      lastArg = p;
      return false;
    };

    const testFile = 'human_selected1.wav' as const;
    await soundExists(testFile, 'alliance', undefined, fakeExists);

    const expectedPath = getSoundPath(testFile, 'alliance');
    expect(calledCount).toBe(1);
    expect(lastArg).toBe(expectedPath);
  });

  test('defaults to real fs when no existsFn supplied', async () => {
    const { createTempDir, removeTempDir, writeTempFileForFaction } = await import('../test-utils');
    const tmp = createTempDir();
    try {
      const filename = 'human_selected1.wav';
      writeTempFileForFaction(tmp, 'alliance', filename, 'data');

      // Now call soundExists with the real fs (no existsFn)
      const result = await soundExists(filename, 'alliance', tmp);
      expect(result).toBe(true);

      const missing = await soundExists('no-such-file.wav', 'alliance', tmp);
      expect(missing).toBe(false);
    } finally {
      removeTempDir(tmp);
    }
  });
});

describe('faction-aware functions', () => {
  test('getAllianceSoundCategories returns correct categories', () => {
    const allianceCategories = getAllianceSoundCategories();
    const expectedAlliance = [
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
    ] as (keyof typeof allianceSounds)[];

    expect(allianceCategories.sort()).toEqual(expectedAlliance.sort());
  });

  test('getHordeSoundCategories returns correct categories', () => {
    const hordeCategories = getHordeSoundCategories();
    const expectedHorde = [
      'orcSelected',
      'orcAcknowledge',
      'deathKnightSelected',
      'deathKnightAcknowledge',
      'dragonSelected',
      'dragonAcknowledge',
      'goblinSapperSelected',
      'goblinSapperAcknowledge',
      'ogreSelected',
      'ogreAcknowledge',
      'ogreMageSelected',
      'ogreMageAcknowledge',
      'trollSelected',
      'trollAcknowledge',
      'hordeShipSelected',
      'hordeShipAcknowledge',
      'special',
    ] as (keyof typeof hordeSounds)[];

    expect(hordeCategories.sort()).toEqual(expectedHorde.sort());
  });

  test('getSoundsByFaction returns correct sounds for each faction', () => {
    const allianceSounds = getSoundsByFaction('alliance');
    const hordeSounds = getSoundsByFaction('horde');
    const bothSounds = getSoundsByFaction('both');
    const specialSounds = sounds.special;

    expect(allianceSounds.length).toBeGreaterThan(0);
    expect(hordeSounds.length).toBeGreaterThan(0);
    expect(bothSounds.length).toBeGreaterThan(allianceSounds.length);
    expect(bothSounds.length).toBeGreaterThan(hordeSounds.length);

    // Both should equal alliance + horde (no deduplication since special sounds are different)
    expect(bothSounds.length).toBe(allianceSounds.length + hordeSounds.length);

    // Check that alliance sounds don't contain horde-specific unit sounds (excluding special sounds)
    const allianceNonSpecialSounds = allianceSounds.filter(
      (s) => !(specialSounds as readonly string[]).includes(s),
    );
    expect(allianceNonSpecialSounds.some((s) => s.startsWith('orc_'))).toBe(false);

    // Check that horde sounds contain horde-specific sounds
    expect(hordeSounds.some((s) => s.startsWith('orc_'))).toBe(true);
  });

  test('getRandomSoundFromFaction returns valid sounds', () => {
    const allianceSound = getRandomSoundFromFaction('alliance');
    const hordeSound = getRandomSoundFromFaction('horde');
    const bothSound = getRandomSoundFromFaction('both');

    const allianceSounds = getSoundsByFaction('alliance');
    const hordeSounds = getSoundsByFaction('horde');
    const bothSounds = getSoundsByFaction('both');

    expect(allianceSounds).toContain(allianceSound);
    expect(hordeSounds).toContain(hordeSound);
    expect(bothSounds).toContain(bothSound);
  });

  test('getRandomSoundPathFromFaction returns valid paths', () => {
    const alliancePath = getRandomSoundPathFromFaction('alliance');
    const hordePath = getRandomSoundPathFromFaction('horde');
    const bothPath = getRandomSoundPathFromFaction('both');

    expect(typeof alliancePath).toBe('string');
    expect(typeof hordePath).toBe('string');
    expect(typeof bothPath).toBe('string');

    expect(alliancePath).toMatch(/\.wav$/);
    expect(hordePath).toMatch(/\.wav$/);
    expect(bothPath).toMatch(/\.wav$/);

    expect(alliancePath).toContain('opencode');
    expect(hordePath).toContain('opencode');
    expect(bothPath).toContain('opencode');
  });
});

describe('getSoundFileList', () => {
  test('returns all sounds when no faction specified', () => {
    const list = getSoundFileList();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    // Note: Combined sounds object has horde 'special' overwrite alliance 'special'
    // so alliance special sounds (work_completed.wav, jobs_done.wav) are not in the combined list
    expect(list).toContain('orc_work_completed.wav'); // Horde special
    expect(list).toContain('human_selected1.wav');
    expect(list).toContain('orc_selected1.wav');
  });

  test('returns faction-specific sounds when faction specified', () => {
    const allianceList = getSoundFileList('alliance');
    const hordeList = getSoundFileList('horde');

    expect(allianceList).toContain('human_selected1.wav');
    expect(allianceList).not.toContain('orc_selected1.wav');

    expect(hordeList).toContain('orc_selected1.wav');
    expect(hordeList).not.toContain('human_selected1.wav');
  });

  test('returns consistent counts', () => {
    const allSounds = getSoundFileList();
    const allianceSounds = getSoundFileList('alliance');
    const hordeSounds = getSoundFileList('horde');

    // Note: getAllSounds() returns sounds from the combined object where 'special'
    // category is shared between factions (horde special overwrites alliance special in spread)
    // So the total is less than alliance + horde
    expect(allSounds.length).toBeGreaterThan(0);
    expect(allianceSounds.length).toBeGreaterThan(0);
    expect(hordeSounds.length).toBeGreaterThan(0);
    expect(allSounds.length).toBeLessThanOrEqual(allianceSounds.length + hordeSounds.length);
  });

  test('alliance sounds contain expected files', () => {
    const allianceSounds = getSoundFileList('alliance');

    expect(allianceSounds).toContain('human_selected1.wav');
    expect(allianceSounds).toContain('peasant_acknowledge1.wav');
    expect(allianceSounds).toContain('knight_selected1.wav');
    expect(allianceSounds).toContain('jobs_done.wav');
  });

  test('horde sounds contain expected files', () => {
    const hordeSounds = getSoundFileList('horde');

    expect(hordeSounds).toContain('orc_selected1.wav');
    expect(hordeSounds).toContain('ogre_acknowledge1.wav');
    expect(hordeSounds).toContain('troll_selected1.wav');
    expect(hordeSounds).toContain('orc_work_completed.wav');
  });
});
