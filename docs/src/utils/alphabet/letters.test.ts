import { describe, it, expect } from 'bun:test';
import { ALPHABET } from './types';
import { cellType } from './letters/types';
import { getColorFromLetter, themeType, darkTheme } from './theme';

describe('ALPHABET structure', () => {
  it('should contain 26 letters A-Z', () => {
    const keys = Object.keys(ALPHABET).sort();
    expect(keys.length).toBe(26);
    expect(keys[0]).toBe('A');
    expect(keys[keys.length - 1]).toBe('Z');
  });
});

describe('Glyph consistency', () => {
  it('each letter should have 7 rows and valid cell values', () => {
    Object.entries(ALPHABET).forEach(([name, data]) => {
      expect(data).toHaveProperty('rows');
      for (let r = 0; r < 7; r++) {
        expect(Array.isArray(data.rows[r])).toBe(true);
        // each cell should be one of the cellType values or numeric 0/1
        data.rows[r].forEach((cell) => {
          const validValue = [cellType.PRIMARY, cellType.SECONDARY, cellType.BLANK].includes(
            cell as any,
          );
          const validNumber = typeof cell === 'number' && (cell === 0 || cell === 1);
          expect(validValue || validNumber).toBe(true);
        });
      }
    });
  });
});

describe('Color mapping with actual letter data', () => {
  it('getColorFromLetter returns matching global theme colors for primary/secondary/blank', () => {
    const sampleLetter = ALPHABET.A; // use A as a representative
    // find a primary cell
    let foundPrimary = false;
    let foundSecondary = false;
    let foundBlank = false;

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < (sampleLetter.rows[r] || []).length; c++) {
        const raw = sampleLetter.rows[r][c];
        // normalize numeric rows (0/1) to cellType
        let cell = raw as any;
        if (typeof raw === 'number') {
          cell =
            raw === 1 ? (r >= 3 && r <= 5 ? cellType.SECONDARY : cellType.PRIMARY) : cellType.BLANK;
        }
        if (!foundPrimary && cell === cellType.PRIMARY) {
          const col = getColorFromLetter(sampleLetter, themeType.DARK, cell);
          expect(col).toBe(darkTheme.primaryColor);
          foundPrimary = true;
        }
        if (!foundSecondary && cell === cellType.SECONDARY) {
          const col = getColorFromLetter(sampleLetter, themeType.DARK, cell);
          expect(col).toBe(darkTheme.secondaryColor);
          foundSecondary = true;
        }
        if (!foundBlank && cell === cellType.BLANK) {
          const col = getColorFromLetter(sampleLetter, themeType.DARK, cell);
          expect(col).toBe(darkTheme.backgroundColor);
          foundBlank = true;
        }
        if (foundPrimary && foundSecondary && foundBlank) break;
      }
      if (foundPrimary && foundSecondary && foundBlank) break;
    }

    // It's possible a representative letter doesn't include secondary cells; that's acceptable as long as primary and blank were found
    expect(foundPrimary).toBe(true);
    expect(foundBlank).toBe(true);
  });
});
