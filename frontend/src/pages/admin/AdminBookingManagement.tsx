import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreVertical,
  AlertCircle,
  Check,
  X,
  Ban
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllBookings, approveBooking, rejectBooking, cancelBooking, Booking } from '../../services/bookingService';

const AdminBookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'cancel' | null;
    booking: Booking | null;
  }>({ isOpen: false, action: null, booking: null });
  const [remarks, setRemarks] = useState('');

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
  ];

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  const handleAction = async (action: 'approve' | 'reject' | 'cancel') => {
    if (!actionModal.booking || !remarks.trim()) {
      toast.error('Please provide remarks for this action');
      return;
    }

    try {
      let updatedBooking;
      switch (action) {
        case 'approve':
          updatedBooking = await approveBooking(actionModal.booking.id!, remarks);
          toast.success('Booking approved successfully');
          break;
        case 'reject':
          updatedBooking = await rejectBooking(actionModal.booking.id!, remarks);
          toast.success('Booking rejected successfully');
          break;
        case 'cancel':
          updatedBooking = await cancelBooking(actionModal.booking.id!, remarks);
          toast.success('Booking cancelled successfully');
          break;
      }

      // Update the booking in the list
      setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
      setActionModal({ isOpen: false, action: null, booking: null });
      setRemarks('');
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      toast.error(`Failed to ${action} booking`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'REJECTED':
        return <XCircle className="text-red-500" size={16} />;
      case 'CANCELLED':
        return <Ban className="text-gray-500" size={16} />;
      case 'PENDING':
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Calendar className="text-blue-500" size={28} />
              Booking Management
            </h1>
            <p className="text-slate-600 mt-1">Review and manage all campus facility bookings</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900">{filteredBookings.length}</p>
            <p className="text-sm text-slate-500">Total Bookings</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by resource, user, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={fetchBookings}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Booking Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.requestedBy}</p>
                      <p className="text-sm text-slate-500">{booking.purpose}</p>
                      <p className="text-xs text-slate-400">{booking.expectedAttendees} attendees</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{booking.resourceName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{formatDate(booking.bookingDate)}</p>
                      <p className="text-sm text-slate-500">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status || 'PENDING')}`}>
                      {getStatusIcon(booking.status || 'PENDING')}
                      {booking.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/booking/${booking.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>

                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => setActionModal({ isOpen: true, action: 'approve', booking })}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve Booking"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setActionModal({ isOpen: true, action: 'reject', booking })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject Booking"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}

                      {(booking.status === 'APPROVED' || booking.status === 'PENDING') && (
                        <button
                          onClick={() => setActionModal({ isOpen: true, action: 'cancel', booking })}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Cancel Booking"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No bookings found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filter criteria.'
                : 'No bookings have been created yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal.isOpen && actionModal.booking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              {actionModal.action === 'approve' && <CheckCircle className="text-green-500" size={24} />}
              {actionModal.action === 'reject' && <XCircle className="text-red-500" size={24} />}
              {actionModal.action === 'cancel' && <Ban className="text-orange-500" size={24} />}
              <h2 className="text-2xl font-bold text-slate-900 capitalize">
                {actionModal.action} Booking
              </h2>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">{actionModal.booking.resourceName}</h3>
              <p className="text-sm text-slate-600 mb-1">Requested by: {actionModal.booking.requestedBy}</p>
              <p className="text-sm text-slate-600">{formatDate(actionModal.booking.bookingDate)} • {formatTime(actionModal.booking.startTime)} - {formatTime(actionModal.booking.endTime)}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Admin Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={`Provide a reason for ${actionModal.action === 'approve' ? 'approval' : actionModal.action === 'reject' ? 'rejection' : 'cancellation'}...`}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActionModal({ isOpen: false, action: null, booking: null })}
                className="flex-1 px-4 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(actionModal.action!)}
                className={`flex-1 px-4 py-3 font-bold text-white rounded-xl transition-all ${
                  actionModal.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionModal.action === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {actionModal.action === 'approve' && 'Approve'}
                {actionModal.action === 'reject' && 'Reject'}
                {actionModal.action === 'cancel' && 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagement;