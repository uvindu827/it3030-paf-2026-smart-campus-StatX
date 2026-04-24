import React, { useEffect, useState } from 'react';
import { Users, Mail, Shield, Trash2, Search, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUser } from '../../services/userService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for Delete Confirmation
  const [showConfirm, setShowConfirm] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number) => {
    console.log("Attempting to delete user with ID:", id); // Check this in browser console
    if (!id) {
      toast.error("Invalid User ID");
      return;
    }
    
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.userId !== id));
      toast.success("User removed successfully");
      setShowConfirm(null);
    } catch (error: any) {
      console.error("Server Error Detail:", error.response?.data);
      toast.error("Server rejected delete. Check backend logs.");
    }
  };

  // --- SEARCH LOGIC ---
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500">Manage {users.length} registered members</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.userId} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {user.name?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role.replace('ROLE_', '')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {showConfirm === user.userId ? (
                    <div className="flex justify-end gap-2 animate-in fade-in zoom-in duration-200">
                      <button onClick={() => handleDelete(user.userId)} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold">Confirm</button>
                      <button onClick={() => setShowConfirm(null)} className="text-xs bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold">Cancel</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowConfirm(user.userId)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;