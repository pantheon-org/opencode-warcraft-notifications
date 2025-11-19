/**
 * Favicon Generation Script
 *
 * Generates the favicon.svg file dynamically using the blocky text utility,
 * matching the visual style of the logo files.
 *
 * This script is executed during the build process to ensure the favicon
 * is generated before Astro builds the site.
 */

import { blockyTextToSVG } from './src/utils/alphabet/index.ts';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the public directory exists
const publicDir = join(__dirname, 'public');
mkdirSync(publicDir, { recursive: true });

// Generate favicon with "W" character in dark theme
// Using a larger block size for better favicon rendering
const faviconSVG = blockyTextToSVG('W', {
  theme: 'dark',
  blockSize: 8,
  charSpacing: 0,
  optimize: true,
});

// Write to public directory
const outputPath = join(publicDir, 'favicon.svg');
writeFileSync(outputPath, faviconSVG);

console.log('✓ Generated: public/favicon.svg');
console.log('  Character: W');
console.log('  Theme: dark');
console.log('  Block size: 8px');
