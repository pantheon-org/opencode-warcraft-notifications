/**
 * Alphabet Module - Public API
 *
 * This module provides a complete blocky text rendering system with:
 * - 26 uppercase letters (A-Z)
 * - 6 symbols (-, |, ', ", ?, !)
 * - Theme support (light/dark modes)
 * - SVG generation
 * - Variable-width characters (1-5 columns)
 * - 7-row grid system with automatic color assignment
 *
 * @module alphabet
 *
 * @example
 * ```typescript
 * import { blockyTextToSVG, textToBlocks } from './alphabet';
 *
 * // Generate SVG
 * const svg = blockyTextToSVG('HELLO', { theme: 'dark', blockSize: 6 });
 *
 * // Get block data for custom rendering
 * const blocks = textToBlocks('WORLD', { theme: 'light', blockSize: 20 });
 * ```
 */

// ============================================================================
// Core Rendering Functions
// ============================================================================

export { textToBlocks, blockyTextToSVG, calculateWidth, blocksToSVGPaths } from './block';

export type { Block, BlockyTextOptions } from './block';

// ============================================================================
// Type System
// ============================================================================

export type { Glyph, CellType, LetterName, SymbolName, Alphabet, Symbols } from './types';

export {
  cellType,
  ALPHABET,
  SYMBOLS,
  getAvailableCharacters,
  getAvailableSymbols,
  getAllAvailableCharacters,
} from './types';

// ============================================================================
// Theme System
// ============================================================================

export type { Theme, ThemeType } from './theme';

export { themeType, lightTheme, darkTheme, getColorFromLetter } from './theme';

// ============================================================================
// Individual Glyphs (optional direct access)
// ============================================================================

export * from './glyphs';

// ============================================================================
// Compatibility Notes
// ============================================================================

/**
 * Migration from blocky-text-to-svg.ts:
 *
 * Old API:
 * ```typescript
 * import { blockyTextToSVG } from './blocky-text-to-svg';
 * const svg = blockyTextToSVG('TEXT', {
 *   colorLight: '#F1ECEC',
 *   colorMedium: '#B7B1B1',
 *   colorDark: '#4B4646',
 *   blockSize: 6,
 *   charSpacing: 6,
 * });
 * ```
 *
 * New API:
 * ```typescript
 * import { blockyTextToSVG } from './alphabet';
 * const svg = blockyTextToSVG('TEXT', {
 *   theme: 'light',  // or 'dark'
 *   blockSize: 6,
 *   charSpacing: 1,  // Note: now in block units, not pixels
 * });
 * ```
 *
 * Key differences:
 * 1. Theme-based colors instead of explicit RGB values
 * 2. charSpacing is now in block units (multiply old value by blockSize)
 * 3. Variable-width characters (1-5 columns vs fixed 4 columns)
 * 4. Automatic PRIMARY/SECONDARY color assignment by row
 * 5. More symbols available (6 vs 4)
 */
