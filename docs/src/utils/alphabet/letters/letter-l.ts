import { darkTheme, lightTheme, themeType } from '../theme';
import { type Glyph } from './types';

/**
 * Letter L representation
 * @type {Glyph}
 *
 * +---+---+---+
 * | 1 | 0 | 0 |
 * +---+---+---+
 * | 1 | 0 | 0 |
 * +---+---+---+
 * | 1 | 0 | 0 |
 * +---+---+---+
 * | 1 | 0 | 0 |
 * +---+---+---+
 * | 1 | 0 | 0 |
 * +---+---+---+
 * | 1 | 1 | 1 |
 * +---+---+---+
 * | 0 | 0 | 0 |
 * +---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('L');
 */
export const letterL: Glyph = {
  rows: {
    0: [1, 0, 0],
    1: [1, 0, 0],
    2: [1, 0, 0],
    3: [1, 0, 0],
    4: [1, 0, 0],
    5: [1, 1, 1],
    6: [0, 0, 0],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
