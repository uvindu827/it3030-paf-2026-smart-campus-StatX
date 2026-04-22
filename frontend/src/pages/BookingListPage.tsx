import { useEffect, useState } from "react";
import { deleteBooking, getAllBookings } from "../services/bookingService";
import BookingList from "../components/BookingList";
import { Booking } from "../types/booking";

function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
      setError("");
    } catch (err) {
      setError("Failed to load bookings. Check backend connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = (id: number) => {
    setSelectedBookingId(id);
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedBookingId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedBookingId === null) return;

    try {
      setIsDeleting(true);
      await deleteBooking(selectedBookingId);
      await fetchBookings();
      setShowConfirm(false);
      setSelectedBookingId(null);
      setError("");
    } catch (err) {
      setError("Failed to delete booking.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page">
      <h1>Booking Management</h1>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <BookingList bookings={bookings} onDelete={handleDelete} />
      )}

      {showConfirm && (
        <div className="custom-overlay">
          <div className="custom-box">
            <div className="custom-icon">🗑️</div>
            <h3>Delete Booking?</h3>
            <p>
              Are you sure you want to delete this booking? This action cannot be
              undone.
            </p>

            <div className="custom-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingListPage;