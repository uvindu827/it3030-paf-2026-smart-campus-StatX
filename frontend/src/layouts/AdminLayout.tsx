// frontend/src/layouts/AdminLayout.tsx

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Menu, Bell } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Admin Dashboard';
    if (location.pathname === '/admin/bookings') return 'Booking Management';
    if (location.pathname === '/admin/facilities') return 'Facility Management';
    if (location.pathname === '/admin/tickets') return 'Ticket Management';
    if (location.pathname === '/admin/users') return 'User Management';
    if (location.pathname === '/admin/settings') return 'Settings';
    return 'Admin Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-md z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>

            {/* Page Title - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-600">Manage your campus operations</p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 ml-auto">

              {/* Admin Avatar (Mobile) */}
              <div className="lg:hidden w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;