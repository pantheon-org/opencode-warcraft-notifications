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

    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = charData.rows[row][col];

        if (cell !== cellType.BLANK) {
          const themeData = charData.theme[theme];
          const color = getColorFromLetter(charData, theme, cell);
          blocks.push({
            x: xOffset + col * blockSize,
            y: row * blockSize,
            color,
          });
        }
      }
    }

    xOffset += 4 * blockSize + charSpacing;
  }

  return blocks;
};
