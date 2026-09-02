import { Inject, Injectable } from "@nestjs/common";

import { Hotel } from "../../domain/hotel/hotel";
import { HotelRepository } from "../../domain/hotel/hotel.repository";
import { HOTEL_REPOSITORY } from "../../domain/hotel/hotel.repository.token";

@Injectable()
export class CreateHotelUseCase {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: HotelRepository,
  ) {}

  async execute(data: Omit<Hotel, "id" | "createdDate">): Promise<Hotel> {
    return this.hotelRepository.create({
      ...data,
      createdDate: new Date(),
    });
  }
}
