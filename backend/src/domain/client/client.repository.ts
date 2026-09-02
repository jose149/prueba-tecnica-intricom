import { Client } from "./client";

export interface ClientRepository {
  findAll(): Promise<Client[]>;
  findById(id: number): Promise<Client | null>;
  create(client: Omit<Client, "id">): Promise<Client>;
  update(client: Client): Promise<Client>;
}
