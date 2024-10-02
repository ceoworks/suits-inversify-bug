module.exports = {
    collectCoverage: true,
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/?(*.)+(spec|test).ts"],
    testPathIgnorePatterns: ["tests/mocks"],
    testTimeout: 30000,
  };
