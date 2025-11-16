import { darkTheme, lightTheme, themeType } from '../theme';
import { type Glyph } from './types';

/**
 * Letter R representation
 * @type {Glyph}
 *
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('R');
 */
export const letterR: Glyph = {
  rows: {
    0: [0, 0, 0, 0],
    1: [1, 1, 1, 1],
    2: [1, 0, 0, 1],
    3: [1, 0, 0, 0],
    4: [1, 0, 0, 0],
    5: [1, 0, 0, 0],
    6: [0, 0, 0, 0],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
