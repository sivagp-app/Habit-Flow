import { describe, it, expect, beforeEach } from 'vitest';
import { HabitManager } from '../../js/modules/HabitManager.js';

describe('HabitManager.js', () => {
  let habitManager;
  let mockStorage;
  let mockNotification;
  
  beforeEach(() => {
    mockStorage = {
      saveHabits: vi.fn(),
      saveCompletions: vi.fn()
    };
    mockNotification = {
      success: vi.fn(),
      error: vi.fn()
    };
    habitManager = new HabitManager(mockStorage, mockNotification);
  });
  
  describe('createHabit', () => {
    it('should create a new habit', () => {
      const habits = [];
      const completions = {};
      const habitData = { name: 'Read', icon: '📚' };
      
      const newHabit = habitManager.createHabit(habitData, habits, completions);
      
      expect(newHabit).toHaveProperty('id');
      expect(newHabit.name).toBe('Read');
      expect(newHabit.icon).toBe('📚');
      expect(habits).toHaveLength(1);
    });
    
    it('should initialize today completion', () => {
      const habits = [];
      const completions = {};
      
      habitManager.createHabit({ name: 'Read' }, habits, completions);
      
      const habitId = habits[0].id;
      expect(completions[habitId]).toBeDefined();
    });
  });
  
  describe('updateHabit', () => {
    it('should update habit properties', () => {
      const habits = [{ id: '1', name: 'Read', icon: '📚' }];
      
      habitManager.updateHabit('1', { name: 'Read Daily' }, habits);
      
      expect(habits[0].name).toBe('Read Daily');
      expect(habits[0].icon).toBe('📚');
    });
  });
  
  describe('deleteHabit', () => {
    it('should remove habit from array', () => {
      const habits = [{ id: '1', name: 'Read' }];
      const completions = { '1': {} };
      
      habitManager.deleteHabit('1', habits, completions);
      
      expect(habits).toHaveLength(0);
      expect(completions['1']).toBeUndefined();
    });
  });
  
  describe('getHabit', () => {
    it('should retrieve habit by id', () => {
      const habits = [
        { id: '1', name: 'Read' },
        { id: '2', name: 'Exercise' }
      ];
      
      const habit = habitManager.getHabit('2', habits);
      
      expect(habit.name).toBe('Exercise');
    });
  });
  
  describe('toggleHabit', () => {
    it('should mark habit as complete', () => {
      const habits = [{ id: '1', name: 'Read', goal: 1 }];
      const completions = {};
      
      habitManager.toggleHabit('1', habits, completions);
      
      expect(completions['1']).toBeDefined();
    });
  });
});
