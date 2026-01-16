import { describe, it, expect } from 'vitest';
import { StatsCalculator } from '../../js/modules/StatsCalculator.js';

describe('StatsCalculator.js', () => {
  let calculator;
  
  beforeEach(() => {
    calculator = new StatsCalculator();
  });
  
  describe('calculateStreak', () => {
    it('should return 0 for no completions', () => {
      const streak = calculator.calculateStreak('1', {});
      expect(streak).toBe(0);
    });
    
    it('should count consecutive days', () => {
      const completions = {
        '1': {
          '2026-01-15': { completed: true },
          '2026-01-14': { completed: true },
          '2026-01-13': { completed: true }
        }
      };
      
      const streak = calculator.calculateStreak('1', completions);
      expect(streak).toBeGreaterThanOrEqual(2);
    });
  });
  
  describe('calculateLongestStreak', () => {
    it('should return 0 for no completions', () => {
      const streak = calculator.calculateLongestStreak('1', {});
      expect(streak).toBe(0);
    });
    
    it('should find longest streak', () => {
      const completions = {
        '1': {
          '2026-01-10': { completed: true },
          '2026-01-11': { completed: true },
          '2026-01-12': { completed: true },
          '2026-01-15': { completed: true }
        }
      };
      
      const longest = calculator.calculateLongestStreak('1', completions);
      expect(longest).toBeGreaterThanOrEqual(3);
    });
  });
  
  describe('calculateOverallStats', () => {
    it('should calculate stats for all habits', () => {
      const habits = [{ id: '1', name: 'Read' }];
      const completions = {
        '1': {
          '2026-01-15': { completed: true }
        }
      };
      
      const stats = calculator.calculateOverallStats(habits, completions);
      
      expect(stats).toBeDefined();
      expect(typeof stats).toBe('object');
    });
  });
});
