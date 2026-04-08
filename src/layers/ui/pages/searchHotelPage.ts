import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "../base/basePage.js";
import DateFormatter from "../../../utils/shared/dateFormatter.js";
import type { SearchHotelFields } from "./types/searchHotel/searchHotel.type.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";
import logger from "../../../configuration/logger/loggerManager.js";

export class SearchHotelPage extends BasePage {
  private readonly searchHotelTitle: Locator;

  private readonly locationDropdown: Locator;
  private readonly noLocationSelectedError: Locator;
  private readonly hotelsDropdown: Locator;
  private readonly roomTypeDropdown: Locator;
  private readonly numberOfRoomsDropdown: Locator;
  private readonly checkInDateInput: Locator;
  private readonly checkInCannotBeInPastError: Locator;
  private readonly checkOutDateInput: Locator;
  private readonly adultsPerRoomDropdown: Locator;
  private readonly childrenPerRoomDropdown: Locator;
  private readonly searchButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    super(page);

    this.searchHotelTitle = page.getByRole("cell", {
      name: "Search Hotel (Fields marked with Red asterix (*) are mandatory)",
      exact: true,
    });
    this.locationDropdown = page.locator("#location");
    this.hotelsDropdown = page.locator("#hotels");
    this.roomTypeDropdown = page.locator("#room_type");
    this.numberOfRoomsDropdown = page.locator("#room_nos");
    this.checkInDateInput = page.locator("#datepick_in");
    this.checkInCannotBeInPastError = page.locator("#checkin_span");
    this.checkOutDateInput = page.locator("#datepick_out");
    this.adultsPerRoomDropdown = page.locator("#adult_room");
    this.childrenPerRoomDropdown = page.locator("#child_room");
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.resetButton = page.getByRole("button", { name: "Reset" });

    this.noLocationSelectedError = page.locator("#location_span");
  }

  /**
   * Verifies that the Search Hotel title is visible on the Search Hotel page.
   * This should be visible on the page after navigating to the search hotel page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifySearchHotelTitileIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.searchHotelTitle,
      "verifySearchHotelTitileIsVisible",
      "visible",
      "Search Hotel Title",
    );
  }

  /**
   * Selects a location from the dropdown based on the provided options.
   * @param options The search hotel options object containing the location.
   * @throws An error if the location is not provided in the options.
   */
  public async selectLocation(options: SearchHotelFields): Promise<void> {
    const { location } = options;
    if (location === undefined) {
      ErrorHandler.logAndThrow(
        "selectLocation",
        "Location is a mandatory field but was not provided in the options.",
      );
    }
    await this.element.selectOption(
      this.locationDropdown,
      "selectLocation",
      location,
      `Location: '${location}' Dropdown option`,
    );
  }

  /**
   * Verifies that the No Location Selected error message is visible on the Search Hotel page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyNoLocationSelectedErrorMessage(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.noLocationSelectedError,
      "verifyNoLocationSelectedErrorMessage",
      "visible",
      "No Location Selected error message",
    );
  }

  /**
   * Searches for hotels based on the provided options.
   * @param options The search hotel options object containing the location, hotel, room type, number of rooms, check-in date, check-out date, adults per room, and children per room.
   * @returns A promise that resolves if the search action succeeds, or rejects with an error if it fails.
   * @remarks The function will search for hotels based on the provided options and throw an error if any of the fields are invalid.
   */
  public async searchHotel(options: SearchHotelFields): Promise<void> {
    try {
      await this.selectLocation(options);
      await this.selectHotel(options);
      await this.selectRoomType(options);
      await this.selectNumberOfRooms(options);
      await this.fillCheckInDate(options);
      await this.fillCheckOutDate(options);
      await this.selectAdultsPerRoom(options);
      await this.selectChildrenPerRoom(options);
      await this.clickSearchButton();
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "searchHotel",
        "An error occurred while searching for hotels with the provided options.",
      );
      throw error;
    }
  }

  /**
   * Selects the hotel from the dropdown list.
   * @param options The search hotel options object containing the hotel.
   * @returns A promise that resolves if the select action succeeds, or rejects with an error if it fails.
   * @remarks The function will select the option from the dropdown list that matches the provided hotel value.
   */
  private async selectHotel(options: SearchHotelFields): Promise<void> {
    const { hotel } = options;
    if (hotel === undefined) return;
    await this.element.selectOption(
      this.hotelsDropdown,
      "selectHotel",
      hotel,
      `Hotel: '${hotel}' Dropdown option`,
    );
  }

  /**
   * Selects the room type from the dropdown list.
   * @param options The search hotel options object containing the room type.
   * @returns A promise that resolves if the select action succeeds, or rejects with an error if it fails.
   * @remarks The function will select the option from the dropdown list that matches the provided roomType value.
   */
  private async selectRoomType(options: SearchHotelFields): Promise<void> {
    const { roomType } = options;
    if (roomType === undefined) return;
    await this.element.selectOption(
      this.roomTypeDropdown,
      "selectRoomType",
      roomType,
      `Room Type: '${roomType}' Dropdown option`,
    );
  }

  /**
   * Selects the number of rooms from the dropdown list.
   * @param options The search hotel options object containing the number of rooms.
   * @returns A promise that resolves if the select action succeeds, or rejects with an error if it fails.
   * @remarks The function will select the option from the dropdown list that matches the provided numberOfRooms value.
   */
  private async selectNumberOfRooms(options: SearchHotelFields): Promise<void> {
    const { numberOfRooms } = options;
    if (numberOfRooms === undefined) return;
    await this.element.selectOption(
      this.numberOfRoomsDropdown,
      "selectNumberOfRooms",
      numberOfRooms,
      `Number of Rooms: '${numberOfRooms}' Dropdown option`,
    );
  }

  /**
   * Fills the Check-In Date input with the provided date.
   * If the provided date is undefined, the function will return without performing any action.
   * @param options The search hotel options object containing the check-in date.
   * @returns A promise that resolves if the fill action succeeds, or rejects with an error if it fails.
   */
  private async fillCheckInDate(options: SearchHotelFields): Promise<void> {
    const { checkInDate } = options;
    if (checkInDate === undefined) return;
    await this.element.fillElement(
      this.checkInDateInput,
      "fillCheckInDate",
      checkInDate,
      "Check-In Date input",
    );
  }

  /**
   * Fills the Check-Out Date input with the provided date.
   * If the provided date is undefined, the function will return without performing any action.
   * @param options The search hotel options object containing the check-out date.
   * @returns A promise that resolves if the fill action succeeds, or rejects with an error if it fails.
   */
  private async fillCheckOutDate(options: SearchHotelFields): Promise<void> {
    const { checkOutDate } = options;
    if (checkOutDate === undefined) return;
    await this.element.fillElement(
      this.checkOutDateInput,
      "fillCheckOutDate",
      checkOutDate,
      "Check-Out Date input",
    );
  }

  /**
   * Selects the number of adults per room from the dropdown list.
   * @param options The search hotel options object.
   * @returns A promise that resolves if the select action succeeds, or rejects with an error if it fails.
   * @remarks The function will select the option from the dropdown list that matches the provided adultsPerRoom value.
   */
  private async selectAdultsPerRoom(options: SearchHotelFields): Promise<void> {
    const { adultsPerRoom } = options;
    if (adultsPerRoom === undefined) return;
    await this.element.selectOption(
      this.adultsPerRoomDropdown,
      "selectAdultsPerRoom",
      adultsPerRoom,
      `Adults per Room: '${adultsPerRoom}' Dropdown option`,
    );
  }

  /**
   * Selects the number of children per room from the dropdown list.
   * @param options The search hotel options object.
   * @returns A promise that resolves if the select action succeeds, or rejects with an error if it fails.
   */
  private async selectChildrenPerRoom(options: SearchHotelFields): Promise<void> {
    const { childrenPerRoom } = options;
    if (childrenPerRoom === undefined) return;
    await this.element.selectOption(
      this.childrenPerRoomDropdown,
      "selectChildrenPerRoom",
      childrenPerRoom,
      `Children per Room: '${childrenPerRoom}' Dropdown option`,
    );
  }

  /**
   * Simulates a click on the Search button on the Search Hotel page.
   * After the click, the page is expected to redirect to the Search Results page.
   * @returns A promise that resolves if the click action succeeds, or rejects with an error if it fails.
   */
  public async clickSearchButton(): Promise<void> {
    await this.element.clickElement(
      this.searchButton,
      "clickSearchButton",
      "Search Button",
    );
  }

  /**
   * Simulates a click on the reset button on the Search Hotel page.
   * After the click, the page is expected to reset all the search fields to their default values.
   * @returns A promise that resolves if the click action succeeds, or rejects with an error if it fails.
   */
  public async clickResetButton(): Promise<void> {
    await this.element.clickElement(this.resetButton, "clickResetButton", "Reset Button");
  }

  // Check-in date

  /**
   * Verifies that the UI error message for past check-in date is visible.
   * If the error message is not visible, falls back to validating the check-in and check-out dates using DateFormatter.
   * @param options - Required search hotel options containing check-in and check-out dates.
   * @returns A promise that resolves when the verification is complete.
   */
  public async verifyCheckInDateCannotBeInPast(
    options: SearchHotelFields,
  ): Promise<void> {
    const isErrorMessageVisible =
      await this.isCheckInDateCannotBeInPastErrorMessageVisible();

    if (isErrorMessageVisible) {
      logger.info("Verified: UI error message for past check-in date is visible");
      return;
    }

    // No UI error — fallback
    DateFormatter.validateCheckInAndOutDates(options);
  }

  /**
   * Checks if the UI error message for past check-in date is visible.
   * @returns A promise that resolves with true if the error message is visible, or false otherwise.
   */
  private async isCheckInDateCannotBeInPastErrorMessageVisible(): Promise<boolean> {
    try {
      await this.checkInCannotBeInPastError.waitFor({
        state: "visible",
        timeout: 2000,
      });
      return true;
    } catch {
      return false;
    }
  }
}
