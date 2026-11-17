import { boolean, jsonb, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import type { SampleRecordType } from "../shared/sample-content";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
});

export const sampleRecords = pgTable("sample_records", {
  id: serial("id").primaryKey(),
  recordType: varchar("record_type", { length: 32 }).$type<SampleRecordType>().notNull(),
  recordKey: varchar("record_key", { length: 180 }).notNull(),
  label: varchar("label", { length: 180 }).notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  isSample: boolean("is_sample").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("sample_records_type_key_uq").on(table.recordType, table.recordKey)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SampleRecord = typeof sampleRecords.$inferSelect;
export type InsertSampleRecord = typeof sampleRecords.$inferInsert;
