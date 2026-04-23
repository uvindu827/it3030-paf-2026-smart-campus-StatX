import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Building2, Ticket, TrendingUp, 
  Users, ArrowUpRight, Activity 
} from 'lucide-react';

// Import your existing service functions
import { getAllBookings } from '../../services/bookingService'; 
// Assuming you have a similar setup for resources:
// import { getAllResources } from '../../services/resourceService'; 

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Use your actual Axios functions
        // Note: If you haven't built resourceService yet, you can comment that part out
        const bookings = await getAllBookings();
        
        // Mocking resources if the service isn't ready, otherwise: 
        // const resources = await getAllResources(); 
        const mockResourcesCount = 24; 

        // Calculate dynamic values
        const pendingCount = bookings.filter(b => b.status === 'Pending').length;

        setStats([
          {
            title: 'Total Bookings',
            value: bookings.length.toString(),
            change: '+12%',
            trend: 'up',
            icon: Calendar,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
          },
          {
            title: 'Active Facilities',
            value: mockResourcesCount.toString(),
            change: 'Live',
            trend: 'up',
            icon: Building2,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
          },
          {
            title: 'Pending Requests',
            value: pendingCount.toString(),
            change: 'Action Required',
            trend: pendingCount > 0 ? 'up' : 'down',
            icon: Ticket,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
          },
          {
            title: 'Campus Users',
            value: '342',
            change: '+24',
            trend: 'up',
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
          },
        ]);

        // Take the 4 most recent bookings
        setRecentBookings(bookings.slice(0, 4));

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ... (keep your getStatusColor and JSX return the same as before)
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Approved: 'bg-green-100 text-green-700 border-green-300',
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Rejected: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-blue-100">Here's the real-time status of the campus resources.</p>
          </div>
          <Activity size={64} className="text-white/20" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <Icon size={24} className={stat.textColor} />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Live Booking Feed</h2>
            <Link to="/admin/bookings" className="text-white hover:underline flex items-center gap-1 text-sm">
              Manage <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{booking.resourceName}</h4>
                    <p className="text-sm text-gray-600">{booking.userName} • {booking.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick Actions - Kept static as they are navigational links */}
        <div className="bg-white rounded-xl shadow-md p-6">
           <h2 className="text-xl font-bold text-gray-900 mb-4">System Shortcuts</h2>
           <div className="flex flex-col gap-4">
             <Link to="/admin/facilities" className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                <p className="font-bold text-green-800">Add New Resource</p>
                <p className="text-sm text-green-600">Update campus inventory</p>
             </Link>
             <Link to="/admin/bookings" className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                <p className="font-bold text-blue-800">Pending Approvals</p>
                <p className="text-sm text-blue-600">Review user requests</p>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;