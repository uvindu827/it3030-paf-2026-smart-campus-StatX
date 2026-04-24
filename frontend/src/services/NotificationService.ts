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

  export const notificationService = {

    async getAllNotifications(page: number = 0, size: number = 10): Promise<any> {
      const response = await fetch(
        `${API_BASE_URL}?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();

      // This maps the HATEOAS structure to the keys your Page expects
      return {
        content: data._embedded ? data._embedded.notifications : [],
        totalPages: data.page?.totalPages || 0,
        totalElements: data.page?.totalElements || 0,
        number: data.page?.number || 0
      };
    },

    /**
     * Get unread notifications - Updated for CollectionModel
     */
    async getUnreadNotifications(): Promise<Notification[]> {
      const response = await fetch(`${API_BASE_URL}/unread`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch unread notifications');

      const data = await response.json();
      // HATEOAS change: Extract the array from _embedded
      return data._embedded?.notifications || data.content || [];
    },

    /**
     * Get unread count - Updated for RESTful URI path change
     */
    async getUnreadCount(): Promise<number> {
      // Note: We changed the URI to /counts/unread to be more RESTful
      const response = await fetch(`${API_BASE_URL}/counts/unread`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch unread count');

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
      const response = await fetch(`${API_BASE_URL}/preferences/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }
    },
};