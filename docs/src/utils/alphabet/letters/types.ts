import type { Theme, ThemeType } from '../theme';

export const cellType = {
  BLANK: 'blank',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;
export type CellType = (typeof cellType)[keyof typeof cellType];
// rows is a record mapping row index (0-6) to an array of numbers (0 or 1)
// each row array should have length between 1 and 5
export type Glyph = {
  rows: Record<number, number[]>;
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
