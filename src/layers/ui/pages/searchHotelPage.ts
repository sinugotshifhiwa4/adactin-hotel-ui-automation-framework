import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../base/basePage.js";
import type { SearchHotelFields } from "./types/searchHotel/searchHotel.type.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";

export class SearchHotelPage extends BasePage {
  private readonly searchHotelTitle: Locator;

  private readonly locationDropdown: Locator;
  private readonly noLocationSelectedError: Locator;
  private readonly hotelsDropdown: Locator;
  private readonly roomTypeDropdown: Locator;
  private readonly numberOfRoomsDropdown: Locator;
  private readonly checkInDateInput: Locator;
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
    this.checkOutDateInput = page.locator("#datepick_out");
    this.adultsPerRoomDropdown = page.locator("#adult_room");
    this.childrenPerRoomDropdown = page.locator("#child_room");
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.resetButton = page.getByRole("button", { name: "Reset" });

    this.noLocationSelectedError = page.locator("#location_span");
  }

  public async verifySearchHotelTitileIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.searchHotelTitle,
      "verifySearchHotelTitileIsVisible",
      "visible",
      "Search Hotel Title",
    );
  }

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

  public async verifyNoLocationSelectedErrorMessage(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.noLocationSelectedError,
      "verifyNoLocationSelectedErrorMessage",
      "visible",
      "No Location Selected error message",
    );
  }

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

  public async clickSearchButton(): Promise<void> {
    await this.element.clickElement(
      this.searchButton,
      "clickSearchButton",
      "Search Button",
    );
  }

  public async clickResetButton(): Promise<void> {
    await this.element.clickElement(this.resetButton, "clickResetButton", "Reset Button");
  }
}
