import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { Hotel } from "../../domain/hotel/hotel";
import { HotelRepository } from "../../domain/hotel/hotel.repository";
import { HOTEL_REPOSITORY } from "../../domain/hotel/hotel.repository.token";

@Injectable()
export class UpdateHotelUseCase {
  constructor(
    @Inject(HOTEL_REPOSITORY)
    private readonly hotelRepository: HotelRepository,
  ) {}

  async execute(
    id: number,
    data: Partial<Omit<Hotel, "id" | "createdDate">>,
  ): Promise<Hotel> {
    const existing = await this.hotelRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Hotel ${id} not found`);
    }

    return this.hotelRepository.update({
      ...existing,
      ...data,
    });
  }
}
