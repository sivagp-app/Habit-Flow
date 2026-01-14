/**
 * UI Renderer Module
 * Handles all UI rendering and display logic
 * Phase 2A - Modular Architecture
 */

import { getTodayString, getCurrentWeekDates, getDaysInMonth, getFirstDayOfMonth, getMonthName } from '../utils/dateHelpers.js';

export class UIRenderer {
    constructor(habitManager, statsCalculator) {
        this.habitManager = habitManager;
        this.statsCalculator = statsCalculator;
        this.currentMonthView = new Date();
    }
    
    /**
     * Initialize UI elements and current date display
     */
    initializeUI() {
        // Display current date
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = today.toLocaleDateString('en-US', options);
        }
    }
    
    /**
     * Render habits list
     */
    renderHabits(habits, completions, settings = {}) {
        const { adhdMode = false, focusMode = false } = settings;
        const habitsList = document.getElementById('habitsList');
        const emptyState = document.getElementById('emptyState');
        
        if (!habitsList) return;
        
        if (habits.length === 0) {
            habitsList.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        habitsList.style.display = 'flex';
        if (emptyState) emptyState.style.display = 'none';
        
        const today = getTodayString();
        let visibleHabits = habits;
        
        // Filter for focus mode
        if (focusMode) {
            visibleHabits = habits.filter(habit => {
                const completion = completions[habit.id]?.[today];
                if (!completion) return true;
                
                if (habit.trackingType === 'simple') {
                    return !completion.completed;
                } else {
                    return completion.value < habit.dailyGoal;
                }
            });
        }
        
        // Show completion message in focus mode
        if (visibleHabits.length === 0 && focusMode) {
            habitsList.innerHTML = `
                <div class="empty-state">
                    <div class="celebration-emoji">🎉</div>
                    <h3>${adhdMode ? 'You did it! All habits complete!' : 'All done for today!'}</h3>
                    <p>${adhdMode ? 'Take a moment to celebrate your progress! 🌟' : 'Great job completing all your habits!'}</p>
                </div>
            `;
            return;
        }
        
        // Render habit cards
        habitsList.innerHTML = visibleHabits.map((habit, index) => {
            return this._renderHabitCard(habit, index, completions, adhdMode);
        }).join('');
    }
    
    /**
     * Render individual habit card
     */
    _renderHabitCard(habit, index, completions, adhdMode) {
        const today = getTodayString();
        const completion = completions[habit.id]?.[today] || { completed: false, value: 0, entries: [] };
        const isCompleted = completion.completed;
        const currentValue = completion.value || 0;
        
        const currentStreak = this.statsCalculator.calculateStreak(habit.id, completions);
        const longestStreak = this.statsCalculator.calculateLongestStreak(habit.id, completions);
        
        const categoryHTML = habit.category ? `
            <div class="habit-category" style="background: ${habit.categoryColor}20; color: ${habit.categoryColor};">
                ${habit.category}
            </div>
        ` : '';
        
        const streakText = adhdMode 
            ? (currentStreak > 0 ? `🔥 Amazing! ${currentStreak} day streak!` : 'Ready to start your streak!')
            : (currentStreak > 0 ? `🔥 ${currentStreak} day streak` : 'No current streak');
        
        const longestStreakText = longestStreak > 0 ? ` • Best: ${longestStreak} days` : '';
        
        let progressHTML = '';
        let actionsHTML = '';
        
        if (habit.trackingType === 'quantity' || habit.trackingType === 'duration') {
            const percentage = Math.min(100, Math.round((currentValue / habit.dailyGoal) * 100));
            const unitDisplay = habit.trackingType === 'duration' ? 'mins' : habit.unit;
            
            progressHTML = `
                <div class="habit-progress">
                    <div class="progress-label">
                        <span>${currentValue}</span>/<span>${habit.dailyGoal}</span> ${unitDisplay}
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="progress-percentage">${percentage}% complete</div>
                </div>
            `;
            
            actionsHTML = `
                <button class="btn-check btn-track-modal" data-habit-id="${habit.id}" title="Track progress">
                    ${isCompleted ? '✓' : '+'}
                </button>
            `;
        } else {
            actionsHTML = `
                <button class="btn-check btn-toggle-habit ${isCompleted ? 'checked' : ''}" data-habit-id="${habit.id}" title="${isCompleted ? 'Mark incomplete' : 'Mark complete'}">
                    ${isCompleted ? '✓' : '○'}
                </button>
            `;
        }
        
        const notesHTML = habit.notes ? `
            <div class="habit-notes">${habit.notes}</div>
        ` : '';
        
        return `
            <div class="habit-card ${isCompleted ? 'completed' : ''}" style="animation-delay: ${index * 0.1}s">
                <div class="habit-icon">${habit.icon}</div>
                <div class="habit-info">
                    <div class="habit-name">${habit.name}</div>
                    ${categoryHTML}
                    <div class="habit-streak ${currentStreak > 0 ? 'active' : ''}">
                        ${streakText}${longestStreakText}
                    </div>
                    ${progressHTML}
                    ${notesHTML}
                </div>
                <div class="habit-actions">
                    ${actionsHTML}
                    <button class="btn-edit" data-habit-id="${habit.id}" title="Edit habit">
                        ✏️
                    </button>
                    <button class="btn-delete" data-habit-id="${habit.id}" title="Delete habit">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Update statistics display
     */
    updateStats(habits, completions) {
        const stats = this.statsCalculator.calculateOverallStats(habits, completions);
        
        const todayProgressEl = document.getElementById('todayProgress');
        const totalHabitsEl = document.getElementById('totalHabits');
        const longestStreakEl = document.getElementById('longestStreak');
        
        if (todayProgressEl) todayProgressEl.textContent = `${stats.todayProgress}%`;
        if (totalHabitsEl) totalHabitsEl.textContent = stats.totalHabits;
        if (longestStreakEl) longestStreakEl.textContent = stats.longestStreak;
    }
    
    /**
     * Render weekly calendar
     */
    renderWeeklyCalendar(habits, completions) {
        const calendar = document.getElementById('weeklyCalendar');
        if (!calendar) return;
        
        const today = new Date();
        const weekDays = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            weekDays.push(date);
        }
        
        calendar.innerHTML = weekDays.map(date => {
            const dateString = date.toISOString().split('T')[0];
            const isToday = dateString === getTodayString();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayDate = date.getDate();
            
            let habitDots = '';
            habits.forEach(habit => {
                const completion = completions[habit.id]?.[dateString];
                if (completion && completion.completed) {
                    habitDots += `<div class="habit-dot completed" style="background: ${habit.color || '#3b82f6'}"></div>`;
                } else {
                    habitDots += `<div class="habit-dot"></div>`;
                }
            });
            
            return `
                <div class="calendar-day ${isToday ? 'today' : ''}">
                    <div class="day-name">${dayName}</div>
                    <div class="day-number">${dayDate}</div>
                    <div class="day-habits">${habitDots}</div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Render monthly view
     */
    renderMonthlyView(habits, completions) {
        const container = document.getElementById('monthlyCalendarGrid');
        if (!container) return;
        
        const year = this.currentMonthView.getFullYear();
        const month = this.currentMonthView.getMonth();
        
        // Update month display
        const monthYearEl = document.getElementById('currentMonthYear');
        if (monthYearEl) {
            monthYearEl.textContent = `${getMonthName(month)} ${year}`;
        }
        
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        let html = '';
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="month-day empty"></div>';
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const isToday = dateString === getTodayString();
            
            let completedCount = 0;
            habits.forEach(habit => {
                const completion = completions[habit.id]?.[dateString];
                if (completion && completion.completed) {
                    completedCount++;
                }
            });
            
            const totalHabits = habits.length;
            const percentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
            
            let heatClass = '';
            if (percentage === 100) heatClass = 'heat-100';
            else if (percentage >= 75) heatClass = 'heat-75';
            else if (percentage >= 50) heatClass = 'heat-50';
            else if (percentage >= 25) heatClass = 'heat-25';
            else if (percentage > 0) heatClass = 'heat-1';
            
            html += `
                <div class="month-day ${isToday ? 'today' : ''} ${heatClass}" title="${completedCount}/${totalHabits} habits completed">
                    <div class="day-number">${day}</div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    /**
     * Navigate month view
     */
    previousMonth() {
        this.currentMonthView.setMonth(this.currentMonthView.getMonth() - 1);
    }
    
    nextMonth() {
        this.currentMonthView.setMonth(this.currentMonthView.getMonth() + 1);
    }
    
    /**
     * Update tracking modal
     */
    updateTrackingModal(habitId, habits, completions) {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;
        
        const today = getTodayString();
        const completion = completions[habitId]?.[today] || { completed: false, value: 0, entries: [] };
        
        const currentValueEl = document.getElementById('trackingCurrentValue');
        const entriesListEl = document.getElementById('trackingEntriesList');
        
        if (currentValueEl) {
            currentValueEl.textContent = completion.value || 0;
        }
        
        if (entriesListEl && completion.entries) {
            entriesListEl.innerHTML = completion.entries.map((entry, index) => `
                <div class="tracking-entry">
                    <span>+${entry.amount} ${habit.trackingType === 'duration' ? 'min' : habit.unit}</span>
                    <span class="entry-time">${new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    <button class="entry-delete btn-delete-entry" data-habit-id="${habitId}" data-entry-index="${index}" title="Delete entry">×</button>
                </div>
            `).join('');
        }
    }
}
