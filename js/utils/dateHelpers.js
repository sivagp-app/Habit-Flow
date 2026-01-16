/**
 * dateHelpers.js - Date manipulation utilities
 * Provides functions for date formatting and calculations
 */

/**
 * Get today's date as YYYY-MM-DD string
 * @returns {string} - Today's date in ISO format
 */
export function getTodayString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Format a date as a readable string
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} - Formatted date string (e.g., "Jan 15, 2026") or "Invalid Date"
 */
export function formatDate(date) {
  let dateObj;
  
  // Handle string input - force UTC to avoid timezone issues
  if (typeof date === 'string') {
    // Parse as UTC by appending timezone if not present
    const dateStr = date.includes('T') ? date : date + 'T12:00:00Z';
    dateObj = new Date(dateStr);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return 'Invalid Date';
  }
  
  // Check for invalid date
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  // Format as "Jan 15, 2026"
  const options = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Get day of week name from date string
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {string} - Day name (e.g., "Monday")
 */
export function getDayOfWeek(dateStr) {
  const date = new Date(dateStr + 'T12:00:00Z');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getUTCDay()];
}

/**
 * Get array of dates for current week (Monday to Sunday)
 * Returns dates that when parsed with new Date(dateStr) will show correct day
 * @returns {string[]} - Array of 7 ISO date strings
 */
export function getWeekDates() {
  const today = new Date();
  
  // Get current day in local time (0 = Sunday, 1 = Monday, etc.)
  const currentDay = today.getDay();
  
  // Calculate offset to get to Monday
  let daysFromMonday;
  if (currentDay === 0) {
    // Sunday - go back 6 days to get to Monday
    daysFromMonday = 6;
  } else {
    // Other days - go back (currentDay - 1) days
    daysFromMonday = currentDay - 1;
  }
  
  // Create array for the week
  const dates = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    // Calculate days offset: from Monday (negative) plus current position (positive)
    date.setDate(today.getDate() - daysFromMonday + i);
    
    // Use local date string to avoid timezone issues in tests
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    dates.push(`${year}-${month}-${day}`);
  }
  
  return dates;
}

/**
 * Check if a date string is today
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {boolean} - True if date is today
 */
export function isToday(dateStr) {
  return dateStr === getTodayString();
}

/**
 * Calculate days between two dates
 * @param {string} date1 - First ISO date string
 * @param {string} date2 - Second ISO date string
 * @returns {number} - Number of days between dates (can be negative)
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
