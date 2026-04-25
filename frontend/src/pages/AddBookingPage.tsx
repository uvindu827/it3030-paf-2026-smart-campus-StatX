import { useSearchParams } from "react-router-dom"; // Add this
import BookingForm from "../components/BookingForm";
import { createBooking } from "../services/bookingService";
import { Booking } from "../types/booking";

function AddBookingPage() {
  const [searchParams] = useSearchParams();
  const resourceId = searchParams.get("resourceId");
  const resourceName = searchParams.get("resourceName");

  const handleCreateBooking = async (bookingData: Booking) => {
    await createBooking(bookingData);
  };

  // Create an initialData object using the URL params
  const initialBookingData = {
    resourceName: resourceName || "",
    // If your Booking type has a resourceId field, add it here:
    // resourceId: resourceId ? Number(resourceId) : undefined 
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <BookingForm
        initialData={initialBookingData} // Pass the extracted data here
        onSubmit={handleCreateBooking}
        submitButtonText="Create Booking"
      />
    </div>
  );
}

export default AddBookingPage;