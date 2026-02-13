/**
 * @file app.module.ts
 * @brief Root application module that wires configuration and feature modules.
 * @details ConfigModule is loaded globally so that environment variables and validated
 *          configuration are available across the application without importing in every module.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigValidationSchema } from "./config/config.schema";

/**
 * @class AppModule
 * @type class
 * @brief Root NestJS module for the application.
 * @details Aggregates configuration (ConfigModule with validation), the root controller
 *          and service. ConfigModule is configured to load from process.env and validate
 *          using the Joi schema in ConfigValidationSchema.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigValidationSchema,
      validationOptions: {
        allowUnknown: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
