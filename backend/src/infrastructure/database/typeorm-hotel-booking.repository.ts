import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { HotelBooking } from "../../domain/hotel-booking/hotel-booking";
import { HotelBookingRepository } from "../../domain/hotel-booking/hotel-booking.repository";

import { HotelBookingEntity } from "./entities/hotel-booking.entity";

@Injectable()
export class TypeOrmHotelBookingRepository implements HotelBookingRepository {
  constructor(
    @InjectRepository(HotelBookingEntity)
    private readonly repository: Repository<HotelBookingEntity>,
  ) {}

  async findAll(): Promise<HotelBooking[]> {
    const records = await this.repository.find();

    return records.map((record) => this.toDomain(record));
  }

  async findById(id: number): Promise<HotelBooking | null> {
    const record = await this.repository.findOneBy({ Id: id });

    return record ? this.toDomain(record) : null;
  }

  async create(booking: Omit<HotelBooking, "id">): Promise<HotelBooking> {
    const entity = this.repository.create({
      HotelId: booking.hotelId,
      Name: booking.name,
      Address: booking.address,
      CreatedDate: booking.createdDate,
      ClientId: booking.clientId,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async update(booking: HotelBooking): Promise<HotelBooking> {
    await this.repository.update(
      { Id: booking.id },
      {
        HotelId: booking.hotelId,
        Name: booking.name,
        Address: booking.address,
        ClientId: booking.clientId,
      },
    );

    const updated = await this.repository.findOneBy({
      Id: booking.id,
    });

    if (!updated) {
      throw new Error(`HotelBooking ${booking.id} not found`);
    }

    return this.toDomain(updated);
  }

  private toDomain(entity: HotelBookingEntity): HotelBooking {
    return {
      id: entity.Id,
      hotelId: entity.HotelId,
      name: entity.Name,
      address: entity.Address,
      createdDate: entity.CreatedDate,
      clientId: entity.ClientId,
    };
  }
}
