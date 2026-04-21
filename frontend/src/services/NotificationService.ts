// frontend/src/services/notificationService.ts

const API_BASE_URL = 'http://localhost:8080/api/v1/notifications';

// Get JWT token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface Notification {
  id: number;
  type: string;
  message: string;
  referenceId: number | null;
  referenceType: string | null;
  isRead: boolean;
  createdAt: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  userId: number;
  userEmail: string;
}

export interface NotificationPreference {
  id: number | null;
  notificationType: string;
  enabled: boolean;
}

/**
 * Notification Service
 * 
 * Handles all API calls for notifications
 */
export const notificationService = {
  /**
   * Get all notifications (paginated)
   */
  async getAllNotifications(page: number = 0, size: number = 10): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}?page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  /**
   * Get unread notifications
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/unread`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread notifications');
    }

    return response.json();
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/count`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    const data = await response.json();
    return data.count;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${notificationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mark-all-read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to mark all as read');
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${notificationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreference[]> {
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch preferences');
    }

    return response.json();
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Record<string, boolean>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ preferences }),
    });

    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }
  },
};