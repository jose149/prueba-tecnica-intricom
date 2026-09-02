import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";

import { Hotel } from "../../domain/hotel/hotel";

import { CreateHotelDto } from "./dto/create-hotel.dto";
import { UpdateHotelDto } from "./dto/update-hotel.dto";

import { CreateHotelUseCase } from "./create-hotel.use-case";
import { ListHotelUseCase } from "./list-hotel.use-case";
import { UpdateHotelUseCase } from "./update-hotel.use-case";

@Controller("hotels")
export class HotelController {
  constructor(
    private readonly createHotel: CreateHotelUseCase,
    private readonly listHotels: ListHotelUseCase,
    private readonly updateHotel: UpdateHotelUseCase,
  ) {}

  @Get()
  findAll(): Promise<Hotel[]> {
    return this.listHotels.execute();
  }

  @Post()
  create(@Body() dto: CreateHotelDto): Promise<Hotel> {
    return this.createHotel.execute(dto);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateHotelDto,
  ): Promise<Hotel> {
    return this.updateHotel.execute(id, dto);
  }
}
