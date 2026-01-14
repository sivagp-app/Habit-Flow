/**
 * Habit Manager Module
 * Handles all habit CRUD operations and tracking logic
 * Phase 2A - Modular Architecture
 */

import { getTodayString } from '../utils/dateHelpers.js';

export class HabitManager {
    constructor(storageService, notificationService) {
        this.storageService = storageService;
        this.notificationService = notificationService;
    }
    
    /**
     * Create a new habit
     */
    createHabit(habitData, habits, completions) {
        const newHabit = {
            ...habitData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        
        habits.push(newHabit);
        completions[newHabit.id] = {};
        
        return newHabit;
    }
    
    /**
     * Update an existing habit
     */
    updateHabit(habitId, habitData, habits) {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            Object.assign(habit, habitData);
            return true;
        }
        return false;
    }
    
    /**
     * Delete a habit
     */
    deleteHabit(habitId, habits, completions) {
        const index = habits.findIndex(h => h.id === habitId);
        if (index !== -1) {
            habits.splice(index, 1);
            delete completions[habitId];
            return true;
        }
        return false;
    }
    
    /**
     * Get habit by ID
     */
    getHabit(habitId, habits) {
        return habits.find(h => h.id === habitId);
    }
    
    /**
     * Toggle simple habit completion
     */
    toggleHabit(habitId, habits, completions, adhdMode = false) {
        const today = getTodayString();
        
        // Initialize if needed
        if (!completions[habitId]) {
            completions[habitId] = {};
        }
        
        if (!completions[habitId][today]) {
            completions[habitId][today] = { 
                completed: false, 
                value: 0, 
                entries: [] 
            };
        }
        
        // Toggle completion
        const wasCompleted = completions[habitId][today].completed;
        completions[habitId][today].completed = !wasCompleted;
        completions[habitId][today].value = !wasCompleted ? 1 : 0;
        
        // Return celebration data for ADHD mode
        if (!wasCompleted && adhdMode) {
            const habit = habits.find(h => h.id === habitId);
            return {
                shouldCelebrate: true,
                habit: habit
            };
        }
        
        return { shouldCelebrate: false };
    }
    
    /**
     * Add tracking entry for quantity/duration habits
     */
    addTrackingEntry(habitId, value, habits, completions, adhdMode = false) {
        const today = getTodayString();
        const habit = habits.find(h => h.id === habitId);
        
        if (!habit) return { success: false };
        
        // Initialize if needed
        if (!completions[habitId]) {
            completions[habitId] = {};
        }
        
        if (!completions[habitId][today]) {
            completions[habitId][today] = { 
                completed: false, 
                value: 0, 
                entries: [] 
            };
        }
        
        const completion = completions[habitId][today];
        
        // Add entry
        completion.entries.push({
            amount: value,
            timestamp: new Date().toISOString()
        });
        
        // Update total value
        completion.value += value;
        
        // Check if goal reached
        const goalReached = !completion.completed && 
                          completion.value >= habit.dailyGoal;
        
        if (completion.value >= habit.dailyGoal) {
            completion.completed = true;
        }
        
        return {
            success: true,
            goalReached: goalReached,
            shouldCelebrate: goalReached && adhdMode,
            habit: habit,
            currentValue: completion.value,
            goalValue: habit.dailyGoal
        };
    }
    
    /**
     * Delete a tracking entry
     */
    deleteTrackingEntry(habitId, entryIndex, habits, completions) {
        const today = getTodayString();
        const habit = habits.find(h => h.id === habitId);
        
        if (!habit || !completions[habitId]?.[today]) {
            return false;
        }
        
        const completion = completions[habitId][today];
        const entry = completion.entries[entryIndex];
        
        if (!entry) return false;
        
        // Remove value and entry
        completion.value -= entry.amount;
        completion.entries.splice(entryIndex, 1);
        
        // Update completion status
        if (completion.value < habit.dailyGoal) {
            completion.completed = false;
        }
        
        return true;
    }
    
    /**
     * Get today's completion for a habit
     */
    getTodayCompletion(habitId, completions) {
        const today = getTodayString();
        return completions[habitId]?.[today] || { 
            completed: false, 
            value: 0, 
            entries: [] 
        };
    }
    
    /**
     * Check if habit is completed today
     */
    isCompletedToday(habitId, completions) {
        const today = getTodayString();
        return completions[habitId]?.[today]?.completed || false;
    }
    
    /**
     * Get celebration messages for ADHD mode
     */
    getCelebrationMessage() {
        const messages = [
            'Fantastic! Keep it up! 🌟',
            'You\'re crushing it! 💪',
            'One step closer! 🎯',
            'Amazing progress! ✨',
            'You did it! 🎉',
            'Great job! Keep going! 🚀',
            'Goal crushed! 🎯',
            'You did it! Amazing! 🌟',
            'Fantastic work! 💪',
            'Keep going! You\'re on fire! 🔥'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
}
