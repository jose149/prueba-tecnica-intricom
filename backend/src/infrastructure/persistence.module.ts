import { Injectable, Module, OnModuleInit } from "@nestjs/common";

import { FileSystemService } from "./filesystem/filesystem.service";

@Injectable()
export class PersistenceInitializer implements OnModuleInit {
  constructor(private readonly fileSystemService: FileSystemService) {}

  async onModuleInit(): Promise<void> {
    await this.fileSystemService.initialize();
  }
}

@Module({
  providers: [FileSystemService, PersistenceInitializer],
  exports: [FileSystemService],
})
export class PersistenceModule {}
