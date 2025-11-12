# OpenCode Documentation Style Implementation Plan

**Project**: Warcraft Notifications Plugin Documentation  
**Target Style**: OpenCode Documentation (https://opencode.ai/docs)  
**Current Framework**: Astro v5.15.0 + Starlight v0.36.0  
**Status**: Implementation Roadmap

---

## Executive Summary

This plan outlines the steps to transform the Warcraft Notifications documentation to match the OpenCode documentation style, maintaining the existing Astro + Starlight foundation while adopting OpenCode's visual design, color system, and interaction patterns.

**Key Objectives**:

1. Match OpenCode's dark-mode-first color scheme
2. Implement OpenCode's component styling (buttons, badges, code blocks)
3. Adopt OpenCode's typography and spacing system
4. Configure enhanced code highlighting with Expressive Code
5. Ensure responsive design matches OpenCode's breakpoints

---

## Phase 1: Version Alignment & Dependencies

### Task 1.1: Update Core Dependencies

**Current State**:

- Astro: v5.15.0
- Starlight: v0.36.0

**Target State**:

- Astro: v5.7.13 (match OpenCode)
- Starlight: v0.34.3 (match OpenCode)

**Action**:

```bash
cd docs
bun add astro@5.7.13 @astrojs/starlight@0.34.3
```

**Rationale**: Version alignment ensures CSS variable compatibility and prevents style conflicts.

### Task 1.2: Add Expressive Code Integration

**Action**:

```bash
cd docs
bun add astro-expressive-code
```

**Configuration**: Add to `astro.config.mjs`:

```javascript
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      styleOverrides: {
        borderRadius: '0.5rem',
        borderColor: 'var(--sl-color-gray-5)',
      },
    }),
    starlight({
      // ... existing config
    }),
  ],
});
```

**Priority**: High  
**Estimated Time**: 30 minutes

---

## Phase 2: Color System Implementation

### Task 2.1: Replace Custom CSS Variables

**File**: `docs/src/styles/custom.css`

**Current Issues**:

- Colors don't match OpenCode's dark theme
- Missing semantic badge colors
- Incorrect gray scale values

**Implementation**:

Replace existing `:root` variables with OpenCode-compatible values:

```css
:root {
  /* === Primary Colors === */
  --sl-color-accent-low: #2e3440;
  --sl-color-accent: #88c0d0;
  --sl-color-accent-high: #d8dee9;

  /* === Grayscale === */
  --sl-color-white: #eceff4;
  --sl-color-black: #2e3440;
  --sl-color-gray-1: #3b4252;
  --sl-color-gray-2: #434c5e;
  --sl-color-gray-3: #4c566a;
  --sl-color-gray-4: #d8dee9;
  --sl-color-gray-5: #e5e9f0;
  --sl-color-gray-6: #eceff4;

  /* === Semantic Badge Colors === */
  --sl-color-blue: #5e81ac;
  --sl-color-red: #bf616a;
  --sl-color-green: #a3be8c;
  --sl-color-orange: #d08770;
  --sl-color-purple: #b48ead;

  /* === Typography === */
  --sl-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  --sl-font-system-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
  --sl-line-height: 1.8;
  --sl-line-height-headings: 1.2;

  /* === Text Sizes === */
  --sl-text-xs: 0.8125rem;
  --sl-text-sm: 0.875rem;
  --sl-text-base: 1rem;

  /* === Layout === */
  --sl-content-width: 48rem;
  --sl-sidebar-width: 18rem;
  --sl-border-radius: 0.5rem;

  /* === Borders === */
  --sl-color-hairline-light: rgba(255, 255, 255, 0.1);
  --sl-color-hairline-shade: rgba(0, 0, 0, 0.1);
}

/* === Dark Mode (Default) === */
:root[data-theme='dark'] {
  --sl-color-accent-low: #1e2936;
  --sl-color-accent: #88c0d0;
  --sl-color-accent-high: #d8dee9;

  --sl-color-white: #eceff4;
  --sl-color-black: #2e3440;
  --sl-color-gray-1: #2e3440;
  --sl-color-gray-2: #3b4252;
  --sl-color-gray-3: #4c566a;
  --sl-color-gray-4: #d8dee9;
  --sl-color-gray-5: #434c5e;
  --sl-color-bg: #1e2936;

  /* Badge dark mode colors */
  --sl-color-blue: #81a1c1;
  --sl-color-red: #bf616a;
  --sl-color-green: #a3be8c;
  --sl-color-orange: #d08770;
  --sl-color-purple: #b48ead;
}

/* === Light Mode === */
:root[data-theme='light'] {
  --sl-color-accent-low: #dce4f0;
  --sl-color-accent: #5e81ac;
  --sl-color-accent-high: #2e3440;

  --sl-color-white: #2e3440;
  --sl-color-black: #eceff4;
  --sl-color-gray-1: #eceff4;
  --sl-color-gray-2: #e5e9f0;
  --sl-color-gray-3: #d8dee9;
  --sl-color-gray-4: #4c566a;
  --sl-color-gray-5: #e5e9f0;
  --sl-color-bg: #ffffff;

  /* Badge light mode colors */
  --sl-color-blue: #5e81ac;
  --sl-color-red: #bf616a;
  --sl-color-green: #a3be8c;
  --sl-color-orange: #d08770;
  --sl-color-purple: #b48ead;
}
```

**Priority**: High  
**Estimated Time**: 1 hour

### Task 2.2: Add Badge Styling

**Add to `custom.css`**:

```css
/* === Badge Components === */
.sl-badge {
  display: inline-block;
  padding: 0.175rem 0.35rem;
  border-radius: 0.25rem;
  border: 1px solid currentColor;
  font-size: var(--sl-text-xs);
  font-weight: 600;
  line-height: 1;
}

.sl-badge.default {
  color: var(--sl-color-gray-4);
  background: var(--sl-color-gray-1);
  border-color: var(--sl-color-gray-3);
}

.sl-badge.note {
  color: var(--sl-color-blue);
  background: color-mix(in srgb, var(--sl-color-blue) 15%, transparent);
  border-color: var(--sl-color-blue);
}

.sl-badge.success {
  color: var(--sl-color-green);
  background: color-mix(in srgb, var(--sl-color-green) 15%, transparent);
  border-color: var(--sl-color-green);
}

.sl-badge.caution {
  color: var(--sl-color-orange);
  background: color-mix(in srgb, var(--sl-color-orange) 15%, transparent);
  border-color: var(--sl-color-orange);
}

.sl-badge.danger {
  color: var(--sl-color-red);
  background: color-mix(in srgb, var(--sl-color-red) 15%, transparent);
  border-color: var(--sl-color-red);
}

.sl-badge.tip {
  color: var(--sl-color-purple);
  background: color-mix(in srgb, var(--sl-color-purple) 15%, transparent);
  border-color: var(--sl-color-purple);
}
```

**Priority**: Medium  
**Estimated Time**: 30 minutes

---

## Phase 3: Component Styling

### Task 3.1: Button & Link Styles

**Add to `custom.css`**:

```css
/* === Button Components === */
.sl-link-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4375rem 1.125rem;
  border-radius: 999rem;
  font-size: var(--sl-text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.sl-link-button.primary {
  background: var(--sl-color-accent);
  color: var(--sl-color-black);
  border: 1px solid var(--sl-color-accent);
}

.sl-link-button.primary:hover {
  background: var(--sl-color-accent-high);
  border-color: var(--sl-color-accent-high);
}

.sl-link-button.secondary {
  background: transparent;
  color: var(--sl-color-accent);
  border: 1px solid var(--sl-color-accent);
}

.sl-link-button.secondary:hover {
  background: var(--sl-color-accent-low);
}

.sl-link-button.minimal {
  background: transparent;
  color: var(--sl-color-text);
  border: none;
}

.sl-link-button.minimal:hover {
  background: var(--sl-color-gray-5);
}
```

**Priority**: Medium  
**Estimated Time**: 30 minutes

### Task 3.2: Code Block Enhancements

**Add to `custom.css`**:

```css
/* === Code Block Styling === */
.expressive-code {
  margin: 1.5rem 0;
  border-radius: var(--sl-border-radius);
  overflow: hidden;
}

.expressive-code .frame {
  border: 1px solid var(--sl-color-gray-5);
  background: var(--sl-color-gray-1);
}

.expressive-code .frame.is-terminal {
  background: #1a1f2c;
}

.expressive-code .copy {
  background: var(--sl-color-gray-2);
  color: var(--sl-color-gray-4);
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: var(--sl-text-xs);
  transition: all 0.2s ease;
}

.expressive-code .copy:hover {
  background: var(--sl-color-gray-3);
  border-color: var(--sl-color-accent);
}

/* Syntax highlighting colors */
.expressive-code .ec-line .code {
  color: #d8dee9;
}

.expressive-code .keyword {
  color: #b48ead; /* Purple */
}

.expressive-code .string {
  color: #a3be8c; /* Green */
}

.expressive-code .number {
  color: #d08770; /* Orange */
}

.expressive-code .function {
  color: #88c0d0; /* Blue */
}

.expressive-code .comment {
  color: #616e88; /* Gray */
  font-style: italic;
}
```

**Priority**: High  
**Estimated Time**: 45 minutes

### Task 3.3: Navigation & TOC Styling

**Add to `custom.css`**:

```css
/* === Sidebar Navigation === */
.sidebar-content a[aria-current='page'] {
  background: var(--sl-color-accent-low);
  color: var(--sl-color-accent);
  font-weight: 600;
  border-left: 3px solid var(--sl-color-accent);
  padding-left: calc(1rem - 3px);
}

.sidebar-content a:hover {
  background: var(--sl-color-gray-5);
  color: var(--sl-color-accent);
}

/* === Table of Contents === */
.right-sidebar-panel a[aria-current='true'] {
  color: var(--sl-color-accent);
  font-weight: 600;
}

.right-sidebar-panel a:hover {
  color: var(--sl-color-accent);
  text-decoration: underline;
}

/* === Mobile Menu === */
@media (max-width: 50em) {
  .mobile-preferences {
    background: var(--sl-color-gray-1);
    border-top: 1px solid var(--sl-color-gray-5);
  }

  .mobile-starlight-toc {
    background: var(--sl-color-gray-1);
    border: 1px solid var(--sl-color-gray-5);
    border-radius: var(--sl-border-radius);
  }
}
```

**Priority**: High  
**Estimated Time**: 45 minutes

---

## Phase 4: Logo & Branding

### Task 4.1: Create Logo Variants

**Required Assets**:

- `docs/src/assets/logo-light.svg` (for dark mode)
- `docs/src/assets/logo-dark.svg` (for light mode)

**Update `astro.config.mjs`**:

```javascript
logo: {
  light: './src/assets/logo-dark.svg',
  dark: './src/assets/logo-light.svg',
  replacesTitle: false,
},
```

**Priority**: Medium  
**Estimated Time**: 1 hour (including design work)

### Task 4.2: Configure Favicon

**Ensure favicon exists**: `docs/public/favicon.svg`

**Priority**: Low  
**Estimated Time**: 15 minutes

---

## Phase 5: Enhanced Configuration

### Task 5.1: Theme Selector Configuration

**Update `astro.config.mjs`**:

```javascript
starlight({
  // ... existing config
  defaultTheme: 'dark', // Match OpenCode default
  customCss: ['./src/styles/custom.css'],
  components: {
    ThemeSelect: './src/components/ThemeSelect.astro', // Optional custom component
  },
});
```

**Priority**: Medium  
**Estimated Time**: 30 minutes

### Task 5.2: Search Configuration

**Add to `astro.config.mjs`**:

```javascript
starlight({
  // ... existing config
  search: {
    provider: 'local', // Built-in Pagefind search
  },
});
```

**Priority**: Low  
**Estimated Time**: 15 minutes

### Task 5.3: Social Links Enhancement

**Update `astro.config.mjs`**:

```javascript
social: [
  {
    icon: 'github',
    label: 'GitHub',
    href: 'https://github.com/pantheon-org/opencode-warcraft-notifications',
  },
  // Add Discord if applicable
  // {
  //   icon: 'discord',
  //   label: 'Discord',
  //   href: 'https://discord.gg/your-invite',
  // },
],
```

**Priority**: Low  
**Estimated Time**: 10 minutes

---

## Phase 6: Typography & Spacing

### Task 6.1: Typography System

**Add to `custom.css`**:

```css
/* === Typography === */
.sl-markdown-content {
  font-size: var(--sl-text-base);
  line-height: var(--sl-line-height);
  color: var(--sl-color-white);
}

.sl-markdown-content h1 {
  font-size: 2.25rem;
  line-height: var(--sl-line-height-headings);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.sl-markdown-content h2 {
  font-size: 1.75rem;
  line-height: var(--sl-line-height-headings);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  border-bottom: 1px solid var(--sl-color-hairline-light);
  padding-bottom: 0.5rem;
}

.sl-markdown-content h3 {
  font-size: 1.375rem;
  line-height: var(--sl-line-height-headings);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.sl-markdown-content h4 {
  font-size: 1.125rem;
  line-height: var(--sl-line-height-headings);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.sl-markdown-content p {
  margin: 1rem 0;
}

.sl-markdown-content code {
  font-family: var(--sl-font-system-mono);
  font-size: 0.9em;
  background: var(--sl-color-gray-1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  border: 1px solid var(--sl-color-gray-5);
}

.sl-markdown-content pre code {
  background: transparent;
  padding: 0;
  border: none;
}
```

**Priority**: High  
**Estimated Time**: 1 hour

### Task 6.2: List & Content Spacing

**Add to `custom.css`**:

```css
/* === List Styling === */
.sl-markdown-content ul,
.sl-markdown-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.sl-markdown-content li {
  margin: 0.5rem 0;
  line-height: var(--sl-line-height);
}

.sl-markdown-content li > ul,
.sl-markdown-content li > ol {
  margin: 0.5rem 0;
}

/* Nested list indentation */
.sl-markdown-content ul ul,
.sl-markdown-content ol ol,
.sl-markdown-content ul ol,
.sl-markdown-content ol ul {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

/* === Blockquotes === */
.sl-markdown-content blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-left: 4px solid var(--sl-color-accent);
  background: var(--sl-color-gray-1);
  border-radius: var(--sl-border-radius);
}

/* === Horizontal Rules === */
.sl-markdown-content hr {
  margin: 3rem 0;
  border: none;
  border-top: 1px solid var(--sl-color-hairline-light);
}

/* === Tables === */
.sl-markdown-content table {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: collapse;
  border: 1px solid var(--sl-color-gray-5);
  border-radius: var(--sl-border-radius);
  overflow: hidden;
}

.sl-markdown-content th,
.sl-markdown-content td {
  padding: 0.75rem 1rem;
  border: 1px solid var(--sl-color-gray-5);
  text-align: left;
}

.sl-markdown-content th {
  background: var(--sl-color-gray-1);
  font-weight: 600;
}

.sl-markdown-content tbody tr:nth-child(even) {
  background: var(--sl-color-gray-1);
}
```

**Priority**: Medium  
**Estimated Time**: 45 minutes

---

## Phase 7: Callouts & Special Components

### Task 7.1: Enhanced Callout Styling

**Add to `custom.css`**:

```css
/* === Callout/Aside Components === */
.sl-markdown-content aside {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: var(--sl-border-radius);
  border-left: 4px solid currentColor;
  background: var(--sl-color-gray-1);
}

.sl-markdown-content aside.note {
  color: var(--sl-color-blue);
  border-color: var(--sl-color-blue);
  background: color-mix(in srgb, var(--sl-color-blue) 10%, var(--sl-color-gray-1));
}

.sl-markdown-content aside.tip {
  color: var(--sl-color-purple);
  border-color: var(--sl-color-purple);
  background: color-mix(in srgb, var(--sl-color-purple) 10%, var(--sl-color-gray-1));
}

.sl-markdown-content aside.caution {
  color: var(--sl-color-orange);
  border-color: var(--sl-color-orange);
  background: color-mix(in srgb, var(--sl-color-orange) 10%, var(--sl-color-gray-1));
}

.sl-markdown-content aside.danger {
  color: var(--sl-color-red);
  border-color: var(--sl-color-red);
  background: color-mix(in srgb, var(--sl-color-red) 10%, var(--sl-color-gray-1));
}

.sl-markdown-content aside.success {
  color: var(--sl-color-green);
  border-color: var(--sl-color-green);
  background: color-mix(in srgb, var(--sl-color-green) 10%, var(--sl-color-gray-1));
}

/* Aside title */
.sl-markdown-content aside > p:first-child {
  margin-top: 0;
  font-weight: 600;
}

/* Aside icon (if using Starlight's built-in icons) */
.sl-markdown-content aside .icon {
  vertical-align: middle;
  margin-right: 0.5rem;
}
```

**Priority**: Medium  
**Estimated Time**: 30 minutes

### Task 7.2: Step-by-Step Guide Styling

**Add to `custom.css`**:

```css
/* === Step Component === */
.sl-steps {
  counter-reset: step-counter;
  list-style: none;
  padding-left: 0;
  margin: 2rem 0;
}

.sl-steps li {
  position: relative;
  padding-left: 2.5rem;
  margin-bottom: 2rem;
  counter-increment: step-counter;
}

.sl-steps li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--sl-color-accent);
  color: var(--sl-color-black);
  font-weight: 700;
  font-size: var(--sl-text-sm);
}

.sl-steps li::after {
  content: '';
  position: absolute;
  left: 0.875rem;
  top: 2rem;
  width: 2px;
  height: calc(100% - 1.5rem);
  background: var(--sl-color-gray-5);
}

.sl-steps li:last-child::after {
  display: none;
}
```

**Priority**: Low  
**Estimated Time**: 30 minutes

---

## Phase 8: Responsive Design

### Task 8.1: Mobile Breakpoint Alignment

**Add to `custom.css`**:

```css
/* === Responsive Breakpoints (match OpenCode) === */
@media (max-width: 50em) {
  /* 800px - Mobile */
  :root {
    --sl-content-width: 100%;
    --sl-text-base: 0.9375rem;
  }

  .sl-markdown-content h1 {
    font-size: 1.875rem;
  }

  .sl-markdown-content h2 {
    font-size: 1.5rem;
  }

  .sl-markdown-content h3 {
    font-size: 1.25rem;
  }

  .sl-markdown-content pre {
    margin-left: -1rem;
    margin-right: -1rem;
    border-radius: 0;
  }

  .sl-markdown-content table {
    display: block;
    overflow-x: auto;
  }
}

@media (min-width: 50em) {
  /* 800px+ - Desktop */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
    background: color-mix(in srgb, var(--sl-color-bg) 90%, transparent);
  }
}

@media (min-width: 72em) {
  /* 1152px - Wide Desktop */
  :root {
    --sl-content-width: 56rem;
  }
}
```

**Priority**: High  
**Estimated Time**: 1 hour

---

## Phase 9: Accessibility & Polish

### Task 9.1: Focus States

**Add to `custom.css`**:

```css
/* === Accessibility - Focus States === */
:focus-visible {
  outline: 2px solid var(--sl-color-accent);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.sl-markdown-content a:focus-visible,
.sidebar-content a:focus-visible,
.right-sidebar a:focus-visible {
  outline: 2px solid var(--sl-color-accent);
  outline-offset: 2px;
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Priority**: Medium  
**Estimated Time**: 30 minutes

### Task 9.2: Print Styles

**Add to `custom.css`**:

```css
/* === Print Styles === */
@media print {
  .header,
  .sidebar,
  .right-sidebar,
  .edit-link,
  .social-icons,
  .theme-select,
  .search {
    display: none !important;
  }

  .main-frame {
    margin: 0;
    max-width: 100%;
  }

  .sl-markdown-content a {
    color: var(--sl-color-black);
    text-decoration: underline;
  }

  .sl-markdown-content a[href^='http']::after {
    content: ' (' attr(href) ')';
    font-size: 0.875rem;
    color: var(--sl-color-gray-3);
  }
}
```

**Priority**: Low  
**Estimated Time**: 20 minutes

---

## Phase 10: Testing & Validation

### Task 10.1: Visual Regression Testing

**Test Checklist**:

- [ ] Homepage loads with correct dark theme
- [ ] Light theme toggle works correctly
- [ ] Logo variants display correctly in each theme
- [ ] Navigation sidebar styling matches OpenCode
- [ ] Right TOC highlights active sections
- [ ] Code blocks have copy buttons
- [ ] Code syntax highlighting displays correctly
- [ ] Mobile menu works on < 800px screens
- [ ] Search modal opens with Cmd/Ctrl+K
- [ ] All badges render with correct colors
- [ ] Callouts/asides display with proper styling
- [ ] Links have correct hover states
- [ ] Focus states are visible for keyboard navigation

**Priority**: High  
**Estimated Time**: 2 hours

### Task 10.2: Cross-Browser Testing

**Browsers to Test**:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

**Priority**: Medium  
**Estimated Time**: 1 hour

### Task 10.3: Accessibility Audit

**Tools**:

- Lighthouse accessibility score
- axe DevTools
- WAVE browser extension
- Keyboard navigation testing

**Target**: Score ≥ 95/100 on Lighthouse

**Priority**: High  
**Estimated Time**: 1 hour

---

## Timeline Estimate

| Phase        | Tasks                | Priority | Time  | Dependencies |
| ------------ | -------------------- | -------- | ----- | ------------ |
| **Phase 1**  | Version alignment    | High     | 0.5h  | None         |
| **Phase 2**  | Color system         | High     | 1.5h  | Phase 1      |
| **Phase 3**  | Component styling    | High     | 2h    | Phase 2      |
| **Phase 4**  | Logo & branding      | Medium   | 1.25h | Phase 1      |
| **Phase 5**  | Configuration        | Medium   | 1h    | Phase 1      |
| **Phase 6**  | Typography & spacing | High     | 1.75h | Phase 2      |
| **Phase 7**  | Special components   | Medium   | 1h    | Phase 3      |
| **Phase 8**  | Responsive design    | High     | 1h    | Phase 3, 6   |
| **Phase 9**  | Accessibility        | Medium   | 0.75h | Phase 8      |
| **Phase 10** | Testing              | High     | 4h    | All phases   |

**Total Estimated Time**: 14.75 hours (~2 working days)

---

## Success Criteria

### Visual Design

- [ ] Dark mode matches OpenCode's color scheme
- [ ] Light mode has proper contrast and readability
- [ ] Typography follows OpenCode's scale and spacing
- [ ] Component styles (badges, buttons, callouts) match reference

### Functionality

- [ ] Theme switching works smoothly
- [ ] Search functionality is operational
- [ ] Mobile navigation is fully functional
- [ ] Code copy buttons work correctly
- [ ] TOC highlights active sections

### Performance

- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] Page load time < 2 seconds
- [ ] No console errors or warnings

### Responsive Design

- [ ] Layout adapts correctly at 800px breakpoint
- [ ] Mobile menu is accessible and functional
- [ ] Content remains readable at all screen sizes
- [ ] No horizontal scrolling on mobile

---

## Rollback Plan

If issues arise during implementation:

1. **Git Branch Strategy**: Work on `docs/opencode-style-implementation` branch
2. **Backup Current State**: Tag current version as `docs-v1-backup`
3. **Incremental Rollback**: Each phase can be reverted independently via git
4. **Testing Environment**: Use `bun run dev` to test before deploying

**Rollback Command**:

```bash
git checkout docs-v1-backup
git checkout -b docs/rollback
```

---

## Next Steps

1. **Start Phase 1**: Update dependencies and add Expressive Code
2. **Review Design**: Confirm color choices with stakeholders
3. **Create Assets**: Design logo variants for light/dark themes
4. **Schedule Implementation**: Allocate 2-day sprint for core work
5. **Plan Deployment**: Coordinate with CI/CD pipeline for docs deployment

---

## References

- [OpenCode Documentation](https://opencode.ai/docs)
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build/)
- [Expressive Code Docs](https://expressive-code.com/)
- [Style Analysis Document](./opencode-docs-style-analysis.md)

---

**Document Status**: Draft v1.0  
**Created**: 2025-11-12  
**Last Updated**: 2025-11-12  
**Author**: Implementation planning team  
**Approvers**: TBD
