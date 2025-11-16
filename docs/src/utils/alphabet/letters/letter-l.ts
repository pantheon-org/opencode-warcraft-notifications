import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter L representation
 * @type {LetterData}
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
export const letterL: LetterData = {
  rows: {
    0: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK],
    1: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK],
    2: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK],
    3: [cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY],
    4: [cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY],
    5: [cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
