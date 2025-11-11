# Astro/Starlight Migration Plan

**Document Version**: 1.0  
**Created**: 2025-11-11  
**Project**: Warcraft II Notifications Plugin Documentation  
**Migration**: Jekyll → Astro/Starlight

## Executive Summary

This document outlines the step-by-step migration plan for converting the Warcraft II Notifications Plugin documentation from Jekyll to Astro with Starlight theme, matching the visual style of https://opencode.ai/docs.

**Timeline**: 3-5 hours of focused work
**Approach**: Incremental migration in a feature branch with parallel testing
**Risk Level**: Low (reversible, no production data)

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Migration Strategy](#2-migration-strategy)
3. [Phase 1: Setup](#phase-1-setup-30-45-minutes)
4. [Phase 2: Configuration](#phase-2-configuration-30-45-minutes)
5. [Phase 3: Content Migration](#phase-3-content-migration-60-90-minutes)
6. [Phase 4: Styling](#phase-4-styling-customization-30-60-minutes)
7. [Phase 5: Deployment](#phase-5-deployment-workflow-30-minutes)
8. [Phase 6: Testing](#phase-6-testing--validation-30-45-minutes)
9. [Phase 7: Launch](#phase-7-launch-15-minutes)
10. [Rollback Strategy](#rollback-strategy)
11. [Post-Migration Tasks](#post-migration-tasks)

---

## 1. Current State Analysis

### 1.1 Jekyll Site Structure

**Directory**: `/docs`

**Structure**:

```
docs/
├── _config.yml           # Jekyll configuration
├── _data/
│   └── navigation.yml    # Navigation structure
├── _includes/            # Jekyll partials
│   ├── footer.html
│   ├── head-custom-google-analytics.html
│   ├── header.html
│   ├── sidebar.html
│   └── toc.html
├── _layouts/             # Jekyll layouts
│   ├── default.html
│   ├── home.html
│   └── page.html
├── assets/
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   ├── copy-code.js
│   │   ├── navigation.js
│   │   ├── search.js
│   │   ├── tabs.js
│   │   ├── theme-toggle.js
│   │   └── toc-scroll.js
│   └── favicon.svg
├── github-workflows/     # Documentation subfolder
├── schemas/              # Documentation subfolder
├── *.md                  # Content files
└── index.md              # Homepage
```

### 1.2 Content Inventory

**Main Documentation Files**:

1. `index.md` - Homepage
2. `README.md` - Documentation index
3. `USER_GUIDE.md` - User guide
4. `API.md` - API documentation
5. `ARCHITECTURE.md` - Architecture overview
6. `DEVELOPMENT.md` - Development guide
7. `DEPLOYMENT.md` - Deployment guide
8. `PIPELINE.md` - CI/CD pipeline docs
9. `TROUBLESHOOTING.md` - Troubleshooting guide
10. `ONBOARDING.md` - Onboarding guide
11. `VALIDATE_SCHEMA.md` - Schema validation docs
12. `GITHUB_PAGES_SETUP.md` - GitHub Pages setup

**Subdirectories**:

- `github-workflows/` - 7 files
- `schemas/` - 3 files

**Total content files**: ~22 markdown files

### 1.3 Current Features

**Jekyll features in use**:

- ✅ Markdown rendering (kramdown)
- ✅ Syntax highlighting (rouge)
- ✅ Navigation sidebar
- ✅ Table of contents (TOC)
- ✅ Dark/light theme toggle
- ✅ Code copy buttons
- ✅ Search functionality
- ✅ Google Analytics
- ✅ Responsive design
- ✅ Custom CSS/JS

### 1.4 URL Structure

**Current URLs** (with baseurl: `/opencode-warcraft-notifications`):

- `/opencode-warcraft-notifications/` - Homepage
- `/opencode-warcraft-notifications/USER_GUIDE` - User guide
- `/opencode-warcraft-notifications/API` - API docs
- `/opencode-warcraft-notifications/ARCHITECTURE` - Architecture
- etc.

**Constraint**: Must preserve URL structure to avoid breaking external links

---

## 2. Migration Strategy

### 2.1 Approach

**Incremental migration with parallel testing**:

1. Create feature branch `feat/migrate-to-astro-starlight`
2. Set up Astro/Starlight alongside Jekyll (new directory structure)
3. Migrate content iteratively
4. Test thoroughly before replacing Jekyll
5. Update deployment workflow
6. Merge to main after validation

### 2.2 Directory Structure Decision

**Option A: Keep docs/ for Astro** (Recommended)

- Move Jekyll files to `docs-jekyll-backup/` temporarily
- Set up Astro in `docs/` to maintain path
- Simpler deployment configuration

**Option B: New directory for Astro**

- Set up Astro in `docs-astro/`
- Keep Jekyll in `docs/` during transition
- Update GitHub Pages source after migration

**Decision**: Use Option A for simplicity

### 2.3 Success Criteria

**Must Have**:

- [ ] All content pages render correctly
- [ ] Navigation structure preserved
- [ ] URLs identical to Jekyll version
- [ ] Dark/light theme working
- [ ] Search functionality working
- [ ] Mobile responsive
- [ ] GitHub Pages deployment successful
- [ ] No broken internal links

**Should Have**:

- [ ] Visual design matches OpenCode docs (95%+ accuracy)
- [ ] Code syntax highlighting matches
- [ ] Performance equal to or better than Jekyll
- [ ] Google Analytics integrated
- [ ] Edit page links working

**Nice to Have**:

- [ ] Improved page load speed
- [ ] Better accessibility scores
- [ ] Enhanced search relevance

---

## Phase 1: Setup (30-45 minutes)

### Step 1.1: Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feat/migrate-to-astro-starlight
```

### Step 1.2: Backup Jekyll Site

```bash
# Move Jekyll site to backup directory
mv docs docs-jekyll-backup

# Commit backup
git add docs-jekyll-backup
git commit -m "backup: Preserve Jekyll site before Astro migration"
```

### Step 1.3: Install Astro and Starlight

**Create new docs directory**:

```bash
# Create docs directory
mkdir docs
cd docs

# Initialize Astro with Starlight
bun create astro@latest . -- --template starlight --typescript strict --no-git
```

**Alternatively, manual setup**:

```bash
mkdir docs
cd docs
bun init -y
```

**Add dependencies** (update `docs/package.json`):

```json
{
  "name": "warcraft-notifications-docs",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/starlight": "^0.27.0",
    "astro": "^4.15.0",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
```

**Install**:

```bash
cd docs
bun install
cd ..
```

### Step 1.4: Verify Setup

```bash
cd docs
bun run dev
# Should start dev server at http://localhost:4321
# Ctrl+C to stop
cd ..
```

**Checkpoint**: Astro/Starlight running with default template

---

## Phase 2: Configuration (30-45 minutes)

### Step 2.1: Create Astro Config

**File**: `docs/astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://pantheon-org.github.io',
  base: '/opencode-warcraft-notifications',
  outDir: '../dist/docs', // Output to dist/docs for deployment
  integrations: [
    starlight({
      title: 'Warcraft Notifications',
      description: 'OpenCode plugin for Warcraft II notification sounds',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/pantheon-org/opencode-warcraft-notifications',
        discord: 'https://opencode.ai/discord',
      },
      editLink: {
        baseUrl: 'https://github.com/pantheon-org/opencode-warcraft-notifications/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'User Guide',
          link: '/user-guide/',
        },
        {
          label: 'API Documentation',
          link: '/api/',
        },
        {
          label: 'Architecture',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/architecture/' },
            { label: 'Core Modules', link: '/architecture/#core-modules' },
            { label: 'Sound Data', link: '/architecture/#sound-data-module' },
          ],
        },
        {
          label: 'Development',
          collapsed: false,
          items: [
            { label: 'Getting Started', link: '/development/' },
            { label: 'Testing', link: '/development/#testing' },
            { label: 'Contributing', link: '/development/#contributing' },
          ],
        },
        {
          label: 'Deployment',
          link: '/deployment/',
        },
        {
          label: 'Pipeline',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/pipeline/' },
            { label: 'Workflows', link: '/pipeline/#workflows' },
          ],
        },
        {
          label: 'Troubleshooting',
          link: '/troubleshooting/',
        },
        {
          label: 'Onboarding',
          link: '/onboarding/',
        },
        {
          label: 'GitHub Workflows',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/github-workflows/' },
            { label: 'Setup Guide', link: '/github-workflows/setup-guide/' },
            { label: 'Architecture', link: '/github-workflows/architecture-summary/' },
          ],
        },
        {
          label: 'Schemas',
          collapsed: true,
          items: [
            { label: 'Plugin Schema', link: '/schemas/' },
            { label: 'Validation', link: '/validate-schema/' },
          ],
        },
      ],
      components: {
        // Override components if needed
        // Footer: './src/components/Footer.astro',
      },
      head: [
        // Google Analytics (if needed)
        {
          tag: 'script',
          attrs: {
            async: true,
            src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX',
          },
        },
        {
          tag: 'script',
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `,
        },
      ],
    }),
  ],
});
```

### Step 2.2: Create TypeScript Config

**File**: `docs/tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Step 2.3: Setup Asset Files

**Logo** (use favicon or create placeholder):

```bash
mkdir -p docs/src/assets
cp docs-jekyll-backup/assets/favicon.svg docs/src/assets/logo.svg
```

**Custom CSS file**:

```bash
mkdir -p docs/src/styles
touch docs/src/styles/custom.css
```

### Step 2.4: Create Directory Structure

```bash
mkdir -p docs/src/content/docs/{github-workflows,schemas}
```

**Final structure**:

```
docs/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── content/
│   │   └── docs/
│   │       ├── index.mdx
│   │       ├── user-guide.md
│   │       ├── api.md
│   │       ├── architecture.md
│   │       ├── development.md
│   │       ├── deployment.md
│   │       ├── pipeline.md
│   │       ├── troubleshooting.md
│   │       ├── onboarding.md
│   │       ├── validate-schema.md
│   │       ├── github-workflows/
│   │       │   ├── index.md
│   │       │   ├── setup-guide.md
│   │       │   ├── architecture-summary.md
│   │       │   ├── cleanup-old-releases.md
│   │       │   ├── cycle-prevention-fix.md
│   │       │   ├── overview.md
│   │       │   └── squash-merge-configuration.md
│   │       └── schemas/
│   │           ├── index.md
│   │           ├── plugin.json.example
│   │           └── plugin.json.schema
│   └── styles/
│       └── custom.css
└── public/
    └── favicon.svg
```

**Checkpoint**: Astro/Starlight configured with project structure

---

## Phase 3: Content Migration (60-90 minutes)

### Step 3.1: Content Conversion Strategy

**Frontmatter changes**:

**Jekyll format**:

```yaml
---
layout: page
title: User Guide
---
```

**Starlight format**:

```yaml
---
title: User Guide
description: How to use the Warcraft II Notifications Plugin
---
```

### Step 3.2: Migrate Homepage

**Source**: `docs-jekyll-backup/index.md`
**Target**: `docs/src/content/docs/index.mdx`

**Changes needed**:

1. Remove Jekyll layout frontmatter
2. Add Starlight frontmatter
3. Convert HTML to MDX (if any)
4. Update internal links
5. Convert callouts to Starlight syntax

**Callout conversion**:

**Jekyll/Markdown**:

```markdown
> [!NOTE]
> This is a note
```

**Starlight**:

```markdown
:::note
This is a note
:::
```

### Step 3.3: Migrate Main Content Files

**Process for each file**:

1. **USER_GUIDE.md**:
   - Source: `docs-jekyll-backup/USER_GUIDE.md`
   - Target: `docs/src/content/docs/user-guide.md`
   - Update frontmatter
   - Convert callouts
   - Update links

2. **API.md** → `docs/src/content/docs/api.md`
3. **ARCHITECTURE.md** → `docs/src/content/docs/architecture.md`
4. **DEVELOPMENT.md** → `docs/src/content/docs/development.md`
5. **DEPLOYMENT.md** → `docs/src/content/docs/deployment.md`
6. **PIPELINE.md** → `docs/src/content/docs/pipeline.md`
7. **TROUBLESHOOTING.md** → `docs/src/content/docs/troubleshooting.md`
8. **ONBOARDING.md** → `docs/src/content/docs/onboarding.md`
9. **VALIDATE_SCHEMA.md** → `docs/src/content/docs/validate-schema.md`

### Step 3.4: Migrate Subdirectories

**GitHub Workflows**:

- `github-workflows/README.md` → `docs/src/content/docs/github-workflows/index.md`
- `github-workflows/*.md` → `docs/src/content/docs/github-workflows/*.md`

**Schemas**:

- `schemas/README.md` → `docs/src/content/docs/schemas/index.md`
- Copy `schemas/*.json` and `schemas/*.example` to `docs/src/content/docs/schemas/`

### Step 3.5: Link Updates

**Common link patterns to update**:

| Old (Jekyll)                | New (Starlight)         |
| --------------------------- | ----------------------- |
| `[Link](USER_GUIDE.md)`     | `[Link](/user-guide/)`  |
| `[Link](API.md#section)`    | `[Link](/api/#section)` |
| `[Link](../README.md)`      | `[Link](/)`             |
| `[Link](schemas/README.md)` | `[Link](/schemas/)`     |

### Step 3.6: Callout Conversion Reference

| Markdown         | Starlight            |
| ---------------- | -------------------- |
| `> [!NOTE]`      | `:::note`            |
| `> [!TIP]`       | `:::tip`             |
| `> [!WARNING]`   | `:::caution`         |
| `> [!IMPORTANT]` | `:::note[Important]` |

### Step 3.7: Code Block Updates

**Jekyll**:

````markdown
```bash
npm install
```
````

**Starlight** (same, but add Terminal label if needed):

````markdown
```bash title="Terminal"
npm install
```
````

**Checkpoint**: All content migrated to Starlight format

---

## Phase 4: Styling Customization (30-60 minutes)

### Step 4.1: Create Custom CSS

**File**: `docs/src/styles/custom.css`

```css
/* Custom styles to match OpenCode docs */

:root {
  /* Override Starlight colors */
  --sl-color-accent-low: #eff6ff;
  --sl-color-accent: #3b82f6;
  --sl-color-accent-high: #1e3a8a;
  --sl-color-white: #ffffff;
  --sl-color-gray-1: #f6f6f7;
  --sl-color-gray-2: #e5e5e7;
  --sl-color-gray-3: #86868b;
  --sl-color-gray-4: #1c1c1e;
  --sl-color-black: #0d1117;

  /* Typography */
  --sl-font:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --sl-font-mono: 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  --sl-line-height: 1.6;
  --sl-line-height-headings: 1.2;

  /* Spacing */
  --sl-content-width: 900px;
  --sl-sidebar-width: 280px;

  /* Borders and radius */
  --sl-border-radius: 8px;
}

/* Dark mode overrides */
:root[data-theme='dark'] {
  --sl-color-accent-low: #1e3a8a;
  --sl-color-accent: #60a5fa;
  --sl-color-accent-high: #eff6ff;
  --sl-color-white: #0d1117;
  --sl-color-gray-1: #161b22;
  --sl-color-gray-2: #30363d;
  --sl-color-gray-3: #8b949e;
  --sl-color-gray-4: #e6edf3;
  --sl-color-black: #ffffff;
}

/* Horizontal rules - more prominent spacing */
.sl-markdown-content hr {
  margin: 3rem 0;
  border: none;
  border-top: 1px solid var(--sl-color-gray-2);
}

/* Code blocks */
.sl-markdown-content pre {
  border-radius: var(--sl-border-radius);
  padding: 1.5rem;
  margin: 1.5rem 0;
}

/* Callout boxes (Asides) */
.sl-markdown-content aside {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: var(--sl-border-radius);
  border-left: 4px solid currentColor;
}

/* Active navigation item */
.sidebar-content a[aria-current='page'] {
  font-weight: 600;
  background: var(--sl-color-accent-low);
  border-left: 3px solid var(--sl-color-accent);
}

/* Table of contents active item */
.right-sidebar a[aria-current='true'] {
  color: var(--sl-color-accent);
  font-weight: 600;
}

/* Link styles */
.sl-markdown-content a {
  color: var(--sl-color-accent);
  text-decoration: none;
  transition: text-decoration 0.2s ease;
}

.sl-markdown-content a:hover {
  text-decoration: underline;
}

/* Improve spacing for lists */
.sl-markdown-content ul,
.sl-markdown-content ol {
  margin: 1rem 0;
}

.sl-markdown-content li {
  margin: 0.5rem 0;
}

/* Headings spacing */
.sl-markdown-content h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.sl-markdown-content h3 {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :root {
    --sl-content-width: 100%;
  }
}
```

### Step 4.2: Add Logo Styling (if needed)

If the logo needs custom styling, add to `custom.css`:

```css
/* Logo customization */
.site-title img {
  height: 40px;
  width: auto;
}
```

### Step 4.3: Footer Customization (Optional)

If custom footer needed beyond Starlight's built-in `editLink`:

**File**: `docs/src/components/Footer.astro`

```astro
---
// Custom footer component (optional)
---
<footer class="custom-footer">
  <div class="footer-links">
    <a href="https://github.com/pantheon-org/opencode-warcraft-notifications/edit/main/docs/" target="_blank">
      Edit this page
    </a>
    <span>|</span>
    <a href="https://github.com/pantheon-org/opencode-warcraft-notifications/issues/new" target="_blank">
      Find a bug? Open an issue
    </a>
    <span>|</span>
    <a href="https://opencode.ai/discord" target="_blank">
      Join our Discord community
    </a>
  </div>
</footer>

<style>
  .custom-footer {
    padding: 2rem 1rem;
    text-align: center;
    border-top: 1px solid var(--sl-color-gray-2);
    margin-top: 4rem;
  }

  .footer-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .footer-links a {
    color: var(--sl-color-accent);
    text-decoration: none;
  }

  .footer-links a:hover {
    text-decoration: underline;
  }

  .footer-links span {
    color: var(--sl-color-gray-3);
  }
</style>
```

Then reference in `astro.config.mjs`:

```javascript
components: {
  Footer: './src/components/Footer.astro',
}
```

**Checkpoint**: Custom styling applied, matches OpenCode design

---

## Phase 5: Deployment Workflow (30 minutes)

### Step 5.1: Update GitHub Actions Workflow

**File**: `.github/workflows/deploy-docs.yml`

**New Astro workflow**:

```yaml
name: Deploy Documentation to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.github/workflows/deploy-docs.yml'
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: |
          cd docs
          bun install

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Build with Astro
        run: |
          cd docs
          bun run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist/docs

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 5.2: Update .gitignore

Add Astro-specific ignores:

```bash
# Astro
docs/node_modules/
docs/.astro/
docs/dist/
dist/docs/

# Keep Jekyll backup out of main branch (temporary)
docs-jekyll-backup/
```

### Step 5.3: Test Build Locally

```bash
cd docs
bun run build
bun run preview
# Visit http://localhost:4321/opencode-warcraft-notifications/
# Verify all pages load correctly
```

**Checkpoint**: Astro site builds successfully, deployment workflow ready

---

## Phase 6: Testing & Validation (30-45 minutes)

### Step 6.1: Local Testing Checklist

**Build Test**:

```bash
cd docs
bun run build
# Should complete without errors
```

**Dev Server Test**:

```bash
bun run dev
# Visit http://localhost:4321
# Test navigation, search, theme toggle
```

### Step 6.2: Content Validation

**Check each page**:

- [ ] Homepage renders correctly
- [ ] User Guide complete
- [ ] API docs display properly
- [ ] Architecture page loads
- [ ] Development guide accessible
- [ ] Deployment guide visible
- [ ] Pipeline docs render
- [ ] Troubleshooting page works
- [ ] Onboarding guide displays
- [ ] GitHub Workflows section complete
- [ ] Schemas section loads
- [ ] All code blocks have syntax highlighting
- [ ] All callouts render correctly
- [ ] All images display (if any)

### Step 6.3: Navigation Testing

- [ ] Sidebar navigation works
- [ ] All links in sidebar functional
- [ ] Collapsible groups expand/collapse
- [ ] Active page highlighted in sidebar
- [ ] Right TOC appears on appropriate pages
- [ ] TOC links scroll to sections
- [ ] Active section highlighted in TOC

### Step 6.4: Interactive Features

- [ ] Search works (Ctrl+K / Cmd+K)
- [ ] Search returns relevant results
- [ ] Theme toggle switches modes
- [ ] Dark mode displays correctly
- [ ] Light mode displays correctly
- [ ] Edit page links work
- [ ] External links open correctly
- [ ] Social links (GitHub/Discord) work

### Step 6.5: Link Validation

**Automated link check**:

```bash
# After building
cd docs
bun run build

# Use a link checker tool
npx linkinator dist/docs --recurse --skip "^(?!.*opencode-warcraft-notifications)"
```

**Manual checks**:

- [ ] All internal links resolve
- [ ] No 404 errors in browser console
- [ ] Anchor links work (#sections)
- [ ] Cross-page links work
- [ ] External links valid

### Step 6.6: Mobile Responsiveness

**Test on various viewports**:

- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1024px+ width)
- [ ] Hamburger menu on mobile
- [ ] Touch targets adequate size
- [ ] No horizontal scroll issues

### Step 6.7: Performance Testing

**Lighthouse audit**:

```bash
# Build and preview
cd docs
bun run build
bun run preview

# Run Lighthouse in Chrome DevTools
# Target scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 95+
```

### Step 6.8: Cross-Browser Testing

Test in:

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Edge

### Step 6.9: Visual Comparison

**Compare with Jekyll version**:

1. Run Jekyll site: `cd docs-jekyll-backup && bundle exec jekyll serve`
2. Run Astro site: `cd docs && bun run dev`
3. Open both side-by-side
4. Compare:
   - Layout structure
   - Typography
   - Spacing
   - Colors (light and dark)
   - Navigation appearance
   - Code block styling
   - Callout box styling

**Take screenshots** for documentation.

**Checkpoint**: All tests pass, site ready for deployment

---

## Phase 7: Launch (15 minutes)

### Step 7.1: Final Pre-Launch Checks

- [ ] All tests passed
- [ ] Content review complete
- [ ] Links validated
- [ ] Performance acceptable
- [ ] Visual parity achieved
- [ ] Mobile responsive
- [ ] Search functional

### Step 7.2: Commit and Push

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat(docs): Migrate from Jekyll to Astro/Starlight

- Set up Astro/Starlight with custom theme matching OpenCode style
- Migrated all content files with updated frontmatter
- Converted callouts to Starlight syntax
- Updated all internal links
- Added custom CSS for visual parity
- Updated GitHub Actions workflow for Astro deployment
- Preserved URL structure for backward compatibility
- Integrated search, theme toggle, and responsive design

BREAKING CHANGE: Documentation now built with Astro instead of Jekyll"

# Push to feature branch
git push origin feat/migrate-to-astro-starlight
```

### Step 7.3: Create Pull Request

**Title**: `feat(docs): Migrate documentation from Jekyll to Astro/Starlight`

**Description**:

```markdown
## Summary

Migrates the documentation site from Jekyll to Astro with Starlight theme, matching the visual design and structure of https://opencode.ai/docs.

## Changes

- ✅ Set up Astro/Starlight with custom configuration
- ✅ Migrated all 22+ content files to Starlight format
- ✅ Preserved URL structure (no breaking links)
- ✅ Custom CSS for OpenCode-style design
- ✅ Updated GitHub Actions deployment workflow
- ✅ Integrated search, theme toggle, and responsive layout
- ✅ All tests passing

## Testing

- [x] All pages render correctly
- [x] Navigation functional
- [x] Search working
- [x] Dark/light theme working
- [x] Mobile responsive
- [x] Links validated (0 broken links)
- [x] Performance tested (Lighthouse 90+)
- [x] Cross-browser tested

## Preview

🚀 Deploy preview will be available once PR is created

## Documentation

- See [STYLE_ANALYSIS.md](STYLE_ANALYSIS.md) for design analysis
- See [MIGRATION_PLAN.md](MIGRATION_PLAN.md) for migration details

## Checklist

- [x] Code follows project standards
- [x] All tests pass
- [x] Documentation updated
- [x] No console warnings
- [x] Backward compatible (URLs preserved)
```

### Step 7.4: Review and Merge

1. Wait for CI/CD checks to pass
2. Review deployment preview
3. Address any feedback
4. Merge to main

### Step 7.5: Verify Production Deployment

After merge:

```bash
# Wait for GitHub Actions to complete (~2-3 minutes)
# Visit production URL
open https://pantheon-org.github.io/opencode-warcraft-notifications/
```

**Final validation**:

- [ ] Site loads on GitHub Pages
- [ ] All pages accessible
- [ ] Search working in production
- [ ] Theme toggle working
- [ ] No console errors
- [ ] Analytics tracking (if configured)

### Step 7.6: Clean Up

**After successful deployment**:

```bash
# Delete feature branch
git branch -d feat/migrate-to-astro-starlight
git push origin --delete feat/migrate-to-astro-starlight

# Optionally remove Jekyll backup (after confirming success)
# git rm -r docs-jekyll-backup
# git commit -m "chore: Remove Jekyll backup after successful migration"
# git push origin main
```

**Checkpoint**: Migration complete, site live on GitHub Pages

---

## Rollback Strategy

### If Issues Arise During Development

**Scenario**: Problems during local development

**Action**:

```bash
# Discard changes and return to main
git checkout main
git branch -D feat/migrate-to-astro-starlight
```

### If Issues Arise After PR Created

**Scenario**: PR created but issues found in review

**Action**:

```bash
# Fix issues in feature branch
git checkout feat/migrate-to-astro-starlight
# Make corrections
git add .
git commit -m "fix: Address review feedback"
git push origin feat/migrate-to-astro-starlight
```

### If Issues Arise After Merge

**Scenario**: Problems discovered after merging to main

**Action 1 - Quick fix** (preferred):

```bash
git checkout main
git pull origin main
# Make fixes
git add .
git commit -m "fix(docs): Fix issue X in Astro migration"
git push origin main
```

**Action 2 - Full rollback** (if major issues):

```bash
# Restore Jekyll from backup
git checkout main
git pull origin main
rm -rf docs
git checkout HEAD~1 docs  # Or specific commit before migration
git add docs
git commit -m "revert: Rollback to Jekyll due to critical issues"
git push origin main

# Fix issues in separate branch
git checkout -b fix/astro-migration-issues
# Address problems
# Create new PR when ready
```

### Rollback Testing

**Before launching**, ensure you can rollback:

1. Keep `docs-jekyll-backup` until migration proven stable
2. Tag the last Jekyll commit: `git tag jekyll-last-version`
3. Document rollback steps for team

---

## Post-Migration Tasks

### Immediate (Within 24 hours)

- [ ] Monitor GitHub Pages deployment
- [ ] Check analytics for traffic patterns
- [ ] Monitor for user-reported issues
- [ ] Verify all external links still work
- [ ] Update any external documentation pointing to docs

### Short-term (Within 1 week)

- [ ] Gather user feedback on new design
- [ ] Monitor search queries for relevance
- [ ] Check Lighthouse scores weekly
- [ ] Review and remove Jekyll backup if stable
- [ ] Update README if needed

### Long-term (Within 1 month)

- [ ] Analyze performance metrics vs. Jekyll
- [ ] Consider additional Starlight features
- [ ] Optimize images (if applicable)
- [ ] Review and improve search configuration
- [ ] Document lessons learned

---

## Content Migration Checklist

### Main Pages

- [ ] `index.md` → `docs/src/content/docs/index.mdx`
- [ ] `USER_GUIDE.md` → `docs/src/content/docs/user-guide.md`
- [ ] `API.md` → `docs/src/content/docs/api.md`
- [ ] `ARCHITECTURE.md` → `docs/src/content/docs/architecture.md`
- [ ] `DEVELOPMENT.md` → `docs/src/content/docs/development.md`
- [ ] `DEPLOYMENT.md` → `docs/src/content/docs/deployment.md`
- [ ] `PIPELINE.md` → `docs/src/content/docs/pipeline.md`
- [ ] `TROUBLESHOOTING.md` → `docs/src/content/docs/troubleshooting.md`
- [ ] `ONBOARDING.md` → `docs/src/content/docs/onboarding.md`
- [ ] `VALIDATE_SCHEMA.md` → `docs/src/content/docs/validate-schema.md`
- [ ] `GITHUB_PAGES_SETUP.md` → (Optional, may not need in Astro version)

### GitHub Workflows Section

- [ ] `github-workflows/README.md` → `docs/src/content/docs/github-workflows/index.md`
- [ ] `github-workflows/setup-guide.md` → `docs/src/content/docs/github-workflows/setup-guide.md`
- [ ] `github-workflows/architecture-summary.md` → `docs/src/content/docs/github-workflows/architecture-summary.md`
- [ ] `github-workflows/cleanup-old-releases.md` → `docs/src/content/docs/github-workflows/cleanup-old-releases.md`
- [ ] `github-workflows/cycle-prevention-fix.md` → `docs/src/content/docs/github-workflows/cycle-prevention-fix.md`
- [ ] `github-workflows/overview.md` → `docs/src/content/docs/github-workflows/overview.md`
- [ ] `github-workflows/squash-merge-configuration.md` → `docs/src/content/docs/github-workflows/squash-merge-configuration.md`

### Schemas Section

- [ ] `schemas/README.md` → `docs/src/content/docs/schemas/index.md`
- [ ] `schemas/plugin.json.schema` → Copy to `docs/src/content/docs/schemas/`
- [ ] `schemas/plugin.json.example` → Copy to `docs/src/content/docs/schemas/`

### Assets

- [ ] `assets/favicon.svg` → `docs/public/favicon.svg` and `docs/src/assets/logo.svg`
- [ ] (Other assets if any)

---

## Risk Assessment

### Low Risk Items ✅

- Core Astro/Starlight setup
- Basic content migration
- CSS customization
- GitHub Actions workflow update

**Mitigation**: Well-documented process, reversible changes

### Medium Risk Items ⚠️

- Link structure preservation
- Search functionality configuration
- Theme toggle behavior
- Mobile responsiveness

**Mitigation**: Thorough testing phase, link validation tools

### High Risk Items ⛔

- URL structure changes causing broken external links
- Analytics tracking discontinuity
- Missing features after migration

**Mitigation**:

- Preserve exact URL structure
- Test analytics in preview
- Feature checklist validation
- Keep Jekyll backup until stable

---

## Timeline Summary

| Phase                      | Duration        | Milestone              |
| -------------------------- | --------------- | ---------------------- |
| Phase 1: Setup             | 30-45 min       | Astro running locally  |
| Phase 2: Configuration     | 30-45 min       | Config complete        |
| Phase 3: Content Migration | 60-90 min       | All content migrated   |
| Phase 4: Styling           | 30-60 min       | Visual parity achieved |
| Phase 5: Deployment        | 30 min          | Workflow updated       |
| Phase 6: Testing           | 30-45 min       | All tests pass         |
| Phase 7: Launch            | 15 min          | Live on GitHub Pages   |
| **Total**                  | **3.5-5 hours** | **Migration complete** |

---

## Success Metrics

### Technical Metrics

- ✅ Build time: < 30 seconds
- ✅ Page load time: < 2 seconds
- ✅ Lighthouse performance: 90+
- ✅ Zero broken links
- ✅ Zero console errors
- ✅ 100% content migrated

### User Experience Metrics

- ✅ Navigation intuitive
- ✅ Search relevant
- ✅ Mobile usable
- ✅ Dark mode comfortable
- ✅ Visual design matches reference

### Business Metrics

- ✅ No downtime during migration
- ✅ No external link breakage
- ✅ Improved maintainability
- ✅ Better documentation UX

---

## Lessons Learned (Post-Migration)

**To be filled after completion**:

### What Went Well

-

### What Could Be Improved

-

### Unexpected Challenges

-

### Recommendations for Future

-

---

## Resources

### Documentation

- [Astro Documentation](https://docs.astro.build/)
- [Starlight Documentation](https://starlight.astro.build/)
- [Starlight Configuration Reference](https://starlight.astro.build/reference/configuration/)
- [Starlight Guides](https://starlight.astro.build/guides/sidebar/)

### Tools

- [Linkinator](https://www.npmjs.com/package/linkinator) - Link validation
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- [WebPageTest](https://www.webpagetest.org/) - Performance testing

### Reference Sites

- [OpenCode Documentation](https://opencode.ai/docs) - Style reference
- [Starlight Showcase](https://starlight.astro.build/showcase/) - Examples

---

## Contact & Support

**Questions during migration?**

- Review STYLE_ANALYSIS.md for design decisions
- Consult Starlight docs for configuration
- Check project CONTRIBUTING.md for guidelines

**Issues after migration?**

- Create GitHub issue with details
- Use rollback strategy if critical
- Document learnings for team

---

**Document Maintained By**: OpenCode Migration Team  
**Last Updated**: 2025-11-11  
**Status**: Ready for execution

---

_"Work complete!"_ - Warcraft II Peasant  
_"Ready to work!"_ - Warcraft II Peon
