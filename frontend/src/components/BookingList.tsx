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



export default BookingList;