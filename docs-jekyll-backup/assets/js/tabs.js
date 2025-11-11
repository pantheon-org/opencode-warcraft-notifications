/**
 * Tab Component Functionality
 * Enables tabbed content with localStorage persistence
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'docs-tab-preferences';

  /**
   * Initialize all tab components on the page
   */
  function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');

    tabContainers.forEach((container, index) => {
      const buttons = container.querySelectorAll('.tab-button');
      const panels = container.querySelectorAll('.tab-panel');

      if (!buttons.length || !panels.length) return;

      const tabGroupId = container.dataset.tabGroup || `tab-group-${index}`;
      container.dataset.tabGroup = tabGroupId;

      // Set up button click handlers
      buttons.forEach((button, buttonIndex) => {
        button.addEventListener('click', () => {
          switchTab(container, buttonIndex, tabGroupId);
        });

        // Add keyboard navigation
        button.addEventListener('keydown', (e) => {
          handleKeyboard(e, buttons, buttonIndex, container, tabGroupId);
        });
      });

      // Initialize with saved preference or first tab
      const savedTab = getSavedTab(tabGroupId);
      const initialTab = savedTab !== null && savedTab < buttons.length ? savedTab : 0;
      switchTab(container, initialTab, tabGroupId, false);
    });
  }

  /**
   * Switch to a specific tab
   * @param {HTMLElement} container - Tab container element
   * @param {number} index - Tab index to switch to
   * @param {string} tabGroupId - Unique identifier for this tab group
   * @param {boolean} save - Whether to save preference
   */
  function switchTab(container, index, tabGroupId, save = true) {
    const buttons = container.querySelectorAll('.tab-button');
    const panels = container.querySelectorAll('.tab-panel');

    // Deactivate all tabs
    buttons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });

    panels.forEach((panel) => {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
    });

    // Activate selected tab
    if (buttons[index] && panels[index]) {
      buttons[index].classList.add('active');
      buttons[index].setAttribute('aria-selected', 'true');
      buttons[index].setAttribute('tabindex', '0');

      panels[index].classList.add('active');
      panels[index].setAttribute('aria-hidden', 'false');

      // Save preference if requested
      if (save) {
        saveTab(tabGroupId, index);
      }
    }
  }

  /**
   * Handle keyboard navigation in tabs
   * @param {KeyboardEvent} e - Keyboard event
   * @param {NodeList} buttons - Tab buttons
   * @param {number} currentIndex - Current tab index
   * @param {HTMLElement} container - Tab container
   * @param {string} tabGroupId - Tab group ID
   */
  function handleKeyboard(e, buttons, currentIndex, container, tabGroupId) {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = buttons.length - 1;
        break;
      default:
        return;
    }

    switchTab(container, newIndex, tabGroupId);
    buttons[newIndex].focus();
  }

  /**
   * Save tab preference to localStorage
   * @param {string} tabGroupId - Tab group ID
   * @param {number} index - Tab index
   */
  function saveTab(tabGroupId, index) {
    try {
      const preferences = getPreferences();
      preferences[tabGroupId] = index;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (err) {
      // localStorage might be disabled
      console.warn('Could not save tab preference:', err);
    }
  }

  /**
   * Get saved tab preference
   * @param {string} tabGroupId - Tab group ID
   * @returns {number|null} Saved tab index or null
   */
  function getSavedTab(tabGroupId) {
    try {
      const preferences = getPreferences();
      return preferences[tabGroupId] !== undefined ? preferences[tabGroupId] : null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get all tab preferences from localStorage
   * @returns {Object} Preferences object
   */
  function getPreferences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (err) {
      return {};
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTabs);
  } else {
    initTabs();
  }

  // Re-initialize tabs when content changes (for dynamic content)
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          initTabs();
        }
      });
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });
    } else {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
})();
