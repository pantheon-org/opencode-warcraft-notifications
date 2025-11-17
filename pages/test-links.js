#!/usr/bin/env node

/**
 * Test all internal links in built HTML files
 *
 * This script:
 * 1. Scans all HTML files in the dist directory
 * 2. Extracts all internal links
 * 3. Verifies each link points to an existing file
 * 4. Reports any broken links
 */

import { readdir, readFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, 'dist');
const BASE_PATH = '/opencode-warcraft-notifications';

/**
 * Extract all internal links from an HTML file
 */
async function extractLinks(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const links = new Set();

  // Match all href attributes
  const hrefPattern = /href="([^"]+)"/g;
  let match;

  while ((match = hrefPattern.exec(content)) !== null) {
    const href = match[1];

    // Only include internal links (starting with / or the base path)
    if (
      href.startsWith('/') &&
      !href.startsWith('//') &&
      !href.startsWith('http://') &&
      !href.startsWith('https://')
    ) {
      links.add(href);
    }
  }

  return Array.from(links);
}

/**
 * Convert a URL path to a file system path
 */
function urlToFilePath(url) {
  // Remove base path if present
  let path = url;
  if (path.startsWith(BASE_PATH)) {
    path = path.substring(BASE_PATH.length);
  }

  // Remove leading slash
  if (path.startsWith('/')) {
    path = path.substring(1);
  }

  // Remove anchor
  const anchorIndex = path.indexOf('#');
  if (anchorIndex !== -1) {
    path = path.substring(0, anchorIndex);
  }

  // If path is empty, it's the root index
  if (path === '') {
    path = 'index.html';
  }
  // If path ends with /, add index.html
  else if (path.endsWith('/')) {
    path += 'index.html';
  }
  // If path has a file extension (css, js, svg, xml, etc.), use it as-is
  else if (path.match(/\.[a-z0-9]+$/i)) {
    // File with extension - use as-is
  }
  // Otherwise assume it's a directory
  else {
    path += '/index.html';
  }

  return join(DIST_DIR, path);
}

/**
 * Check if a link is valid
 */
async function isValidLink(url) {
  const filePath = urlToFilePath(url);

  try {
    await access(filePath);
    return { valid: true, filePath };
  } catch (error) {
    return { valid: false, filePath };
  }
}

/**
 * Recursively process all HTML files in a directory
 */
async function processDirectory(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const allLinks = new Map(); // url -> Set of files containing it

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Skip certain directories
      if (entry.name === '_astro' || entry.name === 'pagefind') {
        continue;
      }
      const dirLinks = await processDirectory(fullPath);
      // Merge directory links
      for (const [url, files] of dirLinks) {
        if (!allLinks.has(url)) {
          allLinks.set(url, new Set());
        }
        for (const file of files) {
          allLinks.get(url).add(file);
        }
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const links = await extractLinks(fullPath);
      const relativePath = fullPath.replace(DIST_DIR + '/', '');

      for (const link of links) {
        if (!allLinks.has(link)) {
          allLinks.set(link, new Set());
        }
        allLinks.get(link).add(relativePath);
      }
    }
  }

  return allLinks;
}

/**
 * Main test process
 */
async function main() {
  console.log('🔍 Testing internal links in HTML files...\n');
  console.log(`Base path: ${BASE_PATH}`);
  console.log(`Dist directory: ${DIST_DIR}\n`);

  try {
    // Collect all links
    const allLinks = await processDirectory(DIST_DIR);

    console.log(`Found ${allLinks.size} unique internal link(s)\n`);

    // Check each link
    const brokenLinks = [];
    const missingBasePathLinks = [];

    for (const [url, files] of allLinks) {
      const { valid, filePath } = await isValidLink(url);

      if (!valid) {
        brokenLinks.push({ url, files: Array.from(files), filePath });
      }

      // Check if link has base path
      if (!url.startsWith(BASE_PATH) && !url.startsWith('#')) {
        missingBasePathLinks.push({ url, files: Array.from(files) });
      }
    }

    // Report results
    if (missingBasePathLinks.length > 0) {
      console.error(`❌ Found ${missingBasePathLinks.length} link(s) missing base path:\n`);
      for (const { url, files } of missingBasePathLinks.slice(0, 10)) {
        console.error(`  ${url}`);
        console.error(`    Found in: ${files.join(', ')}`);
      }
      if (missingBasePathLinks.length > 10) {
        console.error(`  ... and ${missingBasePathLinks.length - 10} more\n`);
      }
      console.error('');
    }

    if (brokenLinks.length > 0) {
      console.error(`❌ Found ${brokenLinks.length} broken link(s):\n`);
      for (const { url, files, filePath } of brokenLinks.slice(0, 10)) {
        console.error(`  ${url}`);
        console.error(`    Expected file: ${filePath}`);
        console.error(`    Found in: ${files.join(', ')}`);
      }
      if (brokenLinks.length > 10) {
        console.error(`  ... and ${brokenLinks.length - 10} more\n`);
      }
      console.error('');
      process.exit(1);
    }

    if (missingBasePathLinks.length > 0) {
      console.error('⚠️  Links are missing base path. Run: bun run fix-links\n');
      process.exit(1);
    }

    console.log('✅ All internal links are valid!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Link testing failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();
