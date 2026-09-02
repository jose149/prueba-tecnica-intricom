import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Client")
export class ClientEntity {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column()
  Name!: string;

  @Column()
  Address!: string;

  @Column()
  Phone!: string;

  @CreateDateColumn()
  CreatedDate!: Date;
}
