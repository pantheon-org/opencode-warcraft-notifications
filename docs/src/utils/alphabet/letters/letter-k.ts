import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter K representation
 * @type {LetterData}
 */
export const letterK: LetterData = {
  rows: {
    0: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    1: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.PRIMARY, cellType.BLANK],
    2: [cellType.PRIMARY, cellType.BLANK, cellType.PRIMARY, cellType.BLANK, cellType.BLANK],
    3: [cellType.PRIMARY, cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY, cellType.SECONDARY],
    4: [cellType.PRIMARY, cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY],
    5: [cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY, cellType.PRIMARY, cellType.SECONDARY],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
