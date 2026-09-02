import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("HotelBooking")
export class HotelBookingEntity {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column()
  HotelId!: number;

  @Column()
  Name!: string;

  @Column()
  Address!: string;

  @CreateDateColumn()
  CreatedDate!: Date;

  @Column()
  ClientId!: number;
}
