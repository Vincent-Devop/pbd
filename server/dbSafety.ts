import { createHash } from "node:crypto";

// One-way identity for the approved Neon Development staging endpoint.
const APPROVED_NEON_STAGING_HOST_SHA256 = "d1425572c7513452aea7116eafec69add1b88cf0a454b7752b7697a83d0aa5ee";

function parsePostgresConnectionString(connectionString: string | undefined, label: string): URL {
  if (!connectionString) throw new Error(`${label} connection string is required`);

  let parsed: URL;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error(`${label} connection string is invalid`);
  }

  if (!["postgres:", "postgresql:"].includes(parsed.protocol) || !parsed.hostname) {
    throw new Error(`${label} connection must use PostgreSQL`);
  }

  return parsed;
}

function isApprovedStagingHost(hostname: string): boolean {
  const fingerprint = createHash("sha256").update(hostname.toLowerCase()).digest("hex");
  return fingerprint === APPROVED_NEON_STAGING_HOST_SHA256;
}

export function assertNeonDevStagingConnectionString(connectionString: string | undefined): string {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Neon staging database operations are restricted to Development");
  }

  const parsed = parsePostgresConnectionString(connectionString, "Development Neon staging");
  if (!isApprovedStagingHost(parsed.hostname)) {
    throw new Error("The configured endpoint does not match the approved Development staging identity");
  }

  return connectionString!;
}

export function assertNeonProductionConnectionString(connectionString: string | undefined): string {
  if (process.env.NODE_ENV !== "production") {
    throw new Error("Production database operations are restricted to Production");
  }

  const parsed = parsePostgresConnectionString(connectionString, "Production database");
  if (isApprovedStagingHost(parsed.hostname)) {
    throw new Error("Production DATABASE_URL must not point to the approved Development staging database");
  }

  return connectionString!;
}
