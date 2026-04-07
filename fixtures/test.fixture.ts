import { test as baseTest, expect, type TestInfo } from "@playwright/test";

import { RuntimeEnvVariableResolver } from "../src/configuration/environment/runtimeVariableResolver/runtimeEnvVariableResolver.js";
import { TestContext } from "../src/layers/ui/context/testContext.js";

// Pages

import { LoginPage } from "../src/layers/ui/pages/loginPage.js";
import { SearchHotelPage } from "../src/layers/ui/pages/searchHotelPage.js";
import { LoginOrchestrator } from "../src/configuration/authentication/loginOrchestrator.js";
import { TopNavigationBar } from "../src/layers/ui/pages/topNavigationBar.js";
import { SelectHotelPage } from "../src/layers/ui/pages/selectHotelPage.js";

type TestFixtures = {
  testInfo: TestInfo;
  runtimeResolver: RuntimeEnvVariableResolver;
  testContext: TestContext;

  // Pages
  loginPage: LoginPage;
  searchHotelPage: SearchHotelPage;
  loginOrchestrator: LoginOrchestrator;
  topNavigationBar: TopNavigationBar;
  selectHotelPage: SelectHotelPage;
};

export const test = baseTest.extend<TestFixtures>({
  /**
   * Sets the zoom level of the given page to 0.70.
   * This is used to ensure that the page is rendered at a consistent size
   * for testing purposes.
   *
   * @param {Page} page - The page to set the zoom level of.
   * @param {Function} use - A function that is called with the page as an argument.
   * @returns {Promise<void>} - A promise that resolves when the zoom level has been set and the page has been used.
   */
  page: async ({ page }, use) => {
    const onLoad = async () => {
      try {
        await page.evaluate(() => {
          document.body.style.zoom = "0.70";
        });
      } catch {}
    };

    page.on("load", onLoad);
    await use(page);
    page.off("load", onLoad);
  },

  testInfo: async ({}, use, testInfo: TestInfo) => {
    await use(testInfo);
  },

  runtimeResolver: async ({}, use) => {
    await use(new RuntimeEnvVariableResolver());
  },

  testContext: async ({}, use) => {
    await use(new TestContext());
  },

  // Pages
  loginPage: async ({ page, runtimeResolver }, use) => {
    await use(new LoginPage(page, runtimeResolver));
  },

  searchHotelPage: async ({ page }, use) => {
    await use(new SearchHotelPage(page));
  },

  topNavigationBar: async ({ page }, use) => {
    await use(new TopNavigationBar(page));
  },

  loginOrchestrator: async (
    { page, runtimeResolver, loginPage, topNavigationBar },
    use,
  ) => {
    await use(new LoginOrchestrator(page, runtimeResolver, loginPage, topNavigationBar));
  },

  selectHotelPage: async ({ page }, use) => {
    await use(new SelectHotelPage(page));
  },
});

export { expect };
