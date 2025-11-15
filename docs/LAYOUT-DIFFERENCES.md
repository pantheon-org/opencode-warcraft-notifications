# Form/Layout Differences: Local Docs vs OpenCode.ai

## Comparison Summary

Based on analyzing both sites, here are the **form and layout differences** (not content):

---

## ✅ **MATCHES** (Already Correct)

### Typography

- ✅ IBM Plex Mono font
- ✅ Font sizes (26px, 22px, 18px, 16px)
- ✅ Font weights (500 for headings)
- ✅ Line height (1.6875)

### Colors

- ✅ Dark mode HSL values match
- ✅ Light mode HSL values match
- ✅ Border colors match
- ✅ Background colors match

### Sidebar

- ✅ Active state with 2px left border
- ✅ Padding (4px 24px)
- ✅ Group labels uppercase
- ✅ Collapsed/expanded states

---

## ❌ **DIFFERENCES** (Need Fixing)

### 1. Header Structure ⚠️

**OpenCode Has:**

- Logo on left
- **"Home" and "Docs" links in center** (middle-group)
- Search, social icons, theme toggle on right

**Your Docs Has:**

- Logo on left
- **Missing "Home" and "Docs" navigation links**
- Search and theme toggle on right (correct)
- Only GitHub link (OpenCode has GitHub + Discord)

**Fix Needed:**

```javascript
// Add to astro.config.mjs header
// OR create custom header component with middle-group navigation
```

---

### 2. Logo Size

**OpenCode:**

- Logo: `width="234" height="42"` (larger, full wordmark)

**Your Docs:**

- Logo: `width="32" height="32"` (smaller icon only)

**Visual Impact:** OpenCode's logo is more prominent

---

### 3. Search Button Styling

**OpenCode:**

- Button has uppercase "SEARCH" text
- Keyboard shortcut displays "Ctrl+K" or "⌘K"
- Button background: `var(--color-background-weak)`

**Your Docs:**

- Button shows "Search" (normal case)
- Same keyboard shortcut display

**Minor difference** - text casing

---

### 4. Theme Toggle Visibility

**OpenCode:**

- Theme toggle is **hidden** (`starlight-theme-select { display: none; }`)
- Auto dark/light based on system preference only

**Your Docs:**

- Theme toggle is **visible** with dropdown
- Users can manually select Dark/Light/Auto

**Fix Needed:**

```css
/* Already in custom.css, should be working */
starlight-theme-select {
  display: none;
}
```

---

### 5. Social Icons

**OpenCode:**

- GitHub icon
- Discord icon
- Icon size: `--sl-icon-size: 1rem;`

**Your Docs:**

- GitHub icon only
- Missing Discord link

**Fix Needed:**

```javascript
// Add to astro.config.mjs social array
{
  icon: 'discord',
  label: 'Discord',
  href: 'https://YOUR_DISCORD_URL',
}
```

---

### 6. Middle Navigation Group (CRITICAL)

**OpenCode:**

```html
<div class="middle-group sl-flex">
  <a class="links" href="/">Home</a>
  <a class="links" href="/docs/">Docs</a>
</div>
```

**Your Docs:**

- **Missing entirely**

**Fix Needed:**

- Create custom Header component that includes middle-group
- OR add these links via Starlight's header slots

---

## 📊 **Layout Structure Comparison**

### Header Layout Order:

**OpenCode:**

```
[Logo] [Home|Docs] ...................... [GitHub|Discord] [Search]
   1        2                                    3            4
```

**Your Docs:**

```
[Logo] .................................. [GitHub] [Search] [Theme]
   1                                        2        3        4
```

---

## 🎯 **Priority Fixes**

### High Priority:

1. **Add "Home" and "Docs" navigation links** (middle-group)
2. **Hide theme toggle** (already in CSS, may need !important)
3. **Add Discord social icon**

### Medium Priority:

4. Update logo to larger size/wordmark
5. Make search button text uppercase

### Low Priority (Cosmetic):

6. Minor spacing adjustments

---

## 💡 **Recommended Implementation**

### Option 1: Custom Header Component (RECOMMENDED)

Create `docs/src/components/Header.astro`:

```astro
---
import Default from '@astrojs/starlight/components/Header.astro';
const base = import.meta.env.BASE_URL || '/';
---

<div class="header sl-flex">
  <div class="title-wrapper sl-flex">
    <Default {...Astro.props} />
  </div>

  <!-- Middle navigation group -->
  <div class="middle-group sl-flex">
    <a class="links" href="/">Home</a>
    <a class="links" href={`${base}`}>Docs</a>
  </div>

  <div class="sl-hidden md:sl-flex right-group">
    <Default {...Astro.props}>
      <slot />
    </Default>
  </div>
</div>

<style>
  .middle-group {
    display: flex;
    gap: 2rem;
    margin-left: 2rem;
  }

  .links {
    color: var(--sl-color-text);
    text-decoration: none;
    font-size: var(--sl-text-base);
    font-weight: 500;
  }

  .links:hover {
    color: var(--sl-color-text-accent);
  }
</style>
```

Then enable in `astro.config.mjs`:

```javascript
starlight({
  components: {
    Header: './src/components/Header.astro',
  },
  // ...
});
```

### Option 2: CSS-Only Approach

If you can't modify components, use CSS to hide/show elements:

```css
/* Hide theme toggle */
starlight-theme-select {
  display: none !important;
}
```

---

## 🔍 **Testing Checklist**

After implementing fixes:

- [ ] "Home" and "Docs" links visible in header
- [ ] Links properly navigate
- [ ] Theme toggle hidden
- [ ] Discord icon present
- [ ] Logo sized appropriately
- [ ] Layout matches OpenCode structure
- [ ] Mobile responsive (hamburger menu)

---

## 📝 **Notes**

- Content differences (page titles, descriptions, text) are **intentionally kept** as they're project-specific
- Focus is on **visual structure and layout** matching OpenCode
- Color scheme and typography already match perfectly ✅
- Main gap is **header navigation structure**
