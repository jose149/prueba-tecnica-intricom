import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "../../domain/client/client";
import { ClientRepository } from "../../domain/client/client.repository";

import { ClientEntity } from "./entities/client.entity";

@Injectable()
export class TypeOrmClientRepository implements ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  async findAll(): Promise<Client[]> {
    const records = await this.repository.find();

    return records.map((record) => this.toDomain(record));
  }

  async findById(id: number): Promise<Client | null> {
    const record = await this.repository.findOneBy({ Id: id });

    return record ? this.toDomain(record) : null;
  }

  async create(client: Omit<Client, "id">): Promise<Client> {
    const entity = this.repository.create({
      Name: client.name,
      Address: client.address,
      Phone: client.phone,
      CreatedDate: client.createdDate,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async update(client: Client): Promise<Client> {
    await this.repository.update(
      { Id: client.id },
      {
        Name: client.name,
        Address: client.address,
        Phone: client.phone,
      },
    );

    const updated = await this.repository.findOneBy({
      Id: client.id,
    });

    if (!updated) {
      throw new Error(`Client ${client.id} not found`);
    }

    return this.toDomain(updated);
  }

  private toDomain(entity: ClientEntity): Client {
    return {
      id: entity.Id,
      name: entity.Name,
      address: entity.Address,
      phone: entity.Phone,
      createdDate: entity.CreatedDate,
    };
  }
}
