/**
 * sanitizer.js - Input sanitization utilities
 * Provides functions to clean and validate user input
 */

/**
 * Sanitize text input by removing HTML tags, trimming whitespace,
 * and limiting length
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeInput(input) {
  // Handle null/undefined
  if (input == null) return '';
  
  // Convert to string
  let text = String(input);
  
  // Remove HTML tags AND their content for script/style tags
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove remaining HTML tags (but keep content)
  text = text.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  text = text.trim();
  
  // Replace multiple consecutive spaces with single space
  text = text.replace(/\s+/g, ' ');
  
  // Truncate to maximum length
  const MAX_LENGTH = 255;
  if (text.length > MAX_LENGTH) {
    text = text.substring(0, MAX_LENGTH);
  }
  
  return text;
}

/**
 * Sanitize HTML content by removing dangerous elements and attributes
 * while preserving safe HTML tags
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html) {
  if (!html) return '';
  
  let sanitized = String(html);
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags and their content
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove event handler attributes (onclick, onload, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src="#"');
  
  // Remove data: URLs (can be used for XSS)
  sanitized = sanitized.replace(/href\s*=\s*["']data:[^"']*["']/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*["']data:[^"']*["']/gi, 'src="#"');
  
  return sanitized;
}

/**
 * Sanitize URL by validating protocol and removing whitespace
 * @param {string} url - The URL to sanitize
 * @returns {string} - Sanitized URL or empty string if invalid
 */
export function sanitizeURL(url) {
  // Handle null/undefined/empty
  if (!url) return '';
  
  // Convert to string and trim
  let cleanUrl = String(url).trim();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
  const lowerUrl = cleanUrl.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '';
    }
  }
  
  // Allow http, https, and relative URLs
  return cleanUrl;
}
