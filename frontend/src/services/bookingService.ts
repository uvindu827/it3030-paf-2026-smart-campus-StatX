import axios from "axios";
import { Booking } from "../types/booking";

const API_BASE_URL = "http://localhost:8080/api/bookings";

export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await axios.get<Booking[]>(API_BASE_URL);
  return response.data;
};