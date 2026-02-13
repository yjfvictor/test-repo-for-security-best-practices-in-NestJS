/**
 * @file config.schema.spec.ts
 * @brief Unit tests for the environment variable validation schema.
 * @details Ensures valid env objects pass and invalid ones are rejected.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import { ConfigValidationSchema } from "./config.schema";

describe("ConfigValidationSchema", () => {
  it("should accept valid minimal env", () => {
    /**
     * @var env
     * @type Record<string, unknown>
     * @brief Empty env object for minimal validation.
     * @details An empty object is passed to ConfigValidationSchema.validate(). The schema
     *          defines defaults for NODE_ENV and PORT, so validation should succeed with
     *          no error. This test ensures the schema does not require any mandatory keys
     *          and that defaults are applied.
     */
    const env: Record<string, unknown> = {};
    const { error } = ConfigValidationSchema.validate(env);
    expect(error).toBeUndefined();
  });

  it("should accept valid env with NODE_ENV and PORT", () => {
    /**
     * @var env
     * @type Record<string, unknown>
     * @brief Env object with NODE_ENV and PORT.
     * @details Contains valid values: NODE_ENV is "production" (one of the allowed values)
     *          and PORT is 4000 (within 1–65535). Passed to validate() to confirm the
     *          schema accepts these and returns the same values; the test then asserts
     *          value?.NODE_ENV and value?.PORT match.
     */
    const env: Record<string, unknown> = {
      NODE_ENV: "production",
      PORT: 4000,
    };
    const { error, value } = ConfigValidationSchema.validate(env);
    expect(error).toBeUndefined();
    expect(value?.NODE_ENV).toBe("production");
    expect(value?.PORT).toBe(4000);
  });

  it("should reject invalid NODE_ENV", () => {
    /**
     * @var env
     * @type Record<string, unknown>
     * @brief Env object with invalid NODE_ENV.
     * @details NODE_ENV is set to "staging", which is not in the schema's allowed set
     *          (development, production, test). The test asserts that validate() returns
     *          an error so that invalid runtime environments are caught at startup.
     */
    const env: Record<string, unknown> = { NODE_ENV: "staging" };
    const { error } = ConfigValidationSchema.validate(env);
    expect(error).toBeDefined();
  });

  it("should reject PORT out of range", () => {
    /**
     * @var env
     * @type Record<string, unknown>
     * @brief Env object with PORT out of valid range.
     * @details PORT is 70000, which exceeds the schema maximum of 65535. The test asserts
     *          that validate() returns an error so that invalid ports are rejected and
     *          the application does not start with an invalid listen port.
     */
    const env: Record<string, unknown> = { PORT: 70000 };
    const { error } = ConfigValidationSchema.validate(env);
    expect(error).toBeDefined();
  });
});
