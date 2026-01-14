/**
 * Sanitizer Utility Module
 * Provides functions to sanitize user input and prevent XSS attacks
 * Phase 2A - Modular Architecture
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Converts HTML entities to safe text
 */
export function sanitizeHTML(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Sanitize and validate habit name
 * - Removes HTML tags
 * - Removes dangerous special characters
 * - Limits length to 100 characters
 */
export function sanitizeHabitName(name) {
    if (!name) return '';
    return name.trim()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[^\w\s\-.,!?']/g, '') // Remove special chars except safe punctuation
        .substring(0, 100); // Max 100 chars
}

/**
 * Sanitize and validate notes
 * - Removes HTML tags
 * - Limits length to 200 characters
 */
export function sanitizeNotes(notes) {
    if (!notes) return '';
    return notes.trim()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .substring(0, 200); // Max 200 chars
}
