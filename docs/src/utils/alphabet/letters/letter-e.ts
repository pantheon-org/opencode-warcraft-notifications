import { darkTheme, lightTheme, themeType } from '../theme';
import { type Glyph } from './types';

/**
 * Letter E representation
 * @type {Glyph}
 *
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 1 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('E');
 */
export const letterE: Glyph = {
  rows: {
    0: [0, 0, 0, 0],
    1: [1, 1, 1, 1],
    2: [1, 0, 0, 1],
    3: [1, 1, 1, 1],
    4: [1, 0, 0, 0],
    5: [1, 1, 1, 1],
    6: [0, 0, 0, 0],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
