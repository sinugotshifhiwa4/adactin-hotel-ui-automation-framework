import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../base/basePage.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";

export class TopNavigationBar extends BasePage {
  private readonly welcomeMessage: Locator;
  private readonly loggedInUserGreeting: Locator;
  private readonly searchHotelLink: Locator;
  private readonly bookedItineraryLink: Locator;
  private readonly changePasswordLink: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByRole("cell", {
      name: "Welcome to Adactin Group of Hotels",
    });
    this.loggedInUserGreeting = page.locator("#username_show");
    this.searchHotelLink = page.getByRole("link", { name: "Search Hotel" });
    this.bookedItineraryLink = page.getByRole("link", { name: "Booked Itinerary" });
    this.changePasswordLink = page.getByRole("link", { name: "Change Password" });
    this.logoutLink = page.getByRole("link", { name: "Logout" });
  }

  /**
   * Verifies that the welcome message and logged in user greeting are visible on the Search Hotel  Page.
   * This includes the welcome message and the logged in user greeting.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyTopNavBarIsDisplayed(): Promise<void> {
    await Promise.all([
      this.verifyWelcomeMessageIsVisible(),
      this.verifyLoggedInUserGreetingIsVisible(),
    ]);
  }

  /**
   * Verifies that the welcome message is visible on the page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  private async verifyWelcomeMessageIsVisible(): Promise<void> {
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
  private async verifyLoggedInUserGreetingIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.loggedInUserGreeting,
      "verifyLoggedInUserGreetingIsVisible",
      "visible",
      "Logged in user greeting",
    );
  }

  // Actions

  /**
   * Simulates a click on the search hotel link on the Search Hotel Hotel Page.
   * After the click, the page is expected to redirect to the search hotel page.
   * @returns A promise that resolves if the click action succeeds, or rejects with an error if it fails.
   */
  public async clickSearchHotelLink(): Promise<void> {
    await this.element.clickElement(
      this.searchHotelLink,
      "clickSearchHotelLink",
      "Search Hotel Link",
    );
  }

  /**
   * Simulates a click on the booked itinerary link on the Search Hotel Hotel Page.
   * After the click, the page is expected to redirect to the booked itinerary page.
   * @returns A promise that resolves if the click action succeeds, or rejects with an error if it fails.
   */
  public async clickBookedItineraryLink(): Promise<void> {
    await this.element.clickElement(
      this.bookedItineraryLink,
      "clickBookedItineraryLink",
      "Booked Itinerary Link",
    );
  }

  /**
   * Simulates a click on the change password link on the Search Hotel Hotel Page.
   * After the click, the page is expected to redirect to the change password page.
   * @returns A promise that resolves if the click action succeeds, or rejects with an error if it fails.
   */
  public async clickChangePasswordLink(): Promise<void> {
    await this.element.clickElement(
      this.changePasswordLink,
      "clickChangePasswordLink",
      "Change Password Link",
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

  // Verifications

  /**
   * Verifies that all top navigation bar links are visible on the Search Hotel  Page.
   * This includes the Search Hotel , Booked Itinerary, Change Password and Logout links.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyAllTopNavigationBarLinksAreVisible(): Promise<void> {
    try {
      await Promise.all([
        this.verifySearchHotelLinkIsVisible(),
        this.verifyBookedItineraryLinkIsVisible(),
        this.verifyChangePasswordLinkIsVisible(),
        this.verifyLogoutLinkIsVisible(),
      ]);
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "verifyAllTopNavigationBarLinksAreVisible",
        "One or more top navigation bar links are not visible.",
      );
      throw error;
    }
  }

  /**
   * Verifies that the Search Hotel link is visible on the Search Hotel Hotel Page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifySearchHotelLinkIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.searchHotelLink,
      "verifySearchHotelLinkIsVisible",
      "visible",
      "Search Hotel Link",
    );
  }

  /**
   * Verifies that the Booked Itinerary link is visible on the Search Hotel Hotel Page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyBookedItineraryLinkIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.bookedItineraryLink,
      "verifyBookedItineraryLinkIsVisible",
      "visible",
      "Booked Itinerary Link",
    );
  }

  /**
   * Verifies that the Change Password link is visible on the Search Hotel Hotel Page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyChangePasswordLinkIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.changePasswordLink,
      "verifyChangePasswordLinkIsVisible",
      "visible",
      "Change Password Link",
    );
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
