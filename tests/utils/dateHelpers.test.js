import { describe, it, expect } from 'vitest';
import { 
  getTodayString,
  formatDate,
  getDayOfWeek,
  getWeekDates,
  isToday,
  daysBetween
} from '../../js/utils/dateHelpers.js';

describe('dateHelpers.js', () => {
  describe('getTodayString', () => {
    it('should return YYYY-MM-DD format', () => {
      const result = getTodayString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    
    it('should return today date', () => {
      const today = new Date();
      const expected = today.toISOString().split('T')[0];
      expect(getTodayString()).toBe(expected);
    });
  });
  
  describe('formatDate', () => {
    it('should format date object', () => {
      const date = new Date('2026-01-15');
      const result = formatDate(date);
      expect(result).toMatch(/Jan.*15.*2026/);
    });
    
    it('should format date string', () => {
      const result = formatDate('2026-01-15');
      expect(result).toBeTruthy();
    });
    
    it('should handle invalid dates', () => {
      const result = formatDate('invalid');
      expect(result).toBe('Invalid Date');
    });
  });
  
  describe('getDayOfWeek', () => {
    it('should return day name', () => {
      const result = getDayOfWeek('2026-01-15');
      expect(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).toContain(result);
    });
    
    it('should return correct day for known date', () => {
      // January 1, 2026 is a Thursday
      const result = getDayOfWeek('2026-01-01');
      expect(result).toBe('Thursday');
    });
  });
  
  describe('getWeekDates', () => {
    it('should return 7 dates', () => {
      const dates = getWeekDates();
      expect(dates).toHaveLength(7);
    });
    
	it('should start with Monday', () => {
		const dates = getWeekDates();
		const [year, month, day] = dates[0].split('-').map(Number);
		const firstDate = new Date(year, month - 1, day);
		expect(firstDate.getDay()).toBe(1);
	});

	it('should end with Sunday', () => {
		const dates = getWeekDates();
		const [year, month, day] = dates[6].split('-').map(Number);
		const lastDate = new Date(year, month - 1, day);
		expect(lastDate.getDay()).toBe(0);
	});
    
    it('should return consecutive dates', () => {
      const dates = getWeekDates();
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        expect(diff).toBe(1);
      }
    });
  });
  
  describe('isToday', () => {
    it('should return true for today', () => {
      const today = getTodayString();
      expect(isToday(today)).toBe(true);
    });
    
    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];
      expect(isToday(dateStr)).toBe(false);
    });
    
    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      expect(isToday(dateStr)).toBe(false);
    });
  });
  
  describe('daysBetween', () => {
    it('should calculate days between dates', () => {
      const days = daysBetween('2026-01-01', '2026-01-10');
      expect(days).toBe(9);
    });
    
    it('should return 0 for same date', () => {
      const days = daysBetween('2026-01-15', '2026-01-15');
      expect(days).toBe(0);
    });
    
    it('should handle reversed dates', () => {
      const days = daysBetween('2026-01-10', '2026-01-01');
      expect(Math.abs(days)).toBe(9);
    });
  });
});
