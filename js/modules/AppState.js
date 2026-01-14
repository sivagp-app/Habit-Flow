/**
 * AppState Module
 * Central state container with observer pattern
 * Phase 2B - State Management
 * 
 * This replaces all global variables and provides controlled access to state
 */

export class AppState {
    constructor() {
        // Private state (use # for true private fields)
        this._habits = [];
        this._completions = {};
        this._settings = {
            adhdMode: false,
            focusMode: false,
            notificationsEnabled: false
        };
        
        // Observer pattern for state changes
        this._observers = [];
    }
    
    // ============================================================================
    // HABITS GETTERS & SETTERS
    // ============================================================================
    
    /**
     * Get all habits (returns copy to prevent external modifications)
     */
    getHabits() {
        return [...this._habits];
    }
    
    /**
     * Set habits array
     */
    setHabits(habits) {
        this._habits = habits;
        this._notify('habitsChanged', habits);
    }
    
    /**
     * Add a single habit
     */
    addHabit(habit) {
        this._habits.push(habit);
        this._notify('habitAdded', habit);
        this._notify('habitsChanged', this._habits);
    }
    
    /**
     * Update a habit
     */
    updateHabit(habitId, updates) {
        const habit = this._habits.find(h => h.id === habitId);
        if (habit) {
            Object.assign(habit, updates);
            this._notify('habitUpdated', habit);
            this._notify('habitsChanged', this._habits);
        }
    }
    
    /**
     * Remove a habit
     */
    removeHabit(habitId) {
        const index = this._habits.findIndex(h => h.id === habitId);
        if (index !== -1) {
            const removed = this._habits.splice(index, 1)[0];
            this._notify('habitRemoved', removed);
            this._notify('habitsChanged', this._habits);
        }
    }
    
    /**
     * Get single habit by ID
     */
    getHabit(habitId) {
        return this._habits.find(h => h.id === habitId);
    }
    
    // ============================================================================
    // COMPLETIONS GETTERS & SETTERS
    // ============================================================================
    
    /**
     * Get all completions (returns copy)
     */
    getCompletions() {
        return JSON.parse(JSON.stringify(this._completions));
    }
    
    /**
     * Set completions object
     */
    setCompletions(completions) {
        this._completions = completions;
        this._notify('completionsChanged', completions);
    }
    
    /**
     * Get completions for a specific habit
     */
    getHabitCompletions(habitId) {
        return this._completions[habitId] || {};
    }
    
    /**
     * Set completion for a habit on a specific date
     */
    setCompletion(habitId, date, completion) {
        if (!this._completions[habitId]) {
            this._completions[habitId] = {};
        }
        this._completions[habitId][date] = completion;
        this._notify('completionUpdated', { habitId, date, completion });
        this._notify('completionsChanged', this._completions);
    }
    
    /**
     * Get completion for a habit on a specific date
     */
    getCompletion(habitId, date) {
        return this._completions[habitId]?.[date] || null;
    }
    
    /**
     * Remove all completions for a habit (used when deleting habit)
     */
    removeHabitCompletions(habitId) {
        delete this._completions[habitId];
        this._notify('completionsChanged', this._completions);
    }
    
    // ============================================================================
    // SETTINGS GETTERS & SETTERS
    // ============================================================================
    
    /**
     * Get all settings
     */
    getSettings() {
        return { ...this._settings };
    }
    
    /**
     * Set all settings
     */
    setSettings(settings) {
        this._settings = { ...this._settings, ...settings };
        this._notify('settingsChanged', this._settings);
    }
    
    /**
     * Get specific setting
     */
    getSetting(key) {
        return this._settings[key];
    }
    
    /**
     * Set specific setting
     */
    setSetting(key, value) {
        const oldValue = this._settings[key];
        this._settings[key] = value;
        this._notify('settingChanged', { key, value, oldValue });
        this._notify('settingsChanged', this._settings);
    }
    
    /**
     * ADHD Mode
     */
    isADHDMode() {
        return this._settings.adhdMode;
    }
    
    setADHDMode(enabled) {
        this.setSetting('adhdMode', enabled);
    }
    
    /**
     * Focus Mode
     */
    isFocusMode() {
        return this._settings.focusMode;
    }
    
    setFocusMode(enabled) {
        this.setSetting('focusMode', enabled);
    }
    
    /**
     * Notifications
     */
    areNotificationsEnabled() {
        return this._settings.notificationsEnabled;
    }
    
    setNotificationsEnabled(enabled) {
        this.setSetting('notificationsEnabled', enabled);
    }
    
    // ============================================================================
    // OBSERVER PATTERN
    // ============================================================================
    
    /**
     * Subscribe to state changes
     * @param {string} event - Event name (e.g., 'habitsChanged', 'completionUpdated')
     * @param {Function} callback - Function to call when event occurs
     * @returns {Function} Unsubscribe function
     */
    subscribe(event, callback) {
        this._observers.push({ event, callback });
        
        // Return unsubscribe function
        return () => {
            this._observers = this._observers.filter(
                observer => observer.callback !== callback
            );
        };
    }
    
    /**
     * Notify observers of state change
     */
    _notify(event, data) {
        this._observers
            .filter(observer => observer.event === event || observer.event === '*')
            .forEach(observer => {
                try {
                    observer.callback(data, event);
                } catch (error) {
                    console.error(`Error in observer callback for ${event}:`, error);
                }
            });
    }
    
    // ============================================================================
    // UTILITY METHODS
    // ============================================================================
    
    /**
     * Get current state snapshot (for debugging)
     */
    getSnapshot() {
        return {
            habits: this.getHabits(),
            completions: this.getCompletions(),
            settings: this.getSettings()
        };
    }
    
    /**
     * Reset all state (for testing or reset functionality)
     */
    reset() {
        this._habits = [];
        this._completions = {};
        this._settings = {
            adhdMode: false,
            focusMode: false,
            notificationsEnabled: false
        };
        this._notify('stateReset', null);
    }
}
