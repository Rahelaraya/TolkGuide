export type Booking = {
  id: number;
  customerId: number;
  interpreterId: number | null;
  languageId: number;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string | null;
  status: string;
};
