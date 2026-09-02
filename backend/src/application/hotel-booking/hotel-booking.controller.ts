import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";

import { HotelBooking } from "../../domain/hotel-booking/hotel-booking";

import { CreateHotelBookingDto } from "./dto/create-hotel-booking.dto";
import { UpdateHotelBookingDto } from "./dto/update-hotel-booking.dto";

import { CreateHotelBookingUseCase } from "./create-hotel-booking.use-case";
import { ListHotelBookingUseCase } from "./list-hotel-booking.use-case";
import { UpdateHotelBookingUseCase } from "./update-hotel-booking.use-case";

@Controller("hotel-bookings")
export class HotelBookingController {
  constructor(
    private readonly createHotelBooking: CreateHotelBookingUseCase,
    private readonly listHotelBookings: ListHotelBookingUseCase,
    private readonly updateHotelBooking: UpdateHotelBookingUseCase,
  ) {}

  @Get()
  findAll(): Promise<HotelBooking[]> {
    return this.listHotelBookings.execute();
  }

  @Post()
  create(@Body() dto: CreateHotelBookingDto): Promise<HotelBooking> {
    return this.createHotelBooking.execute(dto);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateHotelBookingDto,
  ): Promise<HotelBooking> {
    return this.updateHotelBooking.execute(id, dto);
  }
}
