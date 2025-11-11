#!/usr/bin/env node

/**
 * Transform Jekyll markdown docs to Astro/Starlight format
 * This script runs during CI/CD to prepare docs for Astro build
 */

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_SOURCE = join(__dirname, '../docs');
const DOCS_DEST = join(__dirname, 'src/content/docs');

// Ensure destination exists
mkdirSync(DOCS_DEST, { recursive: true });

/**
 * Extract first heading from markdown content
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

/**
 * Generate description from content
 */
function generateDescription(content, defaultDesc) {
  // Try to get first paragraph after heading
  const lines = content.split('\n');
  let foundHeading = false;
  for (const line of lines) {
    if (line.startsWith('#')) {
      foundHeading = true;
      continue;
    }
    if (foundHeading && line.trim() && !line.startsWith('---')) {
      // Limit length and escape special characters for YAML
      let desc = line.trim().slice(0, 150);
      // Remove colons and quotes that might break YAML
      desc = desc.replace(/:/g, ' -').replace(/"/g, "'");
      return desc;
    }
  }
  return defaultDesc;
}

/**
 * Add Starlight frontmatter to markdown content
 */
function addFrontmatter(content, title, description) {
  // Remove any existing Jekyll frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/m, '');

  // Quote description to handle special YAML characters
  const quotedDesc = description.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  return `---
title: "${title}"
description: "${quotedDesc}"
---

${withoutFrontmatter}`;
}

/**
 * Update internal links to Starlight format
 */
function updateLinks(content) {
  return content
    .replace(/\[([^\]]+)\]\(USER_GUIDE\.md([#][^\)]+)?\)/g, '[$1](/user-guide/$2)')
    .replace(/\[([^\]]+)\]\(API\.md([#][^\)]+)?\)/g, '[$1](/api/$2)')
    .replace(/\[([^\]]+)\]\(ARCHITECTURE\.md([#][^\)]+)?\)/g, '[$1](/architecture/$2)')
    .replace(/\[([^\]]+)\]\(DEVELOPMENT\.md([#][^\)]+)?\)/g, '[$1](/development/$2)')
    .replace(/\[([^\]]+)\]\(DEPLOYMENT\.md([#][^\)]+)?\)/g, '[$1](/deployment/$2)')
    .replace(/\[([^\]]+)\]\(PIPELINE\.md([#][^\)]+)?\)/g, '[$1](/pipeline/$2)')
    .replace(/\[([^\]]+)\]\(TROUBLESHOOTING\.md([#][^\)]+)?\)/g, '[$1](/troubleshooting/$2)')
    .replace(/\[([^\]]+)\]\(ONBOARDING\.md([#][^\)]+)?\)/g, '[$1](/onboarding/$2)')
    .replace(/\[([^\]]+)\]\(VALIDATE_SCHEMA\.md([#][^\)]+)?\)/g, '[$1](/validate-schema/$2)')
    .replace(/\[([^\]]+)\]\(README\.md([#][^\)]+)?\)/g, '[$1](/$2)')
    .replace(
      /\[([^\]]+)\]\(github-workflows\/README\.md([#][^\)]+)?\)/g,
      '[$1](/github-workflows/$2)',
    )
    .replace(
      /\[([^\]]+)\]\(github-workflows\/([^)]+)\.md([#][^\)]+)?\)/g,
      '[$1](/github-workflows/$2/$3)',
    )
    .replace(/\[([^\]]+)\]\(schemas\/README\.md([#][^\)]+)?\)/g, '[$1](/schemas/$2)')
    .replace(
      /\[([^\]]+)\]\(\.\.\/CONTRIBUTING\.md\)/g,
      '[$1](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md)',
    );
}

/**
 * File mapping with metadata
 */
const fileMap = {
  'index.md': {
    dest: 'index.md',
    title: 'Home',
    description: 'Warcraft II Notifications Plugin for OpenCode',
  },
  'USER_GUIDE.md': {
    dest: 'user-guide.md',
    title: 'User Guide',
    description: 'Installation, configuration, and usage guide',
  },
  'API.md': {
    dest: 'api.md',
    title: 'API Documentation',
    description: 'Complete API reference for the plugin',
  },
  'ARCHITECTURE.md': {
    dest: 'architecture.md',
    title: 'Architecture',
    description: 'System architecture and design',
  },
  'DEVELOPMENT.md': {
    dest: 'development.md',
    title: 'Development Guide',
    description: 'Development setup and contributing',
  },
  'DEPLOYMENT.md': {
    dest: 'deployment.md',
    title: 'Deployment Guide',
    description: 'Installation and deployment instructions',
  },
  'PIPELINE.md': {
    dest: 'pipeline.md',
    title: 'CI/CD Pipeline',
    description: 'Automated release pipeline documentation',
  },
  'TROUBLESHOOTING.md': {
    dest: 'troubleshooting.md',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
  },
  'ONBOARDING.md': {
    dest: 'onboarding.md',
    title: 'Onboarding',
    description: 'New contributor onboarding guide',
  },
  'VALIDATE_SCHEMA.md': {
    dest: 'validate-schema.md',
    title: 'Schema Validation',
    description: 'JSON schema validation guide',
  },
};

/**
 * Process subdirectory
 */
function processDirectory(sourceDir, destDir, prefix = '') {
  mkdirSync(destDir, { recursive: true });

  const files = readdirSync(sourceDir);

  for (const file of files) {
    const sourcePath = join(sourceDir, file);
    const stat = statSync(sourcePath);

    if (stat.isDirectory()) {
      processDirectory(sourcePath, join(destDir, file), `${prefix}${file}/`);
    } else if (file.endsWith('.md')) {
      const content = readFileSync(sourcePath, 'utf-8');
      const title = extractTitle(content) || file.replace('.md', '');
      const description = generateDescription(content, `Documentation for ${title}`);

      const transformed = updateLinks(addFrontmatter(content, title, description));

      const destFile = file === 'README.md' ? 'index.md' : file.toLowerCase();
      writeFileSync(join(destDir, destFile), transformed);

      console.log(`  ✓ ${prefix}${file} → ${prefix}${destFile}`);
    } else {
      // Copy non-markdown files (schemas, etc.)
      copyFileSync(sourcePath, join(destDir, file));
      console.log(`  📄 ${prefix}${file} (copied)`);
    }
  }
}

console.log('🔄 Transforming documentation...\n');

// Process main files
console.log('Main pages:');
for (const [source, config] of Object.entries(fileMap)) {
  const sourcePath = join(DOCS_SOURCE, source);
  const destPath = join(DOCS_DEST, config.dest);

  try {
    const content = readFileSync(sourcePath, 'utf-8');
    const transformed = updateLinks(addFrontmatter(content, config.title, config.description));

    writeFileSync(destPath, transformed);
    console.log(`  ✓ ${source} → ${config.dest}`);
  } catch (error) {
    console.error(`  ✗ Failed to process ${source}:`, error.message);
  }
}

// Process subdirectories
console.log('\nGitHub Workflows:');
processDirectory(
  join(DOCS_SOURCE, 'github-workflows'),
  join(DOCS_DEST, 'github-workflows'),
  'github-workflows/',
);

console.log('\nSchemas:');
processDirectory(join(DOCS_SOURCE, 'schemas'), join(DOCS_DEST, 'schemas'), 'schemas/');

// Copy assets
console.log('\nAssets:');
try {
  const assetSource = join(DOCS_SOURCE, 'assets/favicon.svg');
  const assetDest1 = join(__dirname, 'src/assets/logo.svg');
  const assetDest2 = join(__dirname, 'public/favicon.svg');

  mkdirSync(join(__dirname, 'public'), { recursive: true });

  copyFileSync(assetSource, assetDest1);
  copyFileSync(assetSource, assetDest2);
  console.log('  ✓ favicon.svg → logo.svg & public/favicon.svg');
} catch (error) {
  console.error('  ✗ Failed to copy assets:', error.message);
}

console.log('\n✅ Documentation transformation complete!');
