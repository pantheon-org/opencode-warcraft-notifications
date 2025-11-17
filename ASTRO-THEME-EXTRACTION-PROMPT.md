# Astro Theme Extraction and Replication Prompt

## Objective

Extract the layout, style, and theme from a live website and replicate it in an Astro documentation site. This process uses browser developer tools, CSS inspection, and automated extraction tools to reverse-engineer the visual design.

---

## Phase 1: Reconnaissance and Analysis

### 1.1 Install Required Tools

```bash
# Install browser automation and CSS extraction tools
bun add -D playwright @playwright/test
bun add -D css-tree csso
bun add -D puppeteer-extra puppeteer-extra-plugin-stealth

# Install CLI tools for inspection
npm install -g css-analyzer
npm install -g webpage-analyzer

# Optional: Install browser extensions
# - CSS Peeper (Chrome/Edge)
# - WhatFont (All browsers)
# - ColorZilla (All browsers)
```

### 1.2 Target Website Analysis

```bash
# Create analysis script
cat > analyze-site.mjs << 'EOF'
import { chromium } from 'playwright';
import fs from 'fs';

const TARGET_URL = process.env.TARGET_URL || 'https://example.com/docs';

async function analyzeSite() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Extract computed styles
  const analysis = await page.evaluate(() => {
    const results = {
      colors: new Set(),
      fonts: new Set(),
      fontSizes: new Set(),
      spacing: new Set(),
      borderRadius: new Set(),
      shadows: new Set(),
    };

    // Analyze all elements
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      const style = getComputedStyle(el);

      // Colors
      if (style.color) results.colors.add(style.color);
      if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        results.colors.add(style.backgroundColor);
      }

      // Fonts
      if (style.fontFamily) results.fonts.add(style.fontFamily);
      if (style.fontSize) results.fontSizes.add(style.fontSize);

      // Spacing
      if (style.padding !== '0px') results.spacing.add(`padding: ${style.padding}`);
      if (style.margin !== '0px') results.spacing.add(`margin: ${style.margin}`);

      // Border radius
      if (style.borderRadius !== '0px') results.borderRadius.add(style.borderRadius);

      // Shadows
      if (style.boxShadow !== 'none') results.shadows.add(style.boxShadow);
    });

    // Convert Sets to Arrays
    return {
      colors: Array.from(results.colors),
      fonts: Array.from(results.fonts),
      fontSizes: Array.from(results.fontSizes),
      spacing: Array.from(results.spacing),
      borderRadius: Array.from(results.borderRadius),
      shadows: Array.from(results.shadows),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  });

  // Get CSS custom properties (CSS variables)
  const cssVars = await page.evaluate(() => {
    const vars = {};
    const root = document.documentElement;
    const styles = getComputedStyle(root);

    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      if (prop.startsWith('--')) {
        vars[prop] = styles.getPropertyValue(prop).trim();
      }
    }
    return vars;
  });

  analysis.cssVariables = cssVars;

  // Extract layout structure
  const structure = await page.evaluate(() => {
    const getStructure = (el, depth = 0) => {
      if (depth > 3) return null; // Limit depth

      const style = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        classes: Array.from(el.classList),
        display: style.display,
        position: style.position,
        width: style.width,
        height: style.height,
        children: Array.from(el.children)
          .slice(0, 5) // Limit children
          .map(child => getStructure(child, depth + 1))
          .filter(Boolean),
      };
    };

    return {
      header: getStructure(document.querySelector('header')),
      main: getStructure(document.querySelector('main')),
      aside: getStructure(document.querySelector('aside')),
      nav: getStructure(document.querySelector('nav')),
    };
  });

  analysis.structure = structure;

  // Save analysis
  fs.writeFileSync(
    'site-analysis.json',
    JSON.stringify(analysis, null, 2)
  );

  console.log('✓ Analysis complete - saved to site-analysis.json');
  console.log('\nSummary:');
  console.log(`- ${analysis.colors.length} unique colors`);
  console.log(`- ${analysis.fonts.length} font families`);
  console.log(`- ${analysis.fontSizes.length} font sizes`);
  console.log(`- ${Object.keys(analysis.cssVariables).length} CSS variables`);

  await browser.close();
}

analyzeSite().catch(console.error);
EOF

# Run analysis
TARGET_URL="https://your-target-site.com/docs" node analyze-site.mjs
```

### 1.3 Manual Inspection Checklist

Open the target website in browser and use DevTools:

**Chrome DevTools Checklist:**

```javascript
// Run in Console to extract key information

// 1. Get all CSS custom properties
const rootStyles = getComputedStyle(document.documentElement);
const cssVars = {};
for (let i = 0; i < rootStyles.length; i++) {
  const prop = rootStyles[i];
  if (prop.startsWith('--')) {
    cssVars[prop] = rootStyles.getPropertyValue(prop);
  }
}
console.table(cssVars);

// 2. Get typography scale
['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'code'].forEach((tag) => {
  const el = document.querySelector(tag);
  if (el) {
    const style = getComputedStyle(el);
    console.log(`${tag}:`, {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      fontFamily: style.fontFamily,
      color: style.color,
      margin: style.margin,
    });
  }
});

// 3. Get color palette
const colors = new Set();
document.querySelectorAll('*').forEach((el) => {
  const style = getComputedStyle(el);
  colors.add(style.color);
  if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    colors.add(style.backgroundColor);
  }
  if (style.borderColor && style.borderColor !== 'rgb(0, 0, 0)') {
    colors.add(style.borderColor);
  }
});
console.log('Color Palette:', Array.from(colors));

// 4. Get spacing system
const spacing = new Set();
document.querySelectorAll('*').forEach((el) => {
  const style = getComputedStyle(el);
  ['padding', 'margin', 'gap'].forEach((prop) => {
    const val = style[prop];
    if (val && val !== '0px') spacing.add(val);
  });
});
console.log('Spacing Values:', Array.from(spacing));

// 5. Measure layout dimensions
console.log('Layout:', {
  headerHeight: document.querySelector('header')?.offsetHeight,
  sidebarWidth: document.querySelector('aside, nav[class*="sidebar"]')?.offsetWidth,
  contentWidth: document.querySelector('main, article')?.offsetWidth,
  maxContentWidth: getComputedStyle(document.querySelector('main, article')).maxWidth,
});
```

**Record the following manually:**

- [ ] Primary font family (body text)
- [ ] Monospace font (code blocks)
- [ ] Base font size
- [ ] Line height
- [ ] Color scheme (background, text, accent)
- [ ] Heading sizes (h1-h6)
- [ ] Header height
- [ ] Sidebar width
- [ ] Content max-width
- [ ] Border radius values
- [ ] Border colors
- [ ] Link styles (normal, hover)
- [ ] Button styles
- [ ] Code block theme
- [ ] Spacing scale

---

## Phase 2: Screenshot and Visual Reference

### 2.1 Capture Screenshots

```bash
# Create screenshot script
cat > capture-screenshots.mjs << 'EOF'
import { chromium } from 'playwright';

const TARGET_URL = process.env.TARGET_URL || 'https://example.com/docs';

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Different viewport sizes
  const viewports = [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 1024, height: 768, name: 'tablet' },
    { width: 375, height: 812, name: 'mobile' },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

    // Full page screenshot
    await page.screenshot({
      path: `reference-${viewport.name}-full.png`,
      fullPage: true,
    });

    // Above-the-fold screenshot
    await page.screenshot({
      path: `reference-${viewport.name}-hero.png`,
      fullPage: false,
    });

    console.log(`✓ Captured ${viewport.name} screenshots`);
  }

  // Capture specific components
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  const components = {
    'header': 'header',
    'navigation': 'nav, aside',
    'main-content': 'main, article',
    'code-block': 'pre, .code-block',
    'table': 'table',
  };

  for (const [name, selector] of Object.entries(components)) {
    const element = await page.$(selector);
    if (element) {
      await element.screenshot({ path: `component-${name}.png` });
      console.log(`✓ Captured ${name} component`);
    }
  }

  await browser.close();
}

captureScreenshots().catch(console.error);
EOF

# Run screenshot capture
TARGET_URL="https://your-target-site.com/docs" node capture-screenshots.mjs
```

### 2.2 Extract All CSS

```bash
# Download all stylesheets
cat > extract-css.mjs << 'EOF'
import { chromium } from 'playwright';
import fs from 'fs';

const TARGET_URL = process.env.TARGET_URL || 'https://example.com/docs';

async function extractCSS() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Get all stylesheets
  const cssContent = await page.evaluate(() => {
    const styles = [];

    // External stylesheets
    Array.from(document.styleSheets).forEach((sheet, idx) => {
      try {
        const rules = Array.from(sheet.cssRules);
        const css = rules.map(rule => rule.cssText).join('\n');
        styles.push({
          source: sheet.href || `inline-${idx}`,
          css: css,
        });
      } catch (e) {
        console.log('Could not access stylesheet:', e.message);
      }
    });

    // Inline styles
    Array.from(document.querySelectorAll('style')).forEach((style, idx) => {
      styles.push({
        source: `style-tag-${idx}`,
        css: style.textContent,
      });
    });

    return styles;
  });

  // Save CSS files
  cssContent.forEach((item, idx) => {
    fs.writeFileSync(
      `extracted-css-${idx}.css`,
      `/* Source: ${item.source} */\n\n${item.css}`
    );
  });

  console.log(`✓ Extracted ${cssContent.length} CSS files`);

  await browser.close();
}

extractCSS().catch(console.error);
EOF

# Run CSS extraction
TARGET_URL="https://your-target-site.com/docs" node extract-css.mjs
```

---

## Phase 3: Theme Synthesis

### 3.1 Create Design Tokens

Based on your analysis, create a design tokens file:

```bash
cat > design-tokens.json << 'EOF'
{
  "colors": {
    "background": {
      "primary": "EXTRACTED_VALUE",
      "secondary": "EXTRACTED_VALUE"
    },
    "text": {
      "primary": "EXTRACTED_VALUE",
      "secondary": "EXTRACTED_VALUE",
      "accent": "EXTRACTED_VALUE"
    },
    "border": {
      "default": "EXTRACTED_VALUE",
      "light": "EXTRACTED_VALUE"
    }
  },
  "typography": {
    "fontFamily": {
      "base": "EXTRACTED_VALUE",
      "mono": "EXTRACTED_VALUE"
    },
    "fontSize": {
      "base": "EXTRACTED_VALUE",
      "h1": "EXTRACTED_VALUE",
      "h2": "EXTRACTED_VALUE",
      "h3": "EXTRACTED_VALUE",
      "h4": "EXTRACTED_VALUE"
    },
    "fontWeight": {
      "normal": "EXTRACTED_VALUE",
      "medium": "EXTRACTED_VALUE",
      "bold": "EXTRACTED_VALUE"
    },
    "lineHeight": {
      "base": "EXTRACTED_VALUE",
      "heading": "EXTRACTED_VALUE"
    }
  },
  "spacing": {
    "base": "EXTRACTED_VALUE",
    "scale": ["EXTRACTED_VALUES"]
  },
  "layout": {
    "headerHeight": "EXTRACTED_VALUE",
    "sidebarWidth": "EXTRACTED_VALUE",
    "contentMaxWidth": "EXTRACTED_VALUE"
  },
  "borders": {
    "radius": "EXTRACTED_VALUE",
    "width": "EXTRACTED_VALUE"
  }
}
EOF
```

### 3.2 Generate CSS from Tokens

```bash
cat > generate-theme-css.mjs << 'EOF'
import fs from 'fs';

const tokens = JSON.parse(fs.readFileSync('design-tokens.json', 'utf8'));

const css = `
/**
 * Extracted Theme - Based on Analysis
 * Generated from design tokens
 */

:root {
  /* Colors */
  --sl-color-bg: ${tokens.colors.background.primary};
  --sl-color-bg-secondary: ${tokens.colors.background.secondary};
  --sl-color-text: ${tokens.colors.text.primary};
  --sl-color-text-secondary: ${tokens.colors.text.secondary};
  --sl-color-text-accent: ${tokens.colors.text.accent};
  --sl-color-border: ${tokens.colors.border.default};

  /* Typography */
  --sl-font: ${tokens.typography.fontFamily.base};
  --sl-font-mono: ${tokens.typography.fontFamily.mono};
  --sl-text-base: ${tokens.typography.fontSize.base};
  --sl-text-h1: ${tokens.typography.fontSize.h1};
  --sl-text-h2: ${tokens.typography.fontSize.h2};
  --sl-text-h3: ${tokens.typography.fontSize.h3};
  --sl-text-h4: ${tokens.typography.fontSize.h4};
  --sl-line-height: ${tokens.typography.lineHeight.base};
  --sl-line-height-headings: ${tokens.typography.lineHeight.heading};

  /* Layout */
  --sl-header-height: ${tokens.layout.headerHeight};
  --sl-sidebar-width: ${tokens.layout.sidebarWidth};
  --sl-content-width: ${tokens.layout.contentMaxWidth};

  /* Borders */
  --sl-border-radius: ${tokens.borders.radius};
  --sl-border-width: ${tokens.borders.width};
}

/* Apply base styles */
body {
  font-family: var(--sl-font);
  font-size: var(--sl-text-base);
  line-height: var(--sl-line-height);
  background-color: var(--sl-color-bg);
  color: var(--sl-color-text);
}

/* Typography */
h1 { font-size: var(--sl-text-h1); line-height: var(--sl-line-height-headings); }
h2 { font-size: var(--sl-text-h2); line-height: var(--sl-line-height-headings); }
h3 { font-size: var(--sl-text-h3); line-height: var(--sl-line-height-headings); }
h4 { font-size: var(--sl-text-h4); line-height: var(--sl-line-height-headings); }

/* Code */
code, pre {
  font-family: var(--sl-font-mono);
}

/* Layout */
header {
  height: var(--sl-header-height);
  border-bottom: var(--sl-border-width) solid var(--sl-color-border);
}
`;

fs.writeFileSync('generated-theme.css', css);
console.log('✓ Generated theme CSS from tokens');
EOF

node generate-theme-css.mjs
```

---

## Phase 4: Astro Implementation

### 4.1 Setup Astro Project

```bash
# If not already set up
bun add astro@latest
bun add @astrojs/starlight@latest
```

### 4.2 Create Astro Config with Extracted Values

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Your Project',
      customCss: ['./src/styles/extracted-theme.css'],
      // Add other extracted configuration
    }),
  ],
});
```

### 4.3 Create Theme CSS

Copy `generated-theme.css` to `src/styles/extracted-theme.css` and refine based on visual comparison.

---

## Phase 5: Iterative Refinement

### 5.1 Visual Comparison Tool

```bash
cat > compare-visual.mjs << 'EOF'
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';

const REFERENCE_URL = process.env.REFERENCE_URL;
const LOCAL_URL = 'http://localhost:4321';

async function compareVisual() {
  const browser = await chromium.launch();
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();

  await page1.goto(REFERENCE_URL);
  await page2.goto(LOCAL_URL);

  const screenshot1 = await page1.screenshot();
  const screenshot2 = await page2.screenshot();

  const img1 = PNG.sync.read(screenshot1);
  const img2 = PNG.sync.read(screenshot2);
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  fs.writeFileSync('visual-diff.png', PNG.sync.write(diff));

  const diffPercentage = (numDiffPixels / (width * height)) * 100;
  console.log(`Difference: ${diffPercentage.toFixed(2)}%`);
  console.log(`✓ Diff image saved to visual-diff.png`);

  await browser.close();
}

compareVisual().catch(console.error);
EOF

# Install dependencies
bun add -D pngjs pixelmatch

# Run comparison
REFERENCE_URL="https://target-site.com/docs" node compare-visual.mjs
```

### 5.2 Element-by-Element Comparison

```javascript
// Run in browser console on both sites

function getElementStyles(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;

  const style = getComputedStyle(el);
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily,
    color: style.color,
    backgroundColor: style.backgroundColor,
    padding: style.padding,
    margin: style.margin,
    borderRadius: style.borderRadius,
    border: style.border,
  };
}

// Compare common elements
const elements = ['h1', 'h2', 'p', 'code', 'pre', 'a', 'header', 'nav'];
elements.forEach((sel) => {
  console.log(sel, getElementStyles(sel));
});
```

### 5.3 Refinement Loop

```bash
# 1. Make adjustments to src/styles/extracted-theme.css
# 2. View changes
bun run dev

# 3. Compare visually
# 4. Extract specific element styles if needed
# 5. Repeat until satisfied
```

---

## Phase 6: Validation

### 6.1 Automated Checks

```bash
cat > validate-theme.mjs << 'EOF'
import { chromium } from 'playwright';

async function validateTheme() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:4321');

  const checks = {
    hasCustomFont: await page.evaluate(() => {
      const computed = getComputedStyle(document.body);
      return !computed.fontFamily.includes('system-ui');
    }),
    hasCustomColors: await page.evaluate(() => {
      const computed = getComputedStyle(document.body);
      return computed.backgroundColor !== 'rgb(255, 255, 255)';
    }),
    headerExists: await page.evaluate(() => {
      return !!document.querySelector('header');
    }),
    navExists: await page.evaluate(() => {
      return !!document.querySelector('nav');
    }),
  };

  console.log('Validation Results:');
  Object.entries(checks).forEach(([key, value]) => {
    console.log(`${value ? '✓' : '✗'} ${key}`);
  });

  await browser.close();
}

validateTheme().catch(console.error);
EOF

node validate-theme.mjs
```

### 6.2 Manual Checklist

Compare your implementation to reference screenshots:

- [ ] Overall color scheme matches
- [ ] Typography (fonts, sizes, weights) matches
- [ ] Spacing and layout match
- [ ] Header design matches
- [ ] Navigation styling matches
- [ ] Code block styling matches
- [ ] Link styles match (normal, hover, active)
- [ ] Responsive behavior matches at key breakpoints
- [ ] Border styles match
- [ ] Shadow effects match (if any)

---

## Phase 7: Documentation

### 7.1 Document Extraction Process

```markdown
# Theme Extraction Notes

## Source

- Target URL: [URL]
- Extraction Date: [DATE]
- Tools Used: Playwright, DevTools

## Key Design Tokens

### Colors

- Primary Background: [VALUE]
- Primary Text: [VALUE]
- Accent: [VALUE]

### Typography

- Base Font: [VALUE]
- Monospace: [VALUE]
- Base Size: [VALUE]

### Layout

- Header Height: [VALUE]
- Content Max Width: [VALUE]

## Deviations from Source

- [Note any intentional changes]

## Known Differences

- [Note any unresolved differences]
```

---

## Tools Reference

### Required Tools

```bash
# Node.js packages
bun add -D playwright @playwright/test
bun add -D pngjs pixelmatch
bun add -D css-tree

# CLI installation
npm install -g playwright
npx playwright install chromium
```

### Browser DevTools Shortcuts

- **Elements Panel**: `Cmd/Ctrl + Shift + C`
- **Console**: `Cmd/Ctrl + Shift + J`
- **Computed Styles**: Elements > Computed tab
- **CSS Variables**: Elements > :root > Computed > Filter "--"

### Useful Browser Extensions

- **CSS Peeper**: Extract CSS and assets
- **WhatFont**: Identify fonts
- **ColorZilla**: Pick colors
- **Dimensions**: Measure spacing
- **Page Ruler**: Measure elements

---

## Best Practices

1. **Work incrementally**: Extract one component at a time
2. **Keep references**: Save all screenshots and extracted data
3. **Version control**: Commit after each successful component
4. **Test responsive**: Check mobile, tablet, desktop
5. **Document deviations**: Note where you diverge from source
6. **Respect copyright**: Create similar styling, don't copy code directly
7. **Test in multiple browsers**: Chrome, Firefox, Safari
8. **Validate accessibility**: Ensure good contrast ratios

---

## Common Pitfalls

- **Font loading**: Ensure web fonts are properly loaded
- **CSS specificity**: Extracted CSS may have specificity conflicts
- **Dynamic styles**: Some styles may be JS-generated
- **Browser differences**: Computed styles vary by browser
- **Responsive behavior**: Media queries need manual extraction
- **Animations**: CSS animations need special attention
- **Pseudo-elements**: ::before and ::after need manual inspection

---

## Success Criteria

Your replication is successful when:

- [ ] Visual comparison shows <5% difference
- [ ] Typography matches (fonts, sizes, weights)
- [ ] Color palette matches key colors
- [ ] Layout structure matches (header, nav, content)
- [ ] Spacing feels equivalent
- [ ] Responsive breakpoints work similarly
- [ ] Code blocks render similarly
- [ ] Links and interactive elements match
- [ ] Build completes without errors
- [ ] Site is accessible (WCAG AA)

---

## Time Estimate

- Phase 1 (Analysis): 1-2 hours
- Phase 2 (Screenshots & CSS): 30-45 minutes
- Phase 3 (Synthesis): 1 hour
- Phase 4 (Implementation): 2-3 hours
- Phase 5 (Refinement): 2-4 hours
- Phase 6 (Validation): 30 minutes

**Total: 7-11 hours** for high-fidelity replication

---

## Legal and Ethical Notes

- **Inspiration vs. Copying**: Extract design patterns and principles, not exact code
- **Trademarks**: Don't use logos or brand assets without permission
- **Attribution**: If design is particularly distinctive, consider attribution
- **Fair Use**: Educational and personal projects generally acceptable
- **Commercial Use**: Consult legal counsel for commercial implementations

---

**End of Extraction and Replication Prompt**
