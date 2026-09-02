import { HotelBooking } from "./hotel-booking";

export interface HotelBookingRepository {
  findAll(): Promise<HotelBooking[]>;
  findById(id: number): Promise<HotelBooking | null>;
  create(booking: Omit<HotelBooking, "id">): Promise<HotelBooking>;
  update(booking: HotelBooking): Promise<HotelBooking>;
}
