import { defineConfig } from "drizzle-kit";
import { assertNeonDevStagingConnectionString } from "./server/dbSafety";

if (process.env.NODE_ENV !== "development") {
  throw new Error("Drizzle commands are restricted to the Development staging environment");
}

const stagingConnectionString = assertNeonDevStagingConnectionString(
  process.env.PBD_NEON_DEV_STAGING_DATABASE_URL
);

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/postgres",
  dialect: "postgresql",
  dbCredentials: {
    url: stagingConnectionString,
  },
});
