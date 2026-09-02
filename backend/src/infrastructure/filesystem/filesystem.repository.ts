import { promises as fs } from "fs";
import * as path from "path";

export interface FileMetadata {
  TOTAL_REGISTRIES: number;
  LAST_INDEX: number;
}

export class FileSystemRepository<T extends { id: number }> {
  constructor(
    private readonly basePath: string,
    private readonly entityName: string,
  ) {}

  private get entityPath(): string {
    return path.join(this.basePath, this.entityName);
  }

  private get metadataPath(): string {
    return path.join(this.entityPath, "_metadata.json");
  }

  private getRecordPath(id: number): string {
    return path.join(this.entityPath, `${id}.json`);
  }

  async initialize(): Promise<void> {
    await fs.mkdir(this.entityPath, { recursive: true });

    try {
      await fs.access(this.metadataPath);
    } catch {
      await this.writeMetadata({
        TOTAL_REGISTRIES: 0,
        LAST_INDEX: 0,
      });
    }
  }

  async findAll(): Promise<T[]> {
    const files = await fs.readdir(this.entityPath);

    const recordFiles = files.filter(
      (file) => file.endsWith(".json") && file !== "_metadata.json",
    );

    const records = await Promise.all(
      recordFiles.map((file) =>
        this.readFile<T>(path.join(this.entityPath, file)),
      ),
    );

    return records.sort((a, b) => a.id - b.id);
  }

  async findById(id: number): Promise<T | null> {
    try {
      return await this.readFile<T>(this.getRecordPath(id));
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return null;
      }

      throw error;
    }
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const metadata = await this.readMetadata();

    const id = metadata.LAST_INDEX + 1;

    const record = {
      ...data,
      id,
    } as T;

    await this.writeFile(this.getRecordPath(id), record);

    await this.writeMetadata({
      TOTAL_REGISTRIES: metadata.TOTAL_REGISTRIES + 1,
      LAST_INDEX: id,
    });

    return record;
  }

  async update(data: T): Promise<T> {
    const existing = await this.findById(data.id);

    if (!existing) {
      throw new Error(`Record with id ${data.id} not found`);
    }

    await this.writeFile(this.getRecordPath(data.id), data);

    return data;
  }

  private async readMetadata(): Promise<FileMetadata> {
    return this.readFile<FileMetadata>(this.metadataPath);
  }

  private async writeMetadata(metadata: FileMetadata): Promise<void> {
    await this.writeFile(this.metadataPath, metadata);
  }

  private async readFile<R>(filePath: string): Promise<R> {
    const content = await fs.readFile(filePath, "utf-8");

    return JSON.parse(content) as R;
  }

  private async writeFile(filePath: string, data: unknown): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}
