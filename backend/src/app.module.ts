import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Joi from "joi";

import configuration from "./config/configuration";
import { PersistenceModule } from "./infrastructure/persistence.module";

import { ClientModule } from "./application/client/client.module";
import { HotelModule } from "./application/hotel/hotel.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        DATA_TYPE: Joi.string().valid("FS", "DB").required(),
        FS_FOLDER: Joi.string().when("DATA_TYPE", {
          is: "FS",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    }),
    PersistenceModule,
    ClientModule,
    HotelModule,
  ],
})
export class AppModule {}
