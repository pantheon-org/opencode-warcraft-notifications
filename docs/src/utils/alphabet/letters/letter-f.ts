import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter F representation
 * @type {LetterData}
 *
 * +---+---+---+
 * | 0 | 1 | 1 |
 * +---+---+---+
 * | 0 | 1 | 0 |
 * +---+---+---+
 * | 1 | 1 | 1 |
 * +---+---+---+
 * | 0 | 1 | 0 |
 * +---+---+---+
 * | 0 | 1 | 0 |
 * +---+---+---+
 * | 0 | 1 | 0 |
 * +---+---+---+
 * | 0 | 0 | 0 |
 * +---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('F');
 */
export const letterF: LetterData = {
  rows: {
    0: [cellType.BLANK, cellType.PRIMARY, cellType.PRIMARY],
    1: [cellType.BLANK, cellType.PRIMARY, cellType.BLANK],
    2: [cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY],
    3: [cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY],
    4: [cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY],
    5: [cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
