module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.test.ts"],
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.ts",
      "!src/server.ts",
      "!src/**/*.d.ts"
    ]
  };