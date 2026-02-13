/**
 * @file app.controller.ts
 * @brief Root HTTP controller exposing health and example endpoints.
 * @details Provides a simple health check and a getHello endpoint for demonstration.
 *          All routes are subject to rate limiting and security headers applied in main.ts.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

/**
 * @class AppController
 * @type class
 * @brief Root controller for the application.
 * @details Handles GET / and GET /health. Used by load balancers and monitoring
 *          for liveness and readiness checks.
 */
@Controller()
export class AppController {
  /**
   * @fn constructor
   * @type function
   * @brief Constructs the controller and injects the application service.
   * @details Injected by the Nest dependency injection container when AppController is
   *          instantiated. The service is used in getHello() to return the greeting string
   *          and in getHealth() to return the health status object. It is read-only and
   *          must not be reassigned after construction.
   * @param appService { AppService } Injected application service for greeting and health status.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * @fn getHello
   * @type function
   * @brief Returns a greeting message.
   * @details Serves the root path (GET /). The handler calls appService.getHello() and
   *          returns the resulting string as the response body with no content-type
   *          override, so the client receives plain text. This endpoint is subject to the
   *          same rate limiting and security headers as all other routes configured in
   *          main.ts. Used for demonstration and simple connectivity checks.
   * @returns { Promise<string> } The greeting string from AppService.
   */
  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  /**
   * @fn getHealth
   * @type function
   * @brief Health check endpoint for liveness and readiness.
   * @details Serves GET /health. Returns a JSON object { status: 'ok' } by calling
   *          appService.getHealth(). Orchestrators (e.g. Kubernetes) and load balancers
   *          use this endpoint to determine if the application is running and ready to
   *          receive traffic. The response is typically sent with application/json
   *          content-type. Can be extended later to include database or dependency
   *          health without changing the route contract.
   * @returns { Promise<{ status: string }> } Object with status field.
   */
  @Get("health")
  getHealth(): Promise<{ status: string }> {
    return this.appService.getHealth();
  }
}
