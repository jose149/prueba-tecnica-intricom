import { Module } from "@nestjs/common";

import { PersistenceModule } from "../../infrastructure/persistence.module";

import { HotelBookingController } from "./hotel-booking.controller";
import { CreateHotelBookingUseCase } from "./create-hotel-booking.use-case";
import { ListHotelBookingUseCase } from "./list-hotel-booking.use-case";
import { UpdateHotelBookingUseCase } from "./update-hotel-booking.use-case";

@Module({
  imports: [PersistenceModule],
  controllers: [HotelBookingController],
  providers: [
    CreateHotelBookingUseCase,
    ListHotelBookingUseCase,
    UpdateHotelBookingUseCase,
  ],
})
export class HotelBookingModule {}
