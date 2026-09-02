import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Hotel } from "../../domain/hotel/hotel";
import { HotelRepository } from "../../domain/hotel/hotel.repository";

import { HotelEntity } from "./entities/hotel.entity";

@Injectable()
export class TypeOrmHotelRepository implements HotelRepository {
  constructor(
    @InjectRepository(HotelEntity)
    private readonly repository: Repository<HotelEntity>,
  ) {}

  async findAll(): Promise<Hotel[]> {
    const records = await this.repository.find();

    return records.map((record) => this.toDomain(record));
  }

  async findById(id: number): Promise<Hotel | null> {
    const record = await this.repository.findOneBy({ Id: id });

    return record ? this.toDomain(record) : null;
  }

  async create(hotel: Omit<Hotel, "id">): Promise<Hotel> {
    const entity = this.repository.create({
      Name: hotel.name,
      Address: hotel.address,
      CreatedDate: hotel.createdDate,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async update(hotel: Hotel): Promise<Hotel> {
    await this.repository.update(
      { Id: hotel.id },
      {
        Name: hotel.name,
        Address: hotel.address,
      },
    );

    const updated = await this.repository.findOneBy({
      Id: hotel.id,
    });

    if (!updated) {
      throw new Error(`Hotel ${hotel.id} not found`);
    }

    return this.toDomain(updated);
  }

  private toDomain(entity: HotelEntity): Hotel {
    return {
      id: entity.Id,
      name: entity.Name,
      address: entity.Address,
      createdDate: entity.CreatedDate,
    };
  }
}
