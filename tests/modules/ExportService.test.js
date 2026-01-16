import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExportService } from '../../js/modules/ExportService.js';

describe('ExportService.js', () => {
  let exportService;
  let mockStatsCalculator;
  
  beforeEach(() => {
    // CRITICAL: Define the mock BEFORE creating ExportService
    mockStatsCalculator = {
      calculateStreak: vi.fn(() => 5),
      calculateLongestStreak: vi.fn(() => 10),
      calculateCompletionRate: vi.fn(() => 75)
    };

    // Pass the mock to ExportService
    exportService = new ExportService(mockStatsCalculator);
  });
  
  describe('exportToCSV', () => {
    it('should export habits to CSV', () => {
      const habits = [{ id: '1', name: 'Read', icon: '📚' }];
      const completions = {};
      
      exportService.exportToCSV(habits, completions);
      
      expect(mockStatsCalculator.calculateStreak).toHaveBeenCalled();
	  expect(mockStatsCalculator.calculateLongestStreak).toHaveBeenCalled();
      expect(mockStatsCalculator.calculateCompletionRate).toHaveBeenCalled();
    });
    
    it('should handle empty habits', () => {
      expect(() => {
        exportService.exportToCSV([], {});
      }).not.toThrow();
    });
  });
});
