/**
 * Blocky Text to SVG Converter
 *
 * Converts text to blocky, pixel-art style SVG matching OpenCode.ai aesthetic
 * Uses a 6x6 grid per character with three-tone color palette
 */

export interface BlockyTextOptions {
  /** Off-white color for primary highlights */
  colorLight?: string;
  /** Light gray for secondary elements */
  colorMedium?: string;
  /** Dark gray for shadows/depth */
  colorDark?: string;
  /** Size of each block in pixels */
  blockSize?: number;
  /** Spacing between characters */
  charSpacing?: number;
}

interface Block {
  x: number;
  y: number;
  color: string;
}

// Default OpenCode.ai color palette
const DEFAULT_OPTIONS: Required<BlockyTextOptions> = {
  colorLight: '#F1ECEC',
  colorMedium: '#B7B1B1',
  colorDark: '#4B4646',
  blockSize: 6,
  charSpacing: 6,
};

/**
 * Font definition: 6x6 grid per character
 * 0 = empty, 1 = light, 2 = medium, 3 = dark
 */
const FONT: Record<string, number[][]> = {
  A: [
    [0, 0, 2, 2, 0, 0],
    [0, 2, 0, 0, 2, 0],
    [2, 1, 0, 0, 1, 2],
    [2, 3, 3, 3, 3, 2],
    [2, 1, 0, 0, 1, 2],
    [2, 1, 0, 0, 1, 2],
  ],
  C: [
    [0, 2, 2, 2, 2, 0],
    [2, 1, 0, 0, 0, 0],
    [2, 1, 0, 3, 3, 0],
    [2, 1, 0, 3, 3, 0],
    [2, 1, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 0],
  ],
  E: [
    [2, 2, 2, 2, 2, 0],
    [2, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 0, 0],
    [2, 2, 2, 2, 0, 0],
    [2, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 0],
  ],
  F: [
    [2, 2, 2, 2, 2, 0],
    [2, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 0, 0],
    [2, 2, 2, 2, 0, 0],
    [2, 1, 0, 0, 0, 0],
    [2, 1, 0, 0, 0, 0],
  ],
  I: [
    [0, 2, 2, 2, 0, 0],
    [0, 0, 2, 0, 0, 0],
    [0, 0, 2, 0, 0, 0],
    [0, 0, 2, 0, 0, 0],
    [0, 0, 2, 0, 0, 0],
    [0, 2, 2, 2, 0, 0],
  ],
  N: [
    [2, 1, 0, 0, 1, 2],
    [2, 2, 1, 0, 1, 2],
    [2, 1, 2, 1, 1, 2],
    [2, 1, 0, 2, 1, 2],
    [2, 1, 0, 1, 2, 2],
    [2, 1, 0, 0, 1, 2],
  ],
  O: [
    [0, 2, 2, 2, 2, 0],
    [2, 1, 0, 0, 1, 2],
    [2, 1, 0, 3, 1, 2],
    [2, 1, 3, 0, 1, 2],
    [2, 1, 0, 0, 1, 2],
    [0, 2, 2, 2, 2, 0],
  ],
  R: [
    [2, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 0, 0],
    [2, 1, 0, 0, 2, 0],
    [2, 2, 2, 2, 0, 0],
    [2, 1, 0, 2, 0, 0],
    [2, 1, 0, 0, 3, 3],
  ],
  T: [
    [2, 2, 2, 2, 2, 2],
    [0, 0, 2, 2, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0],
  ],
  W: [
    [1, 0, 0, 0, 0, 1],
    [2, 1, 0, 0, 1, 2],
    [2, 1, 0, 3, 1, 2],
    [2, 1, 3, 0, 1, 2],
    [2, 1, 2, 2, 1, 2],
    [1, 0, 2, 2, 0, 1],
  ],
  ' ': [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ],
};

/**
 * Convert text to blocks with positions and colors
 */
function textToBlocks(text: string, options: Required<BlockyTextOptions>): Block[] {
  const blocks: Block[] = [];
  const colorMap = ['', options.colorLight, options.colorMedium, options.colorDark];

  let xOffset = 0;

  for (const char of text.toUpperCase()) {
    const charData = FONT[char];
    if (!charData) {
      console.warn(`Character '${char}' not found in font, skipping`);
      xOffset += options.blockSize + options.charSpacing;
      continue;
    }

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const colorIndex = charData[row][col];
        if (colorIndex > 0) {
          blocks.push({
            x: xOffset + col * options.blockSize,
            y: row * options.blockSize,
            color: colorMap[colorIndex],
          });
        }
      }
    }

    xOffset += 6 * options.blockSize + options.charSpacing;
  }

  return blocks;
}

/**
 * Calculate the width of the rendered text
 */
function calculateWidth(text: string, options: Required<BlockyTextOptions>): number {
  const charCount = text.length;
  return charCount * (6 * options.blockSize + options.charSpacing) - options.charSpacing;
}

/**
 * Generate SVG path elements from blocks
 */
function blocksToSVGPaths(blocks: Block[], blockSize: number): string {
  return blocks
    .map(
      (block) =>
        `<path d="M${block.x} ${block.y}H${block.x + blockSize}V${block.y + blockSize}H${block.x}V${block.y}Z" fill="${block.color}"/>`,
    )
    .join('\n\t\t');
}

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
export function blockyTextToSVG(text: string, options: BlockyTextOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const blocks = textToBlocks(text, opts);
  const width = calculateWidth(text, opts);
  const height = 6 * opts.blockSize;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
		${blocksToSVGPaths(blocks, opts.blockSize)}
	</svg>`;
}

/**
 * Get available characters in the font
 */
export function getAvailableCharacters(): string[] {
  return Object.keys(FONT);
}
