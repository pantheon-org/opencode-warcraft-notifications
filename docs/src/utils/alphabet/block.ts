import { cellType } from './types';
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
    const rowsObj = charData.rows as Record<number, any[]>;

    // Support two row formats:
    // - Record<number, Array<CellType>> (legacy)
    // - Record<number, Array<number>> where numbers are 0/1 (new)
    const cols = Math.max(...Object.values(rowsObj).map((r) => (Array.isArray(r) ? r.length : 0)));

    for (let row = 0; row < 7; row++) {
      const rowArr = rowsObj[row] || [];
      for (let col = 0; col < cols; col++) {
        const raw = rowArr[col];
        let cellValue: any = raw;

        // If numeric rows (0/1), convert to cellType
        if (typeof raw === 'number') {
          if (raw === 1) {
            cellValue = row >= 3 && row <= 5 ? cellType.SECONDARY : cellType.PRIMARY;
          } else {
            cellValue = cellType.BLANK;
          }
        }

        // Skip undefined or blank cells
        if (!cellValue || cellValue === cellType.BLANK) continue;

        const color = getColorFromLetter(charData, theme, cellValue as any);
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

/**
 * Calculate the width of the rendered text
 */
export const calculateWidth = (text: string, options: Required<BlockyTextOptions>): number => {
  const charCount = text.length;
  // Each character is 4 blocks wide (24px with blockSize=6)
  return charCount * (4 * options.blockSize + options.charSpacing) - options.charSpacing;
};

/**
 * Generate SVG path elements from blocks
 */
export const blocksToSVGPaths = (blocks: Block[], blockSize: number): string => {
  return blocks
    .map(
      (block) =>
        `<path d="M${block.x} ${block.y}H${block.x + blockSize}V${block.y + blockSize}H${block.x}V${block.y}Z" fill="${block.color}"/>`,
    )
    .join('\n\t\t');
};

/**
 * Convert text to blocky pixel-art SVG
 *
 * @param text - Text to convert (supports A-Z and space)
 * @param options - Customization options
 * @returns SVG string
 *
 * @example
 * ```ts
 * const svg = blockyTextToSVG('WARCRAFT');
 * ```
 */
export const blockyTextToSVG = (text: string, options: BlockyTextOptions = {}): string => {
  const opts = { ...DEFAULT_BLOCKY_TEXT_OPTIONS, ...options };
  const blocks = textToBlocks(text, opts);
  const width = calculateWidth(text, opts);
  const height = 7 * opts.blockSize; // 7 rows to match OpenCode logo

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${blocksToSVGPaths(blocks, opts.blockSize)}
  </svg>`;
};
