/**
 * Notification Service Module
 * Handles user notifications and feedback messages
 * Phase 2A - Modular Architecture
 */

export class NotificationService {
    /**
     * Show a notification to the user
     * @param {string} message - Message to display
     * @param {string} type - 'success', 'error', or 'info'
     */
    show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Inline styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-family: var(--font-body, sans-serif);
            font-size: 0.9rem;
            font-weight: 500;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    /**
     * Show success notification
     */
    success(message) {
        this.show(message, 'success');
    }
    
    /**
     * Show error notification
     */
    error(message) {
        this.show(message, 'error');
    }
    
    /**
     * Show info notification
     */
    info(message) {
        this.show(message, 'info');
    }
}
