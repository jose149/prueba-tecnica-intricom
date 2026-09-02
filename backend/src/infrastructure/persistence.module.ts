import { Global, Injectable, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { FileSystemService } from "./filesystem/filesystem.service";

import { FsClientRepository } from "./filesystem/fs-client.repository";
import { FsHotelRepository } from "./filesystem/fs-hotel.repository";
import { FsHotelBookingRepository } from "./filesystem/fs-hotel-booking.repository";

import { CLIENT_REPOSITORY } from "../domain/client/client.repository.token";
import { HOTEL_REPOSITORY } from "../domain/hotel/hotel.repository.token";
import { HOTEL_BOOKING_REPOSITORY } from "../domain/hotel-booking/hotel-booking.repository.token";

@Injectable()
export class PersistenceInitializer implements OnModuleInit {
  constructor(private readonly fileSystemService: FileSystemService) {}

  async onModuleInit(): Promise<void> {
    await this.fileSystemService.initialize();
  }
}

@Global()
@Module({
  providers: [
    FileSystemService,
    PersistenceInitializer,

    {
      provide: CLIENT_REPOSITORY,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const basePath = configService.getOrThrow<string>("fsFolder");
        return new FsClientRepository(basePath);
      },
    },

    {
      provide: HOTEL_REPOSITORY,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const basePath = configService.getOrThrow<string>("fsFolder");
        return new FsHotelRepository(basePath);
      },
    },

    {
      provide: HOTEL_BOOKING_REPOSITORY,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const basePath = configService.getOrThrow<string>("fsFolder");
        return new FsHotelBookingRepository(basePath);
      },
    },
  ],

  exports: [CLIENT_REPOSITORY, HOTEL_REPOSITORY, HOTEL_BOOKING_REPOSITORY],
})
export class PersistenceModule {}
