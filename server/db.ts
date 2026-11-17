import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../drizzle/schema";
import type { InsertUser } from "../drizzle/schema";
import { ENV } from "./_core/env";
import {
  assertNeonDevStagingConnectionString,
  assertNeonProductionConnectionString,
} from "./dbSafety";

function createDatabase(connectionString: string) {
  return drizzle({ client: neon(connectionString), schema });
}

type Database = ReturnType<typeof createDatabase>;
let _db: Database | null = null;

export async function getDb(): Promise<Database | null> {
  const environment = process.env.NODE_ENV;
  if (environment !== "development" && environment !== "production") return null;

  const connectionString =
    environment === "development"
      ? ENV.neonStagingDatabaseUrl
      : ENV.neonProductionDatabaseUrl;

  if (!connectionString) return null;
  if (_db) return _db;

  try {
    const safeConnectionString =
      environment === "development"
        ? assertNeonDevStagingConnectionString(connectionString)
        : assertNeonProductionConnectionString(connectionString);

    _db = createDatabase(safeConnectionString);
    return _db;
  } catch (error) {
    console.error("[Database] Could not initialize the configured database:", error);
    return null;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) throw new Error("Database is not configured for this environment");

  const values: InsertUser = { openId: user.openId };
  const updateSet: Partial<InsertUser> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];

  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(schema.users).values(values).onConflictDoUpdate({
    target: schema.users.openId,
    set: { ...updateSet, updatedAt: new Date() },
  });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(schema.users).where(eq(schema.users.openId, openId)).limit(1);
  return result[0];
}
