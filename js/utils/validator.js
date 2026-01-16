/**
 * validator.js - Input validation utilities
 * Provides functions to validate various types of user input
 */

/**
 * Validate habit name
 * @param {string} name - The habit name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidHabitName(name) {
  // Check null/undefined
  if (name == null) return false;
  
  // Convert to string and trim
  const trimmed = String(name).trim();
  
  // Check empty
  if (trimmed.length === 0) return false;
  
  // Check length (max 100 characters)
  if (trimmed.length > 100) return false;
  
  return true;
}

/**
 * Validate email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidEmail(email) {
  // Check null/undefined/empty
  if (!email) return false;
  
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(String(email));
}

/**
 * Validate ISO date string (YYYY-MM-DD)
 * @param {string} dateStr - The date string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidDate(dateStr) {
  // Check null/undefined/empty
  if (!dateStr) return false;
  
  // Check ISO format pattern
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateStr)) return false;
  
  // Parse and validate the date
  const date = new Date(dateStr + 'T00:00:00');
  
  // Check if date is valid
  if (isNaN(date.getTime())) return false;
  
  // Verify the date parts match (catches invalid dates like 2026-13-01)
  const [year, month, day] = dateStr.split('-').map(Number);
  
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validate number (finite, not NaN)
 * @param {*} value - The value to validate
 * @returns {boolean} - True if valid number, false otherwise
 */
export function isValidNumber(value) {
  // Check if it's a number type
  if (typeof value !== 'number') return false;
  
  // Check for NaN
  if (isNaN(value)) return false;
  
  // Check for infinity
  if (!isFinite(value)) return false;
  
  return true;
}

/**
 * Validate goal value (positive integer, max 1000)
 * @param {*} goal - The goal value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidGoal(goal) {
  // Must be a valid number
  if (!isValidNumber(goal)) return false;
  
  // Must be positive
  if (goal <= 0) return false;
  
  // Must be an integer
  if (!Number.isInteger(goal)) return false;
  
  // Max value 1000
  if (goal > 1000) return false;
  
  return true;
}

/**
 * Validate icon (emoji - short string, typically 1-4 characters)
 * @param {string} icon - The icon to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidIcon(icon) {
  // Check null/undefined/empty
  if (!icon) return false;
  
  // Convert to string
  const str = String(icon);
  
  // Emoji are typically 1-4 characters (accounting for multi-byte sequences)
  // Reject strings longer than 10 characters
  if (str.length > 10) return false;
  
  // Must have at least one character
  if (str.trim().length === 0) return false;
  
  return true;
}
