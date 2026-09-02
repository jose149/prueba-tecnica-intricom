import { Module } from "@nestjs/common";

import { PersistenceModule } from "../../infrastructure/persistence.module";

import { ClientController } from "./client.controller";
import { CreateClientUseCase } from "./create-client.use-case";
import { ListClientUseCase } from "./list-client.use-case";
import { UpdateClientUseCase } from "./update-client.use-case";

@Module({
  imports: [PersistenceModule],
  controllers: [ClientController],
  providers: [CreateClientUseCase, ListClientUseCase, UpdateClientUseCase],
})
export class ClientModule {}
