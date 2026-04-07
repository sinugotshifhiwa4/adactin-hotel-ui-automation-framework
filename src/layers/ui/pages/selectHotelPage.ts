import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "../base/basePage.js";
import type { HotelSearchRowIdentifier } from "./types/searchHotel/selectHotel.type.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";
import logger from "../../../configuration/logger/loggerManager.js";

export class SelectHotelPage extends BasePage {
  private readonly selectHotelTitle: Locator;
  private readonly getFilteredRows: (options: HotelSearchRowIdentifier) => Locator;

  constructor(page: Page) {
    super(page);

    this.selectHotelTitle = page.getByRole("cell", { name: "Select Hotel", exact: true });

    const resultsTableBody = page.locator("table.login table tbody");

    this.getFilteredRows = (options: HotelSearchRowIdentifier) => {
      let rows = resultsTableBody.locator("tr");

      if (options.location) {
        rows = rows.filter({
          has: this.page.locator(`input[name^="location_"][value="${options.location}"]`),
        });
      }

      if (options.hotel) {
        rows = rows.filter({
          has: this.page.locator(`input[name^="hotel_name_"][value="${options.hotel}"]`),
        });
      }

      if (options.roomType) {
        rows = rows.filter({
          has: this.page.locator(
            `input[name^="room_type_"][value="${options.roomType}"]`,
          ),
        });
      }

      if (options.numberOfRooms) {
        const roomsValue = this.convertToRoomsFormat(options.numberOfRooms);
        rows = rows.filter({
          has: this.page.locator(`input[name^="rooms_"][value="${roomsValue}"]`),
        });
      }

      if (options.checkInDate) {
        rows = rows.filter({
          has: this.page.locator(
            `input[name^="arr_date_"][value="${options.checkInDate}"]`,
          ),
        });
      }

      if (options.checkOutDate) {
        rows = rows.filter({
          has: this.page.locator(
            `input[name^="dep_date_"][value="${options.checkOutDate}"]`,
          ),
        });
      }

      if (options.numberOfDays) {
        const daysValue = this.convertToDaysFormat(options.numberOfDays);
        rows = rows.filter({
          has: this.page.locator(`input[name^="no_days_"][value="${daysValue}"]`),
        });
      }

      return rows;
    };
  }

  public async verifySelectHotelTitleIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.selectHotelTitle,
      "verifySelectHotelTitleIsVisible",
      "visible",
      "Select Hotel Title",
    );
  }

  public async verifyFilteredResultsMatch(
    options: HotelSearchRowIdentifier,
  ): Promise<void> {
    try {
      await this.selectHotelTitle.waitFor({ state: "visible" });

      const rowsLocator = this.getFilteredRows(options);
      const rowCount = await rowsLocator.count();

      this.assertRowsFound(rowCount, options);

      for (let i = 0; i < rowCount; i++) {
        const row = rowsLocator.nth(i);
        const values = await this.extractAndAssertRowValues(row, options);
        this.logRowValues(i + 1, values);
      }

      const filterEntries = Object.entries(options)
        .map(([key, val]) => `  ${key}: '${val}'`)
        .join("\n");

      logger.info(
        `Verified: ${rowCount} row(s) matched the following filters:\n${filterEntries}`,
      );
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "verifyFilteredResultsMatch",
        `An error occurred while verifying filtered results with options: ${JSON.stringify(options)}`,
      );
      throw error;
    }
  }

  private assertRowsFound(rowCount: number, options: HotelSearchRowIdentifier): void {
    if (rowCount === 0) {
      ErrorHandler.logAndThrow(
        "verifyFilteredResultsMatch",
        `An error has occurred: one or more locators were not found, hence no rows matched the provided fields: ${JSON.stringify(options)}`,
      );
    }
  }

  private async extractAndAssertRowValues(
    row: Locator,
    options: HotelSearchRowIdentifier,
  ): Promise<Record<string, string>> {
    const values: Record<string, string> = {};

    if (options.location) {
      const value = await row
        .locator(`input[name^="location_"]`)
        .first()
        .getAttribute("value");
      expect(value).toBe(options.location);
      if (value !== null) values["Location"] = value;
    }

    if (options.hotel) {
      const value = await row
        .locator(`input[name^="hotel_name_"]`)
        .first()
        .getAttribute("value");
      expect(value).toBe(options.hotel);
      if (value !== null) values["Hotel"] = value;
    }

    if (options.roomType) {
      const value = await row
        .locator(`input[name^="room_type_"]`)
        .first()
        .getAttribute("value");
      expect(value).toBe(options.roomType);
      if (value !== null) values["Room Type"] = value;
    }

    if (options.numberOfRooms) {
      const value = await row
        .locator(`input[name^="rooms_"]`)
        .first()
        .getAttribute("value");
      expect(value).toBe(this.convertToRoomsFormat(options.numberOfRooms));
      if (value !== null) values["Number of Rooms"] = value;
    }

    if (options.checkInDate) {
      const value = await row
        .locator(`input[name^="arr_date_"]`)
        .first()
        .getAttribute("value");
      expect(value).toBe(options.checkInDate);
      if (value !== null) values["Check-In Date"] = value;
    }

    if (options.checkOutDate) {
      const value = await row
        .locator(`input[name^="dep_date_"]`)
        .first()
        .getAttribute("value");
      expect(value).toBe(options.checkOutDate);
      if (value !== null) values["Check-Out Date"] = value;
    }

    if (options.numberOfDays) {
      const value = await row
        .locator(`input[name^="no_days_"]`)
        .first()
        .getAttribute("value");
      expect(value).toBe(this.convertToDaysFormat(options.numberOfDays));
      if (value !== null) values["Number of Days"] = value;
    }

    return values;
  }

  private logRowValues(rowNumber: number, values: Record<string, string>): void {
    const parts = Object.entries(values).map(([key, val]) => `  ${key}: '${val}'`);
    if (parts.length > 0) {
      logger.info(`Row ${rowNumber}:\n${parts.join("\n")}`);
    }
  }

  // Helpers

  private convertToRoomsFormat(numberOfRooms: string): string {
    const numericValue = numberOfRooms.split(" - ")[0].trim();
    return `${numericValue} Rooms`;
  }

  private convertToDaysFormat(numberOfDays: number): string {
    return `${numberOfDays} Days`;
  }
}
