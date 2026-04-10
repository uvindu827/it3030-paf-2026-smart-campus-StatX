import { useEffect, useState } from "react";
import { deleteBooking, getAllBookings } from "../services/bookingService";
import BookingList from "../components/BookingList";
import { Booking } from "../types/booking";

function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      await deleteBooking(id);
      fetchBookings();
    } catch (err) {
      setError("Failed to delete booking.");
      console.error(err);
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
    </div>
  );
}

export default BookingListPage;