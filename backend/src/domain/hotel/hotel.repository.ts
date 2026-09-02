import { Hotel } from "./hotel";

export interface HotelRepository {
  findAll(): Promise<Hotel[]>;
  findById(id: number): Promise<Hotel | null>;
  create(hotel: Omit<Hotel, "id">): Promise<Hotel>;
  update(hotel: Hotel): Promise<Hotel>;
}
