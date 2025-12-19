export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export type BookingDto = {
  id: number;
  customerId: number;
  interpreterId: number | null;
  languageId: number;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  location: string;
  notes: string;
  status: BookingStatus;
};

export type CreateBookingDto = {
  customerId: number;
  interpreterId: number | null;
  languageId: number;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  location: string;
  notes: string;
};
