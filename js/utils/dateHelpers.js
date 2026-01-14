/**
 * Date Helper Utility Module
 * Provides common date manipulation and formatting functions
 * Phase 2A - Modular Architecture
 */

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get date N days ago
 */
export function getDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return formatDate(date);
}

/**
 * Get start of week (Sunday)
 */
export function getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

/**
 * Get array of dates for current week
 */
export function getCurrentWeekDates() {
    const dates = [];
    const startOfWeek = getStartOfWeek();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(formatDate(date));
    }
    
    return dates;
}

/**
 * Get days in month
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get first day of month (0 = Sunday, 6 = Saturday)
 */
export function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

/**
 * Parse date from YYYY-MM-DD string
 */
export function parseDate(dateString) {
    return new Date(dateString + 'T00:00:00');
}

/**
 * Check if date is today
 */
export function isToday(dateString) {
    return dateString === getTodayString();
}

/**
 * Get month name
 */
export function getMonthName(monthIndex) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

/**
 * Get day name
 */
export function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}
