import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeManager } from '../../js/modules/ThemeManager.js';

describe('ThemeManager.js', () => {
  let themeManager;
  
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
    document.body.innerHTML = '<select id="themeSelect"></select><div id="themeHint"></div>';
    themeManager = new ThemeManager();
  });
  
  describe('initialize', () => {
    it('should apply default dark theme', () => {
      themeManager.initialize();
      expect(localStorage.getItem('theme')).toBeTruthy();
    });
  });
  
  describe('applyTheme', () => {
    it('should apply theme to body', () => {
      themeManager.applyTheme('light');
      expect(document.body.classList.contains('light')).toBe(true);
    });
    
    it('should save theme to localStorage', () => {
      themeManager.applyTheme('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });
  
  describe('getCurrentTheme', () => {
    it('should return current theme', () => {
      themeManager.applyTheme('light');
      expect(themeManager.getCurrentTheme()).toBe('light');
    });
  });
  
  describe('getThemeDescription', () => {
    it('should return theme description', () => {
      const desc = themeManager.getThemeDescription('dark');
      expect(typeof desc).toBe('string');
    });
  });
});
