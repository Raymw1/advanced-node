/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  ...require('./jest.config.js'),
  testMatch: ['**/*.test.ts']
}

module.exports = config
