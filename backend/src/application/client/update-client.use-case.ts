import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { Client } from "../../domain/client/client";
import { ClientRepository } from "../../domain/client/client.repository";
import { CLIENT_REPOSITORY } from "../../domain/client/client.repository.token";

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    id: number,
    data: Partial<Omit<Client, "id" | "createdDate">>,
  ): Promise<Client> {
    const existing = await this.clientRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    return this.clientRepository.update({
      ...existing,
      ...data,
    });
  }
}
