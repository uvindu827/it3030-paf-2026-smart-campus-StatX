import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Booking } from "../types/booking";
import { useNavigate } from "react-router-dom";
import { bookingSchema } from "../types/bookingSchema";
// @ts-ignore
import "../App.css";
import {
  FaRegCalendarAlt,
  FaRegClock,
  FaRegUser,
  FaRegBuilding,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";

interface BookingFormProps {
  initialData: Partial<Booking> | null; // Changed to Partial
  onSubmit: (data: Booking) => Promise<void> | void;
  submitButtonText: string;
}

function BookingForm({
  initialData,
  onSubmit,
  submitButtonText,
}: BookingFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Booking>({
    resourceName: initialData?.resourceName || "", // Set directly from initialData
    requestedBy: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        startTime: initialData.startTime ? initialData.startTime.slice(0, 5) : prev.startTime,
        endTime: initialData.endTime ? initialData.endTime.slice(0, 5) : prev.endTime,
      }));
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // ✅ Zod validation
    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setErrorMessage("End time must be later than start time.");
      return;
    }

    const payload: Booking = {
    id: formData.id,
    resourceName: formData.resourceName,
    requestedBy: formData.requestedBy,
    bookingDate: formData.bookingDate,
    startTime: formData.startTime,
    endTime: formData.endTime,
    purpose: formData.purpose,
    expectedAttendees: Number(formData.expectedAttendees),
    status: formData.status,
    adminRemarks: formData.adminRemarks,
    createdAt: formData.createdAt,
  };

    try {
      setIsSubmitting(true);
      await onSubmit(payload);

      setShowSuccessPrompt(true);

      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while submitting the booking."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Booking Form</h2>
            <p className="mt-2 text-base text-slate-600">
              Fill in the required details to create your booking request.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Resource Name
              </label>
              <div className="relative">
                <FaRegBuilding className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="resourceName"
                  value={formData.resourceName}
                  onChange={handleChange}
                  required
                  placeholder="Enter resource name"
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Requested By
              </label>
              <div className="relative">
                <FaRegUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleChange}
                  required
                  placeholder="Enter requester name"
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Booking Date
              </label>
              <div className="relative">
                <FaRegCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Expected Attendees
              </label>
              <div className="relative">
                <FaUsers className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  name="expectedAttendees"
                  value={formData.expectedAttendees}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Enter attendee count"
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Start Time
              </label>
              <div className="relative">
                <FaRegClock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                End Time
              </label>
              <div className="relative">
                <FaRegClock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Purpose
              </label>
              <div className="relative">
                <MdOutlineDescription className="pointer-events-none absolute left-4 top-4 text-xl text-slate-500" />
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Enter booking purpose"
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex min-w-[190px] items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-md transition ${
                isSubmitting
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : submitButtonText}
            </button>

            {isSubmitting && (
              <span className="text-sm font-medium text-slate-500">
                Processing your booking request...
              </span>
            )}
          </div>
        </form>
      </div>

      {showSuccessPrompt && (
        <div className="success-overlay">
          <div className="success-prompt-box">
            <div className="success-icon-wrap">
              <FaCheckCircle className="success-check-icon" />
            </div>

            <h3 className="success-title">Booking Submitted Successfully</h3>
            <p className="success-text">
              Your booking request has been sent successfully and is now waiting
              for further processing.
            </p>

            <div className="success-loader-track">
              <div className="success-loader-bar"></div>
            </div>

            <p className="success-redirect-text">Redirecting to booking list...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingForm;