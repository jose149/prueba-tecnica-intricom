import { Module } from "@nestjs/common";

import { ClientController } from "./client.controller";
import { CreateClientUseCase } from "./create-client.use-case";
import { ListClientUseCase } from "./list-client.use-case";
import { UpdateClientUseCase } from "./update-client.use-case";

@Module({
  controllers: [ClientController],
  providers: [CreateClientUseCase, ListClientUseCase, UpdateClientUseCase],
})
export class ClientModule {}
