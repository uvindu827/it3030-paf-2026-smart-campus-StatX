import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookingById } from "../services/bookingService";
import { Booking } from "../types/booking";

function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!id) return;
        const data = await getBookingById(id);
        setBooking(data);
      } catch (err) {
        setError("Failed to load booking details.");
        console.error(err);
      }
    };

    fetchBooking();
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;
  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div className="page">
      <h1>Booking Details</h1>

      <div className="details-card">
        <p><strong>ID:</strong> {booking.id}</p>
        <p><strong>Resource Name:</strong> {booking.resourceName}</p>
        <p><strong>Requested By:</strong> {booking.requestedBy}</p>
        <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
        <p><strong>Start Time:</strong> {booking.startTime}</p>
        <p><strong>End Time:</strong> {booking.endTime}</p>
        <p><strong>Purpose:</strong> {booking.purpose}</p>
        <p><strong>Expected Attendees:</strong> {booking.expectedAttendees}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Admin Remarks:</strong> {booking.adminRemarks || "N/A"}</p>
        <p><strong>Created At:</strong> {booking.createdAt}</p>
      </div>

      <Link to="/" className="btn primary-btn">
        Back to Home
      </Link>
    </div>
  );
}

export default BookingDetailsPage;