/**
 * @file app.service.spec.ts
 * @brief Unit tests for AppService.
 * @details Verifies that getHello and getHealth return the expected values.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import { Test, type TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";

describe("AppService", () => {
  /**
   * @var service
   * @type AppService
   * @brief Service instance under test.
   * @details Assigned in beforeEach from the compiled TestingModule via get<AppService>().
   *          Each test calls getHello() or getHealth() on this instance and asserts the
   *          return value, with no mocks so that the real AppService implementation is
   *          exercised.
   */
  let service: AppService;

  beforeEach(async () => {
    /**
     * @var module
     * @type TestingModule
     * @brief Compiled testing module containing AppService.
     * @details Built with Test.createTestingModule with AppService as the only provider.
     *          After compile(), the module is used to obtain the AppService instance via
     *          get<AppService>() and assign it to service for each test in this suite.
     */
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getHello", () => {
    it('should return "Hello World!"', async () => {
      /**
       * @var result
       * @type string
       * @brief Return value of getHello.
       * @details The string returned by service.getHello(). It is asserted to be exactly
       *          "Hello World!" to confirm the service returns the expected greeting
       *          without any external configuration or I/O.
       */
      const result: string = await service.getHello();
      expect(result).toBe("Hello World!");
    });
  });

  describe("getHealth", () => {
    it('should return { status: "ok" }', async () => {
      /**
       * @var result
       * @type { status: string }
       * @brief Return value of getHealth.
       * @details The object returned by service.getHealth(). It is asserted to equal
       *          { status: 'ok' } to confirm the service returns the expected health
       *          payload for use by health-check endpoints.
       */
      const result: { status: string } = await service.getHealth();
      expect(result).toEqual({ status: "ok" });
    });
  });
});
