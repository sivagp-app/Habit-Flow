import { describe, it, expect, beforeEach } from 'vitest';
import { UIRenderer } from '../../js/modules/UIRenderer.js';

describe('UIRenderer.js', () => {
  let renderer;
  let mockHabitManager;
  let mockStats;
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="currentDate"></div>
      <div id="habitsList"></div>
      <div id="emptyState"></div>
    `;
	mockHabitManager = {};
	mockStats = {
		calculateStreak: () => 5,
		calculateLongestStreak: () => 10,
		calculateOverallStats: () => ({ totalHabits: 0, completedToday: 0 })
	};
	renderer = new UIRenderer(mockHabitManager, mockStats);
  });
  
  describe('initializeUI', () => {
    it('should set current date', () => {
      renderer.initializeUI();
      
      const dateElement = document.getElementById('currentDate');
      expect(dateElement.textContent).toBeTruthy();
    });
  });
  
  describe('renderHabits', () => {
    it('should show empty state when no habits', () => {
      renderer.renderHabits([], {});
      
      const emptyState = document.getElementById('emptyState');
      expect(emptyState.style.display).toBe('block');
    });
    
    it('should hide empty state when habits exist', () => {
      const habits = [{ id: '1', name: 'Read', icon: '📚' }];
      renderer.renderHabits(habits, {});
      
      const emptyState = document.getElementById('emptyState');
      expect(emptyState.style.display).toBe('none');
    });
  });
});
