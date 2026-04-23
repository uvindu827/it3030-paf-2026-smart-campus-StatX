// frontend/src/pages/admin/AdminDashboard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Building2,
  Ticket,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  Activity,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data - Replace with real API calls
  const stats = [
    {
      title: 'Total Bookings',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Facilities',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Open Tickets',
      value: '18',
      change: '-5',
      trend: 'down',
      icon: Ticket,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Total Users',
      value: '342',
      change: '+24',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const recentBookings = [
    { id: 1, resource: 'Lab A', user: 'John Doe', status: 'Approved', date: '2026-04-20' },
    { id: 2, resource: 'Meeting Room B', user: 'Jane Smith', status: 'Pending', date: '2026-04-21' },
    { id: 3, resource: 'Auditorium', user: 'Bob Wilson', status: 'Approved', date: '2026-04-22' },
    { id: 4, resource: 'Lab C', user: 'Alice Brown', status: 'Rejected', date: '2026-04-23' },
  ];

  const recentTickets = [
    { id: 1, title: 'Projector not working', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'AC repair needed', status: 'Open', priority: 'Normal' },
    { id: 3, title: 'Broken chair', status: 'Resolved', priority: 'Low' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Approved: 'bg-green-100 text-green-700 border-green-300',
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Rejected: 'bg-red-100 text-red-700 border-red-300',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
      Open: 'bg-orange-100 text-orange-700 border-orange-300',
      Resolved: 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      High: 'bg-red-100 text-red-700',
      Normal: 'bg-blue-100 text-blue-700',
      Low: 'bg-gray-100 text-gray-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-primary-100">
              Here's what's happening with your campus today
            </p>
          </div>
          <Activity size={64} className="text-white/20" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <Icon size={24} className={stat.textColor} />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                    <TrendingUp
                      size={16}
                      className={stat.trend === 'down' ? 'rotate-180' : ''}
                    />
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
            <Link
              to="/admin/bookings"
              className="text-white hover:text-blue-100 transition-colors flex items-center gap-1 text-sm"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{booking.resource}</h4>
                    <p className="text-sm text-gray-600">
                      {booking.user} • {booking.date}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Tickets</h2>
            <Link
              to="/admin/tickets"
              className="text-white hover:text-orange-100 transition-colors flex items-center gap-1 text-sm"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/bookings"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 border border-blue-200"
          >
            <Calendar size={24} className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Manage Bookings</h3>
              <p className="text-sm text-blue-700">View and approve requests</p>
            </div>
          </Link>

          <Link
            to="/admin/facilities"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 border border-green-200"
          >
            <Building2 size={24} className="text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Manage Facilities</h3>
              <p className="text-sm text-green-700">Add or edit resources</p>
            </div>
          </Link>

          <Link
            to="/admin/tickets"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all duration-200 border border-orange-200"
          >
            <Ticket size={24} className="text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">Manage Tickets</h3>
              <p className="text-sm text-orange-700">Handle maintenance issues</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;