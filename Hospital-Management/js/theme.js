/**
 * Theme Management - Dark/Light Mode Toggle
 */

const ThemeManager = {
  init() {
    this.theme = localStorage.getItem('hms-theme') || 'light';
    this.applyTheme();
    this.bindEvents();
  },

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateToggleIcon();
  },

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('hms-theme', this.theme);
    this.applyTheme();
  },

  updateToggleIcon() {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
      }
    });
  },

  bindEvents() {
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => this.toggle());
    });
  }
};

document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
