import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getEditableSampleRecords, getPublicSampleRecords, updateEditableSampleRecord } from "./sampleContent";

const sampleSectionSchema = z.object({
  heading: z.string().trim().min(1).max(140),
  body: z.string().trim().min(1).max(3000),
  items: z.array(z.string().trim().min(1).max(200)).max(30).optional(),
}).strict();

const pageDataSchema = z.object({
  path: z.string().trim().min(1).max(255),
  title: z.string().trim().min(1).max(180),
  description: z.string().trim().min(1).max(600),
  sections: z.array(sampleSectionSchema).max(30),
}).strict();

const productDataSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(180),
  category: z.string().trim().min(1).max(100),
  image: z.string().trim().min(1).max(1000),
  description: z.string().trim().min(1).max(1000),
  material: z.string().trim().min(1).max(300),
  variants: z.array(z.object({
    sku: z.string().trim().min(1).max(100),
    color: z.string().trim().min(1).max(100),
    colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    size: z.string().trim().min(1).max(100),
    price: z.number().int().min(0).max(100_000_000),
  }).strict()).min(1).max(100),
  note: z.string().max(300).optional(),
}).strict();

const operationDataSchema = z.object({
  name: z.string().trim().min(1).max(180),
  description: z.string().trim().min(1).max(600),
  columns: z.array(z.string().trim().min(1).max(80)).max(20),
  rows: z.array(z.record(z.string().max(80), z.string().max(500))).max(100),
  note: z.string().trim().min(1).max(1000),
}).strict();

const recordDataSchemas = {
  page: pageDataSchema,
  product: productDataSchema,
  operation: operationDataSchema,
} as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  sampleContent: router({
    publicRecords: publicProcedure.query(() => getPublicSampleRecords()),
    editorRecords: adminProcedure.query(() => getEditableSampleRecords()),
    update: adminProcedure
      .input(z.object({
        recordType: z.enum(["page", "product", "operation"]),
        recordKey: z.string().trim().min(1).max(180),
        label: z.string().trim().min(1).max(180),
        data: z.unknown(),
      }))
      .mutation(async ({ input }) => {
        const parsed = recordDataSchemas[input.recordType].safeParse(input.data);
        if (!parsed.success) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "The sample record does not match its required fields." });
        }

        if (input.recordType === "page" && (parsed.data as { path: string }).path !== input.recordKey) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "A page record path must match its stored key." });
        }
        if (input.recordType === "product" && (parsed.data as { slug: string }).slug !== input.recordKey) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "A product slug must match its stored key." });
        }

        try {
          const updated = await updateEditableSampleRecord({
            recordType: input.recordType,
            recordKey: input.recordKey,
            label: input.label,
            data: parsed.data as Record<string, unknown>,
          });
          if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Editable sample record not found." });
          return updated;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Sample record could not be saved to Development staging." });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
