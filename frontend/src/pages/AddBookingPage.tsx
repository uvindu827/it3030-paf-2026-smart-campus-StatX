import BookingForm from "../components/BookingForm";
import { createBooking } from "../services/bookingService";
import { Booking } from "../types/booking";

function AddBookingPage() {
  const handleCreateBooking = async (bookingData: Booking) => {
    await createBooking(bookingData);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <BookingForm
        initialData={null}
        onSubmit={handleCreateBooking}
        submitButtonText="Create Booking"
      />
    </div>
  );
}

export default AddBookingPage;