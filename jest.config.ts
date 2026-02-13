/**
 * @file jest.config.ts
 * @brief Jest configuration for unit and integration tests.
 * @details Configures ts-jest for TypeScript, sets module paths and coverage thresholds.
 * @author Victor Yeh
 * @date 2026-02-13
 * @copyright MIT License
 */

import type { Config } from 'jest';

/**
 * @var config
 * @type Config
 * @brief Jest configuration object. Defines file extensions, test pattern, transform, coverage collection and environment.
 * @details moduleFileExtensions allows Jest to resolve .js, .json and .ts files. rootDir is
 *          the project root. testRegex matches *.spec.ts and *-spec.ts so unit and e2e tests
 *          are discovered. transform uses ts-jest for TypeScript. collectCoverageFrom
 *          gathers coverage from src except main.ts. coverageDirectory is ./coverage.
 *          testEnvironment is node for a Node.js backend. This object is exported as the
 *          default and used by Jest when running npm test.
 */
const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '(.*\\.spec\\.ts$|.*-spec\\.ts$)',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/main.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};

export default config;
