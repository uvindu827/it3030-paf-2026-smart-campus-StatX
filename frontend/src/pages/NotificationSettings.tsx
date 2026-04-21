// frontend/src/pages/NotificationSettingsPage.tsx

import React, { useState, useEffect } from 'react';
import { Settings, ArrowLeft, Save, RotateCcw, Bell, Check } from 'lucide-react';
import { notificationService, NotificationPreference } from '../services/NotificationService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const NotificationSettingsPage: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (notificationType: string) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.notificationType === notificationType
          ? { ...pref, enabled: !pref.enabled }
          : pref
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const prefsMap: Record<string, boolean> = {};
      preferences.forEach(pref => {
        prefsMap[pref.notificationType] = pref.enabled;
      });
      
      await notificationService.updatePreferences(prefsMap);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all preferences to default (all enabled)?')) {
      try {
        // Reset by enabling all
        const updatedPrefs = preferences.map(pref => ({ ...pref, enabled: true }));
        setPreferences(updatedPrefs);
        toast.success('Preferences reset to defaults');
      } catch (error) {
        toast.error('Failed to reset preferences');
      }
    }
  };

  const getNotificationInfo = (type: string) => {
    const info: Record<string, { icon: string; title: string; description: string; color: string }> = {
      BOOKING_APPROVED: {
        icon: '✅',
        title: 'Booking Approved',
        description: 'Get notified when your booking requests are approved',
        color: 'from-green-400 to-green-600',
      },
      BOOKING_REJECTED: {
        icon: '❌',
        title: 'Booking Rejected',
        description: 'Get notified when your booking requests are rejected',
        color: 'from-red-400 to-red-600',
      },
      BOOKING_CANCELLED: {
        icon: '🚫',
        title: 'Booking Cancelled',
        description: 'Get notified when bookings are cancelled',
        color: 'from-orange-400 to-orange-600',
      },
      TICKET_STATUS_CHANGED: {
        icon: '🔄',
        title: 'Ticket Status Changed',
        description: 'Get notified when your ticket status changes',
        color: 'from-blue-400 to-blue-600',
      },
      TICKET_ASSIGNED: {
        icon: '👤',
        title: 'Ticket Assigned',
        description: 'Get notified when you are assigned to a ticket',
        color: 'from-purple-400 to-purple-600',
      },
      TICKET_RESOLVED: {
        icon: '✔️',
        title: 'Ticket Resolved',
        description: 'Get notified when your tickets are resolved',
        color: 'from-teal-400 to-teal-600',
      },
      TICKET_CLOSED: {
        icon: '🔒',
        title: 'Ticket Closed',
        description: 'Get notified when tickets are closed',
        color: 'from-gray-400 to-gray-600',
      },
      TICKET_REJECTED: {
        icon: '⛔',
        title: 'Ticket Rejected',
        description: 'Get notified when tickets are rejected',
        color: 'from-red-400 to-red-600',
      },
      COMMENT_ADDED: {
        icon: '💬',
        title: 'Comments',
        description: 'Get notified when someone comments on your tickets',
        color: 'from-indigo-400 to-indigo-600',
      },
      COMMENT_REPLY: {
        icon: '↩️',
        title: 'Comment Replies',
        description: 'Get notified when someone replies to your comments',
        color: 'from-pink-400 to-pink-600',
      },
      SYSTEM_ANNOUNCEMENT: {
        icon: '📢',
        title: 'System Announcements',
        description: 'Get notified about important system updates',
        color: 'from-yellow-400 to-yellow-600',
      },
      MAINTENANCE_SCHEDULED: {
        icon: '🔧',
        title: 'Maintenance Scheduled',
        description: 'Get notified about scheduled maintenance',
        color: 'from-cyan-400 to-cyan-600',
      },
    };
    return info[type] || {
      icon: '📧',
      title: type,
      description: 'Notification preference',
      color: 'from-gray-400 to-gray-600',
    };
  };

  const enabledCount = preferences.filter(p => p.enabled).length;
  const totalCount = preferences.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/notifications" 
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Back to Notifications
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Settings size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
              <p className="text-gray-600">Customize which notifications you want to receive</p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary-700">{enabledCount} / {totalCount}</div>
                <div className="text-sm text-primary-600">Notification types enabled</div>
              </div>
              <Bell size={40} className="text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading preferences...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {preferences.map((pref, index) => {
                const info = getNotificationInfo(pref.notificationType);
                return (
                  <div
                    key={pref.notificationType}
                    className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in ${
                      pref.enabled ? 'border-2 border-primary-300' : 'border-2 border-transparent'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                            {info.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                            <p className="text-sm text-gray-600">{info.description}</p>
                          </div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                          onClick={() => handleToggle(pref.notificationType)}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            pref.enabled ? 'bg-primary-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                              pref.enabled ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          >
                            {pref.enabled && (
                              <Check size={14} className="text-primary-500 m-0.5" />
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <RotateCcw size={20} />
                Reset to Defaults
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex gap-3">
                <Bell size={24} className="text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tip</h4>
                  <p className="text-sm text-blue-800">
                    Enable only the notifications you need to stay focused. You can always change these settings later.
                    Disabled notifications won't be created, helping keep your notification panel clutter-free!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsPage;