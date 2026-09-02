import { Client } from "../../domain/client/client";
import { ClientRepository } from "../../domain/client/client.repository";
import { FileSystemRepository } from "./filesystem.repository";

export class FsClientRepository implements ClientRepository {
  private readonly repository: FileSystemRepository<Client>;

  constructor(basePath: string) {
    this.repository = new FileSystemRepository<Client>(basePath, "Client");
  }

  initialize(): Promise<void> {
    return this.repository.initialize();
  }

  findAll(): Promise<Client[]> {
    return this.repository.findAll();
  }

  findById(id: number): Promise<Client | null> {
    return this.repository.findById(id);
  }

  create(client: Omit<Client, "id">): Promise<Client> {
    return this.repository.create(client);
  }

  update(client: Client): Promise<Client> {
    return this.repository.update(client);
  }
}
