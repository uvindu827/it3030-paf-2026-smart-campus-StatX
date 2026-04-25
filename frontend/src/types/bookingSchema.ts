import { z } from "zod";

export const bookingSchema = z.object({
  resourceName: z.string().min(1, "Resource name is required"),
  requestedBy: z.string().min(1, "Requester name is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  startTime: z.string(),
  endTime: z.string(),
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
  expectedAttendees: z.number().min(1, "At least 1 attendee required"),
});

