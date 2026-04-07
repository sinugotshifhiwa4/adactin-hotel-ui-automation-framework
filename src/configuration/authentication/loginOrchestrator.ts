import type { Page } from "@playwright/test";
import { BasePage } from "../../layers/ui/base/basePage.js";
import type { RuntimeEnvVariableResolver } from "../environment/runtimeVariableResolver/runtimeEnvVariableResolver.js";
import type { LoginPage } from "../../layers/ui/pages/loginPage.js";
import type { SearchHotelPage } from "../../layers/ui/pages/searchHotelPage.js";
import type { Credentials } from "./types/credentials.types.js";

export class LoginOrchestrator extends BasePage {
  private resolver: RuntimeEnvVariableResolver;
  private loginPage: LoginPage;
  private searchHotelPage: SearchHotelPage;

  constructor(
    page: Page,
    resolver: RuntimeEnvVariableResolver,
    loginPage: LoginPage,
    searchHotelPage: SearchHotelPage,
  ) {
    super(page);

    this.resolver = resolver;
    this.loginPage = loginPage;
    this.searchHotelPage = searchHotelPage;
  }

  public async navigateToPortal(): Promise<void> {
    const portalUrl = this.resolver.getPortalBaseUrl();
    await this.navigation.navigateToUrl(portalUrl, "navigateToPortal");
  }

  public async performLoginWithValidCredentials(options: Credentials): Promise<void> {
    await this.submitLoginForm(options);
    await this.loginPage.verifyInvalidLoginErrorIsNotVisible();
    await this.searchHotelPage.verifySearchHotelPageIsDisplayed();
  }

  public async performLoginWithInvalidCredentials(options: Credentials): Promise<void> {
    await this.submitLoginForm(options);
    await this.loginPage.verifyInvalidLoginErrorIsVisible();
  }

  private async submitLoginForm(options: Credentials): Promise<void> {
    await this.loginPage.performLogin(options);
  }
}
