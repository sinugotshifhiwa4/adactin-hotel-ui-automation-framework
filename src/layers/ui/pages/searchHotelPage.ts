import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../base/basePage.js";

export class SearchHotelPage extends BasePage {
  private readonly welcomeMessage: Locator;
  private readonly loggedInUserGreeting: Locator;

  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByRole("cell", {
      name: "Welcome to Adactin Group of Hotels",
    });
    this.loggedInUserGreeting = page.locator("#username_show");

    this.logoutLink = page.getByRole("link", { name: "Logout" });
  }

  /**
   * Verifies that the Search Hotel Hotel Page is displayed by verifying the presence of the welcome message, the logged in user greeting and the logout link.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifySearchHotelPageIsDisplayed(): Promise<void> {
    await Promise.all([
      this.verifyWelcomeMessageIsVisible(),
      this.verifyLoggedInUserGreetingIsVisible(),
      this.verifyLogoutLinkIsVisible(),
    ]);
  }

  /**
   * Verifies that the welcome message is visible on the page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyWelcomeMessageIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.welcomeMessage,
      "verifyWelcomeMessageIsVisible",
      "visible",
      "Welcome message",
    );
  }

  /**
   * Verifies that the logged in user greeting is visible on the page.
   * This should be visible after a successful login.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyLoggedInUserGreetingIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.loggedInUserGreeting,
      "verifyLoggedInUserGreetingIsVisible",
      "visible",
      "Logged in user greeting",
    );
  }

  /**
   * Simulates a click on the logout link on the Search Hotel Hotel Page.
   * After the click, the page is expected to redirect to the login page.
   * @returns A promise that resolves if the click action succeeds, or rejects with an error if it fails.
   */
  public async clickLogoutLink(): Promise<void> {
    await this.element.clickElement(this.logoutLink, "clickLogoutLink", "Logout Link");
  }

  /**
   * Verifies that the Logout link is visible on the Search Hotel Hotel Page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyLogoutLinkIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.logoutLink,
      "verifyLogoutLinkIsVisible",
      "visible",
      "Logout Link",
    );
  }
}
