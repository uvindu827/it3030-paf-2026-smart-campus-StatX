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
}

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



export default BookingForm;