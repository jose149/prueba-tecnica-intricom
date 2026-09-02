import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientEntity } from "./entities/client.entity";
import { HotelEntity } from "./entities/hotel.entity";
import { HotelBookingEntity } from "./entities/hotel-booking.entity";

import { TypeOrmClientRepository } from "./typeorm-client.repository";
import { TypeOrmHotelRepository } from "./typeorm-hotel.repository";
import { TypeOrmHotelBookingRepository } from "./typeorm-hotel-booking.repository";

import { CLIENT_REPOSITORY } from "../../domain/client/client.repository.token";
import { HOTEL_REPOSITORY } from "../../domain/hotel/hotel.repository.token";
import { HOTEL_BOOKING_REPOSITORY } from "../../domain/hotel-booking/hotel-booking.repository.token";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity, HotelEntity, HotelBookingEntity]),
  ],

  providers: [
    {
      provide: CLIENT_REPOSITORY,
      useClass: TypeOrmClientRepository,
    },
    {
      provide: HOTEL_REPOSITORY,
      useClass: TypeOrmHotelRepository,
    },
    {
      provide: HOTEL_BOOKING_REPOSITORY,
      useClass: TypeOrmHotelBookingRepository,
    },
  ],

  exports: [CLIENT_REPOSITORY, HOTEL_REPOSITORY, HOTEL_BOOKING_REPOSITORY],
})
export class DatabaseModule {}
