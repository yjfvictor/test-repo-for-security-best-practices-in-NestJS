/**
 * @file app.service.ts
 * @brief Root application service providing greeting and health logic.
 * @details Contains no external I/O; returns fixed strings and health status for the
 *          root controller. Kept minimal to avoid exposing sensitive data.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import { Injectable } from "@nestjs/common";

/**
 * @class AppService
 * @type class
 * @brief Service for root-level application behaviour.
 * @details Used by AppController to serve the default greeting and health check.
 *          No configuration or secrets are read here; sensitive values are handled
 *          only through ConfigService in dedicated modules.
 */
@Injectable()
export class AppService {
  /**
   * @fn getHello
   * @type function
   * @brief Returns a greeting message.
   * @details Returns a fixed string "Hello World!" via Promise.resolve. This service
   *          does not perform external I/O or read configuration. In a real application
   *          the text might be localised or read from configuration, but it must never
   *          be derived from unsanitised user input to avoid injection or XSS. The
   *          controller calls this method to serve the root path response.
   * @returns { Promise<string> } The greeting "Hello World!".
   */
  getHello(): Promise<string> {
    return Promise.resolve("Hello World!");
  }

  /**
   * @fn getHealth
   * @type function
   * @brief Returns health status for the application.
   * @details Returns an object { status: 'ok' } via Promise.resolve. Used by the
   *          health controller to serve GET /health for liveness and readiness probes.
   *          This implementation always reports ok; it can be extended to query a
   *          database or other dependencies and return a non-ok status or additional
   *          fields when the application is degraded, without changing the method
   *          signature used by the controller.
   * @returns { Promise<{ status: string }> } Object with status "ok".
   */
  getHealth(): Promise<{ status: string }> {
    return Promise.resolve({ status: "ok" });
  }
}
