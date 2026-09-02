import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateHotelBookingDto {
  @IsNumber()
  @IsNotEmpty()
  hotelId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsNumber()
  @IsNotEmpty()
  clientId!: number;
}
