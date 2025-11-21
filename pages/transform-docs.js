#!/usr/bin/env node

/**
 * Transform documentation from source (../docs/) to Astro content (./src/content/docs/)
 *
 * This script:
 * 1. Reads markdown files from ../docs/
 * 2. Adds frontmatter if missing (title is required by Astro)
 * 3. Copies them to ./src/content/docs/
 * 4. Preserves directory structure
 * 5. Maintains existing frontmatter and markdown formatting
 */

import { readdir, mkdir, copyFile, readFile, writeFile } from 'fs/promises';
import { join, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_DIR = join(__dirname, '../docs');
const TARGET_DIR = join(__dirname, 'src/content/docs');

/**
 * Extract title from first heading in markdown content
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Untitled';
}

/**
 * Check if content has frontmatter
 */
function hasFrontmatter(content) {
  return content.trimStart().startsWith('---');
}

/**
 * Add frontmatter to markdown content if missing
 */
function addFrontmatter(content, filename) {
  if (hasFrontmatter(content)) {
    return content;
  }

  const title = extractTitle(content);
  const frontmatter = `---\ntitle: '${title}'\n---\n\n`;
  return frontmatter + content;
}

/**
 * Process markdown file: add frontmatter if needed, then copy
 */
async function processMarkdownFile(sourcePath, targetPath) {
  const content = await readFile(sourcePath, 'utf-8');
  const processedContent = addFrontmatter(content, basename(sourcePath));
  await writeFile(targetPath, processedContent, 'utf-8');
}

/**
 * Recursively copy all markdown files from source to target
 */
async function copyMarkdownFiles(sourceDir, targetDir, relativePath = '') {
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);
    const currentRelativePath = join(relativePath, entry.name);

    // Skip certain directories and files
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name === '.DS_Store' ||
      (entry.name === 'README.md' && relativePath === '')
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      // Create directory if it doesn't exist
      await mkdir(targetPath, { recursive: true });
      // Recursively copy contents
      await copyMarkdownFiles(sourcePath, targetPath, currentRelativePath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Process markdown files (add frontmatter if needed)
      await processMarkdownFile(sourcePath, targetPath);
      console.log(`  ✓ ${currentRelativePath}`);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.json') ||
        entry.name.endsWith('.example') ||
        entry.name.endsWith('.schema'))
    ) {
      // Copy non-markdown files as-is
      await copyFile(sourcePath, targetPath);
      console.log(`  ✓ ${currentRelativePath}`);
    }
  }
}

/**
 * Main transformation process
 */
async function transform() {
  console.log('🔄 Transforming documentation...\n');
  console.log(`Source: ${relative(process.cwd(), SOURCE_DIR)}`);
  console.log(`Target: ${relative(process.cwd(), TARGET_DIR)}\n`);

  try {
    // Ensure target directory exists
    await mkdir(TARGET_DIR, { recursive: true });

    // Copy all markdown files
    await copyMarkdownFiles(SOURCE_DIR, TARGET_DIR);

    console.log('\n✅ Documentation transformation complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Transformation failed:', error.message);
    process.exit(1);
  }
}

// Run transformation
transform();
