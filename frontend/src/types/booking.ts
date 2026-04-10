export interface Booking {
  id?: number;
  resourceName: string;
  requestedBy: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  expectedAttendees: number;
  status?: string;
  adminRemarks?: string | null;
  createdAt?: string;
}