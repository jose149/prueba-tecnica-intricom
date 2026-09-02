import { Module } from "@nestjs/common";

import { HotelController } from "./hotel.controller";
import { CreateHotelUseCase } from "./create-hotel.use-case";
import { ListHotelUseCase } from "./list-hotel.use-case";
import { UpdateHotelUseCase } from "./update-hotel.use-case";

@Module({
  controllers: [HotelController],
  providers: [CreateHotelUseCase, ListHotelUseCase, UpdateHotelUseCase],
})
export class HotelModule {}
