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

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!id) return;
        const data = await getBookingById(id);
        setBooking(data);
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