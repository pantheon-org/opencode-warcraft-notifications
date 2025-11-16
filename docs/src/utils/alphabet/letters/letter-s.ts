import { darkTheme, lightTheme, themeType } from '../theme';
import { type Glyph } from './types';

/**
 * Letter S representation
 * @type {Glyph}
 *
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 0 | 0 | 0 | 1 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('S');
 */
export const letterS: Glyph = {
  rows: {
    0: [0, 0, 0, 0],
    1: [1, 1, 1, 1],
    2: [1, 0, 0, 0],
    3: [1, 1, 1, 1],
    4: [0, 0, 0, 1],
    5: [1, 1, 1, 1],
    6: [0, 0, 0, 0],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
