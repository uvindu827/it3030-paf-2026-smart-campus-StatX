import axios from "axios";
import { Booking } from "../types/booking";

const API_BASE_URL = "http://localhost:8080/api/bookings";

export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await axios.get<Booking[]>(API_BASE_URL);
  return response.data;
};

export const getBookingById = async (id: string | number): Promise<Booking> => {
  const response = await axios.get<Booking>(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createBooking = async (bookingData: Booking): Promise<Booking> => {
  const response = await axios.post<Booking>(API_BASE_URL, bookingData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateBooking = async (
  id: string | number,
  bookingData: Booking
): Promise<Booking> => {
  const response = await axios.put<Booking>(`${API_BASE_URL}/${id}`, bookingData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteBooking = async (id: string | number): Promise<string> => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};

function Navbar() {
  return (
    <nav className="navbar">zz
      <h2>SmartCampus Booking Management</h2>
    </nav>
  );
}

export default Navbar;