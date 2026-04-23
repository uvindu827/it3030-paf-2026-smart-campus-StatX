import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Building2,
  Ticket,
  Settings,
  LogOut,
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
  const navigate = useNavigate();

  // State to hold user info to force a re-render if needed
  const [userData, setUserData] = useState({
    name: "Admin User",
    email: "admin@smartcampus.com",
    initials: "AU"
  });

  useEffect(() => {
    // 1. Try to find the name/email under various common keys
    const name = localStorage.getItem("userName") || 
                 localStorage.getItem("name") || 
                 localStorage.getItem("user") || 
                 "Admin User";

    const email = localStorage.getItem("userEmail") || 
                  localStorage.getItem("email") || 
                  "admin@smartcampus.com";

    // 2. Generate Initials
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    setUserData({ name, email, initials });
  }, [location.pathname]); // Re-check when navigating

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin', badge: null },
    { title: 'Booking Management', icon: Calendar, path: '/admin/bookings', badge: null },
    { title: 'Facility Management', icon: Building2, path: '/admin/facilities', badge: null },
    { title: 'Ticket Management', icon: Ticket, path: '/admin/tickets', badge: 'Coming Soon' },
    { title: 'User Management', icon: Users, path: '/admin/users', badge: null },
  ];

  const bottomMenuItems = [
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar}></div>
      )}

      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white w-72 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Admin Panel</h2>
              <p className="text-xs text-gray-400 font-medium">SmartCampus</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">Main Menu</p>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link to={item.path} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-800'}`}>
                      <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                      <span className={`flex-1 font-medium ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item.title}</span>
                      {item.badge && <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-[10px] rounded-md font-bold">{item.badge}</span>}
                      {active && <ChevronRight size={16} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">System</p>
            <ul className="space-y-1">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link to={item.path} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-800'}`}>
                      <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                      <span className={`flex-1 font-medium ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Footer - Profile Section */}
        <div className="border-t border-gray-700 p-4 bg-gray-900/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
              {userData.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{userData.name}</p>
              <p className="text-xs text-gray-500 truncate">{userData.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-600 hover:text-white text-red-400 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;