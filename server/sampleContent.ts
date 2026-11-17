import { and, asc, eq, inArray } from "drizzle-orm";
import {
  sampleRecords as sampleRecordFixtures,
  type SampleRecordSeed,
  type SampleRecordType,
} from "../shared/sample-content";
import { sampleRecords as sampleRecordTable } from "../drizzle/schema";
import { getDb } from "./db";

const publicRecordTypes: SampleRecordType[] = ["page", "product", "business"];
const bundledPublicRecords = sampleRecordFixtures.filter((record) => publicRecordTypes.includes(record.recordType));

function toSeedRecord(row: typeof sampleRecordTable.$inferSelect): SampleRecordSeed {
  return {
    recordType: row.recordType,
    recordKey: row.recordKey,
    label: row.label,
    data: row.data,
    isSample: row.isSample,
  };
}

function mergeWithFixtures(storedRows: SampleRecordSeed[], fixtures: SampleRecordSeed[]) {
  const storedByIdentity = new Map(storedRows.map((record) => [`${record.recordType}:${record.recordKey}`, record]));
  const seen = new Set<string>();
  const merged = fixtures.map((record) => {
    const identity = `${record.recordType}:${record.recordKey}`;
    seen.add(identity);
    return storedByIdentity.get(identity) ?? record;
  });
  for (const record of storedRows) {
    const identity = `${record.recordType}:${record.recordKey}`;
    if (!seen.has(identity)) merged.push(record);
  }
  return merged;
}

export async function getPublicSampleRecords(): Promise<SampleRecordSeed[]> {
  const db = await getDb();
  if (!db) return bundledPublicRecords;

  try {
    const rows = await db
      .select()
      .from(sampleRecordTable)
      .where(inArray(sampleRecordTable.recordType, publicRecordTypes))
      .orderBy(asc(sampleRecordTable.recordType), asc(sampleRecordTable.label));
    return mergeWithFixtures(rows.map(toSeedRecord), bundledPublicRecords);
  } catch {
    console.warn("[Sample content] Neon read failed; using bundled sample records.");
    return bundledPublicRecords;
  }
}

export async function getEditableSampleRecords(): Promise<SampleRecordSeed[]> {
  const db = await getDb();
  if (!db) throw new Error("Development Neon staging database is not available");

  try {
    const rows = await db
      .select()
      .from(sampleRecordTable)
      .where(eq(sampleRecordTable.isSample, true))
      .orderBy(asc(sampleRecordTable.recordType), asc(sampleRecordTable.label));
    return rows.map(toSeedRecord);
  } catch {
    console.warn("[Sample content] Editor read failed in Development staging.");
    throw new Error("Development Neon staging sample records could not be read");
  }
}

export async function updateEditableSampleRecord(input: {
  recordType: Exclude<SampleRecordType, "business">;
  recordKey: string;
  label: string;
  data: Record<string, unknown>;
}): Promise<SampleRecordSeed | null> {
  const db = await getDb();
  if (!db) throw new Error("Development Neon staging database is not available");

  const [updated] = await db
    .update(sampleRecordTable)
    .set({ label: input.label, data: input.data, updatedAt: new Date() })
    .where(and(
      eq(sampleRecordTable.recordType, input.recordType),
      eq(sampleRecordTable.recordKey, input.recordKey),
      eq(sampleRecordTable.isSample, true),
    ))
    .returning();

  return updated ? toSeedRecord(updated) : null;
}

export async function seedMissingSampleRecords() {
  const db = await getDb();
  if (!db) throw new Error("Development Neon staging database is not available");

  await db.insert(sampleRecordTable).values(sampleRecordFixtures).onConflictDoNothing();
  return sampleRecordFixtures.length;
}
