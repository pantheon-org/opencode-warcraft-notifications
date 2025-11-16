const fs = require('fs');
const path = require('path');
const htmlPath = path.resolve(__dirname, '../docs/src/utils/alphabet/letters/letters.html');
const outDir = path.resolve(__dirname, '../docs/src/utils/alphabet/letters');
const s = fs.readFileSync(htmlPath, 'utf8');
const m = s.match(/const letters = \{([\s\S]*?)\};/m);
if (!m) {
  console.error('letters object not found');
  process.exit(1);
}
const body = m[1];
const entryRe = /['\"]([a-z])['\"]\s*:\s*createLetter\((\[\[[\s\S]*?\]\])\s*,\s*(\d+)\)/g;
let match;
const letters = {};
while ((match = entryRe.exec(body)) !== null) {
  const name = match[1];
  const gridText = match[2];
  const cols = parseInt(match[3], 10);
  let grid;
  try {
    grid = JSON.parse(gridText);
  } catch (e) {
    console.error('JSON parse failed for', name, e);
    process.exit(1);
  }
  letters[name] = { grid, cols };
}

function cell(val, rowIdx) {
  if (val === 1) return 'cellType.PRIMARY';
  if (rowIdx >= 3 && rowIdx <= 5) return 'cellType.SECONDARY';
  return 'cellType.BLANK';
}

function makeGridAscii(rows) {
  const cols = Math.max(...rows.map((r) => r.length));
  const lines = [];
  const sep = '+' + Array(cols).fill('---').join('+') + '+';
  lines.push(sep);
  for (let r = 0; r < 7; r++) {
    const row = rows[r] || [];
    const cells = [];
    for (let c = 0; c < cols; c++) {
      const v = c < row.length ? row[c] : 0;
      cells.push(' ' + v + ' ');
    }
    lines.push('|' + cells.join('|') + '|');
    lines.push(sep);
  }
  return lines.join('\n');
}

for (const [ch, data] of Object.entries(letters)) {
  const upper = ch.toUpperCase();
  const fileName = path.join(outDir, `letter-${ch}.ts`);
  const rows = data.grid.slice();
  while (rows.length < 7) rows.push([]);

  // Emit rows as Record<number, number[]>, ensure each row length is between 1 and 5
  const rowsLines = rows
    .map((r, idx) => {
      const limited = r.slice(0, 5);
      while (limited.length < 1) limited.push(0);
      const arr = limited.map((v) => (v ? 1 : 0)).join(', ');
      return `    ${idx}: [${arr}],`;
    })
    .join('\n');

  const ascii = makeGridAscii(rows);

  const asciiComment = ascii
    .split('\n')
    .map((l) => ' * ' + l)
    .join('\n');

  const content = `import { darkTheme, lightTheme, themeType } from '../theme';\nimport { cellType, type Glyph } from './types';\n\n/**\n * Letter ${upper} representation\n * @type {Glyph}\n *\n${asciiComment}\n *\n * Example usage:\n * const blocks = textToBlocks('${upper}');\n */\nexport const letter${upper}: Glyph = {\n  rows: {\n${rowsLines}\n  },\n  theme: {\n    [themeType.LIGHT]: lightTheme,\n    [themeType.DARK]: darkTheme,\n  },\n};\n`;
  fs.writeFileSync(fileName, content, 'utf8');
  console.log('Wrote', fileName);
}
