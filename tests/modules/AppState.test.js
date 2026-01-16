/**
 * AppState Module Tests - CUSTOM FOR YOUR REPO
 * Tests state management and observer pattern
 * 
 * Matches YOUR actual AppState.js from GitHub
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppState } from '../../js/modules/AppState.js';

describe('AppState.js', () => {
  let appState;
  
  beforeEach(() => {
    appState = new AppState();
  });
  
  describe('Initialization', () => {
    it('should initialize with empty habits', () => {
      const habits = appState.getHabits();
      
      expect(habits).toEqual([]);
    });
    
    it('should initialize with empty completions', () => {
      const completions = appState.getCompletions();
      
      expect(completions).toEqual({});
    });
    
    it('should initialize with default settings', () => {
      const settings = appState.getSettings();
      
      expect(settings).toBeDefined();
      expect(typeof settings).toBe('object');
    });
  });
  
  describe('Habits Management', () => {
    it('should add a habit', () => {
      const habit = { id: '1', name: 'Read', icon: '📚' };
      
      appState.addHabit(habit);
      
      expect(appState.getHabits()).toContainEqual(habit);
    });
    
    it('should update a habit', () => {
      const habit = { id: '1', name: 'Read', icon: '📚' };
      appState.addHabit(habit);
      
      appState.updateHabit('1', { name: 'Read Daily' });
      
      const updated = appState.getHabit('1');
      expect(updated.name).toBe('Read Daily');
      expect(updated.icon).toBe('📚');
    });
    
    it('should remove a habit', () => {
      const habit = { id: '1', name: 'Read', icon: '📚' };
      appState.addHabit(habit);
      
      appState.removeHabit('1');
      
      expect(appState.getHabits()).not.toContainEqual(habit);
    });
    
    it('should get habit by id', () => {
      const habit = { id: '1', name: 'Read', icon: '📚' };
      appState.addHabit(habit);
      
      const retrieved = appState.getHabit('1');
      
      expect(retrieved).toEqual(habit);
    });
    
    it('should set habits array', () => {
      const habits = [
        { id: '1', name: 'Read', icon: '📚' },
        { id: '2', name: 'Exercise', icon: '💪' }
      ];
      
      appState.setHabits(habits);
      
      expect(appState.getHabits()).toEqual(habits);
    });
    
    it('should return a copy of habits (immutability)', () => {
      const habits = [{ id: '1', name: 'Read', icon: '📚' }];
      appState.setHabits(habits);
      
      const retrieved = appState.getHabits();
      retrieved.push({ id: '999', name: 'Sneaky', icon: '🤐' });
      
      // Original should be unchanged
      expect(appState.getHabits()).toHaveLength(1);
      expect(appState.getHabits()[0].id).toBe('1');
    });
  });
  
  describe('Completions Management', () => {
    it('should set completion for a habit', () => {
      const completion = { completed: true, value: 1 };
      
      appState.setCompletion('1', '2026-01-15', completion);
      
      expect(appState.getCompletion('1', '2026-01-15')).toEqual(completion);
    });
    
    it('should get completion for a habit on a date', () => {
      const completion = { completed: true, value: 1 };
      appState.setCompletion('1', '2026-01-15', completion);
      
      const retrieved = appState.getCompletion('1', '2026-01-15');
      
      expect(retrieved).toEqual(completion);
    });
    
    it('should return null for non-existent completion', () => {
      const completion = appState.getCompletion('999', '2026-01-15');
      
      expect(completion).toBeNull();
    });
    
    it('should get all completions for a habit', () => {
      appState.setCompletion('1', '2026-01-15', { completed: true });
      appState.setCompletion('1', '2026-01-14', { completed: true });
      
      const completions = appState.getHabitCompletions('1');
      
      expect(completions).toHaveProperty('2026-01-15');
      expect(completions).toHaveProperty('2026-01-14');
    });
    
    it('should set all completions', () => {
      const completions = {
        '1': {
          '2026-01-15': { completed: true }
        }
      };
      
      appState.setCompletions(completions);
      
      expect(appState.getCompletions()).toEqual(completions);
    });
    
    it('should remove habit completions', () => {
      appState.setCompletion('1', '2026-01-15', { completed: true });
      appState.setCompletion('1', '2026-01-14', { completed: true });
      
      appState.removeHabitCompletions('1');
      
      expect(appState.getHabitCompletions('1')).toEqual({});
    });
  });
  
  describe('Settings Management', () => {
    it('should check if ADHD mode is enabled (isADHDMode)', () => {
      const adhdMode = appState.isADHDMode();
      
      expect(typeof adhdMode).toBe('boolean');
    });
    
    it('should set ADHD mode', () => {
      appState.setADHDMode(true);
      
      expect(appState.isADHDMode()).toBe(true);
    });
    
    it('should check if focus mode is enabled (isFocusMode)', () => {
      const focusMode = appState.isFocusMode();
      
      expect(typeof focusMode).toBe('boolean');
    });
    
    it('should set focus mode', () => {
      appState.setFocusMode(true);
      
      expect(appState.isFocusMode()).toBe(true);
    });
    
    it('should check if notifications are enabled (areNotificationsEnabled)', () => {
      const enabled = appState.areNotificationsEnabled();
      
      expect(typeof enabled).toBe('boolean');
    });
    
    it('should set notifications enabled', () => {
      appState.setNotificationsEnabled(true);
      
      expect(appState.areNotificationsEnabled()).toBe(true);
    });
    
    it('should set individual setting via setSetting', () => {
      appState.setSetting('customSetting', 'test-value');
      
      expect(appState.getSetting('customSetting')).toBe('test-value');
    });
    
    it('should get individual setting via getSetting', () => {
      appState.setSetting('key', 'value');
      
      const value = appState.getSetting('key');
      
      expect(value).toBe('value');
    });
    
    it('should set all settings via setSettings', () => {
      const settings = {
        adhdMode: true,
        focusMode: true,
        notificationsEnabled: false
      };
      
      appState.setSettings(settings);
      
      const retrieved = appState.getSettings();
      expect(retrieved.adhdMode).toBe(true);
      expect(retrieved.focusMode).toBe(true);
      expect(retrieved.notificationsEnabled).toBe(false);
    });
    
    it('should get all settings via getSettings', () => {
      const settings = appState.getSettings();
      
      expect(settings).toBeDefined();
      expect(typeof settings).toBe('object');
    });
  });
  
  describe('Observer Pattern', () => {
    it('should subscribe to events', () => {
      const callback = vi.fn();
      
      appState.subscribe('habitsChanged', callback);
      appState.setHabits([{ id: '1', name: 'Test' }]);
      
      expect(callback).toHaveBeenCalled();
    });
    
    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      
      const unsubscribe = appState.subscribe('habitsChanged', callback);
      
      expect(typeof unsubscribe).toBe('function');
    });
    
    it('should unsubscribe using returned function', () => {
      const callback = vi.fn();
      
      const unsubscribe = appState.subscribe('habitsChanged', callback);
      unsubscribe();
      appState.setHabits([{ id: '1' }]);
      
      expect(callback).not.toHaveBeenCalled();
    });
    
    it('should notify on habit added', () => {
      const callback = vi.fn();
      appState.subscribe('habitAdded', callback);
      
      const habit = { id: '1', name: 'Test' };
      appState.addHabit(habit);
      
      expect(callback).toHaveBeenCalledWith(habit, 'habitAdded');
    });
    
    it('should notify on habit updated', () => {
      const callback = vi.fn();
      appState.subscribe('habitUpdated', callback);
      
      appState.addHabit({ id: '1', name: 'Test' });
      appState.updateHabit('1', { name: 'Updated' });
      
      expect(callback).toHaveBeenCalled();
    });
    
    it('should notify on habit removed', () => {
      const callback = vi.fn();
      appState.subscribe('habitRemoved', callback);
      
      appState.addHabit({ id: '1', name: 'Test' });
      appState.removeHabit('1');
      
      expect(callback).toHaveBeenCalled();
    });
    
    it('should notify on completions changed', () => {
      const callback = vi.fn();
      appState.subscribe('completionsChanged', callback);
      
      appState.setCompletion('1', '2026-01-15', { completed: true });
      
      expect(callback).toHaveBeenCalled();
    });
    
    it('should notify on settings changed', () => {
      const callback = vi.fn();
      appState.subscribe('settingsChanged', callback);
      
      appState.setADHDMode(true);
      
      expect(callback).toHaveBeenCalled();
    });
    
    it('should support multiple observers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      appState.subscribe('habitsChanged', callback1);
      appState.subscribe('habitsChanged', callback2);
      appState.setHabits([{ id: '1' }]);
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });
  
  describe('State Snapshot', () => {
    it('should get complete state snapshot', () => {
      appState.setHabits([{ id: '1', name: 'Test' }]);
      appState.setCompletion('1', '2026-01-15', { completed: true });
      appState.setADHDMode(true);
      
      const snapshot = appState.getSnapshot();
      
      expect(snapshot).toHaveProperty('habits');
      expect(snapshot).toHaveProperty('completions');
      expect(snapshot).toHaveProperty('settings');
      expect(snapshot.habits).toHaveLength(1);
      expect(snapshot.settings.adhdMode).toBe(true);
    });
  });
  
  describe('State Reset', () => {
    it('should reset to initial state', () => {
      appState.setHabits([{ id: '1', name: 'Test' }]);
      appState.setCompletion('1', '2026-01-15', { completed: true });
      appState.setADHDMode(true);
      
      appState.reset();
      
      expect(appState.getHabits()).toEqual([]);
      expect(appState.getCompletions()).toEqual({});
    });
    
    it('should notify on reset', () => {
      const callback = vi.fn();
      appState.subscribe('stateReset', callback);
      
      appState.reset();
      
      expect(callback).toHaveBeenCalled();
    });
  });
});
