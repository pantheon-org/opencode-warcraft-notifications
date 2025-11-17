import { blockyTextToSVG } from './src/utils/alphabet/index.ts';
import { ALPHABET, SYMBOLS } from './src/utils/alphabet/types.ts';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('docs/glyphs', { recursive: true });

// Generate markdown documentation with both ASCII and SVG for all glyphs
let markdown = `# Blocky Alphabet — Complete Glyph Reference

This document shows all available glyphs in the blocky text system, including both letters (A-Z) and symbols (punctuation).

Each glyph is shown with:
- **ASCII Grid**: Text representation of the 7-row grid
- **SVG Preview**: Visual rendering in dark theme

## Letters (A-Z)

`;

// Generate for each letter
const letters = Object.keys(ALPHABET).sort();
letters.forEach(letter => {
  const glyph = ALPHABET[letter];
  
  markdown += `### ${letter}\n\n`;
  markdown += `**Width**: ${glyph.rows[0].length} columns\n\n`;
  markdown += `#### ASCII Grid\n\n\`\`\`\n`;
  
  // Build ASCII table
  const colCount = glyph.rows[0].length;
  const divider = '+' + '---+'.repeat(colCount) + '\n';
  
  for (let row = 0; row < 7; row++) {
    markdown += divider;
    markdown += '|';
    for (let col = 0; col < colCount; col++) {
      const val = glyph.rows[row][col];
      markdown += ` ${val} |`;
    }
    markdown += '\n';
  }
  markdown += divider;
  markdown += `\`\`\`\n\n`;
  
  // Generate SVG
  try {
    const svg = blockyTextToSVG(letter, { 
      theme: 'dark', 
      blockSize: 12,
      optimize: false 
    });
    markdown += `#### SVG Preview\n\n${svg}\n\n`;
  } catch (err) {
    markdown += `#### SVG Preview\n\n*Error generating SVG: ${err.message}*\n\n`;
  }
  
  markdown += `---\n\n`;
});

markdown += `## Symbols

Available punctuation and special characters:

`;

// Generate for each symbol
const symbols = Object.keys(SYMBOLS);
symbols.forEach(symbol => {
  const glyph = SYMBOLS[symbol];
  const symbolName = {
    '-': 'Hyphen',
    '|': 'Pipe',
    "'": 'Apostrophe',
    '"': 'Quote',
    '?': 'Question',
    '!': 'Exclamation'
  }[symbol] || 'Unknown';
  
  markdown += `### ${symbolName} (\`${symbol}\`)\n\n`;
  markdown += `**Width**: ${glyph.rows[0].length} column${glyph.rows[0].length > 1 ? 's' : ''}\n\n`;
  markdown += `#### ASCII Grid\n\n\`\`\`\n`;
  
  // Build ASCII table
  const colCount = glyph.rows[0].length;
  const divider = '+' + '---+'.repeat(colCount) + '\n';
  
  for (let row = 0; row < 7; row++) {
    markdown += divider;
    markdown += '|';
    for (let col = 0; col < colCount; col++) {
      const val = glyph.rows[row][col];
      markdown += ` ${val} |`;
    }
    markdown += '\n';
  }
  markdown += divider;
  markdown += `\`\`\`\n\n`;
  
  // Note: Symbols might not render individually, show character code
  markdown += `#### Character Code\n\nUnicode: U+${symbol.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}\n\n`;
  
  markdown += `---\n\n`;
});

// Add usage examples
markdown += `## Usage Examples

### Rendering Letters

\`\`\`typescript
import { blockyTextToSVG } from './utils/alphabet';

const svg = blockyTextToSVG('HELLO');
\`\`\`

### Available Characters

**Letters**: ${letters.join(', ')}

**Symbols**: ${symbols.map(s => `\`${s}\``).join(', ')}

### Character Spacing

Letters are separated by 1 column of space by default. This can be adjusted:

\`\`\`typescript
const svg = blockyTextToSVG('ABC', { charSpacing: 2 });
\`\`\`

### Theme Options

\`\`\`typescript
// Dark theme (default)
const darkSvg = blockyTextToSVG('TEXT', { theme: 'dark' });

// Light theme
const lightSvg = blockyTextToSVG('TEXT', { theme: 'light' });
\`\`\`

## Grid System

All glyphs use a **7-row grid system**:

- **Row 0**: Top padding/ascender space
- **Rows 1-2**: Upper portion (PRIMARY color)
- **Rows 3-5**: Middle to lower portion (SECONDARY color)
- **Row 6**: Bottom padding/descender space

### Width Variations

- **Narrow** (1-2 columns): I, J, apostrophe, pipe, exclamation
- **Regular** (3-4 columns): Most letters, hyphen, question
- **Wide** (5 columns): M, W, V, X

## Color Zones

Colors are automatically applied based on row position:

- **PRIMARY**: Rows 0-2 and 6 (bright/foreground)
- **SECONDARY**: Rows 3-5 (medium/shading)
- **TERTIARY**: Reserved for future use

## See Also

- [Alphabet README](./pages/src/utils/alphabet/README.md) - System overview
- [Letter Glyphs](./pages/src/utils/alphabet/glyphs/letters/README.md) - Letter documentation
- [Symbol Glyphs](./pages/src/utils/alphabet/glyphs/symbols/README.md) - Symbol documentation
- [Usage Guide](./pages/src/utils/alphabet/USAGE.md) - Detailed usage examples
`;

writeFileSync('docs/glyphs/COMPLETE-REFERENCE.md', markdown);
console.log('✅ Generated: docs/glyphs/COMPLETE-REFERENCE.md');
