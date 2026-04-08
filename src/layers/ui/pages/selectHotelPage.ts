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

    /**
     * Returns a Locator that filters the rows in the results table based on the provided options.
     * The Locator will return the rows that match all the provided options.
     * If an option is not provided, it will not be used as a filter.
     * @param options - The options to filter the rows by.
     * @returns A Locator that filters the rows in the results table based on the provided options.
     */
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

  /**
   * Verifies that the Select Hotel title is visible on the Select Hotel page.
   * This should be visible after navigating to the select hotel page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifySelectHotelTitleIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.selectHotelTitle,
      "verifySelectHotelTitleIsVisible",
      "visible",
      "Select Hotel Title",
    );
  }

  /**
   * Verifies that the filtered results match the provided options.
   * It first waits for the select hotel title to be visible, then gets the filtered rows based on the provided options.
   * It then asserts that the number of filtered rows matches the expected number, and
   * logs an error if the assertion fails.
   * Finally, it loops through each filtered row and extracts and asserts the values in the row match the provided options.
   * @param options - The options to filter the rows by.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
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

  /**
   * Asserts that one or more rows were found with the provided options.
   * If no rows are found, an error is logged and thrown.
   * @param rowCount - The number of rows found.
   * @param options - The options used to filter the rows.
   */
  private assertRowsFound(rowCount: number, options: HotelSearchRowIdentifier): void {
    if (rowCount === 0) {
      ErrorHandler.logAndThrow(
        "verifyFilteredResultsMatch",
        `An error has occurred: one or more locators were not found, hence no rows matched the provided fields: ${JSON.stringify(options)}`,
      );
    }
  }

  /**
   * Extracts the values from a given row in a table, and asserts that the values match the provided options.
   * The values are extracted by locating the input elements in the row with names that match the provided options,
   * and then extracting the value attribute of the located input elements.
   * The extracted values are then asserted to match the provided options.
   * The function returns a Record containing the extracted values, with the keys being the column names and the values being the values in the row.
   * @param row - The Locator of the row to extract the values from.
   * @param options - The options to filter the rows by.
   * @returns A Record containing the extracted values, with the keys being the column names and the values being the values in the row.
   */
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

  /**
   * Logs the values of a given row in a table, in a human-readable format.
   * The values are logged as a series of key-value pairs, with each pair
   * separated by a newline character.
   * @param rowNumber - The number of the row being logged.
   * @param values - A Record containing the values of the row, with the keys
   *   being the column names and the values being the values in the row.
   */
  private logRowValues(rowNumber: number, values: Record<string, string>): void {
    const parts = Object.entries(values).map(([key, val]) => `  ${key}: '${val}'`);
    if (parts.length > 0) {
      logger.info(`Row ${rowNumber}:\n${parts.join("\n")}`);
    }
  }

  // Helpers

  /**
   * Converts a given number of rooms into a string format
   * @param numberOfRooms - The number of rooms to convert, in the format "X - Y"
   * @returns A string representation of the number of rooms, in the format "X Rooms"
   */
  private convertToRoomsFormat(numberOfRooms: string): string {
    const numericValue = numberOfRooms.split(" - ")[0].trim();
    return `${numericValue} Rooms`;
  }

  /**
   * Converts a given number of days into a string format
   * @param numberOfDays - The number of days to convert
   * @returns A string representation of the number of days
   */
  private convertToDaysFormat(numberOfDays: number): string {
    return `${numberOfDays} Days`;
  }
}
