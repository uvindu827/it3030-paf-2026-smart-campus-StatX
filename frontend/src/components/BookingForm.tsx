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

export default BookingForm;