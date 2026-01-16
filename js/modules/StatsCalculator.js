/**
 * Stats Calculator Module
 * Handles all statistics calculations for habits
 * Phase 2A - Modular Architecture
 */

import { getTodayString } from '../utils/dateHelpers.js';

export class StatsCalculator {
    /**
     * Calculate current streak for a habit
     * Returns number of consecutive days completed
     */
    calculateStreak(habitId, completions) {
        const habitCompletions = completions[habitId] || {};
        let streak = 0;
        let currentDate = new Date();
        
        const today = getTodayString();
        const todayCompletion = habitCompletions[today];
        
        // If today is not completed, start checking from yesterday
        if (!todayCompletion || !todayCompletion.completed) {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // Count consecutive completed days going backwards
        while (true) {
            const dateString = currentDate.toISOString().split('T')[0];
            const completion = habitCompletions[dateString];
            
            if (completion && completion.completed) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    /**
     * Calculate longest streak ever for a habit
     */
    calculateLongestStreak(habitId, completions) {
        const habitCompletions = completions[habitId] || {};
        const dates = Object.keys(habitCompletions)
            .filter(date => habitCompletions[date].completed)
            .sort();
        
        if (dates.length === 0) return 0;
        
        let longestStreak = 1;
        let currentStreak = 1;
        
        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            
            const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        
        return longestStreak;
    }
    
    /**
     * Calculate overall statistics
     * Returns { todayProgress, totalHabits, longestStreak, completedToday }
     */
    calculateOverallStats(habits, completions) {
        const today = getTodayString();
        let completedToday = 0;
        let longestStreak = 0;
        
        habits.forEach(habit => {
            const completion = completions[habit.id]?.[today];
            if (completion && completion.completed) {
                completedToday++;
            }
            
            const streak = this.calculateLongestStreak(habit.id, completions);
            if (streak > longestStreak) {
                longestStreak = streak;
            }
        });
        
        const totalHabits = habits.length;
        const todayProgress = totalHabits > 0 
            ? Math.round((completedToday / totalHabits) * 100) 
            : 0;
        
        return {
            todayProgress,
            totalHabits,
            longestStreak,
            completedToday
        };
    }
    
/**
 * Calculate completion rate for a habit over last N days
 */
calculateCompletionRate(habitOrId, completions, days = 30) {
    // Handle both habit object and habitId string
    const habitId = typeof habitOrId === 'string' ? habitOrId : habitOrId?.id;
    
    if (!habitId) return 0;
    
    const habitCompletions = completions[habitId] || {};
    let completed = 0;
    
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const completion = habitCompletions[dateString];
        if (completion && completion.completed) {
            completed++;
        }
    }
    
    return Math.round((completed / days) * 100);
}
    
    /**
     * Calculate progress percentage for quantity/duration habits
     */
    calculateProgress(habit, completion) {
        if (!completion || !habit.dailyGoal) return 0;
        
        if (habit.trackingType === 'quantity' || habit.trackingType === 'duration') {
            const progress = (completion.value / habit.dailyGoal) * 100;
            return Math.min(100, Math.round(progress));
        }
        
        return completion.completed ? 100 : 0;
    }
    
    /**
     * Get weekly completion data for a habit
     * Returns array of { date, completed, value }
     */
    getWeeklyData(habitId, completions) {
        const habitCompletions = completions[habitId] || {};
        const weekData = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const completion = habitCompletions[dateString] || { completed: false, value: 0 };
            
            weekData.push({
                date: dateString,
                completed: completion.completed,
                value: completion.value
            });
        }
        
        return weekData;
    }
    
    /**
     * Get monthly completion data for a habit
     * Returns object with dates as keys
     */
    getMonthlyData(habitId, completions, year, month) {
        const habitCompletions = completions[habitId] || {};
        const monthlyData = {};
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            monthlyData[dateString] = habitCompletions[dateString] || { completed: false, value: 0 };
        }
        
        return monthlyData;
    }
}
