import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter W representation
 * @type {LetterData}
 *
 * +---+---+---+---+---+
 * | 0 | 0 | 0 | 0 | 0 |
 * +---+---+---+---+---+
 * | 1 | 0 | 0 | 0 | 1 |
 * +---+---+---+---+---+
 * | 1 | 0 | 0 | 0 | 1 |
 * +---+---+---+---+---+
 * | 1 | 0 | 1 | 0 | 1 |
 * +---+---+---+---+---+
 * | 1 | 0 | 1 | 0 | 1 |
 * +---+---+---+---+---+
 * | 1 | 1 | 1 | 1 | 1 |
 * +---+---+---+---+---+
 * | 0 | 0 | 0 | 0 | 0 |
 * +---+---+---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('W');
 */
export const letterW: LetterData = {
  rows: {
    0: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    1: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.PRIMARY],
    2: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.PRIMARY],
    3: [cellType.PRIMARY, cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY, cellType.PRIMARY],
    4: [cellType.PRIMARY, cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY, cellType.PRIMARY],
    5: [cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
