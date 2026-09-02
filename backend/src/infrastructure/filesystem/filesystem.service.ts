import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FsClientRepository } from "./fs-client.repository";
import { FsHotelRepository } from "./fs-hotel.repository";
import { FsHotelBookingRepository } from "./fs-hotel-booking.repository";

@Injectable()
export class FileSystemService {
  constructor(private readonly configService: ConfigService) {}

  async initialize(): Promise<void> {
    const basePath = this.configService.getOrThrow<string>("fsFolder");

    const repositories = [
      new FsClientRepository(basePath),
      new FsHotelRepository(basePath),
      new FsHotelBookingRepository(basePath),
    ];

    await Promise.all(
      repositories.map((repository) => repository.initialize()),
    );
  }
}
