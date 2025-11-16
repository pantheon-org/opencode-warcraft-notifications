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
 * 0 = empty, 1 = light (#F1ECEC), 2 = medium (#B7B1B1), 3 = dark (#4B4646)
 *
 * Decoded directly from the actual OpenCode.ai logo SVG:
 * <svg width="234" height="42" viewBox="0 0 234 42" fill="none">
 *
 * Original logo grid: 7 rows × 4 columns, 6px blocks
 * - Height: 42px (7 rows × 6px)
 * - Width per char: 24px (4 cols × 6px)
 * - Spacing: 6px between characters
 * - Total per char: 30px (24px + 6px spacing)
 */
const FONT: Record<string, number[][]> = {
  // === EXACT DECODED LETTERS FROM OPENCODE LOGO ===

  // O from OPENCODE (x=0-24, uses medium #B7B1B1)
  O: [
    [0, 0, 0, 0], // Row 0: empty
    [2, 2, 2, 2], // Row 1: full medium
    [2, 3, 3, 2], // Row 2: medium edges + dark center
    [2, 3, 3, 2], // Row 3: hollow center
    [2, 3, 3, 2], // Row 4: hollow center
    [2, 2, 2, 2], // Row 5: full medium
    [0, 0, 0, 0], // Row 6: empty
  ],

  // P from OPENCODE (x=30-54, uses medium #B7B1B1)
  P: [
    [2, 2, 2, 0], // Row 0: partial medium (left 3 cols)
    [2, 2, 2, 2], // Row 1: full medium
    [2, 3, 3, 2], // Row 2: medium + dark center
    [2, 3, 3, 2], // Row 3: medium + dark center
    [2, 3, 3, 2], // Row 4: medium + dark center
    [2, 2, 2, 2], // Row 5: full medium
    [2, 2, 2, 0], // Row 6: extends down (P has descender)
  ],

  // E from OPENCODE (x=60-84, uses medium #B7B1B1)
  E: [
    [0, 0, 0, 0], // Row 0: empty
    [2, 2, 2, 2], // Row 1: top bar
    [0, 2, 2, 0], // Row 2: small rect (cols 1-2)
    [2, 0, 0, 0], // Row 3: left edge only
    [2, 3, 3, 3], // Row 4: left medium + dark middle bar
    [2, 2, 2, 2], // Row 5: full medium
    [0, 0, 0, 0], // Row 6: empty
  ],

  // N from OPENCODE (x=90-114, uses medium #B7B1B1)
  N: [
    [0, 0, 0, 0], // Row 0: empty
    [2, 2, 2, 0], // Row 1: partial (cols 0-2)
    [2, 3, 3, 2], // Row 2: medium edges + dark center
    [2, 3, 3, 2], // Row 3: two pillars with dark center
    [2, 3, 3, 2], // Row 4: two pillars with dark center
    [2, 3, 3, 2], // Row 5: two pillars with dark center
    [0, 0, 0, 0], // Row 6: empty
  ],

  // C from OPENCODE (x=120-144, uses light #F1ECEC)
  C: [
    [0, 0, 0, 0], // Row 0: empty
    [1, 1, 1, 1], // Row 1: full light
    [1, 3, 3, 3], // Row 2: light left + dark right (opening)
    [1, 3, 3, 3], // Row 3: C opening
    [1, 3, 3, 3], // Row 4: C opening
    [1, 1, 1, 1], // Row 5: full light
    [0, 0, 0, 0], // Row 6: empty
  ],

  // Second O from OPENCODE (x=150-174, uses light #F1ECEC)
  // (mapped to O already above - this is the second instance)

  // D from OPENCODE (x=180-204, uses light #F1ECEC)
  D: [
    [1, 1, 1, 1], // Row 0: extends above (full width for simplicity)
    [1, 1, 1, 1], // Row 1: full light
    [1, 3, 3, 1], // Row 2: light edges + dark center
    [1, 3, 3, 1], // Row 3: hollow center
    [1, 3, 3, 1], // Row 4: hollow center
    [1, 1, 1, 1], // Row 5: full light
    [0, 0, 0, 0], // Row 6: empty
  ],

  // === EXTENDED ALPHABET (OpenCode-inspired, using medium color) ===

  A: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1: top bar
    [2, 3, 3, 2], // Row 2: hole at top
    [2, 2, 2, 2], // Row 3: middle bar (crossbar of A)
    [2, 3, 3, 2], // Row 4: sides
    [2, 3, 3, 2], // Row 5: sides
    [2, 0, 0, 2], // Row 6: two legs
  ],

  B: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1
    [2, 3, 3, 2], // Row 2
    [2, 2, 2, 2], // Row 3: middle bar
    [2, 3, 3, 2], // Row 4
    [2, 2, 2, 2], // Row 5
    [2, 2, 2, 0], // Row 6
  ],

  F: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1: top bar
    [2, 0, 0, 0], // Row 2: left edge
    [2, 2, 2, 0], // Row 3: middle bar
    [2, 0, 0, 0], // Row 4: left edge
    [2, 0, 0, 0], // Row 5: left edge
    [0, 0, 0, 0], // Row 6
  ],

  G: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1
    [2, 3, 3, 3], // Row 2: left + dark
    [2, 0, 2, 2], // Row 3: left + small bar right
    [2, 3, 3, 2], // Row 4
    [2, 2, 2, 2], // Row 5
    [0, 0, 0, 0], // Row 6
  ],

  H: [
    [0, 0, 0, 0], // Row 0
    [2, 0, 0, 2], // Row 1: two pillars
    [2, 0, 0, 2], // Row 2
    [2, 2, 2, 2], // Row 3: crossbar
    [2, 3, 3, 2], // Row 4
    [2, 0, 0, 2], // Row 5
    [0, 0, 0, 0], // Row 6
  ],

  I: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1: top bar
    [0, 2, 2, 0], // Row 2: center column
    [0, 2, 2, 0], // Row 3
    [0, 2, 2, 0], // Row 4
    [2, 2, 2, 2], // Row 5: bottom bar
    [0, 0, 0, 0], // Row 6
  ],

  J: [
    [0, 0, 0, 0], // Row 0
    [0, 2, 2, 2], // Row 1: right portion
    [0, 0, 2, 2], // Row 2
    [0, 0, 2, 2], // Row 3
    [2, 3, 3, 2], // Row 4: curves left
    [2, 2, 2, 2], // Row 5
    [0, 0, 0, 0], // Row 6
  ],

  K: [
    [0, 0, 0, 0], // Row 0
    [2, 0, 0, 2], // Row 1: left + right
    [2, 0, 2, 0], // Row 2: left + middle
    [2, 2, 0, 0], // Row 3: left + junction
    [2, 0, 2, 0], // Row 4
    [2, 0, 0, 2], // Row 5
    [0, 0, 0, 0], // Row 6
  ],

  L: [
    [0, 0, 0, 0], // Row 0
    [2, 0, 0, 0], // Row 1: left edge
    [2, 0, 0, 0], // Row 2
    [2, 0, 0, 0], // Row 3
    [2, 0, 0, 0], // Row 4
    [2, 2, 2, 2], // Row 5: bottom bar
    [0, 0, 0, 0], // Row 6
  ],

  M: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1: top
    [2, 3, 3, 2], // Row 2: peaks
    [2, 3, 3, 2], // Row 3: sides
    [2, 0, 0, 2], // Row 4: two pillars
    [2, 0, 0, 2], // Row 5
    [0, 0, 0, 0], // Row 6
  ],

  Q: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1
    [2, 3, 3, 2], // Row 2
    [2, 3, 3, 2], // Row 3
    [2, 3, 3, 2], // Row 4: tail starts
    [2, 2, 2, 2], // Row 5
    [0, 0, 2, 2], // Row 6: tail extends (descender)
  ],

  R: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1
    [2, 3, 3, 2], // Row 2
    [2, 2, 2, 0], // Row 3: curves back
    [2, 0, 2, 0], // Row 4: leg splits
    [2, 0, 0, 2], // Row 5: leg extends
    [0, 0, 0, 0], // Row 6
  ],

  S: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1: top
    [2, 3, 3, 3], // Row 2: left + dark
    [2, 2, 2, 2], // Row 3: middle
    [3, 3, 3, 2], // Row 4: dark + right
    [2, 2, 2, 2], // Row 5: bottom
    [0, 0, 0, 0], // Row 6
  ],

  T: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1: top bar
    [3, 2, 2, 3], // Row 2: darker edges
    [0, 2, 2, 0], // Row 3: center stem
    [0, 2, 2, 0], // Row 4
    [0, 2, 2, 0], // Row 5
    [0, 0, 0, 0], // Row 6
  ],

  U: [
    [0, 0, 0, 0], // Row 0
    [2, 0, 0, 2], // Row 1: two pillars
    [2, 0, 0, 2], // Row 2
    [2, 0, 0, 2], // Row 3
    [2, 3, 3, 2], // Row 4: bottom curves
    [2, 2, 2, 2], // Row 5: bottom bar
    [0, 0, 0, 0], // Row 6
  ],

  V: [
    [0, 0, 0, 0], // Row 0
    [2, 0, 0, 2], // Row 1: two pillars
    [2, 0, 0, 2], // Row 2
    [2, 0, 0, 2], // Row 3
    [2, 3, 3, 2], // Row 4: converging
    [0, 2, 2, 0], // Row 5: point
    [0, 0, 0, 0], // Row 6
  ],

  W: [
    [0, 0, 0, 0], // Row 0
    [2, 0, 0, 2], // Row 1: two pillars
    [2, 0, 0, 2], // Row 2
    [2, 3, 3, 2], // Row 3: valley
    [2, 3, 3, 2], // Row 4
    [2, 2, 2, 2], // Row 5: bottom
    [0, 0, 0, 0], // Row 6
  ],

  X: [
    [0, 0, 0, 0], // Row 0
    [2, 0, 0, 2], // Row 1: corners
    [0, 2, 2, 0], // Row 2: converging
    [0, 2, 2, 0], // Row 3: center
    [0, 2, 2, 0], // Row 4: diverging
    [2, 0, 0, 2], // Row 5: corners
    [0, 0, 0, 0], // Row 6
  ],

  Y: [
    [0, 0, 0, 0], // Row 0
    [2, 0, 0, 2], // Row 1: two pillars
    [2, 0, 0, 2], // Row 2
    [0, 2, 2, 0], // Row 3: converges
    [0, 2, 2, 0], // Row 4: center stem
    [0, 2, 2, 0], // Row 5
    [0, 0, 0, 0], // Row 6
  ],

  Z: [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1: top bar
    [0, 0, 2, 2], // Row 2: diagonal starts
    [0, 2, 2, 0], // Row 3: diagonal middle
    [2, 2, 0, 0], // Row 4: diagonal ends
    [2, 2, 2, 2], // Row 5: bottom bar
    [0, 0, 0, 0], // Row 6
  ],

  // === SPECIAL CHARACTERS ===

  ' ': [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  '-': [
    [0, 0, 0, 0], // Row 0
    [0, 0, 0, 0], // Row 1
    [0, 0, 0, 0], // Row 2
    [2, 2, 2, 2], // Row 3: middle bar
    [0, 0, 0, 0], // Row 4
    [0, 0, 0, 0], // Row 5
    [0, 0, 0, 0], // Row 6
  ],

  _: [
    [0, 0, 0, 0], // Row 0
    [0, 0, 0, 0], // Row 1
    [0, 0, 0, 0], // Row 2
    [0, 0, 0, 0], // Row 3
    [0, 0, 0, 0], // Row 4
    [2, 2, 2, 2], // Row 5: bottom bar
    [0, 0, 0, 0], // Row 6
  ],

  '!': [
    [0, 0, 0, 0], // Row 0
    [0, 2, 2, 0], // Row 1: top
    [0, 2, 2, 0], // Row 2
    [0, 2, 2, 0], // Row 3
    [0, 0, 0, 0], // Row 4: gap
    [0, 2, 2, 0], // Row 5: dot
    [0, 0, 0, 0], // Row 6
  ],

  '?': [
    [0, 0, 0, 0], // Row 0
    [2, 2, 2, 2], // Row 1: top
    [0, 3, 3, 2], // Row 2
    [0, 2, 2, 0], // Row 3: curves down
    [0, 0, 0, 0], // Row 4: gap
    [0, 2, 2, 0], // Row 5: dot
    [0, 0, 0, 0], // Row 6
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
