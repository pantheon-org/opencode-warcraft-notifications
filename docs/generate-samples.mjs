import { blockyTextToSVG } from './src/utils/alphabet/index.ts';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('samples', { recursive: true });

const samples = [
  { text: 'OPENCODE', desc: 'Original logo (pixel-perfect)', theme: 'dark' },
  { text: 'WARCRAFT', desc: 'Project name', theme: 'dark' },
  { text: 'HELLO WORLD', desc: 'Classic example', theme: 'dark' },
  { text: 'A-Z TEST!', desc: 'Alphabet demo', theme: 'dark' },
  { text: 'QUICK FIX?', desc: 'Punctuation demo', theme: 'dark' },
];

samples.forEach(({ text, desc, theme }) => {
  const svg = blockyTextToSVG(text, {
    theme,
    blockSize: 6,
    charSpacing: 1,
    optimize: true, // Enable path optimization
  });
  const filename = text.replace(/[^A-Z]/g, '-').toLowerCase();
  writeFileSync(`samples/${filename}.svg`, svg);
  console.log(`✓ Generated: samples/${filename}.svg (${desc})`);
});

console.log('\n=== SAMPLES GENERATED ===');
console.log('View files in: docs/samples/');
