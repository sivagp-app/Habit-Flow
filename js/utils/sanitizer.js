/**
 * Simple sanitizer for production use
 */

export function sanitizeHabitName(name) {
    if (!name) return '';
    return String(name).trim().substring(0, 100);
}

export function sanitizeNotes(notes) {
    if (!notes) return '';
    return String(notes).trim().substring(0, 500);
}
