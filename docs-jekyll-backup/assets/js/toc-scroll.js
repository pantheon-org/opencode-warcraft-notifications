/**
 * Table of Contents Scroll Highlighting
 * Highlights the current section in the TOC as user scrolls
 */

(function () {
  'use strict';

  let observer = null;
  let tocLinks = [];
  let headings = [];

  /**
   * Initialize TOC scroll highlighting
   */
  function initTocHighlighting() {
    const toc = document.querySelector('.toc');
    if (!toc) return;

    // Get all TOC links and their corresponding headings
    tocLinks = Array.from(toc.querySelectorAll('.toc-link'));
    if (tocLinks.length === 0) return;

    // Get all heading IDs from TOC links
    const headingIds = tocLinks
      .map((link) => {
        const href = link.getAttribute('href');
        return href ? href.substring(1) : null;
      })
      .filter(Boolean);

    // Get all corresponding heading elements
    headings = headingIds.map((id) => document.getElementById(id)).filter(Boolean);

    if (headings.length === 0) return;

    // Use Intersection Observer for efficient scroll detection
    setupIntersectionObserver();

    // Highlight first item on load if at top of page
    if (window.scrollY < 100) {
      highlightTocItem(0);
    }
  }

  /**
   * Set up Intersection Observer to watch headings
   */
  function setupIntersectionObserver() {
    const options = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const index = headings.findIndex((heading) => heading.id === id);
          if (index !== -1) {
            highlightTocItem(index);
          }
        }
      });
    }, options);

    // Observe all headings
    headings.forEach((heading) => {
      observer.observe(heading);
    });
  }

  /**
   * Highlight a TOC item by index
   * @param {number} index - Index of the TOC link to highlight
   */
  function highlightTocItem(index) {
    // Remove active class from all links
    tocLinks.forEach((link) => {
      link.classList.remove('active');
    });

    // Add active class to current link
    if (tocLinks[index]) {
      tocLinks[index].classList.add('active');

      // Scroll TOC to make active item visible
      scrollTocIntoView(tocLinks[index]);
    }
  }

  /**
   * Scroll TOC to make active item visible
   * @param {HTMLElement} activeLink - The active TOC link
   */
  function scrollTocIntoView(activeLink) {
    const toc = document.querySelector('.right-sidebar');
    if (!toc) return;

    const tocRect = toc.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    // Check if link is outside visible area
    if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
      activeLink.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }

  /**
   * Clean up observers
   */
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTocHighlighting);
  } else {
    initTocHighlighting();
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', cleanup);
})();
