/**
 * @file main.ts
 * @brief Application entry point that bootstraps the NestJS server with Fastify and security plugins.
 * @details This file initialises the NestJS application using the Fastify adapter, registers
 *          @fastify/helmet for security HTTP headers and @fastify/rate-limit for request rate
 *          limiting. The server listens on the port specified by the PORT environment variable
 *          or 3000 by default. All sensitive configuration is loaded from environment variables.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { AppModule } from "./app.module";

/**
 * @fn bootstrap
 * @type function
 * @brief Bootstraps and starts the NestJS application with security middleware.
 * @details Creates the NestJS application using the Fastify adapter, then registers
 *          Helmet (security headers) and rate limiting before the application listens.
 *          Order of registration matters: helmet and rate-limit are applied before routes
 *          so that every request receives security headers and is subject to rate limits.
 *          The port is read from the PORT environment variable or default 3000, and the
 *          server listens on 0.0.0.0 so it is reachable from all interfaces. The function
 *          is invoked at the end of the file to start the server.
 * @returns { Promise<void> } Resolves when the server is listening.
 */
async function bootstrap(): Promise<void> {
  /**
   * @var app
   * @type NestFastifyApplication
   * @brief Nest application created with Fastify adapter.
   * @details The application is created by NestFactory.create with AppModule and FastifyAdapter.
   *          It is used to obtain the underlying Fastify instance for registering helmet and
   *          rate-limit plugins, and later to call listen(port) so the server binds and
   *          accepts HTTP requests. All routes and middleware are attached to this instance.
   */
  const app: NestFastifyApplication =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: true }),
    );

  /**
   * @var fastifyInstance
   * @type FastifyInstance
   * @brief The underlying Fastify instance for registering plugins.
   * @details Obtained via getHttpAdapter().getInstance() so that Fastify plugins can be
   *          registered directly. Helmet and rate-limit are registered on this instance
   *          before any routes are bound, ensuring every request passes through security
   *          headers and rate limiting. The same instance is used for all subsequent
   *          plugin registration in this bootstrap flow.
   */
  const fastifyInstance = app.getHttpAdapter().getInstance();

  await fastifyInstance.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastifyInstance.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  /**
   * @var port
   * @type number
   * @brief Port number from environment or default 3000.
   * @details Read from the PORT environment variable; if unset or empty, the string "3000"
   *          is used. Parsed with parseInt(..., 10) to produce an integer for the TCP port.
   *          This value is passed to app.listen(port, '0.0.0.0') so the server listens on
   *          all interfaces at the given port for incoming HTTP connections.
   */
  const port: number = parseInt(process.env["PORT"] ?? "3000", 10);
  await app.listen(port, "0.0.0.0");
}

bootstrap();
