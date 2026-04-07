/**
 * Environment URLs used in the tests. These are read from environment variables and should be defined in the .env files for each environment.
 */
export const EnvironmentUrls = {
  BUILD: {
    ONE: process.env.BUILD_ONE_PORTAL_BASE_URL!,
    TWO: process.env.BUILD_TWO_PORTAL_BASE_URL!,
  },
} as const;
