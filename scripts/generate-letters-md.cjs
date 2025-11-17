const fs = require('fs');
const path = require('path');
const htmlPath = path.resolve(__dirname, '../docs/src/utils/alphabet/letters/letters.html');
const outPath = path.resolve(__dirname, '../docs/src/utils/alphabet/LETTERS.md');
const s = fs.readFileSync(htmlPath, 'utf8');
const m = s.match(/const letters = \{([\s\S]*?)\};/m);
if(!m){ console.error('letters object not found'); process.exit(1); }
const body = m[1];
const entryRe = /['\"]([a-z])['\"]\s*:\s*createGlyph\((\[\[[\s\S]*?\]\])\s*,\s*(\d+)\)/g;
let match;
const letters = {};
while((match = entryRe.exec(body)) !== null){
  const name = match[1];
  const gridText = match[2];
  let grid;
  try{ grid = JSON.parse(gridText); } catch(e){ console.error('JSON parse failed for', name, e); process.exit(1); }
  letters[name.toUpperCase()] = grid;
}

function makeSvg(rows, cellSize=16, theme='dark'){
  const cols = Math.max(...rows.map(r=>r.length));
  const width = cols*cellSize;
  const height = 7*cellSize;
  const themes = {
    dark: { background:'#000000', primary:'#FFFFFF', secondary:'#626262' },
    light: { background:'#FFFFFF', primary:'#000000', secondary:'#9d9d9d' }
  };
  const t = themes[theme] || themes.dark;
  let svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${width}\" height=\"${height}\" viewBox=\"0 0 ${width} ${height}\">`;
  svg += `<rect width=\"100%\" height=\"100%\" fill=\"${t.background}\"/>`;
  for(let r=0;r<7;r++){
    const row = rows[r] || [];
    for(let c=0;c<cols;c++){
      const v = c<row.length?row[c]:0;
      let fill = null;
      if(v === 1) fill = t.primary;
      else if(r>=3 && r<=5) fill = t.secondary;
      if(fill){ svg += `<rect x=\"${c*cellSize}\" y=\"${r*cellSize}\" width=\"${cellSize}\" height=\"${cellSize}\" fill=\"${fill}\"/>`; }
    }
  }
  svg += '</svg>';
  return svg;
}

function asciiGrid(rows){
  const cols = Math.max(...rows.map(r=>r.length));
  const sep = '+' + Array(cols).fill('---').join('+') + '+';
  const lines = [sep];
  for(let r=0;r<7;r++){
    const row = rows[r] || [];
    const cells = [];
    for(let c=0;c<cols;c++) cells.push(' '+(c<row.length?row[c]:0)+' ');
    lines.push('|'+cells.join('|')+'|');
    lines.push(sep);
  }
  return lines.join('\n');
}

let md = '# Blocky Alphabet — Letter Reference\n\nThis page is generated from `docs/src/utils/alphabet/letters/letters.html`. It shows an ASCII grid and an inline SVG preview for each letter.\n\n';

for(const [letter, rows] of Object.entries(letters)){
  md += `## ${letter}\n\n`;
  md += '### ASCII grid\n\n';
  md += '```\n'+asciiGrid(rows)+'\n```\n\n';
  md += '### SVG preview (dark)\n\n';
  md += makeSvg(rows, 12, 'dark') + '\n\n';
  md += '---\n\n';
}

fs.writeFileSync(outPath, md, 'utf8');
console.log('Wrote', outPath);
