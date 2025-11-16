/**
 * Blocky Text to SVG Converter
 *
 * Converts text to blocky, pixel-art style SVG matching OpenCode.ai aesthetic
 * Uses a 7-row × 4-column grid per character with three-tone color palette
 * Based on analysis of the actual OpenCode logo (234×42px for 8 chars)
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
 * Font definition: 7 rows x 4 cols per character (matching OpenCode.ai logo)
 * 0 = empty, 1 = light, 2 = medium, 3 = dark
 *
 * Decoded directly from the actual OpenCode.ai logo SVG at:
 * https://opencode.ai/docs/_astro/logo-dark.DOStV66V.svg
 *
 * Grid: 7 rows × 4 columns, 6px blocks
 * - Height: 42px (7 rows × 6px)
 * - Width: 24px per char (4 cols × 6px)
 * - Spacing: 6px between characters
 */
const FONT: Record<string, number[][]> = {
  // First O from OPENCODE (uses medium #B7B1B1)
  O: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1
    [2, 2, 2, 2], // Row 2
    [2, 3, 3, 2], // Row 3
    [2, 3, 3, 2], // Row 4
    [2, 2, 2, 2], // Row 5
    [0, 0, 0, 0], // Row 6
  ],
  // P from OPENCODE (uses medium #B7B1B1)
  P: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1
    [2, 2, 2, 2], // Row 2
    [2, 3, 3, 2], // Row 3
    [2, 3, 3, 2], // Row 4
    [2, 2, 2, 2], // Row 5
    [2, 2, 2, 2], // Row 6 - extends down
  ],
  // First E from OPENCODE (uses medium #B7B1B1) - Classic E shape
  E: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1 - top bar
    [2, 2, 2, 0], // Row 2 - left + partial top
    [2, 0, 0, 0], // Row 3 - left bar only
    [2, 3, 3, 3], // Row 4 - left + dark middle bar
    [2, 2, 2, 2], // Row 5 - left + bottom section
    [2, 2, 2, 2], // Row 6 - full bottom bar
  ],
  // N from OPENCODE (uses medium #B7B1B1) - Two pillars with dark center
  N: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 0], // Row 1 - top without right col
    [2, 2, 2, 2], // Row 2 - all four columns
    [2, 3, 3, 2], // Row 3 - left/right medium, center dark
    [2, 3, 3, 2], // Row 4
    [2, 3, 3, 2], // Row 5
    [0, 0, 0, 0], // Row 6
  ],
  // C from OPENCODE (uses light #F1ECEC)
  C: [
    [0, 0, 0, 0], // Row 0
    [1, 1, 1, 1], // Row 1
    [1, 1, 1, 1], // Row 2
    [1, 3, 3, 3], // Row 3
    [1, 3, 3, 3], // Row 4
    [1, 1, 1, 1], // Row 5
    [0, 0, 0, 0], // Row 6
  ],
  // D from OPENCODE (uses light #F1ECEC)
  D: [
    [1, 1, 1, 1], // Row 0 - extends above
    [1, 1, 1, 1], // Row 1
    [1, 1, 1, 1], // Row 2
    [1, 3, 3, 1], // Row 3
    [1, 3, 3, 1], // Row 4
    [1, 1, 1, 1], // Row 5
    [0, 0, 0, 0], // Row 6
  ],
  // Custom letters for WARCRAFT (inspired by OpenCode style)
  A: [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 3, 3, 2],
    [2, 3, 3, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
  ],
  F: [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [3, 3, 3, 0],
    [3, 3, 3, 0],
    [3, 3, 3, 0],
  ],
  I: [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
  ],
  R: [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 3, 3, 2],
    [2, 3, 3, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
  ],
  T: [
    [0, 0, 0, 0],
    [3, 3, 3, 3],
    [3, 3, 3, 3],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
  ],
  W: [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 3, 3, 2],
    [2, 3, 3, 2],
    [2, 2, 2, 2],
    [2, 2, 2, 2],
  ],
  ' ': [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
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
      xOffset += 4 * options.blockSize + options.charSpacing;
      continue;
    }

    // 7 rows, 4 columns per character
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 4; col++) {
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

    xOffset += 4 * options.blockSize + options.charSpacing;
  }

  return blocks;
}

/**
 * Calculate the width of the rendered text
 */
function calculateWidth(text: string, options: Required<BlockyTextOptions>): number {
  const charCount = text.length;
  // Each character is 4 blocks wide (24px with blockSize=6)
  return charCount * (4 * options.blockSize + options.charSpacing) - options.charSpacing;
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
  const height = 7 * opts.blockSize; // 7 rows to match OpenCode logo

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
