/**
 * Copy Code Button Functionality
 * Adds copy buttons to code blocks for easy copying
 */

(function () {
  'use strict';

  /**
   * Initialize copy buttons for all code blocks
   */
  function initCopyButtons() {
    // Find all code blocks (pre > code elements)
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;

      // Skip if button already exists
      if (pre.querySelector('.copy-code-button')) {
        return;
      }

      // Wrap in a container if not already wrapped
      if (!pre.parentElement.classList.contains('code-block-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      // Create copy button
      const button = createCopyButton();
      pre.parentElement.appendChild(button);

      // Add click handler
      button.addEventListener('click', () => {
        copyCode(codeBlock, button);
      });
    });
  }

  /**
   * Create a copy button element
   * @returns {HTMLButtonElement}
   */
  function createCopyButton() {
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.innerHTML = `
      <svg class="copy-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="4" y="4" width="8" height="10" rx="1" />
        <path d="M8 4V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2" />
      </svg>
      <span>Copy</span>
    `;
    return button;
  }

  /**
   * Copy code to clipboard
   * @param {HTMLElement} codeBlock - The code block element
   * @param {HTMLButtonElement} button - The copy button
   */
  async function copyCode(codeBlock, button) {
    const code = codeBlock.textContent;

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        showSuccess(button);
      } else {
        // Fallback for older browsers
        fallbackCopy(code);
        showSuccess(button);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
      showError(button);
    }
  }

  /**
   * Fallback copy method for older browsers
   * @param {string} text - Text to copy
   */
  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    // execCommand is deprecated but needed for older browser support
    try {
      document.execCommand('copy');
    } catch (err) {
      throw new Error('Fallback copy failed');
    }
    document.body.removeChild(textarea);
  }

  /**
   * Show success state on button
   * @param {HTMLButtonElement} button
   */
  function showSuccess(button) {
    const originalHTML = button.innerHTML;

    button.classList.add('copied');
    button.innerHTML = `
      <svg class="copy-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 8l3 3l7-7" />
      </svg>
      <span>Copied!</span>
    `;

    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = originalHTML;
    }, 2000);
  }

  /**
   * Show error state on button
   * @param {HTMLButtonElement} button
   */
  function showError(button) {
    const originalHTML = button.innerHTML;

    button.innerHTML = `
      <svg class="copy-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
      <span>Failed</span>
    `;

    setTimeout(() => {
      button.innerHTML = originalHTML;
    }, 2000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
