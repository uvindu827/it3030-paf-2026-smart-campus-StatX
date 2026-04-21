import { useEffect, useState } from "react";
import { deleteBooking, getAllBookings } from "../services/bookingService";
import BookingList from "../components/BookingList";
import { Booking } from "../types/booking";

function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
}

export default BookingListPage;