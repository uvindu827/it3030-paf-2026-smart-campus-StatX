import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookingById, approveBooking, rejectBooking, cancelBooking } from "../services/bookingService";
import { Booking } from "../types/booking";
import { toast } from 'react-toastify';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Ban,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';

function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'cancel' | null;
  }>({ isOpen: false, action: null });
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!id) return;
        const data = await getBookingById(id);
        setBooking(data);
      } catch (err) {
        setError("Failed to load booking details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject' | 'cancel') => {
    if (!booking || !remarks.trim()) {
      toast.error('Please provide remarks for this action');
      return;
    }

    setProcessing(true);
    try {
      let updatedBooking;
      switch (action) {
        case 'approve':
          updatedBooking = await approveBooking(booking.id!, remarks);
          toast.success('Booking approved successfully');
          break;
        case 'reject':
          updatedBooking = await rejectBooking(booking.id!, remarks);
          toast.success('Booking rejected successfully');
          break;
        case 'cancel':
          updatedBooking = await cancelBooking(booking.id!, remarks);
          toast.success('Booking cancelled successfully');
          break;
      }

      setBooking(updatedBooking);
      setActionModal({ isOpen: false, action: null });
      setRemarks('');
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      toast.error(`Failed to ${action} booking`);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'REJECTED':
        return <XCircle className="text-red-500" size={20} />;
      case 'CANCELLED':
        return <Ban className="text-gray-500" size={20} />;
      case 'PENDING':
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Booking</h2>
          <p className="text-red-600">{error}</p>
          <Link
            to="/admin/bookings"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Calendar className="text-slate-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Booking Not Found</h2>
          <p className="text-slate-600">The requested booking could not be found.</p>
          <Link
            to="/admin/bookings"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/bookings"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Booking Details</h1>
              <p className="text-slate-600">Booking #{booking.id}</p>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${getStatusColor(booking.status || 'PENDING')}`}>
            {getStatusIcon(booking.status || 'PENDING')}
            {booking.status || 'PENDING'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="text-blue-500" size={20} />
              Booking Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-slate-400" size={18} />
                  <div>
                    <p className="font-medium text-slate-900">{booking.resourceName}</p>
                    <p className="text-sm text-slate-500">Resource</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="text-slate-400" size={18} />
                  <div>
                    <p className="font-medium text-slate-900">{booking.requestedBy}</p>
                    <p className="text-sm text-slate-500">Requested By</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-slate-400" size={18} />
                  <div>
                    <p className="font-medium text-slate-900">{booking.expectedAttendees} people</p>
                    <p className="text-sm text-slate-500">Expected Attendees</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-slate-400" size={18} />
                  <div>
                    <p className="font-medium text-slate-900">{formatDate(booking.bookingDate)}</p>
                    <p className="text-sm text-slate-500">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-slate-400" size={18} />
                  <div>
                    <p className="font-medium text-slate-900">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                    <p className="text-sm text-slate-500">Time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="text-slate-400" size={18} />
                  <div>
                    <p className="font-medium text-slate-900">{booking.purpose}</p>
                    <p className="text-sm text-slate-500">Purpose</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Remarks */}
          {booking.adminRemarks && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="text-orange-500" size={20} />
                Admin Remarks
              </h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800">{booking.adminRemarks}</p>
              </div>
            </div>
          )}

          {/* Created At */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="text-sm text-slate-500">
              Created on {booking.createdAt ? formatDate(booking.createdAt) : 'Unknown'}
            </div>
          </div>
        </div>

        {/* Admin Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Actions</h2>

            {booking.status === 'PENDING' && (
              <div className="space-y-3">
                <button
                  onClick={() => setActionModal({ isOpen: true, action: 'approve' })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Check size={18} />
                  Approve Booking
                </button>
                <button
                  onClick={() => setActionModal({ isOpen: true, action: 'reject' })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <X size={18} />
                  Reject Booking
                </button>
              </div>
            )}

            {(booking.status === 'APPROVED' || booking.status === 'PENDING') && (
              <button
                onClick={() => setActionModal({ isOpen: true, action: 'cancel' })}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium mt-3"
              >
                <Ban size={18} />
                Cancel Booking
              </button>
            )}

            {booking.status !== 'PENDING' && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 text-center">
                  This booking has already been {booking.status?.toLowerCase()}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal.isOpen && (
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
              <h3 className="font-semibold text-slate-900 mb-2">{booking.resourceName}</h3>
              <p className="text-sm text-slate-600 mb-1">Requested by: {booking.requestedBy}</p>
              <p className="text-sm text-slate-600">{formatDate(booking.bookingDate)} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
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
                onClick={() => setActionModal({ isOpen: false, action: null })}
                className="flex-1 px-4 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(actionModal.action!)}
                disabled={processing || !remarks.trim()}
                className={`flex-1 px-4 py-3 font-bold text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionModal.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionModal.action === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    {actionModal.action === 'approve' && 'Approve'}
                    {actionModal.action === 'reject' && 'Reject'}
                    {actionModal.action === 'cancel' && 'Cancel'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDetailsPage;