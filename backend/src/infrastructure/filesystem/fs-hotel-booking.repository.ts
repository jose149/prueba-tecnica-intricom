import { HotelBooking } from "../../domain/hotel-booking/hotel-booking";
import { HotelBookingRepository } from "../../domain/hotel-booking/hotel-booking.repository";
import { FileSystemRepository } from "./filesystem.repository";

export class FsHotelBookingRepository implements HotelBookingRepository {
  private readonly repository: FileSystemRepository<HotelBooking>;

  constructor(basePath: string) {
    this.repository = new FileSystemRepository<HotelBooking>(
      basePath,
      "HotelBooking",
    );
  }

  initialize(): Promise<void> {
    return this.repository.initialize();
  }

  findAll(): Promise<HotelBooking[]> {
    return this.repository.findAll();
  }

  findById(id: number): Promise<HotelBooking | null> {
    return this.repository.findById(id);
  }

  create(booking: Omit<HotelBooking, "id">): Promise<HotelBooking> {
    return this.repository.create(booking);
  }

  update(booking: HotelBooking): Promise<HotelBooking> {
    return this.repository.update(booking);
  }
}
