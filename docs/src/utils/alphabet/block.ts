import { cellType } from './letters/types';
import { getColorFromLetter, themeType, type ThemeType } from './theme';
import { ALPHABET } from './types';

export interface BlockyTextOptions {
  theme?: ThemeType;
  /** Size of each block in pixels */
  blockSize?: number;
  /** Spacing between characters */
  charSpacing?: number;
}

export type Block = {
  x: number;
  y: number;
  color: string;
};

const DEFAULT_BLOCKY_TEXT_OPTIONS: Required<BlockyTextOptions> = {
  theme: themeType.LIGHT,
  blockSize: 20,
  charSpacing: 5,
};

export const textToBlocks = (
  text: string,
  options: Required<BlockyTextOptions> = DEFAULT_BLOCKY_TEXT_OPTIONS,
): Block[] => {
  const { theme = themeType.LIGHT, blockSize = 20, charSpacing = 5 } = options;

  const blocks: Block[] = [];
  let xOffset = 0;

  for (const char of text.toUpperCase()) {
    const charData = ALPHABET[char as keyof typeof ALPHABET];
    if (!charData) {
      // Skip characters that are not in the alphabet
      console.warn(`Character "${char}" not found in alphabet data. Skipping.`);
      xOffset += blockSize + charSpacing;
      continue;
    }

    // Determine the number of columns for this character by scanning its rows
    const rowsObj = charData.rows;
    const cols = Math.max(...Object.values(rowsObj).map((r) => r.length));

    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = rowsObj[row]?.[col];

        // Skip undefined or blank cells
        if (!cell || cell === cellType.BLANK) continue;

        const color = getColorFromLetter(charData, theme, cell);
        blocks.push({
          x: xOffset + col * blockSize,
          y: row * blockSize,
          color,
        });
      }
    }

    // charSpacing represents number of blank block columns between characters
    xOffset += cols * blockSize + charSpacing * blockSize;
  }

  return blocks;
};
