# Astro Documentation Theme Replication Prompt

## Objective

Replicate the exact layout, style, and theme from the source Astro documentation site to a target Astro documentation site. The theme is based on OpenCode.ai documentation design with Astro Starlight.

---

## Phase 1: Environment Analysis

### 1.1 Analyze Source Documentation Site

```bash
# Navigate to source docs directory
cd /path/to/source/docs

# Extract key information
cat package.json | jq '.dependencies'
cat astro.config.mjs
ls -R src/
```

**Extract and document:**

- Astro version
- Starlight version
- All integrations and their versions
- Content structure
- Asset locations
- Custom configurations

### 1.2 Analyze Target Documentation Site

```bash
# Navigate to target docs directory
cd /path/to/target/docs

# Check current setup
cat package.json
cat astro.config.mjs 2>/dev/null || echo "No astro config found"
ls -R src/ 2>/dev/null || echo "No src directory"
```

---

## Phase 2: Dependencies Installation

### 2.1 Match Exact Package Versions

```bash
# Install core dependencies matching source
bun add astro@5.15.0
bun add @astrojs/starlight@0.36.0
bun add astro-expressive-code@0.38.0
bun add sharp@0.34.5
bun add @astrojs/check@0.9.0

# Install dev dependencies
bun add -D @types/node@20.0.0
bun add -D typescript@5.0.0
```

**Critical versions from source:**

- `astro`: ^5.15.0
- `@astrojs/starlight`: ^0.36.0
- `astro-expressive-code`: ^0.38.0
- `sharp`: ^0.34.5

### 2.2 Verify Installation

```bash
bun pm ls | grep -E "astro|starlight|expressive-code|sharp"
```

---

## Phase 3: Directory Structure Setup

### 3.1 Create Required Directories

```bash
# From target docs root
mkdir -p src/assets
mkdir -p src/content/docs
mkdir -p src/styles
mkdir -p public
```

### 3.2 Verify Structure

```bash
tree -L 2 src/
```

Expected structure:

```
src/
├── assets/          # Logos and images
├── content/
│   ├── docs/       # Markdown documentation files
│   └── config.ts   # Content collection config
├── styles/
│   └── custom.css  # Theme customization
└── env.d.ts        # TypeScript environment types
```

---

## Phase 4: Configuration Files

### 4.1 Create astro.config.mjs

Copy the following configuration and customize site/base/title values:

```javascript
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://your-org.github.io',
  base: '/your-project-name',
  outDir: './dist',
  integrations: [
    starlight({
      title: 'Your Project Name',
      description: 'Your project description',
      logo: {
        light: './src/assets/logo-dark.svg',
        dark: './src/assets/logo-light.svg',
        replacesTitle: false,
      },
      expressiveCode: {
        themes: ['github-light', 'github-dark'],
        styleOverrides: {
          borderRadius: '8px',
          borderWidth: '1px',
        },
        shiki: {
          wrap: true,
        },
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'anonymous',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap',
          },
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/your-org/your-project',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/your-org/your-project/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
      sidebar: [
        {
          label: 'Getting Started',
          link: '/',
        },
        // Add your sidebar structure here
      ],
    }),
  ],
});
```

**Verify:**

```bash
node -e "import('./astro.config.mjs').then(() => console.log('✓ Config valid'))"
```

### 4.2 Create src/content/config.ts

```typescript
import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
};
```

### 4.3 Create package.json scripts

Ensure these scripts exist in package.json:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

### 4.4 Create TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

---

## Phase 5: Theme Replication (CRITICAL)

### 5.1 Copy Custom CSS File

Create `src/styles/custom.css` with the EXACT OpenCode theme:

```css
/**
 * OpenCode Docs Theme - Exact Match
 * 
 * This stylesheet precisely replicates the OpenCode.ai documentation design.
 * Colors, fonts, and spacing extracted directly from https://opencode.ai/docs
 */

/* BASE THEME COLORS FROM OPENCODE */
:root {
  /* OpenCode Base Colors (Light Mode) */
  --sl-color-bg: rgb(253, 252, 252);
  --sl-color-text: rgb(100, 98, 98);
  --sl-color-text-accent: rgb(32, 29, 29);

  /* OpenCode Background Colors */
  --sl-color-bg-nav: rgb(253, 252, 252);
  --sl-color-bg-sidebar: rgb(253, 252, 252);
  --sl-color-bg-inline-code: transparent;

  /* OpenCode Borders */
  --sl-color-hairline: rgb(217, 216, 216);
  --sl-color-hairline-shade: rgb(217, 216, 216);
  --sl-color-hairline-light: rgb(217, 216, 216);

  /* OpenCode Gray Scale */
  --sl-color-gray-1: rgb(246, 248, 250);
  --sl-color-gray-2: rgb(225, 228, 232);
  --sl-color-gray-3: rgb(100, 98, 98);
  --sl-color-gray-4: rgb(47, 54, 61);
  --sl-color-gray-5: rgb(36, 41, 46);
  --sl-color-gray-6: rgb(32, 29, 29);

  /* OpenCode Accent Colors */
  --sl-color-accent: rgb(32, 29, 29);
  --sl-color-accent-high: rgb(32, 29, 29);
  --sl-color-accent-low: rgba(32, 29, 29, 0.05);

  /* OpenCode Typography */
  --sl-font:
    'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  --sl-font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;

  /* OpenCode Font Sizes */
  --sl-text-base: 14px;
  --sl-text-sm: 14px;
  --sl-text-xs: 12px;
  --sl-text-h1: 26px;
  --sl-text-h2: 18px;
  --sl-text-h3: 18px;
  --sl-text-h4: 14px;

  /* OpenCode Line Heights */
  --sl-line-height: 1.6875;
  --sl-line-height-headings: 1.2;

  /* OpenCode Spacing */
  --sl-content-width: 45rem;
  --sl-border-radius: 0px;
}

/* GLOBAL BASE STYLES */
body {
  font-family: var(--sl-font) !important;
  font-size: var(--sl-text-base) !important;
  line-height: var(--sl-line-height) !important;
  background-color: var(--sl-color-bg) !important;
  color: var(--sl-color-text) !important;
}

* {
  font-family: var(--sl-font) !important;
}

code,
pre,
.expressive-code {
  font-family: var(--sl-font-mono) !important;
}

/* TYPOGRAPHY - EXACT OPENCODE MATCH */
h1,
.sl-markdown-content h1 {
  font-size: var(--sl-text-h1) !important;
  font-weight: 500 !important;
  line-height: var(--sl-line-height-headings) !important;
  color: var(--sl-color-text-accent) !important;
  margin: 0 0 1rem 0 !important;
}

h2,
.sl-markdown-content h2 {
  font-size: var(--sl-text-h2) !important;
  font-weight: 500 !important;
  line-height: var(--sl-line-height-headings) !important;
  color: var(--sl-color-text-accent) !important;
  margin: 54px 0 0 0 !important;
}

h3,
.sl-markdown-content h3 {
  font-size: var(--sl-text-h3) !important;
  font-weight: 500 !important;
  line-height: var(--sl-line-height-headings) !important;
  color: var(--sl-color-text-accent) !important;
  margin: 54px 0 0 0 !important;
}

h4,
.sl-markdown-content h4 {
  font-size: var(--sl-text-h4) !important;
  font-weight: 400 !important;
  line-height: 1.4 !important;
  color: var(--sl-color-text-accent) !important;
  margin: 1.5rem 0 0.5rem 0 !important;
}

p,
.sl-markdown-content p {
  font-size: var(--sl-text-base) !important;
  line-height: var(--sl-line-height) !important;
  color: var(--sl-color-text) !important;
  margin: 1rem 0 !important;
}

a,
.sl-markdown-content a {
  color: var(--sl-color-text-accent) !important;
  text-decoration: none !important;
  font-weight: 400 !important;
}

a:hover,
.sl-markdown-content a:hover {
  text-decoration: underline !important;
}

code,
.sl-markdown-content code {
  font-family: var(--sl-font-mono) !important;
  font-weight: 600 !important;
  font-size: var(--sl-text-base) !important;
  background: transparent !important;
  padding: 0 !important;
  border: none !important;
  color: var(--sl-color-text) !important;
  margin: -2px 0 !important;
}

strong,
.sl-markdown-content strong {
  font-weight: 600 !important;
  color: var(--sl-color-text) !important;
}

ul,
ol,
.sl-markdown-content ul,
.sl-markdown-content ol {
  margin: 1rem 0 !important;
  padding-left: 1.5rem !important;
}

li,
.sl-markdown-content li {
  margin: 0.5rem 0 !important;
  line-height: var(--sl-line-height) !important;
}

/* HEADER - EXACT OPENCODE MATCH */
.header,
header {
  background-color: var(--sl-color-bg) !important;
  border-bottom: 1px solid var(--sl-color-hairline) !important;
  height: 64px !important;
}

.header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0 24px !important;
  gap: 1rem !important;
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
}

.header .title-wrapper {
  flex: 0 0 auto !important;
  order: 1 !important;
}

.header > div:nth-child(2) {
  order: 3 !important;
  margin-left: auto !important;
  margin-right: 0 !important;
}

.header .right-group {
  order: 4 !important;
  margin-left: 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
}

/* CODE BLOCKS - OPENCODE STYLE */
.expressive-code {
  margin: 1.5rem 0 !important;
  border-radius: var(--sl-border-radius) !important;
}

.expressive-code .frame {
  border: 1px solid var(--sl-color-hairline) !important;
  border-radius: var(--sl-border-radius) !important;
  background: rgb(255, 255, 255) !important;
}

.expressive-code code {
  font-size: 14px !important;
  line-height: var(--sl-line-height) !important;
  padding: 12px 0 !important;
  font-weight: 400 !important;
}

.expressive-code .frame.is-terminal {
  background: rgb(246, 248, 250) !important;
}

.expressive-code .copy {
  background: rgb(36, 41, 46) !important;
  color: rgb(255, 255, 255) !important;
  border: 1px solid rgb(36, 41, 46) !important;
  border-radius: var(--sl-border-radius) !important;
  padding: 0.15rem 0.2rem !important;
  font-size: 0.9rem !important;
  opacity: 0.4 !important;
}

.expressive-code .copy:hover {
  opacity: 0.2 !important;
}

/* BLOCKQUOTES & ASIDES */
blockquote,
.sl-markdown-content blockquote {
  margin: 1.5rem 0 !important;
  padding: 1rem 1.5rem !important;
  border-left: 4px solid var(--sl-color-hairline) !important;
  background: transparent !important;
  color: var(--sl-color-text) !important;
}

aside,
.sl-markdown-content aside {
  margin: 1.5rem 0 !important;
  padding: 1rem 1.5rem !important;
  border-left: 4px solid var(--sl-color-hairline) !important;
  background: rgb(246, 248, 250) !important;
  border-radius: var(--sl-border-radius) !important;
}

/* TABLES */
table,
.sl-markdown-content table {
  width: 100% !important;
  margin: 1.5rem 0 !important;
  border-collapse: collapse !important;
  border: 1px solid var(--sl-color-hairline) !important;
}

th,
.sl-markdown-content th {
  padding: 0.75rem 1rem !important;
  border: 1px solid var(--sl-color-hairline) !important;
  background: rgb(246, 248, 250) !important;
  font-weight: 600 !important;
  text-align: left !important;
}

td,
.sl-markdown-content td {
  padding: 0.75rem 1rem !important;
  border: 1px solid var(--sl-color-hairline) !important;
}

tbody tr:nth-child(even) {
  background: transparent !important;
}

/* HORIZONTAL RULES */
hr,
.sl-markdown-content hr {
  margin: 3rem 0 !important;
  border: none !important;
  border-top: 1px solid var(--sl-color-hairline) !important;
}

/* NAVIGATION - OPENCODE STYLE */
.sidebar-content a,
nav[aria-label='Main'] a {
  color: var(--sl-color-text) !important;
  font-size: var(--sl-text-base) !important;
  font-weight: 400 !important;
  padding: 4px 24px !important;
  border-radius: 0px !important;
}

.sidebar-content a[aria-current='page'] {
  background: var(--sl-color-accent-low) !important;
  color: var(--sl-color-accent) !important;
  font-weight: 500 !important;
}

.sidebar-content a:hover {
  color: var(--sl-color-accent) !important;
  text-decoration: underline !important;
}

.right-sidebar-panel a {
  color: var(--sl-color-text) !important;
  font-size: var(--sl-text-sm) !important;
}

.right-sidebar-panel a[aria-current='true'] {
  color: var(--sl-color-accent) !important;
  font-weight: 500 !important;
}

.right-sidebar-panel a:hover {
  color: var(--sl-color-accent) !important;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  :root {
    --sl-content-width: 100% !important;
  }

  h1,
  .sl-markdown-content h1 {
    font-size: 22px !important;
  }

  h2,
  .sl-markdown-content h2 {
    font-size: 16px !important;
  }
}

/* ACCESSIBILITY */
:focus-visible {
  outline: 2px solid var(--sl-color-accent) !important;
  outline-offset: 2px !important;
}

:focus:not(:focus-visible) {
  outline: none !important;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* BADGES & IMAGES */
img {
  max-width: 100% !important;
  height: auto !important;
}

.sl-badge {
  font-size: var(--sl-text-xs) !important;
  padding: 0.2rem 0.5rem !important;
  border-radius: 0.25rem !important;
  font-weight: 500 !important;
}
```

**Verify CSS is linked:**

```bash
grep "customCss" astro.config.mjs
# Should output: customCss: ['./src/styles/custom.css'],
```

### 5.2 Create Logo Assets

Create placeholder logos or copy from source:

```bash
# Option 1: Copy from source
cp /path/to/source/docs/src/assets/logo-*.svg src/assets/

# Option 2: Create minimal SVG placeholders
cat > src/assets/logo-light.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <text x="16" y="24" text-anchor="middle" font-size="20" fill="#201d1d">L</text>
</svg>
EOF

cat > src/assets/logo-dark.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <text x="16" y="24" text-anchor="middle" font-size="20" fill="#fdfcfc">D</text>
</svg>
EOF
```

### 5.3 Create Environment Types

Create `src/env.d.ts`:

```typescript
/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
```

---

## Phase 6: Content Migration

### 6.1 Create Index Page

Create `src/content/docs/index.md`:

```markdown
---
title: Welcome
description: Getting started with your documentation
---

# Welcome

This is your documentation homepage.

## Quick Links

- [Getting Started](#getting-started)
- [Documentation](#documentation)

## Getting Started

Add your content here.
```

### 6.2 Test Content Rendering

```bash
bun run dev
```

Open browser to `http://localhost:4321` and verify:

- [ ] Page loads without errors
- [ ] IBM Plex Mono font is applied
- [ ] Color scheme matches (light gray background, dark text)
- [ ] Header has correct height (64px) with border
- [ ] Sidebar navigation is visible
- [ ] Code blocks have proper styling

---

## Phase 7: Verification Checklist

### 7.1 Visual Verification

Use browser DevTools to inspect:

```javascript
// Run in browser console
const computedStyle = getComputedStyle(document.documentElement);
console.log('Background:', computedStyle.getPropertyValue('--sl-color-bg'));
console.log('Font:', computedStyle.getPropertyValue('--sl-font'));
console.log('Text size:', computedStyle.getPropertyValue('--sl-text-base'));
```

Expected values:

- Background: `rgb(253, 252, 252)`
- Font: `'IBM Plex Mono', ...`
- Text size: `14px`

### 7.2 Component Verification

Test each component type:

**Typography:**

```markdown
# H1 Heading (26px, weight 500)

## H2 Heading (18px, weight 500)

### H3 Heading (18px, weight 500)

#### H4 Heading (14px, weight 400)

Paragraph text (14px, line-height 1.6875)

**Bold text** and `inline code`
```

**Code blocks:**

````markdown
```javascript
// Code block test
console.log('Hello World');
```
````

**Lists:**

```markdown
- List item 1
- List item 2
  - Nested item
```

**Tables:**

```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
```

**Links:**

```markdown
[Internal link](/page)
[External link](https://example.com)
```

### 7.3 Automated Checks

```bash
# Check for TypeScript errors
bunx astro check

# Check build
bun run build

# Verify dist output
ls -la dist/
```

### 7.4 Cross-browser Testing

Test in:

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

### 7.5 Responsive Testing

Test at breakpoints:

- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

---

## Phase 8: Troubleshooting

### Common Issues

**Issue: Fonts not loading**

```bash
# Check head configuration in astro.config.mjs
grep -A 20 "head:" astro.config.mjs
# Verify font preconnect links are present
```

**Issue: CSS not applying**

```bash
# Verify CSS file exists
ls -la src/styles/custom.css
# Check it's referenced in config
grep customCss astro.config.mjs
```

**Issue: Build fails**

```bash
# Clear cache and reinstall
rm -rf node_modules .astro dist
bun install
bun run build
```

**Issue: Wrong colors**

```bash
# Verify CSS variables in browser DevTools
# Elements > :root > Computed > Filter for "--sl-color"
```

**Issue: Logo not showing**

```bash
# Check logo paths in astro.config.mjs
# Verify files exist
ls -la src/assets/logo-*.svg
```

---

## Phase 9: Comparison Tool

Use this script to compare rendered output:

```bash
#!/bin/bash
# save as compare-themes.sh

SOURCE_URL="http://localhost:4321"
TARGET_URL="http://localhost:4322"

echo "Comparing theme styles..."

# Extract CSS variables from both sites
curl -s "$SOURCE_URL" | grep -o 'rgb([^)]*)' | sort | uniq > /tmp/source-colors.txt
curl -s "$TARGET_URL" | grep -o 'rgb([^)]*)' | sort | uniq > /tmp/target-colors.txt

diff /tmp/source-colors.txt /tmp/target-colors.txt

echo "✓ Comparison complete"
```

---

## Phase 10: Documentation

### 10.1 Create Theme README

Create `docs/THEME.md`:

```markdown
# Documentation Theme

This site uses a custom theme based on OpenCode.ai documentation design.

## Key Features

- **Font**: IBM Plex Mono (monospace)
- **Base font size**: 14px
- **Line height**: 1.6875
- **Color scheme**: Light gray background (#fdfcfc) with dark text (#646262)
- **Framework**: Astro Starlight

## Customization

Edit `src/styles/custom.css` to modify theme variables.

## Build

\`\`\`bash
bun run dev # Development server
bun run build # Production build
\`\`\`
```

---

## Success Criteria

The replication is successful when:

- [ ] All dependencies are installed with matching versions
- [ ] Custom CSS file is properly linked and loaded
- [ ] IBM Plex Mono font is rendering throughout the site
- [ ] Background color matches: rgb(253, 252, 252)
- [ ] Text color matches: rgb(100, 98, 98)
- [ ] Heading colors match: rgb(32, 29, 29)
- [ ] Font sizes match specification (14px base, 26px h1, 18px h2/h3)
- [ ] Code blocks use GitHub themes (light/dark)
- [ ] Border radius is 0px (sharp corners)
- [ ] Header height is 64px with bottom border
- [ ] Navigation has proper hover and active states
- [ ] Site builds without errors
- [ ] All pages render correctly
- [ ] Responsive breakpoints work properly
- [ ] Browser DevTools shows no CSS errors

---

## Advanced: Programmatic Verification

Create `verify-theme.js`:

```javascript
#!/usr/bin/env node

import { chromium } from 'playwright';

async function verifyTheme() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:4321');

  const checks = {
    bgColor: await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sl-color-bg').trim(),
    ),
    font: await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sl-font').trim(),
    ),
    textSize: await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sl-text-base').trim(),
    ),
  };

  console.log('Theme Verification:');
  console.log('Background:', checks.bgColor === 'rgb(253, 252, 252)' ? '✓' : '✗', checks.bgColor);
  console.log('Font:', checks.font.includes('IBM Plex Mono') ? '✓' : '✗', checks.font);
  console.log('Text Size:', checks.textSize === '14px' ? '✓' : '✗', checks.textSize);

  await browser.close();
}

verifyTheme();
```

Install and run:

```bash
bun add -D playwright
bunx playwright install chromium
node verify-theme.js
```

---

## Source Files Reference

**From source project:**

- `docs/astro.config.mjs` - Full Astro configuration
- `docs/src/styles/custom.css` - Complete theme CSS (437 lines)
- `docs/package.json` - Dependency versions
- `docs/src/content/config.ts` - Content collection setup
- `docs/src/assets/` - Logo files

**Key URLs:**

- Source theme: https://opencode.ai/docs
- IBM Plex Mono: https://fonts.google.com/specimen/IBM+Plex+Mono
- Astro Starlight docs: https://starlight.astro.build

---

## Completion Time Estimate

- Phase 1-2 (Analysis & Dependencies): 15 minutes
- Phase 3-4 (Setup & Config): 20 minutes
- Phase 5 (Theme Replication): 30 minutes
- Phase 6 (Content): 15 minutes
- Phase 7-8 (Verification & Fixes): 20 minutes

**Total: ~2 hours** for complete replication

---

## Notes for AI Agents

When executing this prompt:

1. **Always verify each step** before moving to the next
2. **Use exact file paths** - don't assume directory structure
3. **Match exact versions** - version mismatches cause styling issues
4. **Test incrementally** - run dev server after each major phase
5. **Check browser console** - CSS errors indicate problems
6. **Use diff tools** - compare source and target files
7. **Document deviations** - note any changes from source
8. **Verify fonts load** - IBM Plex Mono is critical to the theme
9. **Test responsiveness** - check mobile, tablet, desktop
10. **Build before deploying** - ensure production build succeeds

---

## Tool Requirements

Ensure these tools are available:

```bash
# Required
bun --version         # ≥1.0.0
node --version        # ≥20.0.0

# Recommended
jq --version          # For JSON parsing
diff --version        # For file comparison
curl --version        # For fetching resources
tree --version        # For directory visualization

# Optional (for advanced verification)
playwright --version  # For automated testing
```

Install missing tools:

```bash
# macOS
brew install jq tree

# Linux
sudo apt install jq tree
```

---

**End of Replication Prompt**
