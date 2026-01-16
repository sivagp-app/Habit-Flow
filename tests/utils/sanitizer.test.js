import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeHTML, sanitizeURL } from '../../js/utils/sanitizer.js';

describe('sanitizer.js', () => {
  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });
    
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>Read')).toBe('Read');
    });
    
    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });
    
    it('should handle null/undefined', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
    
    it('should preserve valid text', () => {
      expect(sanitizeInput('Read Book 📚')).toBe('Read Book 📚');
    });
    
    it('should remove multiple consecutive spaces', () => {
      expect(sanitizeInput('hello    world')).toBe('hello world');
    });
    
    it('should handle special characters safely', () => {
      expect(sanitizeInput('Test & Co.')).toContain('Test');
    });
    
    it('should truncate long input', () => {
      const longText = 'a'.repeat(300);
      const result = sanitizeInput(longText);
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });
  
  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const result = sanitizeHTML('<script>alert("xss")</script><p>Content</p>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('Content');
    });
    
    it('should remove onclick attributes', () => {
      const result = sanitizeHTML('<div onclick="alert()">Click</div>');
      expect(result).not.toContain('onclick');
    });
    
    it('should allow safe HTML', () => {
      const safe = '<p>Hello <strong>world</strong></p>';
      const result = sanitizeHTML(safe);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });
    
    it('should remove javascript: URLs', () => {
      const result = sanitizeHTML('<a href="javascript:alert()">Link</a>');
      expect(result).not.toContain('javascript:');
    });
    
    it('should handle empty string', () => {
      expect(sanitizeHTML('')).toBe('');
    });
  });
  
  describe('sanitizeURL', () => {
    it('should allow http URLs', () => {
      expect(sanitizeURL('http://example.com')).toBe('http://example.com');
    });
    
    it('should allow https URLs', () => {
      expect(sanitizeURL('https://example.com')).toBe('https://example.com');
    });
    
    it('should block javascript: URLs', () => {
      expect(sanitizeURL('javascript:alert(1)')).toBe('');
    });
    
    it('should block data: URLs', () => {
      expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('');
    });
    
    it('should handle relative URLs', () => {
      const result = sanitizeURL('/path/to/page');
      expect(result).toBe('/path/to/page');
    });
    
    it('should handle empty/null URLs', () => {
      expect(sanitizeURL('')).toBe('');
      expect(sanitizeURL(null)).toBe('');
    });
    
    it('should remove whitespace from URLs', () => {
      expect(sanitizeURL('  https://example.com  ')).toBe('https://example.com');
    });
  });
});
