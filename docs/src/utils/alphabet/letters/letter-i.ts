import { darkTheme, lightTheme, themeType } from '../theme';
import { type Glyph } from './types';

/**
 * Letter I representation
 * @type {Glyph}
 *
 * +---+
 * | 1 |
 * +---+
 * | 0 |
 * +---+
 * | 1 |
 * +---+
 * | 1 |
 * +---+
 * | 1 |
 * +---+
 * | 1 |
 * +---+
 * | 0 |
 * +---+
 *
 * Example usage:
 * const blocks = textToBlocks('I');
 */
export const letterI: Glyph = {
  rows: {
    0: [1],
    1: [0],
    2: [1],
    3: [1],
    4: [1],
    5: [1],
    6: [0],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
