import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { catalog } from "@/data/catalog";
import type { CartLine, Product, ProductVariant } from "@/data/catalog";

const STORAGE_KEY = "pbd.preview-shopping.v1";
const MAX_COMPARE_ITEMS = 3;
const MAX_QUANTITY = 99;

type PersistedCartItem = { slug: string; sku: string; quantity: number };
type PersistedState = { version: 1; cart: PersistedCartItem[]; wishlist: string[]; compare: string[] };
type ShoppingState = { cart: CartLine[]; wishlist: string[]; compare: string[] };

type ShoppingPreviewValue = ShoppingState & {
  cartCount: number;
  addToCart: (product: Product, variant: ProductVariant) => void;
  changeQuantity: (id: string, quantity: number) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  toggleCompare: (slug: string) => void;
};

const ShoppingPreviewContext = createContext<ShoppingPreviewValue | null>(null);
const validSlugs = new Set(catalog.map((product) => product.slug));

function readPreviewState(): ShoppingState {
  if (typeof window === "undefined") return { cart: [], wishlist: [], compare: [] };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cart: [], wishlist: [], compare: [] };
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (parsed.version !== 1) return { cart: [], wishlist: [], compare: [] };

    const cart = Array.isArray(parsed.cart) ? parsed.cart.flatMap((item) => {
      if (!item || typeof item.slug !== "string" || typeof item.sku !== "string") return [];
      const product = catalog.find((candidate) => candidate.slug === item.slug);
      const variant = product?.variants.find((candidate) => candidate.sku === item.sku);
      const quantity = Number(item.quantity);
      if (!product || !variant || !Number.isFinite(quantity) || quantity < 1) return [];
      const safeQuantity = Math.min(MAX_QUANTITY, Math.floor(quantity));
      return [{ id: `${product.slug}:${variant.sku}`, product, variant, quantity: safeQuantity }];
    }) : [];

    const sanitizeSlugs = (value: unknown) => Array.isArray(value)
      ? [...new Set(value.filter((slug): slug is string => typeof slug === "string" && validSlugs.has(slug)))]
      : [];

    return { cart, wishlist: sanitizeSlugs(parsed.wishlist), compare: sanitizeSlugs(parsed.compare).slice(0, MAX_COMPARE_ITEMS) };
  } catch {
    return { cart: [], wishlist: [], compare: [] };
  }
}

export function ShoppingPreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShoppingState>(readPreviewState);

  useEffect(() => {
    try {
      const value: PersistedState = {
        version: 1,
        cart: state.cart.map(({ product, variant, quantity }) => ({ slug: product.slug, sku: variant.sku, quantity })),
        wishlist: state.wishlist,
        compare: state.compare,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // The preview remains usable for this page session if browser storage is unavailable.
    }
  }, [state]);

  useEffect(() => {
    const syncOtherTab = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) setState(readPreviewState());
    };
    window.addEventListener("storage", syncOtherTab);
    return () => window.removeEventListener("storage", syncOtherTab);
  }, []);

  const addToCart = useCallback((product: Product, variant: ProductVariant) => {
    setState((current) => {
      const id = `${product.slug}:${variant.sku}`;
      const existing = current.cart.find((line) => line.id === id);
      const cart = existing
        ? current.cart.map((line) => line.id === id ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + 1) } : line)
        : [...current.cart, { id, product, variant, quantity: 1 }];
      return { ...current, cart };
    });
  }, []);

  const changeQuantity = useCallback((id: string, quantity: number) => {
    setState((current) => ({
      ...current,
      cart: quantity <= 0
        ? current.cart.filter((line) => line.id !== id)
        : current.cart.map((line) => line.id === id ? { ...line, quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)) } : line),
    }));
  }, []);

  const removeCartItem = useCallback((id: string) => {
    setState((current) => ({ ...current, cart: current.cart.filter((line) => line.id !== id) }));
  }, []);

  const clearCart = useCallback(() => setState((current) => ({ ...current, cart: [] })), []);

  const toggleWishlist = useCallback((slug: string) => {
    if (!validSlugs.has(slug)) return;
    setState((current) => ({
      ...current,
      wishlist: current.wishlist.includes(slug) ? current.wishlist.filter((item) => item !== slug) : [...current.wishlist, slug],
    }));
  }, []);

  const toggleCompare = useCallback((slug: string) => {
    if (!validSlugs.has(slug)) return;
    setState((current) => {
      if (current.compare.includes(slug)) return { ...current, compare: current.compare.filter((item) => item !== slug) };
      if (current.compare.length >= MAX_COMPARE_ITEMS) return current;
      return { ...current, compare: [...current.compare, slug] };
    });
  }, []);

  const cartCount = state.cart.reduce((sum, line) => sum + line.quantity, 0);
  const value = useMemo(() => ({
    ...state,
    cartCount,
    addToCart,
    changeQuantity,
    removeCartItem,
    clearCart,
    toggleWishlist,
    toggleCompare,
  }), [state, cartCount, addToCart, changeQuantity, removeCartItem, clearCart, toggleWishlist, toggleCompare]);

  return <ShoppingPreviewContext.Provider value={value}>{children}</ShoppingPreviewContext.Provider>;
}

export function useShoppingPreview() {
  const value = useContext(ShoppingPreviewContext);
  if (!value) throw new Error("useShoppingPreview must be used inside ShoppingPreviewProvider");
  return value;
}
