import { describe, it, expect } from 'bun:test';
import * as sounds from './index';

describe('sounds edge cases', () => {
  it('determineSoundFaction is case-sensitive and defaults to alliance', () => {
    // Capitalized prefix should not match
    expect(sounds.determineSoundFaction('Orc_selected1.wav')).toBe('alliance');
    // Exact lowercase prefix matches horde
    expect(sounds.determineSoundFaction('orc_selected1.wav')).toBe('horde');
  });

  it('soundExists uses provided existsFn and propagates errors', async () => {
    // Create a checker that throws
    const badChecker: (path: string) => Promise<boolean> = async (_path: string) => {
      throw new Error('checker fail');
    };

    let threw = false;
    try {
      // Provide faction and dataDir, pass the badChecker as the existsFn
      // signature: soundExists(filename, faction, dataDir?, existsFn?)
      await sounds.soundExists('human_selected1.wav', 'alliance', 'someDir', badChecker);
    } catch (e) {
      threw = true;
      expect((e as Error).message).toBe('checker fail');
    }

    expect(threw).toBe(true);
  });
});
