import { useNavigate } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { createBooking } from "../services/bookingService";
import { Booking } from "../types/booking";

function AddBookingPage() {
  const navigate = useNavigate();

  const handleCreateBooking = async (bookingData: Booking) => {
    try {
      await createBooking(bookingData);
      alert("Booking created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create booking");
    }
  };

  return (
    <div className="page">
      <h1>Add New Booking</h1>
      <BookingForm
        initialData={null}
        onSubmit={handleCreateBooking}
        submitButtonText="Create Booking"
      />
    </div>
  );
}

export default AddBookingPage;