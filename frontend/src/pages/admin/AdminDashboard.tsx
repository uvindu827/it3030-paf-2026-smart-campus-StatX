import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Building2, Ticket, TrendingUp, 
  Users, ArrowUpRight, Activity, MapPin 
} from 'lucide-react';

// Import services
import { getAllBookings } from '../../services/bookingService';
import { getAllResources, Resource } from '../../services/resourceService';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [bookings, resources] = await Promise.all([
          getAllBookings(),
          getAllResources()
        ]);

        setFacilities(resources);

        // Logic calculations
        const activeResources = resources.filter(r => r.status === 'ACTIVE' || r.status === 'AVAILABLE').length;
        const pendingBookings = bookings.filter(b => b.status === 'Pending').length;

        setStats([
          {
            title: 'Total Bookings',
            value: bookings.length.toString(),
            icon: Calendar,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
          },
          {
            title: 'Active Facilities',
            value: activeResources.toString(),
            icon: Building2,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
          },
          {
            title: 'Pending Approvals',
            value: pendingBookings.toString(),
            icon: Ticket,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
          },
          {
            title: 'Resource Types',
            value: [...new Set(resources.map(r => r.type))].length.toString(),
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
          },
        ]);

        // Sort bookings by ID fallback
        const sortedBookings = [...bookings]
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .slice(0, 4);
          
        setRecentBookings(sortedBookings);

      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Approved: 'bg-green-100 text-green-700 border-green-300',
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Rejected: 'bg-red-100 text-red-700 border-red-300',
      ACTIVE: 'bg-green-100 text-green-700',
      AVAILABLE: 'bg-green-100 text-green-700',
      OUT_OF_SERVICE: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👋</h1>
            <p className="text-white/80">Real-time overview of campus facilities and booking requests.</p>
          </div>
          <Activity size={48} className="opacity-20" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
              <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} ${stat.textColor} mb-4`}>
                <stat.icon size={20} />
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Recent Booking Requests</h2>
            <Link to="/admin/bookings" className="text-primary-600 hover:underline text-sm flex items-center gap-1 font-semibold">
              Manage All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.length > 0 ? recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{booking.resourceName || 'Resource'}</h4>
                    <p className="text-xs text-gray-500">{booking.userEmail} • {booking.date}</p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              )) : <p className="text-gray-500 text-center py-4">No recent bookings</p>}
            </div>
          </div>
        </div>

        {/* Facilities List (NEW) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Campus Facilities</h2>
            <Link to="/admin/facilities" className="text-primary-600 hover:underline text-sm flex items-center gap-1 font-semibold">
              Edit Assets <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {facilities.slice(0, 4).map((facility) => (
                <div key={facility.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Building2 size={18} className="text-primary-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{facility.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} /> {facility.location}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${getStatusColor(facility.status)}`}>
                    {facility.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;