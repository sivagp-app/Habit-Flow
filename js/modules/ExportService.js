/**
 * Export Service Module
 * Handles exporting habit data to CSV format
 * Phase 2A - Modular Architecture
 */

export class ExportService {
    constructor(statsCalculator) {
        this.statsCalculator = statsCalculator;
    }
    
    /**
     * Export data to CSV file
     */
    exportToCSV(habits, completions, options = {}) {
        const {
            includeHabits = true,
            includeCompletions = true,
            includeStats = true
        } = options;
        
        let csvContent = '';
        
        // Export Habits
        if (includeHabits) {
            csvContent += this._exportHabits(habits);
        }
        
        // Export Completion History
        if (includeCompletions) {
            csvContent += this._exportCompletions(habits, completions);
        }
        
        // Export Statistics
        if (includeStats) {
            csvContent += this._exportStats(habits, completions);
        }
        
        // Create and download file
        this._downloadCSV(csvContent);
        
        return true;
    }
    
    /**
     * Export habits section
     */
    _exportHabits(habits) {
        let content = '=== HABITS ===\n';
        content += 'ID,Name,Icon,Category,Tracking Type,Unit,Daily Goal,Notes,Reminder Time,Created At\n';
        
        habits.forEach(habit => {
            const row = [
                habit.id,
                `"${habit.name}"`,
                habit.icon,
                habit.category || '',
                habit.trackingType || 'simple',
                habit.unit || '',
                habit.dailyGoal || '',
                `"${(habit.notes || '').replace(/"/g, '""')}"`,
                habit.reminderTime || '',
                habit.createdAt
            ].join(',');
            content += row + '\n';
        });
        content += '\n';
        
        return content;
    }
    
    /**
     * Export completion history section
     */
    _exportCompletions(habits, completions) {
        let content = '=== COMPLETION HISTORY ===\n';
        content += 'Habit ID,Habit Name,Date,Completed,Value,Entries Count\n';
        
        habits.forEach(habit => {
            const habitCompletions = completions[habit.id] || {};
            Object.keys(habitCompletions).sort().forEach(date => {
                const completion = habitCompletions[date];
                const row = [
                    habit.id,
                    `"${habit.name}"`,
                    date,
                    completion.completed ? 'Yes' : 'No',
                    completion.value || 0,
                    completion.entries ? completion.entries.length : 0
                ].join(',');
                content += row + '\n';
            });
        });
        content += '\n';
        
        return content;
    }
    
    /**
     * Export statistics section
     */
    _exportStats(habits, completions) {
        let content = '=== STATISTICS ===\n';
        content += 'Habit Name,Total Completions,Current Streak,Longest Streak,Completion Rate (Last 30 Days)\n';
        
        habits.forEach(habit => {
            const habitCompletions = completions[habit.id] || {};
            const totalCompletions = Object.values(habitCompletions)
                .filter(c => c.completed).length;
            
            const currentStreak = this.statsCalculator.calculateStreak(habit.id, completions);
            const longestStreak = this.statsCalculator.calculateLongestStreak(habit.id, completions);
            const completionRate = this.statsCalculator.calculateCompletionRate(habit.id, completions, 30);
            
            const row = [
                `"${habit.name}"`,
                totalCompletions,
                currentStreak,
                longestStreak,
                completionRate + '%'
            ].join(',');
            content += row + '\n';
        });
        
        return content;
    }
    
    /**
     * Create CSV blob and trigger download
     */
    _downloadCSV(csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const now = new Date();
        const filename = `HabitFlow_Export_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
    }
}
