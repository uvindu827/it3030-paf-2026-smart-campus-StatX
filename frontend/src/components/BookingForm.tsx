import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Booking } from "../types/booking";
import {
  FaRegCalendarAlt,
  FaRegClock,
  FaRegUser,
  FaRegBuilding,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";

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
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Booking Form</h2>
        <p className="mt-2 text-base text-slate-600">
          Fill in the required details to create or update a booking request.
        </p>
      </div>

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
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}

export default BookingForm;