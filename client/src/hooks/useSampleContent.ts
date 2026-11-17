import { useMemo } from "react";
import {
  confirmedBusinessData,
  sampleProducts,
  sampleRecords,
  type ConfirmedBusinessData,
  type Product,
  type SamplePageData,
  type SampleRecordSeed,
} from "@shared/sample-content";
import { trpc } from "@/lib/trpc";

const publicRecordTypes = new Set(["page", "product", "business"]);
const legacySampleImagePrefix = "/manus-storage/async-images/VF5hEU2EH8Paur8OoziEBe/";
const sampleImagesBySlug = new Map(sampleProducts.map((product) => [product.slug, product.image]));

function mergeRecords(fallback: SampleRecordSeed[], stored: SampleRecordSeed[]) {
  const storedByIdentity = new Map(stored.map((record) => [`${record.recordType}:${record.recordKey}`, record]));
  const seen = new Set<string>();
  const merged = fallback.map((record) => {
    const identity = `${record.recordType}:${record.recordKey}`;
    seen.add(identity);
    return storedByIdentity.get(identity) ?? record;
  });
  for (const record of stored) {
    const identity = `${record.recordType}:${record.recordKey}`;
    if (!seen.has(identity)) merged.push(record);
  }
  return merged;
}

export function usePublicSampleRecords() {
  const query = trpc.sampleContent.publicRecords.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  const records = useMemo(() => {
    const fallback = sampleRecords.filter((record) => publicRecordTypes.has(record.recordType));
    const stored = (query.data ?? []).filter((record) => publicRecordTypes.has(record.recordType));
    return mergeRecords(fallback, stored);
  }, [query.data]);
  return { ...query, records };
}

export function useEditableSampleRecords() {
  return trpc.sampleContent.editorRecords.useQuery(undefined, {
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}

export function samplePageFrom(records: SampleRecordSeed[], path: string): SamplePageData | undefined {
  const record = records.find((item) => item.recordType === "page" && item.recordKey === path);
  return record?.data as unknown as SamplePageData | undefined;
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<Product>;
  return typeof record.slug === "string"
    && typeof record.name === "string"
    && typeof record.category === "string"
    && typeof record.image === "string"
    && typeof record.description === "string"
    && typeof record.material === "string"
    && Array.isArray(record.variants);
}

export function productsFrom(records: SampleRecordSeed[]): Product[] {
  const products = records
    .filter((record) => record.recordType === "product")
    .map((record) => record.data)
    .filter(isProduct);
  return products.length
    ? products.map((product) => {
        const sampleImage = sampleImagesBySlug.get(product.slug);
        return product.image.startsWith(legacySampleImagePrefix) && sampleImage
          ? { ...product, image: sampleImage }
          : product;
      })
    : sampleProducts;
}

export function businessFrom(records: SampleRecordSeed[]): ConfirmedBusinessData {
  const record = records.find((item) => item.recordType === "business" && item.recordKey === "confirmed-profile");
  const data = record?.data as unknown as ConfirmedBusinessData | undefined;
  return data?.whatsapp?.display && data?.whatsapp?.href && data?.mainBranch?.name && data?.mainBranch?.address
    ? data
    : confirmedBusinessData;
}
