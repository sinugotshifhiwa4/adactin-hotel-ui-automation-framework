import EnvironmentFileManager from "./internal/EnvironmentFileManager.js";
import ErrorHandler from "../../../utils/errorHandling/errorHandler.js";

/**
 * Initializes the environment config by loading all environment files in sequence.
 * Ensures environment variables are available for the current environment.
 * If initialization fails, logs an error with the error and error message.
 * @returns A promise that resolves when environment config is initialized.
 * @throws An error if initialization fails.
 */
async function initializeEnvironmentConfig(): Promise<void> {
  try {
    await EnvironmentFileManager.getInstance().initialize();
  } catch (error) {
    ErrorHandler.captureError(
      error,
      "initializeEnvironmentConfig",
      "Failed to initialize environment config",
    );
    throw error;
  }
}

/**
 * Initializes the global environment configuration by loading all environment files in sequence.
 * Ensures environment variables are available for the current environment.
 * If initialization fails, logs an error with the error and error message.
 * @returns A promise that resolves when environment config is initialized.
 * @throws An error if initialization fails.
 */
async function globalSetup(): Promise<void> {
  await initializeEnvironmentConfig();
}

export default globalSetup;
