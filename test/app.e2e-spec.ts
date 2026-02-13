/**
 * @file app.e2e-spec.ts
 * @brief End-to-end tests for the root application endpoints.
 * @details Tests the default and health endpoints. Rate limiting and helmet are not
 *          asserted here but are applied when the app runs; unit tests cover service logic.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import { Test, type TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "../src/app.module";

describe("AppModule (e2e)", () => {
  /**
   * @var app
   * @type INestApplication
   * @brief Nest application instance using Fastify.
   * @details Created in beforeAll by compiling a TestingModule that imports AppModule and
   *          then calling createNestApplication(new FastifyAdapter()). After init(), app
   *          is used to obtain the Fastify instance for inject() calls and is closed in
   *          afterAll. It represents the full application as it would run in production,
   *          without binding to a real port.
   */
  let app: INestApplication;

  beforeAll(async () => {
    /**
     * @var moduleFixture
     * @type TestingModule
     * @brief Compiled testing module with AppModule.
     * @details Built with Test.createTestingModule({ imports: [AppModule] }).compile().
     *          The fixture is used to create the Nest application with FastifyAdapter and
     *          to initialise it so that HTTP requests can be simulated via inject() in
     *          the tests. It is not stored; only the created app is kept for the suite.
     */
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET / returns Hello World!", async () => {
    /**
     * @var fastifyInstance
     * @type { inject: (opts: { method: string; url: string }) => Promise<{ statusCode: number; payload: string }> }
     * @brief Fastify instance for HTTP inject.
     * @details Obtained from app.getHttpAdapter().getInstance(). The inject() method
     *          simulates an HTTP request without opening a socket: it runs the request
     *          through the full Fastify pipeline (routes, middleware) and returns a
     *          promise with statusCode and payload. Used here to call GET / and
     *          GET /health in the next test.
     */
    const fastifyInstance: {
      inject: (opts: {
        method: string;
        url: string;
      }) => Promise<{ statusCode: number; payload: string }>;
    } = app.getHttpAdapter().getInstance();
    /**
     * @var response
     * @type { statusCode: number; payload: string }
     * @brief HTTP response from inject.
     * @details The result of fastifyInstance.inject({ method: 'GET', url: '/' }).
     *          statusCode is asserted to be 200 and payload to be "Hello World!" so that
     *          the root route returns the expected greeting from the application.
     */
    const response: { statusCode: number; payload: string } =
      await fastifyInstance.inject({
        method: "GET",
        url: "/",
      });
    expect(response.statusCode).toBe(200);
    expect(response.payload).toBe("Hello World!");
  });

  it("GET /health returns status ok", async () => {
    /**
     * @var fastifyInstance
     * @type { inject: (opts: { method: string; url: string }) => Promise<{ statusCode: number; payload: string }> }
     * @brief Fastify instance for HTTP inject.
     * @details Same as in the previous test: the Fastify instance from the Nest app is
     *          used to call inject() with method GET and url /health so that the health
     *          route is exercised without a real HTTP server. The returned response is
     *          asserted for status 200 and a JSON body { status: 'ok' }.
     */
    const fastifyInstance: {
      inject: (opts: {
        method: string;
        url: string;
      }) => Promise<{ statusCode: number; payload: string }>;
    } = app.getHttpAdapter().getInstance();
    /**
     * @var response
     * @type { statusCode: number; payload: string }
     * @brief HTTP response from inject.
     * @details The result of fastifyInstance.inject({ method: 'GET', url: '/health' }).
     *          statusCode is asserted to be 200 and the payload is parsed as JSON and
     *          asserted to equal { status: 'ok' }, confirming the health endpoint
     *          returns the expected structure for liveness and readiness probes.
     */
    const response: { statusCode: number; payload: string } =
      await fastifyInstance.inject({
        method: "GET",
        url: "/health",
      });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload) as { status: string }).toEqual({
      status: "ok",
    });
  });
});
