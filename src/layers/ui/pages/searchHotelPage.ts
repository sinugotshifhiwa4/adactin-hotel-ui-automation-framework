import type { Page } from "@playwright/test";
import { BasePage } from "../base/basePage.js";

export class SearchHotelPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}
