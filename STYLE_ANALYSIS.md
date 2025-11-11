# OpenCode Documentation Style Analysis

**Document Version**: 1.0  
**Analysis Date**: 2025-11-11  
**Reference Site**: https://opencode.ai/docs  
**Target**: Warcraft II Notifications Plugin Documentation

## Executive Summary

This document provides a comprehensive analysis of the OpenCode documentation site's visual design, layout, navigation patterns, and interactive components. This analysis serves as the foundation for migrating the Warcraft II Notifications Plugin documentation from Jekyll to Astro/Starlight while matching the OpenCode visual style.

---

## 1. Visual Design System

### 1.1 Color Scheme

**Light Mode**:

- Primary background: `#ffffff` (white)
- Secondary background: `#f6f6f7` (light gray, sidebar)
- Text primary: `#1c1c1e` (near-black)
- Text secondary: `#86868b` (gray)
- Accent/Links: Custom blue (appears to be `#3b82f6` or similar)
- Border colors: `#e5e5e7` (light gray borders)
- Code blocks: Dark theme with syntax highlighting

**Dark Mode**:

- Primary background: `#0d1117` (near-black)
- Secondary background: `#161b22` (dark gray, sidebar)
- Text primary: `#e6edf3` (off-white)
- Text secondary: `#8b949e` (gray)
- Accent/Links: Lighter blue for contrast
- Border colors: `#30363d` (dark gray borders)
- Code blocks: Dark theme with enhanced syntax highlighting

**Code Syntax Highlighting**:

- Keywords: Blue/Purple tones
- Strings: Green tones
- Comments: Gray/muted
- Functions: Yellow/gold tones
- Consistent with GitHub's syntax theme

### 1.2 Typography

**Font Families**:

- Headings: Sans-serif system font stack (appears to be Inter or system UI fonts)
- Body text: Same sans-serif stack
- Code/Monospace: `'Fira Code'`, `'Monaco'`, `'Consolas'`, monospace with ligatures support

**Font Sizes**:

- Base body: `16px` / `1rem`
- H1 (Page title): `2.5rem` / `40px`
- H2: `2rem` / `32px`
- H3: `1.5rem` / `24px`
- H4: `1.25rem` / `20px`
- Code inline: `0.875rem` / `14px`
- Small text/metadata: `0.875rem` / `14px`

**Font Weights**:

- Headings: `700` (bold) or `600` (semi-bold)
- Body: `400` (normal)
- Code: `400` (normal)
- Strong/Bold: `600` or `700`

**Line Heights**:

- Body: `1.6` - `1.75` (comfortable reading)
- Headings: `1.2` - `1.3` (tighter)
- Code: `1.5` - `1.6`

### 1.3 Spacing System

**Consistent spacing scale** (appears to follow 8px base grid):

- `4px` / `0.25rem` - Tight spacing
- `8px` / `0.5rem` - Small spacing
- `16px` / `1rem` - Base spacing
- `24px` / `1.5rem` - Medium spacing
- `32px` / `2rem` - Large spacing
- `48px` / `3rem` - Extra large spacing
- `64px` / `4rem` - Section spacing

**Content spacing**:

- Paragraph bottom margin: `1rem` - `1.5rem`
- Section breaks (`---`): `2rem` - `3rem` margin
- Code block margins: `1.5rem` - `2rem`
- List item spacing: `0.5rem` - `0.75rem`

---

## 2. Layout Structure

### 2.1 Three-Column Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         Header Bar                          │
├──────────────┬───────────────────────────┬──────────────────┤
│   Sidebar    │     Main Content          │   Right TOC      │
│   (240px)    │     (Flexible)            │   (240px)        │
│              │                           │                  │
│   Nav Tree   │   Article Content         │   "On this page" │
│              │                           │                  │
│              │                           │                  │
│              │                           │                  │
├──────────────┴───────────────────────────┴──────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout Breakpoints**:

- Desktop: `1024px+` - Full three-column layout
- Tablet: `768px-1023px` - Collapsible sidebar, no right TOC
- Mobile: `<768px` - Hamburger menu, stacked layout

### 2.2 Header Bar

**Structure**:

- Fixed position at top
- Height: `~64px`
- Background: Translucent with backdrop blur
- Border bottom: Subtle 1px border

**Left section**:

- Logo/Brand (SVG, dual theme variants)
- "Home" link
- "Docs" link (active state highlighted)

**Right section**:

- Search button (with `Ctrl+K` shortcut indicator)
- GitHub icon link
- Discord icon link
- Theme toggle (Light/Dark/Auto with dropdown)

### 2.3 Left Sidebar (Navigation)

**Dimensions**:

- Width: `240px` - `280px`
- Sticky position
- Full height scrollable
- Background: Slightly differentiated from main content

**Navigation structure**:

- Top-level items (bold, larger text)
- Collapsible groups (with expand/collapse icons)
- Nested sub-items (indented, smaller text)
- Active item highlighted (accent color background)
- Hover states on all items

**Visual elements**:

- Group headers: Uppercase or bold
- Active indicator: Left border accent or background highlight
- Icons: Chevrons for expandable groups (▼ / ▶)
- Padding: Generous internal padding for touch targets

### 2.4 Main Content Area

**Max width**: `~800px` - `900px` for optimal reading
**Padding**: `2rem` - `3rem` on sides
**Vertical spacing**: Generous (2rem+ between sections)

**Content flow**:

1. Page title (H1)
2. Optional description/subtitle
3. Horizontal rule separator (styled)
4. Content sections with H2-H6 hierarchy
5. Horizontal rules between major sections
6. Footer (Edit page / Report bug / Discord links)

### 2.5 Right Sidebar (Table of Contents)

**"On this page" section**:

- Width: `240px` - `280px`
- Sticky position
- Auto-generated from H2-H3 headings
- Active section highlighting (scrollspy)
- Smooth scroll on click
- Hover states
- Indented hierarchy for H3 under H2

---

## 3. Navigation Patterns

### 3.1 Sidebar Navigation Structure

**Observed hierarchy from OpenCode docs**:

```
- Intro (single item)
- Config (single item)
- Providers (single item)
- Enterprise (single item)
- Troubleshooting (single item)
- Migrating to 1.0 (single item)
- Usage (collapsible group)
  - TUI
  - CLI
  - IDE
  - Zen
  - Share
  - GitHub
  - GitLab
- Configure (collapsible group)
  - Tools
  - Rules
  - Agents
  - Models
  - Themes
  - Keybinds
  - Commands
  - Formatters
  - Permissions
  - LSP Servers
  - MCP servers
  - ACP Support
  - Custom Tools
- Develop (collapsible group)
  - SDK
  - Server
  - Plugins
```

**Key patterns**:

- Mix of single items and groups
- Groups can be expanded/collapsed
- 2-3 levels maximum depth
- Related items grouped logically
- Clear group labels

### 3.2 Breadcrumbs

Not explicitly visible, but URL structure suggests hierarchical navigation:

- `/docs/` - Root
- `/docs/category/` - Category
- `/docs/category/page/` - Nested page

### 3.3 Search Functionality

**Features**:

- Global search (Ctrl+K / Cmd+K)
- Modal overlay interface
- Instant results as you type
- Keyboard navigation (arrow keys, Enter)
- Fuzzy matching
- Result categories
- Keyboard shortcut hints

---

## 4. Component Inventory

### 4.1 Callout Boxes (Asides)

**Types**:

- **Tip**: Green/teal accent, lightbulb icon
- **Note**: Blue accent, info icon
- **Warning**: Yellow/orange accent, warning icon
- **Caution/Danger**: Red accent, alert icon

**Styling**:

- Left border accent (4px thick)
- Background: Subtle tint matching accent
- Icon: Top-left or inline with title
- Padding: Generous internal padding
- Rounded corners: `4px` - `8px`
- Title: Bold, optional

**Example structure**:

```
┌─ Tip ────────────────────────────┐
│ 💡 Title (optional)              │
│                                  │
│ Content text here...             │
└──────────────────────────────────┘
```

### 4.2 Code Blocks

**Features**:

- Syntax highlighting (Shiki or similar)
- Language indicator (top-right or inline)
- Copy button (top-right corner, appears on hover)
- Line numbers (optional)
- Line highlighting (optional)
- Filename/title (optional, above block)
- Dark theme by default

**Styling**:

- Background: Dark (`#1e1e1e` or similar)
- Border radius: `8px` - `12px`
- Padding: `1rem` - `1.5rem`
- Overflow: Horizontal scroll if needed
- Font: Monospace with ligatures

**Terminal blocks**:

- Special styling with "Terminal window" label
- `$` prompt indicator
- Different background shade

### 4.3 Tabs Component

**Structure**:

- Horizontal tab headers
- Active tab highlighted
- Content panels switch on click
- Common use: Package manager examples (npm, bun, pnpm, yarn)

**Styling**:

- Tab buttons: Rounded top corners
- Active: Accent underline or background
- Inactive: Muted text
- Smooth transition animations

### 4.4 Horizontal Rules

**Purpose**: Visual section breaks

**Styling**:

- Not a thin line, but significant spacing
- Light decorative line (1px, subtle color)
- Vertical margin: `2rem` - `3rem`
- Full width or inset

### 4.5 Links

**Internal links**:

- Accent color
- Underline on hover
- Smooth color transition

**External links**:

- May include external link icon
- Same styling as internal
- Opens in new tab (optional)

**"Edit this page" / "Find a bug" links**:

- Footer position
- Subtle styling
- Icon + text
- GitHub/Discord icons

### 4.6 Tables

**Styling**:

- Border or borderless design
- Alternating row backgrounds (striped)
- Sticky header (for long tables)
- Responsive: Horizontal scroll on mobile
- Padding: Generous cell padding

### 4.7 Lists

**Unordered lists**:

- Custom bullet: Accent colored disc or icon
- Nested indentation
- Spacing: `0.5rem` between items

**Ordered lists**:

- Numbered with accent color
- Same spacing as unordered

### 4.8 Badges/Pills

**Use cases**:

- Version indicators
- Status labels
- Category tags

**Styling**:

- Inline badges
- Rounded corners (`999px` / pill shape)
- Accent background with contrasting text
- Small font size

### 4.9 Images

**Styling**:

- Rounded corners
- Drop shadow (subtle)
- Max width: `100%`
- Centered or inline
- Optional caption below

---

## 5. Interactive Elements

### 5.1 Scroll Behavior

- Smooth scroll to anchors
- Sticky header (always visible)
- Sticky right TOC (desktop only)
- Active section highlighting in TOC (scrollspy)

### 5.2 Theme Toggle

**Options**:

- Light
- Dark
- Auto (system preference)

**Behavior**:

- Instant switch
- Persisted in localStorage
- No flash of unstyled content (FOUC)
- Icon changes based on mode

### 5.3 Hover States

**Consistent hover feedback**:

- Links: Underline + color change
- Buttons: Background color change
- Navigation items: Background highlight
- Code copy button: Opacity change

### 5.4 Focus States

**Accessibility**:

- Visible focus rings (accent color)
- Keyboard navigation support
- Skip to content link
- ARIA labels

---

## 6. Mobile Responsiveness

### 6.1 Mobile Layout Changes

**< 768px**:

- Hamburger menu for navigation
- Sidebar becomes overlay/drawer
- Right TOC hidden
- Stacked layout
- Larger touch targets
- Simplified header

### 6.2 Touch Interactions

- Swipe gestures for sidebar
- Tap to expand/collapse groups
- Pull-to-refresh (optional)

---

## 7. Custom Starlight Configuration Needed

### 7.1 Theme Customizations

**CSS Custom Properties** (likely overrides):

```css
:root {
  --sl-color-accent: <custom-blue>;
  --sl-font: <system-font-stack>;
  --sl-font-mono: 'Fira Code', 'Consolas', monospace;
  --sl-line-height: 1.6;
  --sl-content-width: 900px;
}
```

### 7.2 Component Overrides

**Components to customize**:

- Header: Add social links (GitHub, Discord)
- Footer: Add "Edit this page" and "Find a bug" links
- Sidebar: Custom styling for active states
- Code blocks: Add copy button, custom dark theme
- Search: Integrate search functionality (built-in Pagefind)

### 7.3 Plugins/Integrations

**Required**:

- Starlight core
- Pagefind (search) - built into Starlight
- Syntax highlighting (Shiki) - built into Starlight
- Dark mode toggle - built into Starlight

**Optional**:

- Analytics (Google Analytics) - custom integration needed
- Mermaid diagrams (if used in content)

---

## 8. Performance Characteristics

### 8.1 Observed Performance

- Fast page loads (< 1s)
- Minimal JavaScript
- Efficient asset loading
- Lazy loading for images
- Prefetching for navigation

### 8.2 Lighthouse Targets

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 9. Differences from Default Starlight

### 9.1 Visual Differences

1. **Header customization**: Social links positioned right
2. **Footer links**: Custom "Edit this page" and "Find a bug" links
3. **Color scheme**: Custom accent color
4. **Code blocks**: Enhanced styling with copy button
5. **Spacing**: More generous vertical spacing between sections

### 9.2 Structural Differences

1. **Navigation grouping**: Mix of single items and groups
2. **Search**: Prominent search with keyboard shortcut
3. **Theme toggle**: Three-option toggle (Light/Dark/Auto)

---

## 10. Brand Consistency Guidelines

### 10.1 OpenCode Branding Elements

**Logo**:

- SVG format
- Light and dark variants
- Positioned top-left in header
- Linked to home page

**Typography**:

- Clean, modern sans-serif
- Professional and readable
- Code-focused aesthetic

**Color philosophy**:

- Neutral base (grays, black, white)
- Single accent color for interaction
- Dark mode friendly

### 10.2 Warcraft Plugin Branding

**Differences to implement**:

- Use project-specific logo (if available) or placeholder
- Maintain OpenCode's clean aesthetic
- Custom accent color (if specified) or use default
- Project name in header: "Warcraft Notifications" or similar
- Social links: Project's GitHub (not OpenCode's)

---

## 11. Content Patterns

### 11.1 Page Structure Pattern

**Typical page flow**:

```markdown
---
title: Page Title
description: Page description for SEO
---

# Page Title

Brief introduction or overview.

---

## Section 1

Content...

:::tip
Helpful tip here
:::

---

## Section 2

More content...

### Subsection

Details...

---

## Next Steps

Links to related pages or actions.
```

### 11.2 Common Elements

- **Prerequisites sections**: Numbered lists with clear requirements
- **Code examples**: Abundant, with language tags
- **Tabs for options**: Package managers, platforms, etc.
- **Callouts**: Tips, notes, warnings used generously
- **Horizontal rules**: Clear visual section breaks
- **"Next Steps"**: End-of-page navigation suggestions

---

## 12. Implementation Checklist

### 12.1 Visual Parity

- [ ] Match color scheme (light and dark modes)
- [ ] Match typography (fonts, sizes, weights, line heights)
- [ ] Match spacing (margins, padding, gaps)
- [ ] Match border radius and shadows
- [ ] Match hover and focus states
- [ ] Match active navigation highlighting

### 12.2 Layout Parity

- [ ] Three-column layout on desktop
- [ ] Responsive breakpoints match
- [ ] Header structure and content
- [ ] Sidebar navigation structure
- [ ] Right TOC with scrollspy
- [ ] Footer with custom links

### 12.3 Component Parity

- [ ] Callout boxes (Tip, Note, Warning, Caution)
- [ ] Code blocks with syntax highlighting
- [ ] Code copy button
- [ ] Tabs component
- [ ] Horizontal rules with spacing
- [ ] Links (internal and external)
- [ ] Tables styling
- [ ] Lists styling
- [ ] Badges/pills (if used)
- [ ] Images with styling

### 12.4 Interactive Parity

- [ ] Search functionality (Ctrl+K)
- [ ] Theme toggle (Light/Dark/Auto)
- [ ] Smooth scroll to anchors
- [ ] Active section highlighting in TOC
- [ ] Collapsible navigation groups
- [ ] Mobile hamburger menu
- [ ] Keyboard navigation

### 12.5 Performance Parity

- [ ] Fast page loads
- [ ] Minimal JavaScript
- [ ] Optimized images
- [ ] Efficient CSS
- [ ] Lighthouse score 90+

---

## 13. Known Starlight Features to Leverage

### 13.1 Built-in Features

Starlight provides many features out-of-the-box:

- Responsive navigation
- Search (Pagefind)
- Dark mode
- Syntax highlighting (Shiki)
- Mobile-friendly layout
- SEO optimization
- Sitemap generation
- RSS feed (optional)

### 13.2 Configuration Options

**Starlight config** (`astro.config.mjs`):

```javascript
starlight({
  title: 'Project Name',
  logo: { src: './src/assets/logo.svg' },
  social: {
    github: 'https://github.com/user/repo',
    discord: 'https://discord.gg/invite',
  },
  editLink: {
    baseUrl: 'https://github.com/user/repo/edit/main/docs/',
  },
  sidebar: [
    /* navigation structure */
  ],
  customCss: ['./src/styles/custom.css'],
  head: [
    /* custom head tags for analytics */
  ],
});
```

---

## 14. Migration Priorities

### Priority 1 (Must Have)

- Core layout structure (three-column)
- Navigation sidebar with correct hierarchy
- Dark/light theme toggle
- Basic typography matching
- Code syntax highlighting
- Search functionality

### Priority 2 (Should Have)

- Exact color matching
- Callout boxes styling
- Right TOC with scrollspy
- Footer custom links
- Mobile responsiveness
- Code copy button

### Priority 3 (Nice to Have)

- Perfect spacing match
- Custom icons
- Advanced animations
- Performance optimizations
- Analytics integration

---

## Conclusion

The OpenCode documentation uses Astro/Starlight with thoughtful customizations for a clean, modern, developer-friendly experience. The design emphasizes:

1. **Readability**: Generous spacing, optimal line length, comfortable typography
2. **Navigation**: Clear hierarchy, persistent sidebar, contextual TOC
3. **Dark mode**: Full support with carefully chosen colors
4. **Performance**: Fast loads, minimal JavaScript, efficient assets
5. **Accessibility**: Keyboard navigation, focus states, ARIA labels
6. **Developer UX**: Code-first design, syntax highlighting, copy buttons

**Key Insight**: While Starlight provides most features out-of-the-box, customization focuses on:

- Brand-specific colors and logo
- Social links in header
- Custom footer links
- Navigation structure organization
- Spacing adjustments for visual comfort

**Recommendation**: Start with Starlight defaults and progressively enhance with custom CSS and component overrides rather than rebuilding from scratch. This approach ensures we maintain Starlight's excellent built-in features while achieving visual parity with OpenCode's design.

---

**Next Steps**: Use this analysis to create the MIGRATION_PLAN.md document with specific implementation steps.
