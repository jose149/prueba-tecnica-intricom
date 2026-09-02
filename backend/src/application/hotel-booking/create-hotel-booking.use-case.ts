import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import { HotelBooking } from "../../domain/hotel-booking/hotel-booking";
import { HotelBookingRepository } from "../../domain/hotel-booking/hotel-booking.repository";
import { HOTEL_BOOKING_REPOSITORY } from "../../domain/hotel-booking/hotel-booking.repository.token";

import { ClientRepository } from "../../domain/client/client.repository";
import { CLIENT_REPOSITORY } from "../../domain/client/client.repository.token";

import { HotelRepository } from "../../domain/hotel/hotel.repository";
import { HOTEL_REPOSITORY } from "../../domain/hotel/hotel.repository.token";

@Injectable()
export class CreateHotelBookingUseCase {
  constructor(
    @Inject(HOTEL_BOOKING_REPOSITORY)
    private readonly hotelBookingRepository: HotelBookingRepository,

    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,

    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: HotelRepository,
  ) {}

  async execute(
    data: Omit<HotelBooking, "id" | "createdDate">,
  ): Promise<HotelBooking> {
    const client = await this.clientRepository.findById(data.clientId);

    if (!client) {
      throw new BadRequestException(`Client ${data.clientId} not found`);
    }

    const hotel = await this.hotelRepository.findById(data.hotelId);

    if (!hotel) {
      throw new BadRequestException(`Hotel ${data.hotelId} not found`);
    }

    return this.hotelBookingRepository.create({
      ...data,
      createdDate: new Date(),
    });
  }
}
