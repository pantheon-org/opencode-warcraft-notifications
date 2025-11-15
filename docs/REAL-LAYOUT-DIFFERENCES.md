# CRITICAL Layout Differences - OpenCode vs Your Docs

## THE MAIN PROBLEM: Content Width and Layout Structure

After comparing the actual rendered pages, here are the **REAL layout issues**:

---

## 1. 🎯 MAIN CONTENT AREA - WRONG WIDTH

### OpenCode Layout:

- **No right sidebar on main pages** (intro page)
- Content spans **full width** (minus left sidebar)
- Table of Contents is in a **collapsible mobile-style TOC** at the top
- Much more spacious, readable layout

### Your Docs Layout:

- **Right sidebar always visible** with Table of Contents
- Content is **constrained** to narrow column
- Three-column layout: Left Sidebar | Content | Right TOC Sidebar
- Feels cramped

**This is the #1 visual difference!**

---

## 2. 📐 PAGE STRUCTURE

### OpenCode:

```
┌──────────────────────────────────────────────────┐
│ Header: [Logo] [Home|Docs] ... [GitHub|Discord] │
├────────┬─────────────────────────────────────────┤
│        │                                         │
│ Left   │         FULL WIDTH CONTENT             │
│ Nav    │         (no right sidebar)              │
│        │                                         │
│        │  Mobile TOC at top (collapsible)       │
│        │                                         │
└────────┴─────────────────────────────────────────┘
```

### Your Docs:

```
┌──────────────────────────────────────────────────┐
│ Header: [Logo] ... [GitHub] [Search] [Theme]    │
├────────┬────────────────────┬────────────────────┤
│        │                    │                    │
│ Left   │  NARROW CONTENT    │   Right TOC       │
│ Nav    │  (cramped)         │   Sidebar         │
│        │                    │                    │
└────────┴────────────────────┴────────────────────┘
```

---

## 3. 🔍 SIDEBAR DIFFERENCES

### OpenCode Sidebar:

- Flat top-level items: "Intro", "Config", "Providers", etc.
- Groups: "Usage", "Configure", "Develop" (collapsed by default)
- **Much simpler, cleaner** hierarchy
- No nested sub-items visible at first

### Your Docs Sidebar:

- "Intro", "Documentation Map", "Quick Reference", etc.
- Groups: "Usage", "Configure", "Develop", "Workflows"
- **Workflows group has many nested items** (overly complex)
- More visual noise

---

## 4. 📱 MOBILE TOC PLACEMENT

### OpenCode:

- Collapsible "On this page" at **top of content**
- Shows/hides on mobile
- Doesn't take permanent space

### Your Docs:

- Fixed **right sidebar** on desktop
- Hamburger menu on mobile
- Always takes up space

---

## 5. 📊 CONTENT DENSITY

### OpenCode:

- **Wider paragraphs** (more characters per line)
- More whitespace
- Easier to read
- Content feels "breathable"

### Your Docs:

- **Narrower paragraphs** (squeezed between sidebars)
- Less whitespace
- Harder to scan
- Content feels "cramped"

---

## 6. 🎨 HEADER LAYOUT (CONFIRMED)

### OpenCode:

```
[Logo Wordmark] [Home] [Docs] ........... [GitHub] [Discord] [Search]
     234x42        nav links              social    social    button
```

### Your Docs:

```
[Small Logo] ............................ [GitHub] [Search] [Theme]
    32x32                                 social   button   dropdown
```

**Missing:**

- Home/Docs navigation links
- Discord icon
- Larger logo

---

## 🔧 REQUIRED FIXES (Priority Order)

### 1. **REMOVE RIGHT SIDEBAR** (CRITICAL)

The right TOC sidebar should be:

- Hidden on main content pages
- Replaced with mobile-style collapsible TOC at top
- Only show in Starlight's "aside" slot if explicitly needed

### 2. **WIDEN CONTENT AREA**

- Content should span full width (minus left sidebar only)
- Remove the 3-column constraint
- Match OpenCode's spacious layout

### 3. **SIMPLIFY SIDEBAR**

- Flatten "Workflows" section or hide by default
- Match OpenCode's cleaner hierarchy
- Consider removing "Documentation Map" (meta-documentation)

### 4. **ADD HEADER NAVIGATION**

- Add "Home" and "Docs" links in center
- Add Discord social icon
- Use larger logo (wordmark)

### 5. **HIDE THEME TOGGLE**

- Already in CSS, confirm it's working

---

## 💡 CSS FIX APPROACH

Add to `custom.css`:

```css
/* HIDE RIGHT SIDEBAR (CRITICAL FIX) */
.right-sidebar-container {
  display: none !important;
}

/* EXPAND CONTENT TO FULL WIDTH */
@media (min-width: 72rem) {
  .main-pane {
    max-width: none !important;
  }

  .content-panel {
    max-width: 48rem !important;
    margin: 0 auto !important;
  }
}

/* SHOW MOBILE TOC ON ALL SCREENS */
.lg\\:sl-hidden {
  display: block !important;
}

mobile-starlight-toc {
  display: block !important;
}
```

---

## 🎯 STARLIGHT CONFIG FIX

In `astro.config.mjs`, disable right sidebar:

```javascript
starlight({
  // ...
  tableOfContents: {
    minHeadingLevel: 2,
    maxHeadingLevel: 3,
  },
  // Disable automatic right sidebar
  sidebar: {
    // your current sidebar config
  },
});
```

---

## 📸 KEY VISUAL DIFFERENCE

**OpenCode:** Wide, spacious, single-column content  
**Your Docs:** Narrow, cramped, three-column layout

The right sidebar TOC is **killing your layout**. OpenCode doesn't use it on their main pages.

---

## ✅ ACTION ITEMS

1. [ ] Hide right TOC sidebar completely
2. [ ] Expand content width to fill available space
3. [ ] Add mobile-style TOC at top of content
4. [ ] Add Home/Docs navigation to header
5. [ ] Add Discord icon
6. [ ] Simplify sidebar groupings
7. [ ] Use larger logo

**The #1 issue is the right sidebar.** Fix that first!
