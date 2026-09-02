import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { CreateClientUseCase } from "./create-client.use-case";
import { ListClientUseCase } from "./list-client.use-case";
import { UpdateClientUseCase } from "./update-client.use-case";
import { Client } from "../../domain/client/client";

@Controller("clients")
export class ClientController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly listClients: ListClientUseCase,
    private readonly updateClient: UpdateClientUseCase,
  ) {}

  @Get()
  findAll(): Promise<Client[]> {
    return this.listClients.execute();
  }

  @Post()
  create(@Body() dto: CreateClientDto): Promise<Client> {
    return this.createClient.execute(dto);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateClientDto,
  ): Promise<Client> {
    return this.updateClient.execute(id, dto);
  }
}
