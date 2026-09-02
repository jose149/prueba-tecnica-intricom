import { Inject, Injectable } from "@nestjs/common";

import { Hotel } from "../../domain/hotel/hotel";
import { HotelRepository } from "../../domain/hotel/hotel.repository";
import { HOTEL_REPOSITORY } from "../../domain/hotel/hotel.repository.token";

@Injectable()
export class ListHotelUseCase {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: HotelRepository,
  ) {}

  execute(): Promise<Hotel[]> {
    return this.hotelRepository.findAll();
  }
}
