import { test } from "../../../fixtures/test.fixture.js";
import SearchHotelTestDataBuilder from "../../../src/testData/builders/searchHotelTestDataBuilder.js";
import DateFormatter from "../../../src/utils/shared/dateFormatter.js";
import logger from "../../../src/configuration/logger/loggerManager.js";

test.describe("Search Hotel Test Suite", { tag: "@regression" }, () => {
  test.beforeEach(async ({ runtimeResolver, loginOrchestrator }) => {
    await loginOrchestrator.navigateToPortal();
    await loginOrchestrator.performLoginWithValidCredentials({
      username: runtimeResolver.getPortalCredentials().username,
      password: runtimeResolver.getPortalCredentials().password,
    });
  });

  test("Should show an error when searching for a hotel without selecting a location", async ({
    searchHotelPage,
  }) => {
    await searchHotelPage.verifySearchHotelTitileIsVisible();
    await searchHotelPage.clickSearchButton();
    await searchHotelPage.verifyNoLocationSelectedErrorMessage();

    logger.info(`Assertion Passed: Error is displayed when location is not selected`);
  });

  test("should return results matching all selected search criteria", async ({
    searchHotelPage,
    selectHotelPage,
  }) => {
    const dataBuilder = SearchHotelTestDataBuilder.build();

    await searchHotelPage.verifySearchHotelTitileIsVisible();
    await searchHotelPage.searchHotel(dataBuilder);

    const numberOfDays = DateFormatter.calculateNumberOfDays(dataBuilder);

    await selectHotelPage.verifyFilteredResultsMatch({
      ...dataBuilder,
      numberOfDays,
    });

    logger.info("Assertion Passed: Hotel search results match all selected criteria");
  });
});
