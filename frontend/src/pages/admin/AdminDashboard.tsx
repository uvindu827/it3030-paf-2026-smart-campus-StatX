import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Building2, Ticket, Users, 
  ArrowUpRight, Activity, MapPin, UserPlus, ShieldCheck 
} from 'lucide-react';
import { toast } from 'react-toastify';

// Import services
import { getAllBookings } from '../../services/bookingService';
import { getAllResources, Resource } from '../../services/resourceService';
import { registerAdmin, getAllUsers } from '../../services/userService';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Admin Registration State
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState({ name: '', email: '' });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bookings, resources, users] = await Promise.all([
        getAllBookings(),
        getAllResources(),
        getAllUsers()
      ]);

      setFacilities(resources);

      const activeResources = resources.filter(r => r.status === 'ACTIVE' || r.status === 'AVAILABLE').length;
      const pendingBookings = bookings.filter(b => b.status === 'Pending').length;

      setStats([
        { title: 'Total Bookings', value: bookings.length.toString(), icon: Calendar, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { title: 'Active Facilities', value: activeResources.toString(), icon: Building2, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-600' },
        { title: 'Pending Approvals', value: pendingBookings.toString(), icon: Ticket, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
        { title: 'System Users', value: users.length.toString(), icon: Users, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
      ]);

      setRecentBookings([...bookings].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 4));
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerAdmin(adminData);
      toast.success("New Admin Registered!");
      setShowAdminForm(false);
      setAdminData({ name: '', email: '' });
      fetchDashboardData(); // Refresh stats
    } catch (error) {
      toast.error("Failed to register admin. check permissions.");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6 p-6">
      {/* Welcome & Admin Actions */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👋</h1>
          <p className="text-slate-400 font-medium">Control center for SmartCampus resources.</p>
        </div>
        <button 
          onClick={() => setShowAdminForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          <UserPlus size={20} /> Register New Admin
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
<<<<<<< Updated upstream
          <Link
            key={i}
            to={stat.title === 'Pending Approvals' ? '/admin/bookings' : '#'}
            className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${stat.title === 'Pending Approvals' ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`}
          >
=======
          <Link key={i} to={stat.title === 'Pending Approvals' ? '/admin/bookings' : '#'} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
>>>>>>> Stashed changes
            <div className="p-5">
              <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} ${stat.textColor} mb-4`}><stat.icon size={20} /></div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Calendar className="text-blue-500" size={20}/> Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All →</Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map(b => (
<<<<<<< Updated upstream
              <Link
                key={b.id}
                to={`/booking/${b.id}`}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
=======
              <div key={b.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
>>>>>>> Stashed changes
                <div>
                  <p className="font-bold text-slate-900">{b.resourceName}</p>
                  <p className="text-xs text-slate-500">{b.userEmail}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-white border rounded-full uppercase">{b.status}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Building2 className="text-green-500" size={20}/> Active Facilities</h2>
          <div className="space-y-3">
            {facilities.slice(0, 4).map(f => (
              <div key={f.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md shadow-sm"><Building2 size={16} className="text-green-600"/></div>
                  <div>
                    <p className="font-bold text-slate-900">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.location}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase">{f.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Registration Modal */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><ShieldCheck size={24} /></div>
              <h2 className="text-2xl font-bold text-slate-900">Add Administrator</h2>
            </div>
            <form onSubmit={handleRegisterAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" required value={adminData.name}
                  onChange={e => setAdminData({...adminData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" required value={adminData.email}
                  onChange={e => setAdminData({...adminData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="admin@campus.com"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" onClick={() => setShowAdminForm(false)}
                  className="flex-1 px-4 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Register Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;