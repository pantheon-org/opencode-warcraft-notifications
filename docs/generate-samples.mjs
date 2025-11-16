import { blockyTextToSVG } from './src/utils/blocky-text-to-svg.ts';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('samples', { recursive: true });

const samples = [
  { text: 'OPENCODE', desc: 'Original logo (pixel-perfect)' },
  { text: 'WARCRAFT', desc: 'Project name' },
  { text: 'HELLO WORLD', desc: 'Classic example' },
  { text: 'A-Z TEST!', desc: 'Alphabet demo' },
  { text: 'QUICK FIX?', desc: 'Punctuation demo' }
];

samples.forEach(({ text, desc }) => {
  const svg = blockyTextToSVG(text);
  const filename = text.replace(/[^A-Z]/g, '-').toLowerCase();
  writeFileSync(`samples/${filename}.svg`, svg);
  console.log(`✓ Generated: samples/${filename}.svg (${desc})`);
});

console.log('\n=== SAMPLES GENERATED ===');
console.log('View files in: docs/samples/');
