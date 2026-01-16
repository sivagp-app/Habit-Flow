import { describe, it, expect } from 'vitest';
import { 
  isValidHabitName, 
  isValidEmail, 
  isValidDate,
  isValidNumber,
  isValidGoal,
  isValidIcon
} from '../../js/utils/validator.js';

describe('validator.js', () => {
  describe('isValidHabitName', () => {
    it('should accept valid names', () => {
      expect(isValidHabitName('Read')).toBe(true);
      expect(isValidHabitName('Exercise 💪')).toBe(true);
      expect(isValidHabitName('Drink Water')).toBe(true);
    });
    
    it('should reject empty names', () => {
      expect(isValidHabitName('')).toBe(false);
      expect(isValidHabitName('   ')).toBe(false);
    });
    
    it('should reject null/undefined', () => {
      expect(isValidHabitName(null)).toBe(false);
      expect(isValidHabitName(undefined)).toBe(false);
    });
    
    it('should reject too long names', () => {
      const longName = 'a'.repeat(101);
      expect(isValidHabitName(longName)).toBe(false);
    });
    
    it('should accept names up to 100 chars', () => {
      const maxName = 'a'.repeat(100);
      expect(isValidHabitName(maxName)).toBe(true);
    });
  });
  
  describe('isValidEmail', () => {
    it('should accept valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });
    
    it('should reject invalid emails', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
    
    it('should reject empty emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });
  
  describe('isValidDate', () => {
    it('should accept valid ISO dates', () => {
      expect(isValidDate('2026-01-15')).toBe(true);
      expect(isValidDate('2025-12-31')).toBe(true);
    });
    
    it('should reject invalid dates', () => {
      expect(isValidDate('2026-13-01')).toBe(false); // Invalid month
      expect(isValidDate('2026-01-32')).toBe(false); // Invalid day
      expect(isValidDate('not-a-date')).toBe(false);
    });
    
    it('should reject empty dates', () => {
      expect(isValidDate('')).toBe(false);
      expect(isValidDate(null)).toBe(false);
    });
  });
  
  describe('isValidNumber', () => {
    it('should accept valid numbers', () => {
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(42)).toBe(true);
      expect(isValidNumber(-10)).toBe(true);
      expect(isValidNumber(3.14)).toBe(true);
    });
    
    it('should reject non-numbers', () => {
      expect(isValidNumber('not a number')).toBe(false);
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
    });
    
    it('should reject infinity', () => {
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
    });
  });
  
  describe('isValidGoal', () => {
    it('should accept valid goals', () => {
      expect(isValidGoal(1)).toBe(true);
      expect(isValidGoal(5)).toBe(true);
      expect(isValidGoal(100)).toBe(true);
    });
    
    it('should reject zero and negative goals', () => {
      expect(isValidGoal(0)).toBe(false);
      expect(isValidGoal(-1)).toBe(false);
    });
    
    it('should reject non-integer goals', () => {
      expect(isValidGoal(1.5)).toBe(false);
      expect(isValidGoal(2.7)).toBe(false);
    });
    
    it('should reject too large goals', () => {
      expect(isValidGoal(1001)).toBe(false);
    });
  });
  
  describe('isValidIcon', () => {
    it('should accept valid emoji icons', () => {
      expect(isValidIcon('📚')).toBe(true);
      expect(isValidIcon('💪')).toBe(true);
      expect(isValidIcon('🏃')).toBe(true);
    });
    
    it('should reject empty icons', () => {
      expect(isValidIcon('')).toBe(false);
      expect(isValidIcon(null)).toBe(false);
    });
    
    it('should reject long strings', () => {
      expect(isValidIcon('not an emoji')).toBe(false);
    });
  });
});
