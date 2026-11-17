import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ShoppingPreviewProvider } from "./contexts/ShoppingPreviewContext";
import Home from "./pages/Home";
import Operations from "./pages/Operations";
import type { CatalogRouteKey } from "./pages/CatalogPage";
import StorefrontPage, { type StoreRouteKey } from "./pages/StorefrontPage";

const CatalogPage = lazy(() => import("./pages/CatalogPage"));

const interactiveCatalogRoutes: { path: string; page: CatalogRouteKey }[] = [
  { path: "/shop", page: "shop" },
  { path: "/categories", page: "categories" },
  { path: "/search", page: "search" },
  { path: "/wishlist", page: "wishlist" },
  { path: "/compare", page: "compare" },
  { path: "/cart", page: "cart" },
];

const staticStoreRoutes: { path: string; page: StoreRouteKey }[] = [
  { path: "/new-arrivals", page: "new-arrivals" },
  { path: "/best-sellers", page: "best-sellers" },
  { path: "/offers", page: "offers" },
  { path: "/wholesale", page: "wholesale" },
  { path: "/wholesale/register", page: "wholesale-register" },
  { path: "/checkout", page: "checkout" },
  { path: "/track-order", page: "track-order" },
  { path: "/about", page: "about" },
  { path: "/contact", page: "contact" },
  { path: "/branches", page: "branches" },
  { path: "/blog", page: "blog" },
  { path: "/faq", page: "faq" },
  { path: "/reviews", page: "reviews" },
  { path: "/privacy-policy", page: "privacy-policy" },
  { path: "/terms", page: "terms" },
  { path: "/returns", page: "returns" },
  { path: "/delivery-policy", page: "delivery-policy" },
];

function CatalogPageFallback() {
  return <div className="route-content catalog-loading" role="status" aria-live="polite" aria-busy="true"><span className="loading-spinner" aria-hidden="true" /><p>Loading sample catalogue…</p></div>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ops" component={Operations} />
      {interactiveCatalogRoutes.map(({ path, page }) => (
        <Route key={path} path={path}>
          <Suspense fallback={<CatalogPageFallback />}><CatalogPage page={page} /></Suspense>
        </Route>
      ))}
      {staticStoreRoutes.map(({ path, page }) => (
        <Route key={path} path={path}>
          <StorefrontPage page={page} />
        </Route>
      ))}
      <Route path="/categories/:slug">{(params) => <Suspense fallback={<CatalogPageFallback />}><CatalogPage page="category" param={params.slug} /></Suspense>}</Route>
      <Route path="/brands/:slug">{(params) => <StorefrontPage page="brand" param={params.slug} />}</Route>
      <Route path="/products/:slug">{(params) => <Suspense fallback={<CatalogPageFallback />}><CatalogPage page="product" param={params.slug} /></Suspense>}</Route>
      <Route path="/order-confirmation/:reference">{(params) => <StorefrontPage page="order-confirmation" param={params.reference} />}</Route>
      <Route path="/branches/:slug">{(params) => <StorefrontPage page="branch" param={params.slug} />}</Route>
      <Route path="/blog/:slug">{(params) => <StorefrontPage page="article" param={params.slug} />}</Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.getElementById("static-storefront-content")?.remove();
    document.getElementById("static-ops-content")?.remove();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <ShoppingPreviewProvider><Router /></ShoppingPreviewProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
