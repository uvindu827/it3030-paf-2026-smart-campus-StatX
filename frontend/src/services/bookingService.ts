import axios from "axios";
import { Booking } from "../types/booking";

const API_BASE_URL = "http://localhost:8080/api/bookings";

// Helper to get the token and format the header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Crucial for JWT
    },
  };
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await axios.get<Booking[]>(API_BASE_URL, getAuthHeaders());
  return response.data;
};

export const getBookingById = async (id: string | number): Promise<Booking> => {
  const response = await axios.get<Booking>(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createBooking = async (bookingData: Booking): Promise<Booking> => {
  const token = localStorage.getItem("token"); // Get the token
  
  const response = await axios.post<Booking>(API_BASE_URL, bookingData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // ADD THIS LINE
    },
  });
  return response.data;
};

export const updateBooking = async (
  id: string | number,
  bookingData: Booking
): Promise<Booking> => {
  const response = await axios.put<Booking>(`${API_BASE_URL}/${id}`, bookingData, getAuthHeaders());
  return response.data;
};

export const deleteBooking = async (id: string | number): Promise<string> => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
};