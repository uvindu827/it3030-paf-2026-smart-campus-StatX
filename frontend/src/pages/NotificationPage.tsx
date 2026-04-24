// frontend/src/pages/NotificationsPage.tsx

import React, { useState, useEffect } from 'react';
import { Bell, Filter, Trash2, CheckCheck, Settings, ArrowLeft, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { notificationService, Notification } from '../services/NotificationService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      if (filter === 'unread') {
        const data = await notificationService.getUnreadNotifications();
        // Ensure data is an array
        const unreadList = Array.isArray(data) ? data : [];
        setNotifications(unreadList);
        setTotalElements(unreadList.length);
        setTotalPages(1);
      } else {
        const data = await notificationService.getAllNotifications(currentPage, pageSize);
        
        // HATEOAS Fix: Extract content from the object we returned in the service
        const content = Array.isArray(data.content) ? data.content : [];
        setNotifications(content);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
      setNotifications([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // ADD GUARDS HERE: Ensure notifications is an array before filtering
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const filteredNotifications = typeFilter === 'all' 
    ? safeNotifications 
    : safeNotifications.filter(n => n.type === typeFilter);

  const unreadCount = safeNotifications.filter(n => !n.isRead).length;
  const highPriorityCount = safeNotifications.filter(n => n.priority === 'HIGH').length;

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await notificationService.deleteNotification(notificationId);
        fetchNotifications();
        toast.success('Notification deleted');
      } catch (error) {
        toast.error('Failed to delete notification');
      }
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

  const getPriorityStyles = (priority: string) => {
    const styles: Record<string, string> = {
      HIGH: 'bg-red-100 text-red-700 border-red-300',
      NORMAL: 'bg-blue-100 text-blue-700 border-blue-300',
      LOW: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return styles[priority] || 'bg-blue-100 text-blue-700 border-blue-300';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            
            <Link 
              to="/notification-settings" 
              className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors duration-200 font-medium"
            >
              <Settings size={20} />
              Settings
            </Link>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Bell size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Stay updated with your latest activities</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="text-3xl font-bold text-blue-700">{totalElements}</div>
              <div className="text-sm text-blue-600 font-medium">Total Notifications</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="text-3xl font-bold text-purple-700">{unreadCount}</div>
              <div className="text-sm text-purple-600 font-medium">Unread</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="text-3xl font-bold text-red-700">{highPriorityCount}</div>
              <div className="text-sm text-red-600 font-medium">High Priority</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Notifications
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'unread'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Unread Only
              </button>
            </div>

            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              <option value="BOOKING_APPROVED">Booking Approved</option>
              <option value="BOOKING_REJECTED">Booking Rejected</option>
              <option value="TICKET_STATUS_CHANGED">Ticket Updates</option>
              <option value="COMMENT_ADDED">Comments</option>
            </select>

            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Bell size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No notifications found</h2>
            <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in ${
                  !notification.isRead ? 'border-l-4 border-primary-500' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getPriorityStyles(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        {!notification.isRead && (
                          <span className="ml-auto px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="text-gray-800 leading-relaxed mb-2">
                        {notification.message}
                      </p>

                      {notification.referenceType && (
                        <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {notification.referenceType} #{notification.referenceId}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                          title="Mark as read"
                        >
                          <CheckCheck size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            
            <span className="text-gray-700 font-medium">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;