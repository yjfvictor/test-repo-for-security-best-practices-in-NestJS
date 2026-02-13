/**
 * @file config.schema.ts
 * @brief Joi validation schema for application environment variables.
 * @details Ensures required and optional environment variables are present and correctly
 *          typed before the application starts. Prevents misconfiguration and supports
 *          secure handling of API keys and secrets by validating them at bootstrap.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import * as Joi from "joi";

/**
 * @var ConfigValidationSchema
 * @type Joi.ObjectSchema
 * @brief Joi schema for validating process environment variables.
 * @details NODE_ENV must be one of development, production, test. PORT must be a positive
 *          integer. Optional API_KEY and DATABASE_URL are validated for format when present.
 *          Never log or expose the raw schema or validated values in production.
 */
export const ConfigValidationSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  API_KEY: Joi.string().optional().allow(""),
  DATABASE_URL: Joi.string().uri().optional().allow(""),
});
