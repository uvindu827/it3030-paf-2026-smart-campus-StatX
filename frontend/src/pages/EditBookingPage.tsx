import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { getBookingById, updateBooking } from "../services/bookingService";
import { Booking } from "../types/booking";

function EditBookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const formatDateForInput = (dateValue: string) => {
    if (!dateValue) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }

    if (dateValue.includes("/")) {
      const parts = dateValue.split("/");
      if (parts.length === 3) {
        const month = parts[0].padStart(2, "0");
        const day = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }

    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }

    return dateValue;
  };

  const formatTimeForInput = (timeValue: string) => {
    if (!timeValue) return "";

    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeValue)) {
      return timeValue.slice(0, 5);
    }

    const amPmMatch = timeValue.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (amPmMatch) {
      let hours = parseInt(amPmMatch[1], 10);
      const minutes = amPmMatch[2];
      const meridiem = amPmMatch[3].toUpperCase();

      if (meridiem === "PM" && hours !== 12) {
        hours += 12;
      }
      if (meridiem === "AM" && hours === 12) {
        hours = 0;
      }

      return `${String(hours).padStart(2, "0")}:${minutes}`;
    }

    return timeValue;
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!id) return;

        const data = await getBookingById(id);

        const normalizedBooking: Booking = {
          ...data,
          bookingDate: formatDateForInput(data.bookingDate),
          startTime: formatTimeForInput(data.startTime),
          endTime: formatTimeForInput(data.endTime),
        };

        setBooking(normalizedBooking);
      } catch (error) {
        console.error(error);
        alert("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleUpdateBooking = async (bookingData: Booking) => {
    try {
      if (!id) return;
      await updateBooking(id, bookingData);
      alert("Booking updated successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to update booking");
    }
  };

  if (loading) return <p>Loading booking...</p>;

  return (
    <div className="page">
      <h1>Edit Booking</h1>
      <BookingForm
        initialData={booking}
        onSubmit={handleUpdateBooking}
        submitButtonText="Update Booking"
      />
    </div>
  );
}

export default EditBookingPage;