# Glyph Documentation

Complete reference documentation for the Blocky Alphabet glyph system used in the opencode-warcraft-notifications project.

## 📚 Documentation Files

### [COMPLETE-REFERENCE.md](./COMPLETE-REFERENCE.md)

Comprehensive markdown documentation showing:

- All 26 letters (A-Z) with ASCII grids and SVG previews
- All 6 symbols with ASCII grids and character codes
- Usage examples and API reference
- Grid system explanation
- Color zone definitions

### [index.html](./index.html)

Interactive HTML gallery featuring:

- Visual grid of all glyphs
- Hoverable glyph cards with preview
- Adjustable block size controls
- Color legend
- Responsive design optimized for viewing

## 🎨 Available Glyphs

### Letters (26)

```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
```

### Symbols (6)

| Symbol | Name        | Width  | Usage                     |
| ------ | ----------- | ------ | ------------------------- |
| `-`    | Hyphen      | 3 cols | Compound words, ranges    |
| `\|`   | Pipe        | 1 col  | Separators, delimiters    |
| `'`    | Apostrophe  | 1 col  | Contractions, possessives |
| `"`    | Quote       | 2 cols | Quoted text               |
| `?`    | Question    | 4 cols | Interrogatives            |
| `!`    | Exclamation | 1 col  | Emphasis                  |

## 📐 Grid System

All glyphs use a **7-row grid system**:

```
Row 0: Top padding/ascender space
Rows 1-2: Upper portion (PRIMARY color)
Rows 3-5: Middle to lower portion (SECONDARY color)
Row 6: Bottom padding/descender space
```

### Width Variations

- **Narrow** (1-2 columns): I, J, apostrophe, pipe, exclamation
- **Regular** (3-4 columns): Most letters, hyphen, question
- **Wide** (5 columns): M, W, V, X

## 🎨 Color System

### Theme: Dark (Default)

- **PRIMARY**: `#F1ECEC` (off-white) - rows 0-2, 6
- **SECONDARY**: `#B7B1B1` (light gray) - rows 3-5
- **TERTIARY**: `#4B4646` (dark gray) - shading/depth

### Theme: Light

- **PRIMARY**: `#2D2D2D` (dark gray)
- **SECONDARY**: `#4A4A4A` (medium gray)
- **TERTIARY**: `#B8B8B8` (light gray)

## 💻 Quick Start

### Basic Usage

```typescript
import { blockyTextToSVG } from './utils/alphabet';

// Simple text to SVG
const svg = blockyTextToSVG('HELLO');
```

### With Options

```typescript
const svg = blockyTextToSVG('WARCRAFT', {
  theme: 'dark', // 'dark' | 'light'
  blockSize: 6, // Size of each pixel block
  charSpacing: 1, // Spacing between characters
  optimize: true, // Enable path optimization
});
```

### Available Characters

```typescript
import {
  getAvailableCharacters, // Letters only
  getAvailableSymbols, // Symbols only
  getAllAvailableCharacters, // Both
} from './utils/alphabet/types';

const letters = getAvailableCharacters();
// Returns: ['A', 'B', 'C', ..., 'Z']

const symbols = getAvailableSymbols();
// Returns: ['-', '|', "'", '"', '?', '!']

const all = getAllAvailableCharacters();
// Returns: ['A', ..., 'Z', '-', '|', "'", '"', '?', '!']
```

## 📖 Examples

### Letters Only

```typescript
blockyTextToSVG('OPENCODE');
```

Output: `OPENCODE` in blocky style

### With Symbols

```typescript
blockyTextToSVG('HELLO WORLD!');
```

Output: `HELLO WORLD!` with space and exclamation

### Hyphenated Words

```typescript
blockyTextToSVG('A-Z');
```

Output: `A-Z` with hyphen separator

### Questions

```typescript
blockyTextToSVG('READY?');
```

Output: `READY?` with question mark

## 🔍 Viewing Options

### 1. Markdown Reference

Open [COMPLETE-REFERENCE.md](./COMPLETE-REFERENCE.md) in any markdown viewer to see:

- ASCII grids for each glyph
- Inline SVG previews
- Technical specifications
- Code examples

### 2. Interactive HTML Gallery

Open [index.html](./index.html) in a web browser to:

- Browse glyphs visually
- Adjust block size in real-time
- See hover effects
- View color legend
- Copy usage examples

### 3. Original Documentation

For more detailed technical information:

- [Alphabet System Overview](../../pages/src/utils/alphabet/README.md)
- [Letter Glyphs](../../pages/src/utils/alphabet/glyphs/letters/README.md)
- [Symbol Glyphs](../../pages/src/utils/alphabet/glyphs/symbols/README.md)
- [Usage Guide](../../pages/src/utils/alphabet/USAGE.md)
- [Letter Reference](../../pages/src/utils/alphabet/LETTERS.md)

## 🛠️ Development

### Generate Documentation

To regenerate the glyph documentation:

```bash
cd pages
bun run generate-glyph-docs.mjs
```

This will create/update:

- `docs/glyphs/COMPLETE-REFERENCE.md` - Markdown reference
- `docs/glyphs/index.html` - Interactive gallery

### Generate Sample SVGs

To generate sample SVG files:

```bash
cd pages
bun run generate-samples.mjs
```

Samples are saved to `pages/samples/`:

- `opencode.svg` - "OPENCODE"
- `warcraft.svg` - "WARCRAFT"
- `hello-world.svg` - "HELLO WORLD"
- `a-z-test-.svg` - Alphabet demo
- `quick-fix-.svg` - Punctuation demo

## 📊 Technical Details

### Character Dimensions

| Metric               | Value          |
| -------------------- | -------------- |
| Grid rows            | 7 (fixed)      |
| Grid columns         | 1-5 (variable) |
| Default block size   | 6px            |
| Default char spacing | 1 block        |
| Primary color zone   | Rows 0-2, 6    |
| Secondary color zone | Rows 3-5       |

### SVG Output Specifications

- **Format**: Optimized SVG paths
- **Viewport**: Dynamic based on text length
- **Colors**: Hex color values
- **Optimization**: Optional path merging
- **Attributes**: `fill="none"`, explicit xmlns

### Performance

- **Small footprint**: ~100 bytes per character
- **Efficient rendering**: Uses SVG paths, not individual rectangles
- **Caching friendly**: Deterministic output for same input
- **Build-time generation**: Pre-render for production

## 🎯 Use Cases

1. **Logo Generation**: Create custom blocky logos
2. **Headers**: Stylized section headers
3. **Badges**: Pixelated badges and labels
4. **Branding**: Consistent retro aesthetic
5. **Notifications**: Match Warcraft II notification style
6. **Documentation**: Visual examples in docs

## 🔗 Related Resources

### Internal

- [Main README](../../README.md) - Project overview
- [Sound Descriptions](../../src/sounds/descriptions.ts) - Warcraft II sounds
- [Notification Plugin](../../src/notification.ts) - Toast notifications

### External

- [SVG Specification](https://www.w3.org/TR/SVG2/)
- [Warcraft II](https://en.wikipedia.org/wiki/Warcraft_II) - Inspiration source
- [Pixel Art](https://en.wikipedia.org/wiki/Pixel_art) - Art style reference

## 📝 Notes

- **Case Sensitive**: Only uppercase letters (A-Z) are available
- **Limited Symbols**: Only 6 punctuation marks are supported
- **No Numbers**: Numeric digits are not yet implemented
- **Space Handling**: Spaces are rendered as empty gaps (not shown in current version)
- **Color Customization**: Themes can be customized via options

## 🚀 Future Enhancements

Potential improvements to the glyph system:

- [ ] Add numeric digits (0-9)
- [ ] Add more symbols (`.`, `,`, `:`, `;`)
- [ ] Support lowercase letters (a-z)
- [ ] Add ligatures for common pairs
- [ ] Implement space character rendering
- [ ] Add animation options
- [ ] Create font file format export
- [ ] Add glyph editor tool

## 📄 License

This glyph system is part of the opencode-warcraft-notifications project.
See the main [LICENSE](../../LICENSE) file for details.

---

**Last Updated**: November 17, 2025  
**Version**: 1.0.0  
**Glyphs**: 26 letters + 6 symbols = 32 total
