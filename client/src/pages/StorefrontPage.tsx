import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, CircleAlert, MapPin, MessageCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import BrandLogo from "@/components/BrandLogo";
import StoreHeader from "@/components/StoreHeader";
import { applyPageMetadata } from "@/pageMetadata";
import { businessFrom, samplePageFrom, usePublicSampleRecords } from "@/hooks/useSampleContent";

export type StoreRouteKey =
  | "shop" | "categories" | "category" | "brand" | "product" | "new-arrivals" | "best-sellers"
  | "offers" | "wholesale" | "wholesale-register" | "search" | "wishlist" | "compare" | "cart"
  | "checkout" | "order-confirmation" | "track-order" | "about" | "contact" | "branches" | "branch"
  | "blog" | "article" | "faq" | "reviews" | "privacy-policy" | "terms" | "returns" | "delivery-policy";

type RouteCopy = { title: string; description: string; notice: string };

const routeCopy: Partial<Record<StoreRouteKey, RouteCopy>> = {
  "new-arrivals": { title: "New arrivals", description: "An editable sample collection.", notice: "This page is sample content, not a statement that products have recently arrived." },
  "best-sellers": { title: "Best sellers", description: "An editable sample collection.", notice: "No sales ranking is represented as genuine." },
  offers: { title: "Offers and campaigns", description: "Editable campaign records.", notice: "No discount or active offer is configured." },
  wholesale: { title: "Wholesale enquiries", description: "Ask the team for current wholesale availability and terms.", notice: "The displayed workflow is sample content; no wholesale account or quote is active." },
  "wholesale-register": { title: "Wholesale registration", description: "Example application fields for editing.", notice: "No application is submitted or stored." },
  checkout: { title: "Checkout information", description: "Sample checkout content for editing.", notice: "Order submission and payment are not active. Do not enter personal or payment information." },
  "order-confirmation": { title: "Sample order record", description: "An editable sample confirmation layout.", notice: "No real order has been created or verified." },
  "track-order": { title: "Order tracking information", description: "Editable example order-status content.", notice: "No customer order lookup is connected." },
  about: { title: "About PRINCE BENJA DESIGNS", description: "Editable introduction content.", notice: "Replace this sample copy with business-approved history and details." },
  contact: { title: "Contact PRINCE BENJA DESIGNS", description: "Contact the team using the confirmed WhatsApp number.", notice: "The WhatsApp number and main-branch location shown here were confirmed." },
  branches: { title: "Main branch", description: "Confirmed main-branch location details.", notice: "Opening hours and visit assistance should be confirmed with the team." },
  branch: { title: "Branch details", description: "Branch information uses the confirmed main-branch record.", notice: "Contact the team to confirm visit details and hours." },
  blog: { title: "Journal", description: "Sample editorial entries for travel and product care.", notice: "Sample editorial content; no customer testimonial or business claim is made." },
  article: { title: "Sample journal article", description: "Editable example editorial content.", notice: "This article is sample copy for review." },
  faq: { title: "Frequently asked questions", description: "Sample questions and safe answers for common product and visit enquiries.", notice: "Business policies and opening hours have not been supplied." },
  reviews: { title: "Customer reviews", description: "Sample review records for editing.", notice: "Sample text is not genuine customer feedback." },
  "privacy-policy": { title: "Privacy information", description: "Sample privacy content for editing.", notice: "Replace this with approved business and legal text before publication." },
  terms: { title: "Terms of service", description: "Sample terms content for editing.", notice: "No business contract terms are asserted here." },
  returns: { title: "Returns and refunds information", description: "Sample returns content for editing.", notice: "No return or refund entitlement is stated as business policy." },
  "delivery-policy": { title: "Delivery and collection information", description: "Sample delivery content for editing.", notice: "Delivery areas, fees and timing are not confirmed." },
  brand: { title: "Brand collection", description: "Sample brand collection content.", notice: "No supplier or manufacturer relationship is claimed by this sample." },
};

const samplePagePaths: Partial<Record<StoreRouteKey, string>> = {
  "new-arrivals": "/new-arrivals", "best-sellers": "/best-sellers", offers: "/offers", wholesale: "/wholesale",
  "wholesale-register": "/wholesale/register", checkout: "/checkout", "order-confirmation": "/order-confirmation/:reference",
  "track-order": "/track-order", about: "/about", contact: "/contact", branches: "/branches", branch: "/branches/:slug",
  blog: "/blog", article: "/blog/:slug", faq: "/faq", reviews: "/reviews", "privacy-policy": "/privacy-policy",
  terms: "/terms", returns: "/returns", "delivery-policy": "/delivery-policy", brand: "/brands/:slug",
};

const footerLinks = [
  ["Shop", "/shop"], ["Categories", "/categories"], ["New arrivals", "/new-arrivals"],
  ["Wholesale", "/wholesale"], ["Contact", "/contact"], ["Branches", "/branches"],
  ["Journal", "/blog"], ["FAQ", "/faq"], ["Privacy notice", "/privacy-policy"],
  ["Terms", "/terms"], ["Returns", "/returns"], ["Delivery", "/delivery-policy"],
] as const;

function humanize(value: string) {
  try {
    return decodeURIComponent(value).replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  } catch {
    return value.replace(/[-_]+/g, " ");
  }
}

export default function StorefrontPage({ page, param }: { page: StoreRouteKey; param?: string }) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("q") ?? "");
  const { records } = usePublicSampleRecords();
  const businessDetails = businessFrom(records);
  const samplePath = samplePagePaths[page];
  const pageRecord = samplePath ? samplePageFrom(records, samplePath) : undefined;
  const copy = routeCopy[page];
  const itemName = param ? humanize(param) : "";
  const isMainBranchRoute = page === "branch" && param?.toLowerCase() === businessDetails.mainBranch.slug;
  const baseTitle = pageRecord?.title ?? copy?.title ?? "Store information";
  const title = page === "branch"
    ? isMainBranchRoute ? businessDetails.mainBranch.name : `${baseTitle}: ${itemName}`
    : page === "brand" || page === "article" ? `${baseTitle}: ${itemName}`
      : page === "order-confirmation" && param ? `${baseTitle} ${param}`
        : baseTitle;
  const description = page === "branch" && !isMainBranchRoute
    ? `No listed branch matches “${itemName}”. Contact us to confirm current locations.`
    : pageRecord?.description ?? copy?.description ?? "Sample information stored for editing.";
  const notice = pageRecord?.sections?.[0]?.body ?? copy?.notice ?? "This page uses editable sample content.";

  useEffect(() => {
    applyPageMetadata({ title: `${title} — PRINCE BENJA DESIGNS`, description, noindex: true });
  }, [title, description]);

  return (
    <div className="storefront route-page">
      <a className="skip-link" href="#route-main-content">Skip to main content</a>
      <StoreHeader cartCount={0} search={search} onSearch={setSearch} onOpenCart={() => setLocation("/cart")} />
      <main className="route-content" id="route-main-content">
        <nav className="route-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
        </nav>
        <section className="route-panel" aria-labelledby="route-page-title">
          <span className="eyebrow">PRINCE BENJA DESIGNS / STORED SAMPLE CONTENT</span>
          <h1 id="route-page-title">{title}</h1>
          <p className="route-description">{description}</p>
          {page === "search" && search.trim() && <p className="route-search-query">Search requested: <strong>{search.trim()}</strong></p>}
          <aside className="route-notice" aria-labelledby="route-notice-title">
            <span className="route-notice-icon"><CircleAlert size={20} aria-hidden="true" /></span>
            <div>
              <h2 id="route-notice-title">{page === "contact" ? "WhatsApp contact" : page === "branches" || page === "branch" ? "Main branch" : "Sample information"}</h2>
              <p>{page === "branch" && !isMainBranchRoute ? "No listed branch matches this route. WhatsApp us to confirm current locations." : notice}</p>
            </div>
          </aside>
          <div className="route-actions" aria-label="Storefront navigation">
            {page === "contact" && <a className="button button-dark" href={businessDetails.whatsapp.href}><MessageCircle size={17} aria-hidden="true" /> WhatsApp · {businessDetails.whatsapp.display} <ArrowUpRight size={16} aria-hidden="true" /></a>}
            {(page === "branches" || page === "branch") && <a className="button button-dark" href={businessDetails.mainBranch.directionsHref}><MapPin size={17} aria-hidden="true" /> Open directions <ArrowUpRight size={16} aria-hidden="true" /></a>}
            <Link className="button button-outline" href="/#collection">Browse sample products <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link className="button button-outline" href="/"><ArrowLeft size={16} aria-hidden="true" /> Return to storefront</Link>
          </div>
        </section>
        {pageRecord?.sections?.length ? <section className="page-sample-sections" aria-label="Stored sample page details">{pageRecord.sections.map((section, index) => <article className="page-sample-card" key={`${section.heading}-${index}`}><span className="eyebrow">EDITABLE SAMPLE CONTENT</span><h2>{section.heading}</h2><p>{section.body}</p>{section.items?.length ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}</article>)}</section> : null}
        <nav className="route-index" aria-label="Store information pages">
          <div className="route-index-heading"><span className="eyebrow">EXPLORE THE SITE</span><h2>Store information</h2></div>
          <ul>{footerLinks.map(([label, href]) => <li key={href}><Link className="button button-outline" href={href}>{label}<ArrowUpRight size={14} aria-hidden="true" /></Link></li>)}</ul>
        </nav>
      </main>
      <footer className="site-footer route-footer">
        <div className="footer-main">
          <Link href="/" className="brand-lockup" aria-label="PRINCE BENJA DESIGNS home"><BrandLogo className="brand-logo-footer" /><span className="brand-words"><strong>PRINCE BENJA</strong><small>DESIGNS</small></span></Link>
          <p>Travel bags and everyday essentials. Sample products and prices; confirm current availability with our team.</p>
          <nav className="footer-links" aria-label="Footer navigation">{footerLinks.slice(0, 8).map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} PRINCE BENJA DESIGNS</span><span>Sample content; confirm current availability and terms.</span><Link href="/ops">Operations sample editor <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
      </footer>
    </div>
  );
}
