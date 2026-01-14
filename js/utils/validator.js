/**
 * Validator Utility Module
 * Provides comprehensive validation for habit data and tracking values
 * Phase 2A - Modular Architecture
 */

export const Validator = {
    /**
     * Validate habit object
     * Returns { valid: boolean, errors: string[] }
     */
    habit(habit) {
        const errors = [];
        
        // Name validation
        if (!habit.name || habit.name.trim().length === 0) {
            errors.push('Habit name is required');
        } else if (habit.name.length > 100) {
            errors.push('Habit name must be 100 characters or less');
        }
        
        // Icon validation
        if (!habit.icon) {
            errors.push('Please select an icon');
        }
        
        // Tracking type validation
        const validTypes = ['simple', 'quantity', 'duration'];
        if (!validTypes.includes(habit.trackingType)) {
            errors.push('Invalid tracking type');
        }
        
        // Quantity tracking validation
        if (habit.trackingType === 'quantity') {
            if (!habit.unit) {
                errors.push('Unit is required for quantity tracking');
            }
            if (!habit.dailyGoal || habit.dailyGoal <= 0) {
                errors.push('Daily goal must be greater than 0');
            }
            if (habit.dailyGoal > 10000) {
                errors.push('Daily goal too large (max 10,000)');
            }
        }
        
        // Duration validation
        if (habit.trackingType === 'duration') {
            if (!habit.dailyGoal || habit.dailyGoal <= 0) {
                errors.push('Daily goal must be greater than 0');
            }
            if (habit.dailyGoal > 1440) { // 24 hours in minutes
                errors.push('Daily goal too large (max 24 hours)');
            }
        }
        
        // Color validation
        if (habit.color && !/#[0-9A-Fa-f]{6}/.test(habit.color)) {
            errors.push('Invalid color format');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    /**
     * Validate tracking value based on habit type
     * Returns { valid: boolean, errors: string[] }
     */
    trackingValue(value, habit) {
        const errors = [];
        
        if (habit.trackingType === 'quantity') {
            if (isNaN(value) || value < 0) {
                errors.push('Value must be a positive number');
            }
            if (value > 100000) {
                errors.push('Value too large');
            }
        }
        
        if (habit.trackingType === 'duration') {
            if (isNaN(value) || value < 0) {
                errors.push('Duration must be a positive number');
            }
            if (value > 1440) { // 24 hours
                errors.push('Duration too large (max 24 hours)');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
};
