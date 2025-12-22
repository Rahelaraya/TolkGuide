// src/api/bookingsApi.ts
import { apiFetch } from "./http";

export type Booking = {
  id: number;
  status?: string;        // "Pending" | "Accepted" | "Canceled" (kan variera)
  startTime?: string;     // beroende på backend
  endTime?: string;
  language?: string;
  customerName?: string;
  notes?: string;
};

export async function getMyBookings() {
  return apiFetch<Booking[]>("/api/Bookings/mine", { method: "GET" });
}

export async function acceptBooking(id: number) {
  return apiFetch<void>(`/api/Bookings/${id}/accept`, { method: "POST" });
}

export async function cancelBooking(id: number) {
  return apiFetch<void>(`/api/Bookings/${id}/cancel`, { method: "POST" });
}
