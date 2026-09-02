import { Hotel } from "../../domain/hotel/hotel";
import { HotelRepository } from "../../domain/hotel/hotel.repository";
import { FileSystemRepository } from "./filesystem.repository";

export class FsHotelRepository implements HotelRepository {
  private readonly repository: FileSystemRepository<Hotel>;

  constructor(basePath: string) {
    this.repository = new FileSystemRepository<Hotel>(basePath, "Hotel");
  }

  initialize(): Promise<void> {
    return this.repository.initialize();
  }

  findAll(): Promise<Hotel[]> {
    return this.repository.findAll();
  }

  findById(id: number): Promise<Hotel | null> {
    return this.repository.findById(id);
  }

  create(hotel: Omit<Hotel, "id">): Promise<Hotel> {
    return this.repository.create(hotel);
  }

  update(hotel: Hotel): Promise<Hotel> {
    return this.repository.update(hotel);
  }
}
