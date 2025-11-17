import { blockyTextToSVG, getAvailableCharacters } from './src/utils/blocky-text-to-svg.ts';

console.log('=== BLOCKY TEXT-TO-SVG ALPHABET TEST ===\n');

const chars = getAvailableCharacters();
console.log(`Available characters (${chars.length}):`, chars.sort().join(', '));

const tests = [
  'OPENCODE',
  'WARCRAFT',
  'HELLO WORLD',
  'A-Z TEST!',
  'QUICK FIX?',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
];

tests.forEach(text => {
  const svg = blockyTextToSVG(text);
  const width = svg.match(/width="(\d+)"/)[1];
  const height = svg.match(/height="(\d+)"/)[1];
  console.log(`\n"${text}": ${width}×${height}px`);
});

console.log('\n=== TEST COMPLETE ===');
