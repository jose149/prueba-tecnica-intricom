import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Hotel")
export class HotelEntity {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column()
  Name!: string;

  @Column()
  Address!: string;

  @CreateDateColumn()
  CreatedDate!: Date;
}
