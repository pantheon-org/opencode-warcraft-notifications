# OpenCode Documentation Style and Theme Analysis Report

Based on analysis of https://opencode.ai/docs

## Framework & Technology Stack

**Framework**: Astro v5.7.13 with Starlight v0.34.3 (documentation theme framework)

## Theme Configuration

### Color Scheme

- **Default Theme**: Dark mode by default (`data-theme="dark"`)
- **Theme Options**: Dark, Light, and Auto modes
- **Theme Storage**: Uses localStorage with key `starlight-theme`
- **System Preference Detection**: Respects `(prefers-color-scheme: light)` media query

### Core Color Variables

**Dark Mode Colors** (default):

- Background: Dark gray/black tones
- Text: White/light gray (`--sl-color-white`)
- Accent: Custom accent color (`--sl-color-text-accent`)
- Border: `--sl-color-gray-5`
- Hairline: `--sl-color-hairline-light`

**Badge Colors** (semantic):

- Default: `--sl-badge-default-*`
- Note: Blue (`--sl-color-blue`)
- Danger: Red (`--sl-color-red`)
- Success: Green (`--sl-color-green`)
- Caution: Orange (`--sl-color-orange`)
- Tip: Purple (`--sl-color-purple`)

## Layout Structure

### Main Page Grid

```
┌──────────────────────────────────────────────────┐
│ Header (Fixed)                                   │
├──────────┬─────────────────────────┬─────────────┤
│ Sidebar  │ Main Content            │ Right TOC   │
│ (Nav)    │                         │ (On Page)   │
│          │                         │             │
│          │                         │             │
└──────────┴─────────────────────────┴─────────────┘
```

### Header Component

- **Layout**: Flexbox container with three sections
  - **Left**: Logo with light/dark variants
  - **Middle**: Navigation links (Home, Docs)
  - **Right**: Social icons, search, theme selector

- **Logo Handling**:
  - SVG images with separate light/dark versions
  - Class-based visibility: `light:sl-hidden`, `dark:sl-hidden`
  - Dimensions: 234×42 pixels

- **Header Features**:
  - Sticky/fixed positioning
  - Social media icons (GitHub, Discord)
  - Search modal (keyboard shortcut: Ctrl/Cmd+K)
  - Theme selector dropdown

### Sidebar (Left Navigation)

**Structure**:

- Collapsible menu button for mobile (hamburger icon)
- Hierarchical navigation tree
- Top-level items and expandable sections
- Active page indication with `aria-current="page"`

**Styling Features**:

- Font size: `--sl-text-xs` to `--sl-text-base`
- Badge support for new/beta features
- Caret icons for expandable sections
- Sidebar state persistence using sessionStorage

**Responsive Behavior**:

- Desktop: Always visible
- Mobile: Toggle with hamburger menu
- Mobile menu overlay expands over content

### Main Content Area

**Typography**:

- Headings: `--sl-line-height-headings`
- Body text: `--sl-line-height` (standard line height)
- System fonts: `--sl-font-system-mono` for code
- Font sizes: `--sl-text-xs`, `--sl-text-sm`, `--sl-text-base`

**Content Components**:

1. **Page Header**:
   - H1 title with ID `_top`
   - Page description/subtitle

2. **Markdown Content** (`.sl-markdown-content`):
   - Code blocks with syntax highlighting
   - Terminal-style code blocks
   - Copy-to-clipboard buttons
   - Tab panels for multi-option content
   - Badges and callouts
   - Step-by-step guides with numbered styling

3. **Code Blocks**:
   - Framework: Expressive Code
   - Syntax highlighting with color variables
   - Terminal window styling
   - Line-by-line highlighting support
   - Copy button functionality

4. **Callouts/Asides**:
   - Types: Tip, Note, Caution, Success, Danger
   - Icon + title + content structure
   - Color-coded borders and backgrounds

### Right Sidebar (Table of Contents)

**Desktop Version**:

- Fixed position sidebar
- "On this page" heading
- Nested list structure
- Active section highlighting
- Auto-scroll to active heading

**Mobile Version**:

- Collapsible details/summary element
- Shows current section in collapsed state
- Dropdown with full TOC when expanded

## Component Styles

### Buttons & Links

**Link Buttons** (`.sl-link-button`):

- Border radius: `999rem` (pill shape)
- Padding: `.4375rem 1.125rem`
- Font size: `--sl-text-sm`
- Variants: primary, secondary, minimal

**Primary Button**:

- Background: `--sl-color-text-accent`
- Color: `--sl-color-black`

**Secondary Button**:

- Border: Inherited color
- Transparent background

### Tabs Component

**Structure**: `<starlight-tabs>` custom element

- Horizontal tab list
- Overflow-x scrolling on mobile
- Active tab indicator (bottom border)
- Accessible keyboard navigation

**Styling**:

- Active tab: Bold font, accent color border
- Inactive tabs: Gray color
- 2px border on bottom

### Badges

**Sizes**: Small, Medium, Large

- Small: `.125rem .25rem`
- Medium: `.175rem .35rem`
- Large: `.225rem .45rem`

**Border**: 1px solid, rounded corners (`.25rem`)

### Code Syntax Highlighting

**Color Scheme** (Dark):

- Keywords: `#B392F0` (purple)
- Strings: `#9ECBFF` (light blue)
- Numbers: `#79B8FF` (blue)
- Functions: `#B392F0` (purple)
- Comments: Gray tones

**Light Mode**: Adjusted contrast ratios

## Responsive Design

### Breakpoints

- Mobile: < 50em (800px)
- Tablet/Desktop: ≥ 50em

### Mobile Adaptations

- Hidden right sidebar (TOC moves to collapsible section)
- Hamburger menu for main navigation
- Collapsible mobile preferences panel
- Stacked social icons
- Full-width search

### Desktop Features

- Three-column layout
- Persistent sidebars
- Inline search bar
- Keyboard shortcuts displayed

## Interactive Features

### Search

- Modal overlay
- Keyboard shortcut (Ctrl/Cmd+K)
- Platform-specific key display (⌘ on Mac)
- Starlight search integration

### Theme Switching

- Dropdown selector
- Icons for each theme (sun, moon, monitor)
- Instant theme switching
- Preserved preference in localStorage

### Navigation State

- Sidebar scroll position persistence
- Expanded/collapsed state tracking
- Session storage for state preservation

### Accessibility

- ARIA labels throughout
- Keyboard navigation support
- Screen reader text (`.sr-only`)
- Semantic HTML structure
- Focus management

## Typography Scale

```css
--sl-text-xs: Extra small --sl-text-sm: Small --sl-text-base: Base/normal --sl-line-height: Standard
  line height --sl-line-height-headings: Heading line height;
```

## Spacing & Layout

**Container**: `.sl-container` - Max width with padding
**Flexbox**: `.sl-flex` - Used extensively for layout
**Grid**: Uses flexbox primarily, not CSS Grid

## Print Styles

- `.print:hidden` - Elements hidden in print
- Simplified layout for print media
- Query: `@media print`

## Icons

**System**: SVG icons with currentColor fill
**Size**: `--sl-icon-size: 1em` (relative to font size)
**Sources**: Built-in icon set (edit, GitHub, Discord, etc.)

## Animation & Transitions

- Minimal animation approach
- Smooth theme transitions
- Hover states on interactive elements
- No excessive motion (respects reduced motion preferences)

## Key CSS Custom Properties

```css
--sl-color-text-accent
--sl-color-bg-badge
--sl-color-border-badge
--sl-color-gray-5
--sl-color-white
--sl-color-black
--sl-font-system-mono
--sl-outline-offset-inside
```

## Implementation Recommendations

1. **Use Astro + Starlight** for easiest replication
2. **Implement dark mode first** as the primary theme
3. **Mobile-first approach** for responsive design
4. **Component-based architecture** for reusability
5. **CSS custom properties** for theming flexibility
6. **Semantic HTML** for accessibility
7. **Progressive enhancement** for JavaScript features

## Design Priorities

This design prioritizes:

- **Readability**: High contrast, generous spacing
- **Navigation**: Clear hierarchy, persistent sidebars
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Minimal JavaScript, efficient CSS
- **Developer Experience**: Code highlighting, copy buttons, search

## Meta Information

- **Generator**: Astro v5.7.13
- **Theme**: Starlight v0.34.3
- **Viewport**: Standard responsive viewport
- **Social Cards**: Dynamic Open Graph images
- **Sitemap**: Included at `/docs/sitemap-index.xml`
- **Favicon**: SVG format for scalability

## Additional Notes

- The site uses Starlight's built-in theming system
- Custom components are registered as web components
- State management uses browser storage APIs (localStorage, sessionStorage)
- Search functionality is provided by Starlight's integrated search
- The documentation is built with content collections in Astro
- Code examples use the Expressive Code integration
- Tab components sync across the page when using the same sync key
- The theme respects system preferences but allows manual override

## Footer Component

**Structure**:

- Three main sections: Edit/Issue links, Copyright, Last updated date
- Links to GitHub for editing and issues
- Discord community link
- Copyright notice with link to Anomaly
- Last updated timestamp with ISO date format

**Styling**:

- Flexbox layout with space-between
- Icon + text link pattern
- Gray text color for meta information
- Hover states on all links

## Code Block Features

**Expressive Code Integration**:

- Terminal window styling with header
- "Terminal window" screen reader text
- Language-specific syntax highlighting
- Copy button with "Copied!" feedback
- Line-by-line code display
- Support for inline highlighting with `<mark>` tags
- Frame variants: `.is-terminal` and `.not-content`

**Code Block CSS Classes**:

- `.expressive-code` - Wrapper container
- `.frame` - Code block frame
- `.is-terminal` - Terminal-style frame
- `.not-content` - Excludes from content flow styling
- `.ec-line` - Individual code line
- `.code` - Code content wrapper
- `.copy` - Copy button container

## Step-by-Step Guide Styling

**Implementation**: `.sl-steps` class

- Numbered bullets with counter CSS
- Vertical guide line connecting steps
- Configurable bullet size: `calc(var(--sl-line-height) * 1rem)`
- Bullet styling: circular with background and shadow
- Step spacing with bullet margin: `.375rem`

## Social Cards

- Dynamic Open Graph images generated via external service
- URL: `https://social-cards.sst.dev/opencode-docs/`
- Includes page title and description
- Used for both `og:image` and `twitter:image`

## Utility Classes

**Starlight Utility Classes**:

- `.sl-flex` - Flexbox container
- `.sl-container` - Content container with max-width
- `.sl-hidden` - Hidden element
- `.sl-block` - Block display
- `.sr-only` - Screen reader only text
- `.print:hidden` - Hidden in print media
- `.print:block` - Block display in print media

**Responsive Prefixes**:

- `md:sl-flex` - Flex display at medium breakpoint
- `md:sl-hidden` - Hidden at medium breakpoint
- `md:sl-block` - Block display at medium breakpoint
- `lg:sl-flex` - Flex display at large breakpoint
- `lg:sl-block` - Block display at large breakpoint
- `lg:sl-hidden` - Hidden at large breakpoint

**Theme-based Classes**:

- `light:sl-hidden` - Hidden in light mode
- `dark:sl-hidden` - Hidden in dark mode

## Navigation Attributes

**ARIA Attributes**:

- `aria-current="page"` for active navigation items
- `aria-expanded` for collapsible sections
- `aria-label` for semantic labeling
- `aria-labelledby` for connecting labels
- `aria-controls` for interactive elements
- `aria-selected` for tabs
- `aria-hidden` for decorative elements

**Data Attributes**:

- `data-theme="dark"` - Current theme
- `data-has-toc` - Page has table of contents
- `data-has-sidebar` - Page has sidebar
- `data-pagefind-body` - Search indexing target
- `data-open-modal` - Search modal trigger
- `data-close-modal` - Modal close trigger
- `data-index` - Sidebar restoration index
- `data-hash` - State persistence hash

## Custom Elements

**Web Components**:

- `<starlight-tabs>` - Tab component
- `<starlight-toc>` - Table of contents
- `<mobile-starlight-toc>` - Mobile TOC
- `<starlight-menu-button>` - Mobile menu toggle
- `<starlight-theme-select>` - Theme selector
- `<site-search>` - Search component
- `<sl-sidebar-state-persist>` - Sidebar state management
- `<sl-sidebar-restore>` - Sidebar restoration

## Page Structure Classes

**Content Hierarchy**:

- `.page` - Main page wrapper
- `.header` - Site header
- `.sidebar` - Left navigation sidebar
- `.sidebar-pane` - Sidebar container
- `.sidebar-content` - Sidebar content wrapper
- `.main-frame` - Main content frame
- `.main-pane` - Main content pane
- `.content-panel` - Content section
- `.right-sidebar` - Right table of contents
- `.right-sidebar-container` - TOC container
- `.right-sidebar-panel` - TOC panel

## Link Styling

**Navigation Links**:

- `.links` class for header navigation
- Underline on hover
- Active state styling
- Smooth color transitions

**Content Links**:

- Blue color (`--sl-color-text-accent`)
- Underline on hover
- No underline by default in body text
- Visited state styling
