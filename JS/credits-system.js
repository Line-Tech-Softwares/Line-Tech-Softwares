/**
 * Credits System - Universal Daily Credits Manager
 * Handles daily 10 credits that reset at midnight for all tools
 * Features: Daily reset, cross-tool storage, persistence
 */

class CreditsManager {
    constructor(toolName = 'global') {
        this.toolName = toolName;
        this.storageKey = `credits_${toolName}`;
        this.lastResetKey = `credits_lastReset_${toolName}`;
        this.dailyLimit = 10;
        this.init();
    }

    // Initialize and check if reset is needed
    init() {
        const lastReset = localStorage.getItem(this.lastResetKey);
        const today = this.getToday();
        
        if (!lastReset || lastReset !== today) {
            // Reset credits for a new day
            localStorage.setItem(this.storageKey, this.dailyLimit);
            localStorage.setItem(this.lastResetKey, today);
        }
    }

    // Get today's date as YYYY-MM-DD
    getToday() {
        return new Date().toISOString().split('T')[0];
    }

    // Get remaining credits
    getRemaining() {
        const credits = localStorage.getItem(this.storageKey);
        return credits ? Math.max(0, parseInt(credits)) : this.dailyLimit;
    }

    // Use credits
    useCredits(amount = 1) {
        const remaining = this.getRemaining();
        if (remaining >= amount) {
            localStorage.setItem(this.storageKey, remaining - amount);
            return true;
        }
        return false;
    }

    // Get total used today
    getUsedToday() {
        return this.dailyLimit - this.getRemaining();
    }

    // Check if user has enough credits
    hasCredits(amount = 1) {
        return this.getRemaining() >= amount;
    }

    // Refund credits (for error handling)
    refundCredits(amount = 1) {
        const remaining = this.getRemaining();
        const newAmount = Math.min(this.dailyLimit, remaining + amount);
        localStorage.setItem(this.storageKey, newAmount);
    }

    // Get reset time (when credits will reset)
    getResetTime() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }

    // Get time until reset (in minutes)
    getTimeUntilReset() {
        const now = new Date();
        const resetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        resetTime.setHours(0, 0, 0, 0);
        return Math.floor((resetTime - now) / (60 * 1000));
    }
}

// Global instance for easy access
window.creditsManager = new CreditsManager('global');

// Update credits display in UI
function updateCreditsDisplay(elemId = 'credits-remaining') {
    const elem = document.getElementById(elemId);
    if (elem) {
        const remaining = window.creditsManager.getRemaining();
        elem.textContent = remaining;
        
        // Update status
        const statusElem = document.getElementById('credits-status');
        if (statusElem) {
            if (remaining === 0) {
                statusElem.textContent = 'Reset Tomorrow';
                statusElem.style.color = '#ef4444';
            } else if (remaining <= 3) {
                statusElem.textContent = 'Low Credits';
                statusElem.style.color = '#f59e0b';
            } else {
                statusElem.textContent = 'Credits Available';
                statusElem.style.color = '#10b981';
            }
        }
    }
}

// Attempt to use credits (returns true if successful)
function attemptUseCredits(amount = 1, toolName = 'tool') {
    if (window.creditsManager.useCredits(amount)) {
        updateCreditsDisplay();
        return true;
    } else {
        showNotification('❌ No credits available! Reset tomorrow.', 'error');
        return false;
    }
}

// Show notification (generic function used across all tools)
function showNotification(msg, type = 'success') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = msg;
    n.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// Add animation for notifications
if (!document.querySelector('style[data-credits-notif]')) {
    const style = document.createElement('style');
    style.setAttribute('data-credits-notif', 'true');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize credits display on page load
window.addEventListener('DOMContentLoaded', () => {
    updateCreditsDisplay();
    
    // Auto-update every minute
    setInterval(updateCreditsDisplay, 60000);
});
