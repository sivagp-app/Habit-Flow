/**
 * Theme Manager Module
 * Handles theme switching and persistence
 * Phase 2A - Modular Architecture
 */

export class ThemeManager {
    constructor(storageService, notificationService) {
        this.storageService = storageService;
        this.notificationService = notificationService;
        this.currentTheme = 'dark';
        
        this.themeDescriptions = {
            'dark': 'Dark theme active - Easy on eyes at night',
            'light-ocean': 'Ocean Blue - Professional and focused',
            'light-serenity': 'Serenity - Gentle & soothing therapeutic palette',
            'light-dawn': 'Dawn - Fresh start with warm optimism',
            'light-harmony': 'Harmony - Wellness-focused calming colors',
            'light-mist': 'Mist - Ultra calm minimal stimulation'
        };
    }
    
    /**
     * Initialize theme system
     * Loads saved theme and applies it
     */
    initialize() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(savedTheme);
        
        // Set dropdown value if element exists
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = savedTheme;
        }
    }
    
    /**
     * Apply a theme to the page
     */
    applyTheme(themeName) {
        // Remove all theme classes
        document.body.classList.remove(
            'light-ocean',
            'light-serenity',
            'light-dawn',
            'light-harmony',
            'light-mist'
        );
        
        // Apply selected theme (dark is default, no class needed)
        if (themeName !== 'dark') {
            document.body.classList.add(themeName);
        }
        
        // Update hint text if element exists
        const themeHint = document.getElementById('themeHint');
        if (themeHint) {
            themeHint.textContent = this.themeDescriptions[themeName] || 'Theme active';
        }
        
        // Store current theme
        const previousTheme = this.currentTheme;
        this.currentTheme = themeName;
        
        // Save to storage
        localStorage.setItem('theme', themeName);
        
        return previousTheme !== themeName; // Return true if theme changed
    }
    
    /**
     * Get current theme name
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    /**
     * Get theme description
     */
    getThemeDescription(themeName) {
        return this.themeDescriptions[themeName] || 'Theme';
    }
    
    /**
     * Get all available themes
     */
    getAvailableThemes() {
        return Object.keys(this.themeDescriptions);
    }
}
