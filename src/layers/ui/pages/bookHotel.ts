import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../base/basePage.js";

export class BookHotelPage extends BasePage {
  private readonly bookHotelTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.bookHotelTitle = page.getByRole("cell", { name: "Book A Hotel", exact: true });
  }

  public async verifyBookHotelTitleIsVisible() {
    await this.elementAssertions.verifyElementState(
      this.bookHotelTitle,
      "verifyBookHotelTitleIsVisible",
      "visible",
      "Book Hotel Title",
    );
  }
}
