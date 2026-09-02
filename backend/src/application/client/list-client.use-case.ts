import { Inject, Injectable } from "@nestjs/common";
import { Client } from "../../domain/client/client";
import { ClientRepository } from "../../domain/client/client.repository";
import { CLIENT_REPOSITORY } from "../../domain/client/client.repository.token";

@Injectable()
export class ListClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  execute(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }
}
