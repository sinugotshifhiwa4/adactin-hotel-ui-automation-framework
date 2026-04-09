import { test } from "../../../fixtures/test.fixture.js";
import SearchHotelTestDataBuilder from "../../../src/testData/builders/searchHotelTestDataBuilder.js";
import logger from "../../../src/configuration/logger/loggerManager.js";

test.describe("Search Hotel Test Suite", { tag: "@regression" }, () => {
  test.beforeEach(async ({ runtimeResolver, loginOrchestrator }) => {
    await loginOrchestrator.navigateToPortal();
    await loginOrchestrator.performLoginWithValidCredentials({
      username: runtimeResolver.getPortalCredentials().username,
      password: runtimeResolver.getPortalCredentials().password,
    });
  });

  test("should attempt to book hotel without selecting hotel", async ({
    searchHotelPage,
    selectHotelPage,
  }) => {
    const location = SearchHotelTestDataBuilder.getRandomLocation();
    const hotel = SearchHotelTestDataBuilder.getRandomHotel();
    const roomType = SearchHotelTestDataBuilder.getRandomRoomType();

    await searchHotelPage.verifySearchHotelTitleIsVisible();
    await searchHotelPage.searchHotel({ location: location, hotel: hotel, roomType: roomType });
    await selectHotelPage.verifySelectHotelTitleIsVisible();
    await selectHotelPage.clickContinueButton();
    await selectHotelPage.verifyNoHotelSelectedErrorIsVisible();

    logger.info("Assertion Passed: Error is displayed when hotel is not selected");
  });

  test("should select hotel", async ({ searchHotelPage, selectHotelPage, bookHotelPage }) => {
    const location = SearchHotelTestDataBuilder.getRandomLocation();
    const hotel = SearchHotelTestDataBuilder.getRandomHotel();
    const roomType = SearchHotelTestDataBuilder.getRandomRoomType();

    await searchHotelPage.verifySearchHotelTitleIsVisible();
    await searchHotelPage.searchHotel({ location: location, hotel: hotel, roomType: roomType });

    await selectHotelPage.clickRowRadioButton({
      location: location,
      hotel: hotel,
      roomType: roomType,
    });
    await selectHotelPage.clickContinueButton();
    await bookHotelPage.verifyBookHotelTitleIsVisible();

    logger.info("Assertion Passed: Location, hotel and room type fields have been reset");
  });
});
