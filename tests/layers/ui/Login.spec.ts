import { test } from "../../../fixtures/test.fixture.js";
import logger from "../../../src/configuration/logger/loggerManager.js";

test.describe("Login Page Test Suite", { tag: "@regression" }, () => {
  test.beforeEach(async ({ loginOrchestrator }) => {
    await loginOrchestrator.navigateToPortal();
  });

  test(
    "Should verify login is successful with valid credentials",
    { tag: "@sanity" },
    async ({ runtimeResolver, loginOrchestrator }) => {
      await loginOrchestrator.performLoginWithValidCredentials({
        username: runtimeResolver.getPortalCredentials().username,
        password: runtimeResolver.getPortalCredentials().password,
      });
      logger.info(`Assertion Passed: Login successful with valid credentials`);
    },
  );

  test("Should verify login fails with invalid credentials", async ({
    runtimeResolver,
    loginOrchestrator,
  }) => {
    await loginOrchestrator.performLoginWithInvalidCredentials({
      username: runtimeResolver.getPortalCredentials().username,
      password: "invalidPass",
    });
    logger.info(`Assertion Passed: Login failed with invalid credentials`);
  });
});
