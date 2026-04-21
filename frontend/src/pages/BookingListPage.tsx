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
}

export default BookingListPage;