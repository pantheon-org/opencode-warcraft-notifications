import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter X representation
 * @type {LetterData}
 *
 * +---+---+---+---+---+
 * | 0 | 0 | 0 | 0 | 0 |
 * +---+---+---+---+---+
 * | 1 | 0 | 0 | 0 | 1 |
 * +---+---+---+---+---+
 * | 0 | 1 | 0 | 1 | 0 |
 * +---+---+---+---+---+
 * | 0 | 0 | 1 | 0 | 0 |
 * +---+---+---+---+---+
 * | 0 | 1 | 0 | 1 | 0 |
 * +---+---+---+---+---+
 * | 1 | 0 | 0 | 0 | 1 |
 * +---+---+---+---+---+
 * | 0 | 0 | 0 | 0 | 0 |
 * +---+---+---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('X');
 */
export const letterX: LetterData = {
  rows: {
    0: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    1: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.PRIMARY],
    2: [cellType.BLANK, cellType.PRIMARY, cellType.BLANK, cellType.PRIMARY, cellType.BLANK],
    3: [cellType.SECONDARY, cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY],
    4: [cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY],
    5: [cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY, cellType.SECONDARY, cellType.PRIMARY],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
