import { Link } from "react-router-dom";
import { Booking } from "../types/booking";

interface BookingListProps {
  bookings: Booking[];
  onDelete: (id: number) => void;
}

function BookingList({ bookings, onDelete }: BookingListProps) {
  if (!bookings || bookings.length === 0) {
    return <p>No bookings found.</p>;
  }

  return (
    <div className="table-container">
      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resource</th>
            <th>Requested By</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Purpose</th>
            <th>Attendees</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.resourceName}</td>
              <td>{booking.requestedBy}</td>
              <td>{booking.bookingDate}</td>
              <td>{booking.startTime}</td>
              <td>{booking.endTime}</td>
              <td>{booking.purpose}</td>
              <td>{booking.expectedAttendees}</td>
              <td>{booking.status}</td>
              <td className="actions">
                <Link to={`/booking/${booking.id}`} className="btn small-btn">
                  View
                </Link>
                <Link
                  to={`/edit-booking/${booking.id}`}
                  className="btn small-btn warning-btn"
                >
                  Edit
                </Link>
                <button
                  className="btn small-btn danger-btn"
                  onClick={() => booking.id && onDelete(booking.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingList;