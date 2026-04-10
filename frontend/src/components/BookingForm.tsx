import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Booking } from "../types/booking";

interface BookingFormProps {
  initialData: Booking | null;
  onSubmit: (data: Booking) => void;
  submitButtonText: string;
}

function BookingForm({
  initialData,
  onSubmit,
  submitButtonText,
}: BookingFormProps) {
  const [formData, setFormData] = useState<Booking>({
    resourceName: "",
    requestedBy: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        resourceName: initialData.resourceName || "",
        requestedBy: initialData.requestedBy || "",
        bookingDate: initialData.bookingDate || "",
        startTime: initialData.startTime
          ? initialData.startTime.slice(0, 5)
          : "",
        endTime: initialData.endTime ? initialData.endTime.slice(0, 5) : "",
        purpose: initialData.purpose || "",
        expectedAttendees: initialData.expectedAttendees || 0,
        id: initialData.id,
        status: initialData.status,
        adminRemarks: initialData.adminRemarks,
        createdAt: initialData.createdAt,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "expectedAttendees" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: Booking = {
      resourceName: formData.resourceName,
      requestedBy: formData.requestedBy,
      bookingDate: formData.bookingDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose,
      expectedAttendees: Number(formData.expectedAttendees),
    };

    onSubmit(payload);
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Resource Name</label>
        <input
          type="text"
          name="resourceName"
          value={formData.resourceName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Requested By</label>
        <input
          type="text"
          name="requestedBy"
          value={formData.requestedBy}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Booking Date</label>
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>End Time</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Purpose</label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Expected Attendees</label>
        <input
          type="number"
          name="expectedAttendees"
          value={formData.expectedAttendees}
          onChange={handleChange}
          required
          min="1"
        />
      </div>

      <button type="submit" className="btn primary-btn">
        {submitButtonText}
      </button>
    </form>
  );
}

export default BookingForm;