import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import Joi from "joi";

import configuration from "./config/configuration";

import { PersistenceModule } from "./infrastructure/persistence.module";
import { ClientModule } from "./application/client/client.module";
import { HotelModule } from "./application/hotel/hotel.module";
import { HotelBookingModule } from "./application/hotel-booking/hotel-booking.module";

import { DatabaseModule } from "./infrastructure/database/database.module";

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

        DB_HOST: Joi.string().when("DATA_TYPE", {
          is: "DB",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        DB_PORT: Joi.number().when("DATA_TYPE", {
          is: "DB",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        DB_USERNAME: Joi.string().when("DATA_TYPE", {
          is: "DB",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        DB_PASSWORD: Joi.string().when("DATA_TYPE", {
          is: "DB",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        DB_DATABASE: Joi.string().when("DATA_TYPE", {
          is: "DB",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mssql" as const,
        host: configService.getOrThrow<string>("db.host"),
        port: configService.getOrThrow<number>("db.port"),
        username: configService.getOrThrow<string>("db.username"),
        password: configService.getOrThrow<string>("db.password"),
        database: configService.getOrThrow<string>("db.database"),
        autoLoadEntities: true,
        synchronize: false,
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }),
    }),

    DatabaseModule,

    ClientModule,
    HotelModule,
    HotelBookingModule,
  ],
})
export class AppModule {}
