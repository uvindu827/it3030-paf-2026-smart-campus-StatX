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

      



export default BookingList;