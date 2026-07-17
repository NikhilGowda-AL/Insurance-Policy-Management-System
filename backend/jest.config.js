/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**',
    '!src/server.ts',
    '!src/seed/**'
  ],
  testTimeout: 30000
};
