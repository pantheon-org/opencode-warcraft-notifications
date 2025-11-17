#!/usr/bin/env node

/**
 * Documentation Link Validator
 *
 * This script validates all internal links in the documentation to ensure
 * they point to existing files and sections.
 *
 * Usage:
 *   node scripts/validate-docs-links.cjs
 *
 * Features:
 * - Validates markdown links in docs/src/content/docs/
 * - Checks if linked files exist
 * - Validates section anchors
 * - Reports broken links with line numbers
 * - Generates summary report
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DOCS_DIR = path.join(__dirname, '../docs/src/content/docs');
const DOCS_ROOT = path.join(__dirname, '../docs');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Results tracking
const results = {
  totalFiles: 0,
  totalLinks: 0,
  brokenLinks: [],
  missingFiles: [],
  missingAnchors: [],
  externalLinks: [],
  validLinks: 0,
};

/**
 * Get all markdown files recursively
 */
function getMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules, .git, etc.
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        getMarkdownFiles(fullPath, files);
      }
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract all links from markdown content
 */
function extractLinks(content, filePath) {
  const links = [];
  const lines = content.split('\n');

  // Match markdown links: [text](url) and [text](url "title")
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  lines.forEach((line, index) => {
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      const [fullMatch, text, url] = match;
      links.push({
        text,
        url,
        line: index + 1,
        filePath,
      });
    }
  });

  return links;
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content) {
  const headings = new Set();
  const lines = content.split('\n');

  lines.forEach((line) => {
    const match = line.match(/^#+\s+(.+)$/);
    if (match) {
      const heading = match[1].trim();
      // Convert heading to anchor format
      const anchor = heading
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.add(anchor);
    }
  });

  return headings;
}

/**
 * Check if a link is external
 */
function isExternalLink(url) {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
}

/**
 * Check if a link is a GitHub link
 */
function isGitHubLink(url) {
  return url.includes('github.com');
}

/**
 * Validate a single link
 */
function validateLink(link, currentFile) {
  results.totalLinks++;

  let url = link.url.trim();

  // Skip external links (we'll track them separately)
  if (isExternalLink(url)) {
    results.externalLinks.push(link);
    results.validLinks++;
    return;
  }

  // Parse URL and anchor
  const [linkPath, anchor] = url.split('#');

  // Handle different link formats
  let targetFile;
  if (!linkPath || linkPath === '') {
    // Same-file anchor link (#anchor)
    targetFile = currentFile;
  } else if (linkPath.startsWith('/')) {
    // Absolute path from docs root
    targetFile = path.join(DOCS_DIR, linkPath.replace(/^\//, ''));
    if (!targetFile.endsWith('.md')) {
      targetFile += '.md';
    }
  } else if (linkPath.startsWith('./') || linkPath.startsWith('../')) {
    // Relative path
    const currentDir = path.dirname(currentFile);
    targetFile = path.resolve(currentDir, linkPath);
    if (!targetFile.endsWith('.md')) {
      targetFile += '.md';
    }
  } else {
    // Relative path without ./
    const currentDir = path.dirname(currentFile);
    targetFile = path.resolve(currentDir, linkPath);
    if (!targetFile.endsWith('.md')) {
      targetFile += '.md';
    }
  }

  // Check if file exists
  if (!fs.existsSync(targetFile)) {
    results.brokenLinks.push({
      ...link,
      reason: 'File not found',
      targetFile,
    });
    results.missingFiles.push(targetFile);
    return;
  }

  // Check if anchor exists (if specified)
  if (anchor) {
    const targetContent = fs.readFileSync(targetFile, 'utf-8');
    const headings = extractHeadings(targetContent);

    if (!headings.has(anchor)) {
      results.brokenLinks.push({
        ...link,
        reason: 'Anchor not found',
        targetFile,
        anchor,
      });
      results.missingAnchors.push({
        file: targetFile,
        anchor,
      });
      return;
    }
  }

  results.validLinks++;
}

/**
 * Validate all links in a file
 */
function validateFile(filePath) {
  results.totalFiles++;

  const content = fs.readFileSync(filePath, 'utf-8');
  const links = extractLinks(content, filePath);

  links.forEach((link) => validateLink(link, filePath));
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n');
  console.log('='.repeat(80));
  console.log(`${colors.cyan}Documentation Link Validation Report${colors.reset}`);
  console.log('='.repeat(80));
  console.log('');

  // Summary
  console.log(`${colors.blue}Summary:${colors.reset}`);
  console.log(`  Total files scanned:    ${results.totalFiles}`);
  console.log(`  Total links found:      ${results.totalLinks}`);
  console.log(`  Valid links:            ${colors.green}${results.validLinks}${colors.reset}`);
  console.log(
    `  Broken links:           ${results.brokenLinks.length > 0 ? colors.red : colors.green}${results.brokenLinks.length}${colors.reset}`,
  );
  console.log(`  External links:         ${results.externalLinks.length}`);
  console.log('');

  // Broken links details
  if (results.brokenLinks.length > 0) {
    console.log(`${colors.red}Broken Links:${colors.reset}`);
    console.log('');

    const groupedByFile = {};
    results.brokenLinks.forEach((link) => {
      const relPath = path.relative(DOCS_ROOT, link.filePath);
      if (!groupedByFile[relPath]) {
        groupedByFile[relPath] = [];
      }
      groupedByFile[relPath].push(link);
    });

    Object.entries(groupedByFile).forEach(([file, links]) => {
      console.log(`  ${colors.yellow}${file}${colors.reset}`);
      links.forEach((link) => {
        console.log(`    Line ${link.line}: ${colors.red}${link.url}${colors.reset}`);
        console.log(`      Reason: ${link.reason}`);
        if (link.targetFile) {
          const relTarget = path.relative(DOCS_ROOT, link.targetFile);
          console.log(`      Target: ${relTarget}`);
        }
        if (link.anchor) {
          console.log(`      Anchor: #${link.anchor}`);
        }
        console.log('');
      });
    });
  }

  // Missing files
  if (results.missingFiles.length > 0) {
    const uniqueMissingFiles = [...new Set(results.missingFiles)];
    console.log(`${colors.red}Missing Files (${uniqueMissingFiles.length}):${colors.reset}`);
    console.log('');
    uniqueMissingFiles.forEach((file) => {
      const relPath = path.relative(DOCS_ROOT, file);
      console.log(`  ${colors.red}✗${colors.reset} ${relPath}`);
    });
    console.log('');
  }

  // Missing anchors
  if (results.missingAnchors.length > 0) {
    console.log(`${colors.yellow}Missing Anchors:${colors.reset}`);
    console.log('');

    const groupedByFile = {};
    results.missingAnchors.forEach(({ file, anchor }) => {
      const relPath = path.relative(DOCS_ROOT, file);
      if (!groupedByFile[relPath]) {
        groupedByFile[relPath] = [];
      }
      groupedByFile[relPath].push(anchor);
    });

    Object.entries(groupedByFile).forEach(([file, anchors]) => {
      console.log(`  ${colors.yellow}${file}${colors.reset}`);
      const uniqueAnchors = [...new Set(anchors)];
      uniqueAnchors.forEach((anchor) => {
        console.log(`    #${anchor}`);
      });
      console.log('');
    });
  }

  // External links summary
  if (results.externalLinks.length > 0) {
    console.log(`${colors.blue}External Links Summary:${colors.reset}`);
    console.log(`  Total: ${results.externalLinks.length}`);

    // Group by domain
    const domains = {};
    results.externalLinks.forEach((link) => {
      try {
        const url = new URL(link.url);
        const domain = url.hostname;
        domains[domain] = (domains[domain] || 0) + 1;
      } catch (e) {
        // Invalid URL, skip
      }
    });

    console.log('');
    console.log('  Top domains:');
    Object.entries(domains)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([domain, count]) => {
        console.log(`    ${domain}: ${count}`);
      });
    console.log('');
  }

  // Final status
  console.log('='.repeat(80));
  if (results.brokenLinks.length === 0) {
    console.log(`${colors.green}✓ All links are valid!${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Found ${results.brokenLinks.length} broken link(s)${colors.reset}`);
  }
  console.log('='.repeat(80));
  console.log('');
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}Scanning documentation...${colors.reset}`);

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(
      `${colors.red}Error: Documentation directory not found: ${DOCS_DIR}${colors.reset}`,
    );
    process.exit(1);
  }

  const files = getMarkdownFiles(DOCS_DIR);

  if (files.length === 0) {
    console.error(`${colors.red}Error: No markdown files found${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.blue}Found ${files.length} markdown files${colors.reset}`);
  console.log('');

  files.forEach((file) => {
    const relPath = path.relative(DOCS_ROOT, file);
    console.log(`  Checking: ${relPath}`);
    validateFile(file);
  });

  generateReport();

  // Exit with error code if broken links found
  process.exit(results.brokenLinks.length > 0 ? 1 : 0);
}

// Run the script
main();
