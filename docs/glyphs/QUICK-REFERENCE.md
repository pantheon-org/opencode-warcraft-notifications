# Quick Reference — Blocky Alphabet

Fast lookup guide for all available glyphs.

## 🔤 Letters (26)

### Narrow (1-2 columns)

- **I** (1 col) - Vertical line
- **J** (3 cols) - Hook shape

### Regular (3-4 columns)

- **A** (4 cols) - Triangle top, horizontal bar
- **B** (4 cols) - Vertical left, double bumps
- **C** (4 cols) - Open right side
- **D** (4 cols) - Vertical left, rounded right
- **E** (4 cols) - Three horizontal bars
- **F** (3 cols) - Flag shape, top and middle bars
- **G** (4 cols) - C with bottom extension
- **H** (4 cols) - Two verticals, middle bar
- **K** (4 cols) - Vertical left, diagonal arms
- **L** (3 cols) - Vertical left, bottom bar
- **N** (4 cols) - Two verticals, diagonal
- **O** (4 cols) - Full rectangle
- **P** (4 cols) - Vertical left, top bump
- **Q** (4 cols) - O with tail
- **R** (4 cols) - P with diagonal leg
- **S** (4 cols) - Snake shape
- **T** (4 cols) - Top bar, vertical center
- **U** (4 cols) - Two verticals, bottom bar
- **Y** (4 cols) - Two tops merge, bottom tail
- **Z** (4 cols) - Diagonal zigzag

### Wide (5 columns)

- **M** (5 cols) - Two peaks
- **V** (5 cols) - Inverted triangle
- **W** (5 cols) - Double V shape
- **X** (5 cols) - Cross diagonal

## 🔣 Symbols (6)

| Symbol | Name        | Width | Position           | Example |
| ------ | ----------- | ----- | ------------------ | ------- |
| `-`    | Hyphen      | 3     | Center (row 3)     | `A-Z`   |
| `\|`   | Pipe        | 1     | Full height        | `A\|B`  |
| `'`    | Apostrophe  | 1     | Top (rows 1-2)     | `DON'T` |
| `"`    | Quote       | 2     | Top (rows 0-1)     | `"HI"`  |
| `?`    | Question    | 4     | Full (curve + dot) | `WHY?`  |
| `!`    | Exclamation | 1     | Full (stem + dot)  | `YES!`  |

## 📐 Grid System Cheat Sheet

```
Row 0: [Padding]     → PRIMARY zone
Row 1: [Upper part]  → PRIMARY zone
Row 2: [Upper part]  → PRIMARY zone
Row 3: [Middle]      → SECONDARY zone
Row 4: [Middle]      → SECONDARY zone
Row 5: [Lower part]  → SECONDARY zone
Row 6: [Padding]     → PRIMARY zone
```

## 🎨 Colors

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

## 💻 Common Patterns

### Text Examples

```typescript
blockyTextToSVG('HELLO'); // Simple text
blockyTextToSVG('A-Z'); // With hyphen
blockyTextToSVG("DON'T"); // With apostrophe
blockyTextToSVG('READY?'); // With question
blockyTextToSVG('YES!'); // With exclamation
blockyTextToSVG('A|B|C'); // With pipes
```

### Width Calculations

```
Character width = columns × blockSize
Spacing = charSpacing × blockSize
Total per char = width + spacing
```

### Example: "HELLO" (6px blocks, 1px spacing)

```
H: 4 cols × 6px = 24px
E: 4 cols × 6px = 24px
L: 3 cols × 6px = 18px
L: 3 cols × 6px = 18px
O: 4 cols × 6px = 24px

Spacing: 4 × 1 × 6px = 24px
Total width: 108px + 24px = 132px
Height: 7 rows × 6px = 42px
```

## 🔍 Character Lookup

### By Width

**1 column:**

- Pipe `|`
- Apostrophe `'`
- Exclamation `!`
- Letter I

**2 columns:**

- Quote `"`

**3 columns:**

- Hyphen `-`
- Letters: F, J, L

**4 columns:**

- Question `?`
- Letters: A, B, C, D, E, G, H, K, N, O, P, Q, R, S, T, U, Y, Z

**5 columns:**

- Letters: M, V, W, X

### By Height

**All glyphs:** 7 rows (fixed)

### By Top/Bottom Features

**Top elements:**

- Apostrophe `'` (rows 1-2)
- Quote `"` (rows 0-1)
- Letters with top features: A, B, D, E, F, G, etc.

**Bottom elements:**

- Letter P (extends to row 6)
- Letter Q (tail on row 6)
- Letter Y (tail on row 6)
- Exclamation `!` (dot on row 6)
- Question `?` (dot on row 6)

## ⚡ Quick Tips

1. **Only uppercase**: Use `.toUpperCase()` on input
2. **No spaces**: Spaces aren't rendered (yet)
3. **No numbers**: Digits not implemented
4. **Six symbols only**: `-`, `|`, `'`, `"`, `?`, `!`
5. **Fixed height**: Always 7 rows
6. **Variable width**: 1-5 columns per character
7. **Color by row**: Rows 0-2,6 = PRIMARY; Rows 3-5 = SECONDARY
8. **Optimize output**: Use `optimize: true` for smaller SVGs

## 📊 Character Set Summary

| Category  | Count  | Characters                    |
| --------- | ------ | ----------------------------- |
| Letters   | 26     | A-Z                           |
| Symbols   | 6      | `-`, `\|`, `'`, `"`, `?`, `!` |
| **Total** | **32** | All supported glyphs          |

## 🚀 One-Liner Examples

```typescript
// Logo
blockyTextToSVG('OPENCODE');

// Warcraft theme
blockyTextToSVG('WARCRAFT');

// With punctuation
blockyTextToSVG('WORK DONE!');

// Questions
blockyTextToSVG('READY?');

// Separators
blockyTextToSVG('YES|NO');

// Contractions
blockyTextToSVG("IT'S DONE");

// Ranges
blockyTextToSVG('A-Z');
```

## 📖 Full Documentation

For complete details:

- [README.md](./README.md) - Full overview
- [COMPLETE-REFERENCE.md](./COMPLETE-REFERENCE.md) - All glyphs with ASCII grids & SVGs
- [index.html](./index.html) - Interactive visual gallery

## 🎯 Common Use Cases

| Use Case     | Recommended Glyphs | Example     |
| ------------ | ------------------ | ----------- |
| Logos        | Letters only       | `OPENCODE`  |
| Headers      | Letters + hyphen   | `A-Z GUIDE` |
| Questions    | Letters + `?`      | `WHY?`      |
| Emphasis     | Letters + `!`      | `DONE!`     |
| Quotes       | `"` + letters      | `"HELLO"`   |
| Lists        | Letters + `\|`     | `A\|B\|C`   |
| Contractions | Letters + `'`      | `DON'T`     |

---

**Need more info?** See [README.md](./README.md) for complete documentation.
