/**
 * Search Modal Functionality
 * Implements Ctrl+K / Cmd+K search with fuzzy matching
 */

(function () {
  'use strict';

  let searchModal = null;
  let searchInput = null;
  let searchResults = null;
  let searchData = [];
  let selectedIndex = -1;
  let currentResults = [];

  /**
   * Initialize search functionality
   */
  function initSearch() {
    searchModal = document.getElementById('search-modal');
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');

    if (!searchModal || !searchInput || !searchResults) {
      return;
    }

    // Load search data
    loadSearchData();

    // Set up keyboard shortcut (Ctrl+K / Cmd+K)
    document.addEventListener('keydown', handleGlobalKeydown);

    // Set up search button click
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
      searchButton.addEventListener('click', openSearchModal);
    }

    // Set up modal interactions
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keydown', handleSearchKeydown);

    // Close modal on backdrop click
    const backdrop = searchModal.querySelector('.search-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeSearchModal);
    }

    // Close on ESC key
    searchModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSearchModal();
      }
    });
  }

  /**
   * Load search data from Jekyll search.json
   */
  async function loadSearchData() {
    try {
      const baseUrl = document.querySelector('meta[name="baseurl"]')?.content || '';
      const response = await fetch(`${baseUrl}/search.json`);

      if (response.ok) {
        searchData = await response.json();
      } else {
        // Fallback: extract from current page
        searchData = extractPageData();
      }
    } catch (err) {
      console.warn('Could not load search data:', err);
      searchData = extractPageData();
    }
  }

  /**
   * Extract search data from current DOM
   * @returns {Array} Search data
   */
  function extractPageData() {
    const data = [];
    const pages = document.querySelectorAll('main .doc-content, main .home-content');

    pages.forEach((content) => {
      const headings = content.querySelectorAll('h1, h2, h3, h4');

      headings.forEach((heading) => {
        const id = heading.id;
        if (!id) return;

        // Get following text content until next heading
        let excerpt = '';
        let sibling = heading.nextElementSibling;

        while (sibling && !sibling.matches('h1, h2, h3, h4')) {
          excerpt += sibling.textContent + ' ';
          sibling = sibling.nextElementSibling;
          if (excerpt.length > 200) break;
        }

        data.push({
          title: heading.textContent,
          url: `#${id}`,
          excerpt: excerpt.trim().substring(0, 200),
          breadcrumb: document.title,
        });
      });
    });

    return data;
  }

  /**
   * Handle global keyboard shortcuts
   * @param {KeyboardEvent} e
   */
  function handleGlobalKeydown(e) {
    // Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
  }

  /**
   * Open search modal
   */
  function openSearchModal() {
    if (!searchModal) return;

    searchModal.classList.add('active');
    searchInput.focus();
    selectedIndex = -1;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close search modal
   */
  function closeSearchModal() {
    if (!searchModal) return;

    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = `
      <div class="search-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <p>Start typing to search...</p>
      </div>
    `;
    selectedIndex = -1;
    currentResults = [];
    document.body.style.overflow = '';
  }

  /**
   * Handle search input
   */
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>Start typing to search...</p>
        </div>
      `;
      currentResults = [];
      selectedIndex = -1;
      return;
    }

    // Fuzzy search
    currentResults = searchData
      .map((item) => {
        const titleMatch = fuzzyMatch(query, item.title.toLowerCase());
        const excerptMatch = fuzzyMatch(query, item.excerpt.toLowerCase());

        return {
          ...item,
          score: Math.max(titleMatch, excerptMatch * 0.5),
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    renderResults(query);
  }

  /**
   * Fuzzy match algorithm
   * @param {string} query
   * @param {string} text
   * @returns {number} Match score (0-1)
   */
  function fuzzyMatch(query, text) {
    let score = 0;
    let queryIndex = 0;
    let textIndex = 0;

    while (queryIndex < query.length && textIndex < text.length) {
      if (query[queryIndex] === text[textIndex]) {
        score += 1;
        queryIndex++;
      }
      textIndex++;
    }

    // Bonus for exact substring match
    if (text.includes(query)) {
      score += query.length * 2;
    }

    return score / query.length;
  }

  /**
   * Render search results
   * @param {string} query
   */
  function renderResults(query) {
    if (currentResults.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = currentResults
      .map((result, index) => {
        const highlightedTitle = highlightText(result.title, query);
        const highlightedExcerpt = highlightText(result.excerpt, query);

        return `
          <div class="search-result-item${index === selectedIndex ? ' selected' : ''}" data-index="${index}">
            <div class="search-result-title">${highlightedTitle}</div>
            ${result.breadcrumb ? `<div class="search-result-breadcrumb">${escapeHtml(result.breadcrumb)}</div>` : ''}
            <div class="search-result-excerpt">${highlightedExcerpt}</div>
          </div>
        `;
      })
      .join('');

    // Add click handlers
    searchResults.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        navigateToResult(index);
      });
    });
  }

  /**
   * Highlight matching text
   * @param {string} text
   * @param {string} query
   * @returns {string}
   */
  function highlightText(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escape HTML
   * @param {string} text
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Escape regex special characters
   * @param {string} text
   * @returns {string}
   */
  function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Handle keyboard navigation in search results
   * @param {KeyboardEvent} e
   */
  function handleSearchKeydown(e) {
    if (currentResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
        renderResults(searchInput.value.trim().toLowerCase());
        scrollToSelected();
        break;

      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        renderResults(searchInput.value.trim().toLowerCase());
        scrollToSelected();
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          navigateToResult(selectedIndex);
        }
        break;
    }
  }

  /**
   * Scroll to selected result
   */
  function scrollToSelected() {
    const selected = searchResults.querySelector('.search-result-item.selected');
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /**
   * Navigate to selected result
   * @param {number} index
   */
  function navigateToResult(index) {
    const result = currentResults[index];
    if (result) {
      window.location.href = result.url;
      closeSearchModal();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
