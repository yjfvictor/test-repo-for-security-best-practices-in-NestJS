/**
 * @file app.controller.spec.ts
 * @brief Unit tests for AppController.
 * @details Verifies that AppController delegates to AppService and returns the expected
 *          values for getHello and getHealth.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import { Test, type TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  /**
   * @var appController
   * @type AppController
   * @brief Controller instance under test.
   * @details Assigned in beforeEach from the compiled TestingModule via get<AppController>().
   *          All tests in this describe block call getHello() or getHealth() on this instance
   *          and assert on the return value and that the mock appService was invoked.
   */
  let appController: AppController;

  /**
   * @var appService
   * @type AppService
   * @brief Mock AppService used to isolate controller logic.
   * @details Injected as a mock with jest.fn() for getHello and getHealth. Used to verify
   *          that the controller delegates to the service and to control the returned values
   *          so that only controller behaviour is tested without a real AppService.
   */
  let appService: AppService;

  beforeEach(async () => {
    /**
     * @var app
     * @type TestingModule
     * @brief Compiled testing module with mocked AppService.
     * @details Created by Test.createTestingModule with AppController and a mock provider
     *          for AppService. After compile(), app is used to get the controller and
     *          service instances that are assigned to appController and appService for
     *          each test in this suite.
     */
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockResolvedValue("Hello World!"),
            getHealth: jest.fn().mockResolvedValue({ status: "ok" }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe("getHello", () => {
    it('should return "Hello World!"', async () => {
      /**
       * @var result
       * @type string
       * @brief Return value of getHello.
       * @details The string returned by appController.getHello(). It is asserted to equal
       *          "Hello World!" and the test also verifies that appService.getHello was
       *          called, ensuring the controller delegates to the service.
       */
      const result: string = await appController.getHello();
      expect(result).toBe("Hello World!");
      expect(appService.getHello).toHaveBeenCalled();
    });
  });

  describe("getHealth", () => {
    it('should return { status: "ok" }', async () => {
      /**
       * @var result
       * @type { status: string }
       * @brief Return value of getHealth.
       * @details The object returned by appController.getHealth(). It is asserted to
       *          equal { status: 'ok' } and the test verifies that appService.getHealth
       *          was called, ensuring the controller delegates to the service.
       */
      const result: { status: string } = await appController.getHealth();
      expect(result).toEqual({ status: "ok" });
      expect(appService.getHealth).toHaveBeenCalled();
    });
  });
});
