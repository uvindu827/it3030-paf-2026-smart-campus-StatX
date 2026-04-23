// frontend/src/components/AdminSidebar.tsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Building2,
  Ticket,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Users,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      badge: null,
    },
    {
      title: 'Booking Management',
      icon: Calendar,
      path: '/admin/bookings',
      badge: null,
    },
    {
      title: 'Facility Management',
      icon: Building2,
      path: '/admin/facilities',
      badge: null,
    },
    {
      title: 'Ticket Management',
      icon: Ticket,
      path: '/admin/tickets',
      badge: 'Coming Soon',
    },
    {
      title: 'User Management',
      icon: Users,
      path: '/admin/users',
      badge: 'Coming Soon',
    },
  ];

  const bottomMenuItems = [
    {
      title: 'Notifications',
      icon: Bell,
      path: '/notifications',
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white w-72 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Admin Panel</h2>
              <p className="text-xs text-gray-400">SmartCampus</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {/* Main Menu */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Main Menu
            </p>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                        active
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg'
                          : 'hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`${
                          active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                        }`}
                      />
                      <span
                        className={`flex-1 font-medium ${
                          active ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-semibold">
                          {item.badge}
                        </span>
                      )}
                      {active && <ChevronRight size={16} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom Menu */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Quick Access
            </p>
            <ul className="space-y-1">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                        active
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg'
                          : 'hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`${
                          active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                        }`}
                      />
                      <span
                        className={`flex-1 font-medium ${
                          active ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Footer - User Profile */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-gray-400">admin@smartcampus.com</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors font-medium">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;