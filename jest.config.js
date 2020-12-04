// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Stop running tests after `n` failures
  bail: 1,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFilesAfterEnv: ["dotenv/config"],

  // The test environment that will be used for testing
  testEnvironment: "node",
};
