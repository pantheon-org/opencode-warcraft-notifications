/**
 * Theme toggle functionality (Dark/Light mode)
 */

(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'theme-preference';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  /**
   * Get the user's theme preference
   * Priority: localStorage > system preference > default (dark)
   */
  function getThemePreference() {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return stored;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return THEME_LIGHT;
    }

    // Default to dark theme
    return THEME_DARK;
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === THEME_DARK ? '#0d1117' : '#ffffff');
    }

    // Update Mermaid theme if present
    if (window.mermaid) {
      window.mermaid.initialize({
        theme: theme === THEME_DARK ? 'dark' : 'default',
      });

      // Re-render diagrams if any exist
      const diagrams = document.querySelectorAll('.mermaid');
      if (diagrams.length > 0) {
        window.mermaid.run();
      }
    }
  }

  /**
   * Save theme preference to localStorage
   */
  function saveThemePreference(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // localStorage might be unavailable (private browsing, etc.)
      console.warn('Could not save theme preference:', error);
    }
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;

    applyTheme(newTheme);
    saveThemePreference(newTheme);

    // Announce theme change to screen readers
    announceThemeChange(newTheme);
  }

  /**
   * Announce theme change for accessibility
   */
  function announceThemeChange(theme) {
    const announcement = theme === THEME_DARK ? 'Dark theme enabled' : 'Light theme enabled';

    // Create temporary announcement element
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;

    document.body.appendChild(announcer);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  /**
   * Watch for system theme changes
   */
  function watchSystemTheme() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

    // Handle theme change only if user hasn't set a preference
    const handleChange = (event) => {
      const hasStoredPreference = localStorage.getItem(THEME_STORAGE_KEY);
      if (!hasStoredPreference) {
        const newTheme = event.matches ? THEME_LIGHT : THEME_DARK;
        applyTheme(newTheme);
      }
    };

    // Listen for system theme changes
    try {
      mediaQuery.addEventListener('change', handleChange);
    } catch (error) {
      // Fallback for older browsers (deprecated but necessary for compatibility)
      try {
        // @ts-ignore - Using deprecated API for backwards compatibility
        mediaQuery.addListener(handleChange);
      } catch (e) {
        // No support for theme watching
        console.warn('System theme watching not supported');
      }
    }
  }

  /**
   * Initialize theme toggle
   */
  function init() {
    // Apply theme immediately (before page render if possible)
    const initialTheme = getThemePreference();
    applyTheme(initialTheme);

    // Set up theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);

      // Add keyboard support
      themeToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleTheme();
        }
      });
    }

    // Watch for system theme changes
    watchSystemTheme();
  }

  // Apply theme as early as possible to prevent flash
  applyTheme(getThemePreference());

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
