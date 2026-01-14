/**
 * Storage Service Module
 * Handles all localStorage operations with error handling
 * Phase 2A - Modular Architecture
 */

export class StorageService {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    
    /**
     * Load habits from localStorage
     * Returns array of habit objects
     */
    loadHabits() {
        try {
            const savedHabits = localStorage.getItem('habits');
            if (savedHabits) {
                let habits = JSON.parse(savedHabits);
                
                // Migrate old habits to new format
                habits = habits.map(habit => {
                    if (!habit.trackingType) {
                        return {
                            ...habit,
                            trackingType: 'simple',
                            unit: null,
                            dailyGoal: null,
                            color: habit.categoryColor || '#3b82f6'
                        };
                    }
                    return habit;
                });
                
                return habits;
            }
            return [];
        } catch (error) {
            console.error('Error loading habits:', error);
            if (this.notificationService) {
                this.notificationService.error('Could not load habits. Starting fresh.');
            }
            return [];
        }
    }
    
    /**
     * Save habits to localStorage
     */
    saveHabits(habits) {
        try {
            localStorage.setItem('habits', JSON.stringify(habits));
            return true;
        } catch (error) {
            console.error('Error saving habits:', error);
            
            if (error.name === 'QuotaExceededError') {
                if (this.notificationService) {
                    this.notificationService.error('Storage full! Please export your data and clear some habits.');
                }
            } else {
                if (this.notificationService) {
                    this.notificationService.error('Could not save data. Please try again.');
                }
            }
            return false;
        }
    }
    
    /**
     * Load completions from localStorage
     * Returns object mapping habitId -> date -> completion data
     */
    loadCompletions() {
        try {
            const savedCompletions = localStorage.getItem('habitCompletions');
            if (savedCompletions) {
                let habitCompletions = JSON.parse(savedCompletions);
                
                // Migrate old completions to new format
                Object.keys(habitCompletions).forEach(habitId => {
                    Object.keys(habitCompletions[habitId]).forEach(date => {
                        const completion = habitCompletions[habitId][date];
                        if (typeof completion === 'boolean') {
                            habitCompletions[habitId][date] = {
                                completed: completion,
                                value: completion ? 1 : 0,
                                entries: []
                            };
                        }
                    });
                });
                
                return habitCompletions;
            }
            return {};
        } catch (error) {
            console.error('Error loading completions:', error);
            if (this.notificationService) {
                this.notificationService.error('Could not load history. Starting fresh.');
            }
            return {};
        }
    }
    
    /**
     * Save completions to localStorage
     */
    saveCompletions(completions) {
        try {
            localStorage.setItem('habitCompletions', JSON.stringify(completions));
            return true;
        } catch (error) {
            console.error('Error saving completions:', error);
            
            if (error.name === 'QuotaExceededError') {
                if (this.notificationService) {
                    this.notificationService.error('Storage full! Please export your data.');
                }
            } else {
                if (this.notificationService) {
                    this.notificationService.error('Could not save history. Please try again.');
                }
            }
            return false;
        }
    }
    
    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            return {
                adhdMode: localStorage.getItem('adhd_mode') === 'true',
                focusMode: localStorage.getItem('focus_mode') === 'true',
                notificationsEnabled: localStorage.getItem('notifications_enabled') === 'true'
            };
        } catch (error) {
            console.error('Error loading settings:', error);
            return {
                adhdMode: false,
                focusMode: false,
                notificationsEnabled: false
            };
        }
    }
    
    /**
     * Save individual setting
     */
    saveSetting(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error(`Error saving setting ${key}:`, error);
            return false;
        }
    }
    
    /**
     * Clear all data (for reset functionality)
     */
    clearAll() {
        try {
            localStorage.removeItem('habits');
            localStorage.removeItem('habitCompletions');
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }
}
