import EnvironmentDetector from "../detector/environmentDetector.js";
import EnvironmentConfigManager from "../manager/environmentConfigManager.js";
import EnvironmentVariables from "../variables/environmentVariables.js";
import { ENV_KEYS } from "../variables/internal/environment.keys.js";
import type { Credentials } from "../../authentication/types/credentials.types.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";

export class RuntimeEnvVariableResolver {
  /**
   * Retrieves the portal base URL
   */
  public getPortalBaseUrl(): string {
    try {
      return this.isCI()
        ? this.getRequiredEnv("CI_PORTAL_BASE_URL")
        : this.resolveLocalVariable(
            () => EnvironmentVariables.urls.PORTAL_BASE_URL,
            "Portal Base URL",
          );
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "getPortalBaseUrl",
        "Failed to get portal base URL",
      );
      throw error;
    }
  }

  /**
   * Gets portal credentials
   */
  public getPortalCredentials(): Credentials {
    try {
      return this.isCI() ? this.resolveCICredentials() : this.resolveLocalCredentials();
    } catch (error) {
      ErrorHandler.captureError(
        error,
        "getPortalCredentials",
        "Failed to get portal credentials",
      );
      throw error;
    }
  }

  // Private Core Logic

  private readonly credentialKeys = {
    username: ENV_KEYS.GENERAL.USERNAME,
    password: ENV_KEYS.GENERAL.PASSWORD,
  };

  /**
   * Resolves portal credentials from CI environment variables.
   * @returns The resolved portal credentials.
   */
  private resolveCICredentials(): Credentials {
    const username = this.getRequiredEnv(`CI_${this.credentialKeys.username}`);
    const password = this.getRequiredEnv(`CI_${this.credentialKeys.password}`);

    return EnvironmentConfigManager.verifyCredentials({ username, password });
  }

  /**
   * Resolves portal credentials from local environment variables.
   * @returns The resolved portal credentials.
   */
  private resolveLocalCredentials(): Credentials {
    const username =
      EnvironmentVariables.credentials[
        this.credentialKeys.username as keyof typeof EnvironmentVariables.credentials
      ];
    const password =
      EnvironmentVariables.credentials[
        this.credentialKeys.password as keyof typeof EnvironmentVariables.credentials
      ];

    return EnvironmentConfigManager.verifyCredentials({ username, password });
  }

  // Helpers

  /**
   * Checks if the current environment is a CI/CD pipeline.
   * @returns True if the environment is a CI/CD pipeline, false otherwise
   */
  private isCI(): boolean {
    return EnvironmentDetector.isCI();
  }

  /**
   * Retrieves an environment variable with the given key.
   * If the variable is not present, throws an error with a message indicating the missing variable.
   * @param key - Environment variable key to retrieve
   * @returns The value of the environment variable
   * @throws Error if the environment variable is not present
   */
  private getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }

  /**
   * Resolves a local environment variable by its description.
   * @template T - Type of the environment variable
   * @param getValue - A function that returns the environment variable value
   * @param description - Description of the environment variable
   * @returns The resolved environment variable value
   * @throws Error if the environment variable is not present
   */
  private resolveLocalVariable<T>(getValue: () => T, description: string): T {
    const key = description.toLowerCase().replace(/\s+/g, "");
    const method = `get${description.replace(/\s+/g, "")}`;
    const errorMessage = `Failed to get ${description.toLowerCase()}`;

    return EnvironmentConfigManager.getEnvironmentVariable(
      getValue,
      key,
      method,
      errorMessage,
    );
  }
}
