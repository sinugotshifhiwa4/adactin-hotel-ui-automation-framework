import type { Page, Locator } from "@playwright/test";
import { BasePage } from "../base/basePage.js";
import type { RuntimeEnvVariableResolver } from "../../../configuration/environment/runtimeVariableResolver/runtimeEnvVariableResolver.js";
import type { Credentials } from "../../../configuration/authentication/types/credentials.types.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";
import logger from "../../../configuration/logger/loggerManager.js";

export class LoginPage extends BasePage {
  private readonly runtimeEnvResolver: RuntimeEnvVariableResolver;

  private readonly companyLogo: () => Locator;
  private readonly userLoginBuildNumber: () => Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  private readonly invalidLoginError: Locator;

  constructor(page: Page, runtimeEnvResolver: RuntimeEnvVariableResolver) {
    super(page);

    this.runtimeEnvResolver = runtimeEnvResolver;

    /**
     * Gets the company logo element.
     * The element is identified by its 'img' role and the build logo name.
     * The build logo name is determined by the current build number and is either
     * "AdactIn Group" or "Adactin Group".
     * @returns The company logo element.
     */
    this.companyLogo = () => {
      const build = this.runtimeEnvResolver.getBuild();
      const buildLogo = build === "1" ? "AdactIn Group" : "Adactin Group";
      return this.page.getByRole("img", { name: buildLogo, exact: true });
    };

    /**
     * Gets the User Login Build Number element.
     * The element is identified by its 'cell' role and the build name.
     * The build name is determined by the current build number.
     * @returns The User Login Build Number element.
     */
    this.userLoginBuildNumber = () => {
      const build = this.runtimeEnvResolver.getBuild();
      const buildName =
        build === "1" ? "Existing User Login - Build 1" : "Existing User Login - Build 2";
      return this.page.getByRole("cell", { name: buildName, exact: true });
    };

    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.getByRole("button", { name: "Login" });

    this.invalidLoginError = page
      .locator(".auth_error")
      .getByText("Invalid Login details or Your Password might have expired.");
  }

  /**
   * Verifies that the company logo element is visible on the page.
   * @returns A promise that resolves if the element is visible, or rejects with an error if it fails.
   */
  public async verifyCompanyLogoIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.companyLogo(),
      "verifyCompanyLogoIsVisible",
      "visible",
      "Company logo",
    );
  }

  /**
   * Verifies that the User Login Build Number element is visible on the page.
   * The build number is retrieved from the runtime environment variables.
   * @returns A promise that resolves if the element is visible, or rejects with an error if it fails.
   */
  public async verifyUserLoginBuildNumberIsVisible(): Promise<void> {
    try {
      const buildNumber = this.runtimeEnvResolver.getBuild();
      await this.assertUserLoginBuildNumberIsVisible(buildNumber);
      logger.info(`Verified User Login Build Number ${buildNumber} is visible`);
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "verifyUserLoginBuildNumberIsVisible",
        "Failed to verify User Login Build Number visibility",
      );
      throw error;
    }
  }

  /**
   * Verifies that the user login build number element is visible on the page.
   * The build number is retrieved from the runtime environment variables.
   * @param buildNumber The build number to verify the visibility of.
   * @returns A promise that resolves if the element is visible, or rejects with an error if it fails.
   */
  private async assertUserLoginBuildNumberIsVisible(buildNumber: string): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.userLoginBuildNumber(),
      `assertUserLoginBuildNumberIsVisible for build ${buildNumber}`,
      "visible",
      `User Login Build Number ${buildNumber}`,
    );
  }

  /**
   * Fills the username input field on the page with the provided username.
   *
   * @param username The username to fill the input field with.
   * @returns A promise that resolves if the input field is filled successfully, or rejects with an error if it fails.
   */
  private async fillUsernameInput(username: string): Promise<void> {
    await this.element.fillElement(
      this.usernameInput,
      "fillUsernameInput",
      username,
      "Username input",
    );
  }

  /**
   * Fills the password input field on the page with the provided password.
   *
   * @param password The password to fill the input field with.
   * @returns A promise that resolves if the input field is filled successfully, or rejects with an error if it fails.
   */
  private async fillPasswordInput(password: string): Promise<void> {
    await this.element.fillElement(
      this.passwordInput,
      "fillPasswordInput",
      password,
      "Password input",
    );
  }

  /**
   * Clicks the login button on the page.
   *
   * @returns A promise that resolves if the button is clicked successfully, or rejects with an error if it fails.
   */
  private async clickLoginButton(): Promise<void> {
    await this.element.clickElement(this.loginButton, "clickLoginButton", "Login button");
  }

  /**
   * Performs a login on the page using the provided credentials.
   *
   * @param options - The credentials to use for the login.
   *
   * @returns A promise that resolves if the login is successful, or rejects with an error if it fails.
   */
  public async performLogin(options: Credentials): Promise<void> {
    try {
      await this.verifyCompanyLogoIsVisible();
      await this.verifyUserLoginBuildNumberIsVisible();
      await this.fillUsernameInput(options.username);
      await this.fillPasswordInput(options.password);
      await this.clickLoginButton();
    } catch (error) {
      ErrorHandler.captureError(error, "performLogin", "Failed to perform login");
      throw error;
    }
  }

  /**
   * Verifies that the invalid login error message is visible on the page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyInvalidLoginErrorIsVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.invalidLoginError,
      "verifyInvalidLoginErrorIsVisible",
      "visible",
      "Invalid Login Error",
    );
  }

  /**
   * Verifies that the invalid login error message is not visible on the page.
   * @returns A promise that resolves if the verification succeeds, or rejects with an error if it fails.
   */
  public async verifyInvalidLoginErrorIsNotVisible(): Promise<void> {
    await this.elementAssertions.verifyElementState(
      this.invalidLoginError,
      "verifyInvalidLoginErrorIsNotVisible",
      "hidden",
      "Invalid Login Error",
    );
  }
}
