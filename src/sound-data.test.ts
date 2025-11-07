import { describe, it, expect } from 'bun:test';
import { buildSoundsToDownload, getSoundFileList } from './sound-data';
import { DEFAULT_BASE_URL } from './plugin-config.js';

describe('sound-data module', () => {
  it('getSoundFileList returns a non-empty array and includes known files', () => {
    const list = getSoundFileList();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list).toContain('work_completed.wav');
    expect(list).toContain('human_selected1.wav');
  });

  it('buildSoundsToDownload builds SoundFile objects with correct urls and fields', () => {
    const base = 'https://example.com/base';
    const results = buildSoundsToDownload(base);

    const filenames = getSoundFileList();
    expect(results.length).toBe(filenames.length);

    const resultFilenames = results.map((r) => r.filename);
    expect(resultFilenames.sort()).toEqual(filenames.sort());

    results.forEach((r) => {
      expect(typeof r.filename).toBe('string');
      expect(typeof r.url).toBe('string');
      expect(typeof r.description).toBe('string');
      expect(r.url).toMatch(/\.wav$/);

      // Check URL starts with expected base for Alliance sounds or Horde base for Horde sounds
      const isHordeSound =
        r.filename.startsWith('orc_') ||
        r.filename.startsWith('death_knight_') ||
        r.filename.startsWith('dragon_') ||
        r.filename.startsWith('goblin_sapper_') ||
        r.filename.startsWith('ogre_') ||
        r.filename.startsWith('troll_') ||
        r.filename.startsWith('horde_ship_');

      if (isHordeSound) {
        expect(r.url.startsWith('https://www.thanatosrealms.com/war2/sounds/orcs/')).toBe(true);
      } else {
        expect(r.url.startsWith(base)).toBe(true);
      }
    });
  });

  it('buildSoundsToDownload works with DEFAULT_BASE_URL', () => {
    const results = buildSoundsToDownload(DEFAULT_BASE_URL);
    expect(results.length).toBeGreaterThan(0);

    results.forEach((r) => {
      // Check URL starts with expected base for Alliance sounds or Horde base for Horde sounds
      const isHordeSound =
        r.filename.startsWith('orc_') ||
        r.filename.startsWith('death_knight_') ||
        r.filename.startsWith('dragon_') ||
        r.filename.startsWith('goblin_sapper_') ||
        r.filename.startsWith('ogre_') ||
        r.filename.startsWith('troll_') ||
        r.filename.startsWith('horde_ship_');

      if (isHordeSound) {
        expect(r.url.startsWith('https://www.thanatosrealms.com/war2/sounds/orcs/')).toBe(true);
      } else {
        expect(r.url.startsWith(DEFAULT_BASE_URL)).toBe(true);
      }
    });
  });
});
