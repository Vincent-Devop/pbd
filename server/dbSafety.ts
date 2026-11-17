import { createHash } from "node:crypto";

// One-way identity for the currently approved Neon Development staging endpoint.
// Update only when the isolated staging endpoint is intentionally rotated.
const APPROVED_NEON_STAGING_HOST_SHA256 = "d1425572c7513452aea7116eafec69add1b88cf0a454b7752b7697a83d0aa5ee";

export function assertNeonDevStagingConnectionString(connectionString: string | undefined): string {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Neon staging database operations are restricted to Development");
  }
  if (!connectionString) {
    throw new Error("PBD_NEON_DEV_STAGING_DATABASE_URL is required for Development staging operations");
  }

  let parsed: URL;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error("The Development Neon staging connection string is invalid");
  }

  if (!(["postgres:", "postgresql:"].includes(parsed.protocol)) || !parsed.hostname) {
    throw new Error("The Development database connection must use a Neon PostgreSQL endpoint");
  }

  const hostFingerprint = createHash("sha256").update(parsed.hostname.toLowerCase()).digest("hex");
  if (hostFingerprint !== APPROVED_NEON_STAGING_HOST_SHA256) {
    throw new Error("The configured Neon endpoint does not match the approved Development staging identity");
  }

  return connectionString;
}
