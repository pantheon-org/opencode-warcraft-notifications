import { describe, it, expect } from 'bun:test';
import {
  buildSoundsToDownload,
  buildAllSoundsToDownload,
  getSoundFileList,
  getSoundCounts,
  allianceSoundEntries,
  hordeSoundEntries,
} from './sound-data';
import { DEFAULT_BASE_URL } from './plugin-config.js';

describe('sound-data module', () => {
  it('getSoundFileList returns all sounds when no faction specified', () => {
    const list = getSoundFileList();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list).toContain('work_completed.wav');
    expect(list).toContain('human_selected1.wav');
    expect(list).toContain('orc_selected1.wav');
  });

  it('getSoundFileList returns faction-specific sounds when faction specified', () => {
    const allianceList = getSoundFileList('alliance');
    const hordeList = getSoundFileList('horde');

    expect(allianceList).toContain('human_selected1.wav');
    expect(allianceList).not.toContain('orc_selected1.wav');

    expect(hordeList).toContain('orc_selected1.wav');
    expect(hordeList).not.toContain('human_selected1.wav');
  });

  it('getSoundCounts returns correct counts', () => {
    const counts = getSoundCounts();
    expect(counts.alliance).toBe(allianceSoundEntries.length);
    expect(counts.horde).toBe(hordeSoundEntries.length);
    expect(counts.total).toBe(counts.alliance + counts.horde);
  });

  it('buildSoundsToDownload builds Alliance SoundFile objects correctly', () => {
    const base = 'https://example.com/base';
    const results = buildSoundsToDownload('alliance', base);

    const allianceFilenames = getSoundFileList('alliance');
    expect(results.length).toBe(allianceFilenames.length);

    results.forEach((r) => {
      expect(typeof r.filename).toBe('string');
      expect(typeof r.url).toBe('string');
      expect(typeof r.description).toBe('string');
      expect(r.faction).toBe('alliance');
      expect(r.subdirectory).toBe('alliance');
      expect(r.url).toMatch(/\.wav$/);
      expect(r.url.startsWith(base)).toBe(true);
    });
  });

  it('buildSoundsToDownload builds Horde SoundFile objects correctly', () => {
    const base = 'https://example.com/base';
    const results = buildSoundsToDownload('horde', base);

    const hordeFilenames = getSoundFileList('horde');
    expect(results.length).toBe(hordeFilenames.length);

    results.forEach((r) => {
      expect(typeof r.filename).toBe('string');
      expect(typeof r.url).toBe('string');
      expect(typeof r.description).toBe('string');
      expect(r.faction).toBe('horde');
      expect(r.subdirectory).toBe('horde');
      expect(r.url).toMatch(/\.wav$/);
      expect(r.url.startsWith('https://www.thanatosrealms.com/war2/sounds/orcs/')).toBe(true);
    });
  });

  it('buildAllSoundsToDownload builds all SoundFile objects', () => {
    const base = 'https://example.com/base';
    const results = buildAllSoundsToDownload(base);

    const totalCount = getSoundCounts().total;
    expect(results.length).toBe(totalCount);

    const allianceSounds = results.filter((r) => r.faction === 'alliance');
    const hordeSounds = results.filter((r) => r.faction === 'horde');

    expect(allianceSounds.length).toBe(getSoundCounts().alliance);
    expect(hordeSounds.length).toBe(getSoundCounts().horde);

    // Check Alliance sounds use provided base URL
    allianceSounds.forEach((r) => {
      expect(r.url.startsWith(base)).toBe(true);
      expect(r.subdirectory).toBe('alliance');
    });

    // Check Horde sounds use their own base URL
    hordeSounds.forEach((r) => {
      expect(r.url.startsWith('https://www.thanatosrealms.com/war2/sounds/orcs/')).toBe(true);
      expect(r.subdirectory).toBe('horde');
    });
  });

  it('buildAllSoundsToDownload works with DEFAULT_BASE_URL', () => {
    const results = buildAllSoundsToDownload(DEFAULT_BASE_URL);
    expect(results.length).toBeGreaterThan(0);

    const allianceSounds = results.filter((r) => r.faction === 'alliance');
    const hordeSounds = results.filter((r) => r.faction === 'horde');

    allianceSounds.forEach((r) => {
      expect(r.url.startsWith(DEFAULT_BASE_URL)).toBe(true);
    });

    hordeSounds.forEach((r) => {
      expect(r.url.startsWith('https://www.thanatosrealms.com/war2/sounds/orcs/')).toBe(true);
    });
  });
});
