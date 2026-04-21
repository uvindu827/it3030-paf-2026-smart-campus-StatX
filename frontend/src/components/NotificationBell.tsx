// frontend/src/components/NotificationBell.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { notificationService, Notification } from '../services/NotificationService';
import { toast } from 'react-toastify';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch unread count and notifications
  useEffect(() => {
    fetchUnreadCount();
    fetchUnreadNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (isOpen) {
        fetchUnreadNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchUnreadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getUnreadNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchUnreadNotifications();
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      BOOKING_APPROVED: '✅',
      BOOKING_REJECTED: '❌',
      BOOKING_CANCELLED: '🚫',
      TICKET_STATUS_CHANGED: '🔄',
      TICKET_ASSIGNED: '👤',
      TICKET_RESOLVED: '✔️',
      TICKET_CLOSED: '🔒',
      COMMENT_ADDED: '💬',
      COMMENT_REPLY: '↩️',
    };
    return icons[type] || '📢';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: 'border-red-500',
      NORMAL: 'border-blue-500',
      LOW: 'border-gray-400',
    };
    return colors[priority] || 'border-blue-500';
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button 
        onClick={toggleDropdown}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg animate-pulse-soft">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-down z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-5 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <Bell size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-700 font-semibold mb-2">No unread notifications</p>
                <span className="text-gray-500 text-sm">You're all caught up! 🎉</span>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 border-l-4 ${getPriorityColor(notification.priority)} animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed mb-1 break-words">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(notification.id, e)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="bg-gray-50 px-5 py-3 text-center border-t border-gray-200">
              <a 
                href="/notifications" 
                className="text-primary-500 hover:text-primary-700 font-semibold text-sm transition-colors duration-200"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;