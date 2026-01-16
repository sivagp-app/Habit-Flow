import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../../js/modules/StorageService.js';

describe('StorageService.js', () => {
  let storageService;
  let mockNotification;
  
  beforeEach(() => {
    localStorage.clear();
    mockNotification = {
      error: vi.fn(),
      success: vi.fn()
    };
    storageService = new StorageService(mockNotification);
  });
  
  describe('loadHabits', () => {
    it('should return empty array when no habits saved', () => {
      const habits = storageService.loadHabits();
      expect(habits).toEqual([]);
    });
    
    it('should load saved habits', () => {
      const testHabits = [{ 
		id: '1', 
		name: 'Read',
		color: '#3b82f6',
		dailyGoal: null,
		trackingType: 'simple',
		unit: null
	}];
      localStorage.setItem('habits', JSON.stringify(testHabits));
      
      const habits = storageService.loadHabits();
      expect(habits).toEqual(testHabits);
    });
    
    it('should handle corrupted data', () => {
      localStorage.setItem('habits', 'invalid json');
      
      const habits = storageService.loadHabits();
      expect(habits).toEqual([]);
      expect(mockNotification.error).toHaveBeenCalled();
    });
  });
  
  describe('saveHabits', () => {
    it('should save habits to localStorage', () => {
      const habits = [{ id: '1', name: 'Read' }];
      
      storageService.saveHabits(habits);
      
      const saved = JSON.parse(localStorage.getItem('habits'));
      expect(saved).toEqual(habits);
    });
    
it('should handle save errors', () => {
  // Mock setItem to throw error
		const originalSetItem = localStorage.setItem;
		localStorage.setItem = vi.fn(() => {
		throw new Error('Storage full');
		});

	storageService.saveHabits([{ id: '1' }]);
	expect(mockNotification.error).toHaveBeenCalled();
  
  // Restore original
	localStorage.setItem = originalSetItem;
	});
  });
  
  describe('loadCompletions', () => {
    it('should return empty object when no completions', () => {
      const completions = storageService.loadCompletions();
      expect(completions).toEqual({});
    });
    
    it('should load saved completions', () => {
      const testCompletions = { '1': { '2026-01-15': { completed: true } } };
      localStorage.setItem('habitCompletions', JSON.stringify(testCompletions));
      
      const completions = storageService.loadCompletions();
      expect(completions).toEqual(testCompletions);
    });
  });
  
  describe('saveCompletions', () => {
    it('should save completions to localStorage', () => {
      const completions = { '1': { '2026-01-15': { completed: true } } };
      
      storageService.saveCompletions(completions);
      
      const saved = JSON.parse(localStorage.getItem('habitCompletions'));
      expect(saved).toEqual(completions);
    });
  });
});
