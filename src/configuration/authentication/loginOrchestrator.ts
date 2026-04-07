import type { Page } from "@playwright/test";
import { BasePage } from "../../layers/ui/base/basePage.js";
import type { RuntimeEnvVariableResolver } from "../environment/runtimeVariableResolver/runtimeEnvVariableResolver.js";
import type { LoginPage } from "../../layers/ui/pages/loginPage.js";
import type { TopNavigationBar } from "./../../layers/ui/pages/topNavigationBar.js";
import type { Credentials } from "./types/credentials.types.js";

export class LoginOrchestrator extends BasePage {
  private resolver: RuntimeEnvVariableResolver;
  private loginPage: LoginPage;
  private topNavigationBar: TopNavigationBar;

  constructor(
    page: Page,
    resolver: RuntimeEnvVariableResolver,
    loginPage: LoginPage,
    topNavigationBar: TopNavigationBar,
  ) {
    super(page);

    this.resolver = resolver;
    this.loginPage = loginPage;
    this.topNavigationBar = topNavigationBar;
  }

  /**
   * Navigates to the portal base URL.
   * This method is used to navigate to the portal before performing any actions.
   * It uses the `getPortalBaseUrl` method from the `RuntimeEnvVariableResolver` to get the portal base URL.
   * The method then uses the `navigateToUrl` method from the `NavigationActions` class to navigate to the portal base URL.
   * @returns A promise that resolves with void if the navigation is successful, or rejects with an error if the navigation fails.
   */
  public async navigateToPortal(): Promise<void> {
    const portalUrl = this.resolver.getPortalBaseUrl();
    await this.navigation.navigateToUrl(portalUrl, "navigateToPortal");
  }

  /**
   * Performs a login on the page using the provided valid credentials.
   * Verifies that the form is submitted successfully and the invalid login error is not visible on the page.
   * Also verifies that the Search Hotel Page is displayed after the login.
   *
   * @param options - The valid credentials to use for the login.
   * @returns A promise that resolves if the login is successful, or rejects with an error if it fails.
   */
  public async performLoginWithValidCredentials(options: Credentials): Promise<void> {
    await this.submitLoginForm(options);
    await this.loginPage.verifyInvalidLoginErrorIsNotVisible();
    await this.topNavigationBar.verifyTopNavBarIsDisplayed();
  }

  /**
   * Submits the login form with the provided invalid credentials.
   * Verifies that the invalid login error is visible on the page.
   * @param options - The invalid credentials to use for the login.
   * @returns A promise that resolves if the form is submitted successfully and the invalid login error is visible, or rejects with an error if it fails.
   */
  public async performLoginWithInvalidCredentials(options: Credentials): Promise<void> {
    await this.submitLoginForm(options);
    await this.loginPage.verifyInvalidLoginErrorIsVisible();
  }

  /**
   * Submits the login form with the provided credentials.
   * @param options - The credentials to use for the login.
   * @returns A promise that resolves if the form is submitted successfully, or rejects with an error if it fails.
   */
  private async submitLoginForm(options: Credentials): Promise<void> {
    await this.loginPage.performLogin(options);
  }
}
