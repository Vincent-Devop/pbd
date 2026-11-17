if (process.env.NODE_ENV !== "development") {
  throw new Error("Sample seeding is restricted to Development Neon staging.");
}

export {};

const { seedMissingSampleRecords } = await import("./sampleContent");

try {
  const count = await seedMissingSampleRecords();
  console.log(`[Development staging] Seeded missing sample records from ${count} bundled fixtures; existing records were preserved.`);
} catch {
  console.error("[Development staging] Sample seeding failed. Verify the Development Neon staging connection and migration state.");
  process.exitCode = 1;
}
