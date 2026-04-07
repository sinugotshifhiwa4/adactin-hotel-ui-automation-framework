import { test } from "../../../fixtures/test.fixture.js";
import logger from "../../../src/configuration/logger/loggerManager.js";

test.describe("Top Navigation Bar Test Suite", { tag: "@regression" }, () => {
  test.beforeEach(async ({ runtimeResolver, loginOrchestrator }) => {
    await loginOrchestrator.navigateToPortal();
    await loginOrchestrator.performLoginWithValidCredentials({
      username: runtimeResolver.getPortalCredentials().username,
      password: runtimeResolver.getPortalCredentials().password,
    });
  });

  test("Should verify all top navigation bar links are visible", async ({ topNavigationBar }) => {
    await topNavigationBar.verifyTopNavBarIsDisplayed();
    await topNavigationBar.verifyAllTopNavigationBarLinksAreVisible();

    logger.info(`Assertion Passed: All top navigation bar links are visible`);
  });
});
