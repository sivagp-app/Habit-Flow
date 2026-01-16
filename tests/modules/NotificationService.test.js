import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NotificationService } from '../../js/modules/NotificationService.js';

describe('NotificationService.js', () => {
  let service;
  
  beforeEach(() => {
    service = new NotificationService();
    document.body.innerHTML = '';
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
  });
  
  describe('show', () => {
    it('should create notification element', () => {
      service.show('Test message');
      
      const notification = document.querySelector('.notification');
      expect(notification).toBeTruthy();
    });
    
    it('should display message text', () => {
      service.show('Test message');
      
      const notification = document.querySelector('.notification');
      expect(notification.textContent).toContain('Test');
    });
  });
  
  describe('success', () => {
    it('should show success notification', () => {
      service.success('Success!');
      
      const notification = document.querySelector('.notification');
      expect(notification).toBeTruthy();
    });
  });
  
  describe('error', () => {
    it('should show error notification', () => {
      service.error('Error!');
      
      const notification = document.querySelector('.notification');
      expect(notification).toBeTruthy();
    });
  });
  
  describe('info', () => {
    it('should show info notification', () => {
      service.info('Info!');
      
      const notification = document.querySelector('.notification');
      expect(notification).toBeTruthy();
    });
  });
});
