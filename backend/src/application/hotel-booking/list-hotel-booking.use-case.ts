import { Inject, Injectable } from "@nestjs/common";

import { HotelBooking } from "../../domain/hotel-booking/hotel-booking";
import { HotelBookingRepository } from "../../domain/hotel-booking/hotel-booking.repository";
import { HOTEL_BOOKING_REPOSITORY } from "../../domain/hotel-booking/hotel-booking.repository.token";

@Injectable()
export class ListHotelBookingUseCase {
  constructor(
    @Inject(HOTEL_BOOKING_REPOSITORY)
    private readonly hotelBookingRepository: HotelBookingRepository,
  ) {}

  execute(): Promise<HotelBooking[]> {
    return this.hotelBookingRepository.findAll();
  }
}
