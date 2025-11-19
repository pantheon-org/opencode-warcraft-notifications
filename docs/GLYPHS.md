---
title: Blocky Alphabet Glyph System
---

# Blocky Alphabet Glyph System

Complete documentation for the pixel-art blocky alphabet used in this project.

## 📚 Documentation Overview

This project includes a comprehensive glyph system inspired by retro pixel art and Warcraft II aesthetics. All glyphs are documented with both text representations and visual SVG previews.

### Available Documentation Files

1. **[glyphs/README.md](./glyphs/README.md)** - Main documentation hub
   - System overview
   - Quick start guide
   - Usage examples
   - Technical specifications

2. **[glyphs/COMPLETE-REFERENCE.md](./glyphs/COMPLETE-REFERENCE.md)** - Comprehensive reference
   - All 26 letters (A-Z) with ASCII grids
   - All 6 symbols with details
   - Inline SVG previews for every glyph
   - Color zone explanations

3. **[glyphs/QUICK-REFERENCE.md](./glyphs/QUICK-REFERENCE.md)** - Quick lookup guide
   - Fast character lookup by width
   - Common patterns and examples
   - One-liner code snippets
   - Cheat sheet format

4. **[glyphs/index.html](./glyphs/index.html)** - Interactive gallery
   - Visual grid of all glyphs
   - Adjustable block size
   - Hoverable preview cards
   - Color legend

## 🎨 What's Included

### 26 Letters (A-Z)

All uppercase letters rendered in blocky pixel-art style using a 7-row grid system.

### 6 Symbols

- `-` Hyphen (for compound words)
- `|` Pipe (for separators)
- `'` Apostrophe (for contractions)
- `"` Quote (for quoted text)
- `?` Question mark
- `!` Exclamation point

## 🚀 Quick Start

```typescript
import { blockyTextToSVG } from './pages/src/utils/alphabet';

// Basic usage
const svg = blockyTextToSVG('HELLO');

// With options
const customSvg = blockyTextToSVG('WARCRAFT', {
  theme: 'dark',
  blockSize: 6,
  charSpacing: 1,
  optimize: true,
});
```

## 📖 Viewing Options

### 1. Markdown Files

Perfect for reading in GitHub or any markdown viewer:

- Complete technical documentation
- ASCII grid representations
- Inline SVG previews

### 2. HTML Gallery

Open `docs/glyphs/index.html` in a browser:

- Interactive visual interface
- Real-time block size adjustment
- Beautiful dark theme
- Responsive layout

### 3. Quick Reference

Use `docs/glyphs/QUICK-REFERENCE.md` for:

- Fast character lookup
- Common patterns
- One-liner examples
- Cheat sheet format

## 🔗 Key Locations

| Resource            | Path                                                                |
| ------------------- | ------------------------------------------------------------------- |
| Main Docs           | [docs/glyphs/README.md](./glyphs/README.md)                         |
| Full Reference      | [docs/glyphs/COMPLETE-REFERENCE.md](./glyphs/COMPLETE-REFERENCE.md) |
| Quick Reference     | [docs/glyphs/QUICK-REFERENCE.md](./glyphs/QUICK-REFERENCE.md)       |
| Interactive Gallery | [docs/glyphs/index.html](./glyphs/index.html)                       |
| Source Code         | [pages/src/utils/alphabet/](../pages/src/utils/alphabet/)           |
| Sample SVGs         | [pages/samples/](../pages/samples/)                                 |

## 🎯 Common Examples

```typescript
// Logo generation
blockyTextToSVG('OPENCODE');

// Warcraft theme
blockyTextToSVG('WARCRAFT');

// With punctuation
blockyTextToSVG('READY?');
blockyTextToSVG('YES!');

// Compound words
blockyTextToSVG('A-Z');

// Contractions
blockyTextToSVG("DON'T");
```

## 🛠️ Development

### Generate Documentation

```bash
cd pages
bun run generate-glyph-docs.mjs
```

### Generate Sample SVGs

```bash
cd pages
bun run generate-samples.mjs
```

## 📊 System Specifications

- **Grid**: 7 rows × 1-5 columns (variable width)
- **Colors**: 3-tone palette (Primary, Secondary, Tertiary)
- **Format**: Optimized SVG paths
- **Themes**: Dark (default) and Light
- **Characters**: 32 total (26 letters + 6 symbols)

## 🎨 Color Themes

### Dark Theme (Default)

```
PRIMARY:   #F1ECEC (off-white)
SECONDARY: #B7B1B1 (light gray)
TERTIARY:  #4B4646 (dark gray)
```

### Light Theme

```
PRIMARY:   #2D2D2D (dark gray)
SECONDARY: #4A4A4A (medium gray)
TERTIARY:  #B8B8B8 (light gray)
```

## 📝 Notes

- Only uppercase letters (A-Z) are supported
- Numbers (0-9) are not yet implemented
- Spaces are rendered as gaps (no visible character)
- Limited to 6 punctuation symbols
- Consistent 7-row height for all glyphs

## 🔮 Future Enhancements

- [ ] Numeric digits (0-9)
- [ ] Additional symbols (`.`, `,`, `:`, `;`)
- [ ] Lowercase letters (a-z)
- [ ] Ligatures for common pairs
- [ ] Visible space character
- [ ] Animation support
- [ ] Font file export

## 📄 License

Part of the opencode-warcraft-notifications project.  
See [LICENSE](../LICENSE) for details.

---

**Start Exploring:**

1. Browse the [interactive gallery](./glyphs/index.html)
2. Read the [complete reference](./glyphs/COMPLETE-REFERENCE.md)
3. Check the [quick reference](./glyphs/QUICK-REFERENCE.md)
4. Review the [main documentation](./glyphs/README.md)
