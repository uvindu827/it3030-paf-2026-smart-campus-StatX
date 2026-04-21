import { Link } from "react-router-dom";
import { Booking } from "../types/booking";

interface BookingListProps {
  bookings: Booking[];
  onDelete: (id: number) => void;
}

function BookingList({ bookings, onDelete }: BookingListProps) {
}

export default BookingList;