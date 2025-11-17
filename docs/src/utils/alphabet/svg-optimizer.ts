/**
 * SVG Path Optimizer
 *
 * Merges adjacent blocks with the same color into optimized compound paths.
 * This reduces file size and improves rendering performance.
 *
 * @module svg-optimizer
 */

import type { Block } from './block';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

/**
 * Group blocks by color
 */
const groupBlocksByColor = (blocks: Block[]): Map<string, Block[]> => {
  const colorGroups = new Map<string, Block[]>();

  for (const block of blocks) {
    const existing = colorGroups.get(block.color) || [];
    existing.push(block);
    colorGroups.set(block.color, existing);
  }

  return colorGroups;
};

/**
 * Convert blocks to rectangles by merging horizontally adjacent blocks
 */
const mergeHorizontalRectangles = (blocks: Block[], blockSize: number): Rectangle[] => {
  if (blocks.length === 0) return [];

  // Sort blocks by y (row), then x (column)
  const sorted = [...blocks].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  const rectangles: Rectangle[] = [];
  let current: Rectangle | null = null;

  for (const block of sorted) {
    if (!current) {
      // Start new rectangle
      current = {
        x: block.x,
        y: block.y,
        width: blockSize,
        height: blockSize,
        color: block.color,
      };
    } else if (
      block.y === current.y && // Same row
      block.x === current.x + current.width // Adjacent horizontally
    ) {
      // Extend current rectangle horizontally
      current.width += blockSize;
    } else {
      // Can't merge, save current and start new
      rectangles.push(current);
      current = {
        x: block.x,
        y: block.y,
        width: blockSize,
        height: blockSize,
        color: block.color,
      };
    }
  }

  // Don't forget the last rectangle
  if (current) {
    rectangles.push(current);
  }

  return rectangles;
};

/**
 * Merge vertically adjacent rectangles with same x, width
 */
const mergeVerticalRectangles = (rectangles: Rectangle[]): Rectangle[] => {
  if (rectangles.length === 0) return [];

  // Sort by x, y
  const sorted = [...rectangles].sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    return a.y - b.y;
  });

  const merged: Rectangle[] = [];
  let current = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const rect = sorted[i];

    if (
      rect.x === current.x && // Same x position
      rect.width === current.width && // Same width
      rect.y === current.y + current.height // Adjacent vertically
    ) {
      // Extend current rectangle vertically
      current.height += rect.height;
    } else {
      // Can't merge, save current and start new
      merged.push(current);
      current = rect;
    }
  }

  // Don't forget the last rectangle
  merged.push(current);

  return merged;
};

/**
 * Convert a rectangle to an SVG path string using M (move) and H/V (horizontal/vertical) commands
 */
const rectangleToPath = (rect: Rectangle): string => {
  const { x, y, width, height } = rect;
  const x2 = x + width;
  const y2 = y + height;

  // Create path: Move to start, horizontal to x2, vertical to y2, horizontal back to x, vertical back to y, close
  return `M${x} ${y}H${x2}V${y2}H${x}V${y}Z`;
};

/**
 * Merge multiple rectangles of the same color into a compound SVG path
 */
const rectanglesToCompoundPath = (rectangles: Rectangle[]): string => {
  return rectangles.map(rectangleToPath).join('');
};

/**
 * Optimize blocks into merged SVG path elements
 *
 * @param blocks - Array of blocks to optimize
 * @param blockSize - Size of each block in pixels
 * @returns Array of optimized SVG path strings
 *
 * @example
 * ```ts
 * const blocks = textToBlocks('HELLO');
 * const paths = optimizeBlocksToSVGPaths(blocks, 6);
 * // Returns merged paths, one per color
 * ```
 */
export const optimizeBlocksToSVGPaths = (blocks: Block[], blockSize: number): string[] => {
  const colorGroups = groupBlocksByColor(blocks);
  const optimizedPaths: string[] = [];

  for (const [color, colorBlocks] of colorGroups) {
    // Step 1: Merge horizontally adjacent blocks into rectangles
    const hMerged = mergeHorizontalRectangles(colorBlocks, blockSize);

    // Step 2: Merge vertically adjacent rectangles
    const vMerged = mergeVerticalRectangles(hMerged);

    // Step 3: Convert to compound SVG path
    const pathData = rectanglesToCompoundPath(vMerged);

    // Create SVG path element
    optimizedPaths.push(`<path d="${pathData}" fill="${color}"/>`);
  }

  return optimizedPaths;
};
