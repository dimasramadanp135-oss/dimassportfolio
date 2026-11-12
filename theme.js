/* ============================================================
   CENTRALIZED THEME MANAGEMENT — theme.js
   Handles theme switching, persistence, accessible labels,
   and cross-tab / cross-page synchronization.
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio-theme';
  const DEFAULT_THEME = 'light';

  /**
   * Get the current stored theme or fallback to default
   */
  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (e) {
      // localStorage may be unavailable in private browsing or restricted environments
    }
    return DEFAULT_THEME;
  }

  /**
   * Apply theme to the document and update UI
   * @param {string} theme - 'dark' | 'light'
   * @param {boolean} animate - whether to enable smooth transition
   */
  function applyTheme(theme, animate = false) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    const root = document.documentElement;

    if (animate) {
      root.classList.add('theme-transitioning');
    }

    root.setAttribute('data-theme', validTheme);

    try {
      localStorage.setItem(STORAGE_KEY, validTheme);
    } catch (e) {
      // Ignore storage errors
    }

    updateToggleButtons(validTheme);

    if (animate) {
      window.clearTimeout(root._themeTransitionTimer);
      root._themeTransitionTimer = window.setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 350);
    }
  }

  /**
   * Update accessibility attributes and titles on all toggle buttons
   * @param {string} currentTheme
   */
  function updateToggleButtons(currentTheme) {
    const isDark = currentTheme === 'dark';
    const label = isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap';
    const toggles = document.querySelectorAll('.theme-toggle');

    toggles.forEach((btn) => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.setAttribute('aria-pressed', isDark ? 'false' : 'true');
    });
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  }

  /**
   * Initialize theme toggle buttons and event listeners
   */
  function init() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    applyTheme(currentTheme, false);

    // Click handler with event delegation
    document.addEventListener('click', (event) => {
      const toggleBtn = event.target.closest('.theme-toggle');
      if (toggleBtn) {
        event.preventDefault();
        toggleTheme();
      }
    });

    // Synchronize theme changes across multiple tabs or windows
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
        applyTheme(event.newValue, true);
      }
    });
  }

  // Run immediately or on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose helper on window for debugging or manual triggering if needed
  window.__portfolioTheme = {
    get: getSavedTheme,
    set: (theme) => applyTheme(theme, true),
    toggle: toggleTheme,
  };
})();
