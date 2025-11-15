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
 * Grid based on OpenCode logo analysis:
 * - Height: 42px (7 rows × 6px blocks)
 * - Width per char: 24px (4 cols × 6px blocks)
 * - Character spacing: 6px
 */
const FONT: Record<string, number[][]> = {
  // Based on OpenCode logo letter 'O' (x:0-24, y:0-42)
  O: [
    [0, 0, 0, 0], // Row 0 (y:0-6) - empty top
    [0, 2, 2, 0], // Row 1 (y:6-12) - top border
    [2, 0, 0, 2], // Row 2 (y:12-18) - sides
    [2, 0, 3, 2], // Row 3 (y:18-24) - left side + dark center
    [2, 3, 0, 2], // Row 4 (y:24-30) - dark left + right side
    [2, 0, 0, 2], // Row 5 (y:30-36) - sides
    [0, 2, 2, 0], // Row 6 (y:36-42) - bottom border
  ],
  // Based on OpenCode logo letter 'P' (x:30-54)
  P: [
    [0, 0, 0, 0], // Row 0 - empty top
    [0, 2, 2, 0], // Row 1 - top of P
    [2, 0, 0, 2], // Row 2 - P bowl
    [2, 0, 3, 0], // Row 3 - P bowl with dark
    [2, 2, 2, 0], // Row 4 - P middle bar
    [2, 0, 0, 0], // Row 5 - P stem
    [2, 0, 0, 0], // Row 6 - P stem extends below
  ],
  // Based on OpenCode logo letter 'E' (x:60-84)
  E: [
    [0, 0, 0, 0], // Row 0 - empty top
    [0, 2, 2, 0], // Row 1 - top bar
    [2, 0, 0, 0], // Row 2 - left side
    [2, 0, 0, 0], // Row 3 - left side
    [2, 2, 3, 0], // Row 4 - middle bar with dark
    [2, 0, 0, 0], // Row 5 - left side
    [0, 2, 2, 0], // Row 6 - bottom bar
  ],
  // Based on OpenCode logo letter 'N' (x:90-114)
  N: [
    [0, 0, 0, 0], // Row 0 - empty top
    [0, 2, 0, 2], // Row 1 - top of both sides
    [2, 0, 0, 2], // Row 2 - both sides
    [2, 0, 3, 2], // Row 3 - left, dark middle, right
    [2, 3, 0, 2], // Row 4 - left, dark middle, right
    [2, 0, 0, 2], // Row 5 - both sides
    [2, 0, 0, 2], // Row 6 - both sides extend
  ],
  // Based on OpenCode logo letter 'C' (x:120-144) - uses light color
  C: [
    [0, 0, 0, 0], // Row 0 - empty top
    [0, 1, 1, 0], // Row 1 - top bar (light)
    [1, 0, 0, 0], // Row 2 - left side
    [1, 0, 3, 0], // Row 3 - left side with dark
    [1, 3, 0, 0], // Row 4 - left side with dark
    [1, 0, 0, 0], // Row 5 - left side
    [0, 1, 1, 0], // Row 6 - bottom bar
  ],
  // Based on OpenCode logo letter 'D' (x:180-204) - uses light color
  D: [
    [0, 0, 0, 0], // Row 0 - empty top (extends above)
    [0, 1, 1, 0], // Row 1 - top curve
    [1, 0, 0, 1], // Row 2 - sides
    [1, 0, 3, 1], // Row 3 - left, dark center, right
    [1, 3, 0, 1], // Row 4 - dark left, right
    [1, 0, 0, 1], // Row 5 - sides
    [0, 1, 1, 0], // Row 6 - bottom curve
  ],
  // Placeholder for other letters (using simplified 4-column grid)
  A: [
    [0, 0, 0, 0],
    [0, 2, 2, 0],
    [2, 0, 0, 2],
    [2, 3, 3, 2],
    [2, 0, 0, 2],
    [2, 0, 0, 2],
    [2, 0, 0, 2],
  ],
  F: [
    [0, 0, 0, 0],
    [2, 2, 2, 0],
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [2, 2, 2, 0],
    [2, 0, 0, 0],
    [2, 0, 0, 0],
  ],
  I: [
    [0, 0, 0, 0],
    [0, 2, 2, 0],
    [0, 2, 0, 0],
    [0, 2, 0, 0],
    [0, 2, 0, 0],
    [0, 2, 0, 0],
    [0, 2, 2, 0],
  ],
  R: [
    [0, 0, 0, 0],
    [0, 2, 2, 0],
    [2, 0, 0, 2],
    [2, 2, 2, 0],
    [2, 0, 2, 0],
    [2, 0, 0, 2],
    [2, 0, 0, 2],
  ],
  T: [
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [0, 2, 2, 0],
    [0, 2, 2, 0],
    [0, 2, 2, 0],
    [0, 2, 2, 0],
    [0, 2, 2, 0],
  ],
  W: [
    [0, 0, 0, 0],
    [2, 0, 0, 2],
    [2, 0, 0, 2],
    [2, 0, 3, 2],
    [2, 3, 0, 2],
    [2, 2, 2, 2],
    [2, 0, 0, 2],
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
