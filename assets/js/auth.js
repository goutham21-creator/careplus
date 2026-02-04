/* 
 * CarePlus Hospital - Phase 3 Authentication Utilities
 * Handles role-based authentication, session management, and access control
 */

// Phase 3: Get current logged-in user
export function getCurrentUser() {
    const userJSON = sessionStorage.getItem('careplus_user');
    if (!userJSON) return null;
    try {
        return JSON.parse(userJSON);
    } catch (e) {
        console.error('Failed to parse user data:', e);
        return null;
    }
}

// Phase 3: Check if user is authenticated
export function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Phase 3: Check user role
export function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

// Phase 3: Require authentication (redirect to login if not authenticated)
export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'auth.html';
        return false;
    }
    return true;
}

// Phase 3: Require specific role
export function requireRole(role) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'auth.html';
        return false;
    }
    if (user.role !== role) {
        alert('Unauthorized access. You do not have permission to access this page.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Phase 3: Logout user
export function logout() {
    sessionStorage.removeItem('careplus_user');
    window.location.href = 'index.html';
}

// Phase 3: Get user display name
export function getUserName() {
    const user = getCurrentUser();
    return user?.name || 'User';
}

// Phase 3: Update user session
export function updateUserSession(updates) {
    const user = getCurrentUser();
    if (!user) return;
    const updated = { ...user, ...updates };
    sessionStorage.setItem('careplus_user', JSON.stringify(updated));
}

// Phase 3: Show notification
export function showNotification(message, type = 'info') {
    // Simple notification (can be enhanced with toast UI)
    const notifDiv = document.createElement('div');
    notifDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
        notifDiv.style.background = '#34c759';
        notifDiv.style.color = 'white';
    } else if (type === 'error') {
        notifDiv.style.background = '#ff3b30';
        notifDiv.style.color = 'white';
    } else {
        notifDiv.style.background = '#0071e3';
        notifDiv.style.color = 'white';
    }

    notifDiv.textContent = message;
    document.body.appendChild(notifDiv);

    setTimeout(() => {
        notifDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notifDiv.remove(), 300);
    }, 3000);
}

// Phase 3: Add CSS animations for notifications
if (!document.querySelector('#notifAnimations')) {
    const style = document.createElement('style');
    style.id = 'notifAnimations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
