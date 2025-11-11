/**
 * Navigation functionality for sidebar and mobile menu
 */

(function () {
  'use strict';

  // Get DOM elements
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const body = document.body;

  /**
   * Toggle mobile menu open/closed
   */
  function toggleMobileMenu() {
    const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';

    mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    body.style.overflow = isOpen ? '' : 'hidden';
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    body.style.overflow = '';
  }

  /**
   * Handle active navigation link highlighting
   */
  function updateActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach((link) => {
      const linkPath = new URL(link.href).pathname;

      // Exact match for active link
      if (linkPath === currentPath) {
        link.classList.add('active');

        // Open parent details element if nested
        const parentDetails = link.closest('details');
        if (parentDetails) {
          parentDetails.open = true;
        }
      }
    });
  }

  /**
   * Smooth scroll to anchor with offset for fixed header
   */
  function smoothScrollToAnchor(anchor) {
    const target = document.querySelector(anchor);
    if (target) {
      const headerHeight = 60; // var(--header-height)
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }

  /**
   * Handle anchor link clicks
   */
  function handleAnchorClick(event) {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      event.preventDefault();
      smoothScrollToAnchor(href);
      history.pushState(null, '', href);
    }
  }

  /**
   * Update active TOC link on scroll
   */
  function updateActiveTocLink() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;

    const scrollPosition = window.scrollY + 100;

    // Find all visible headings
    const headings = Array.from(document.querySelectorAll('h2[id], h3[id]'));

    let activeHeading = null;
    for (const heading of headings) {
      if (heading.offsetTop <= scrollPosition) {
        activeHeading = heading;
      } else {
        break;
      }
    }

    // Update active link
    tocLinks.forEach((link) => {
      link.classList.remove('active');

      if (activeHeading) {
        const href = link.getAttribute('href');
        if (href === `#${activeHeading.id}`) {
          link.classList.add('active');
        }
      }
    });
  }

  /**
   * Initialize navigation
   */
  function init() {
    // Mobile menu toggle
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking overlay
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Handle anchor links
    document.addEventListener('click', handleAnchorClick);

    // Update active nav links on load
    updateActiveNavLinks();

    // Update active TOC link on scroll (throttled)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveTocLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial TOC update
    updateActiveTocLink();

    // Handle smooth scroll to anchor on page load
    if (window.location.hash) {
      setTimeout(() => {
        smoothScrollToAnchor(window.location.hash);
      }, 100);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
