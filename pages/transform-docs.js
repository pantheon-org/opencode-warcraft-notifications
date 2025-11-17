#!/usr/bin/env node

/**
 * Transform documentation from source (../docs/) to Astro content (./src/content/docs/)
 *
 * This script:
 * 1. Reads markdown files from ../docs/
 * 2. Copies them to ./src/content/docs/
 * 3. Preserves directory structure
 * 4. Maintains frontmatter and markdown formatting
 */

import { readdir, mkdir, copyFile } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_DIR = join(__dirname, '../docs');
const TARGET_DIR = join(__dirname, 'src/content/docs');

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
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.md') ||
        entry.name.endsWith('.json') ||
        entry.name.endsWith('.example') ||
        entry.name.endsWith('.schema'))
    ) {
      // Copy markdown and schema files
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
