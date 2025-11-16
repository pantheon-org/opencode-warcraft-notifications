import type { Theme, ThemeType } from '../theme';

export const cellType = {
  BLANK: 'blank',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;
export type CellType = (typeof cellType)[keyof typeof cellType];
// row is 3, 4 or 5 cells wide
export type DataRow = Array<CellType>;

export type LetterData = {
  // rows is 7 rows tall
  rows: Record<number, DataRow>;
  theme: Record<ThemeType, Theme>;
};

export type LetterName =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';
