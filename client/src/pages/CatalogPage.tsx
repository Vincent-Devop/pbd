import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleAlert, Heart, Minus, PackageOpen, Plus, Scale, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import BrandLogo from "@/components/BrandLogo";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import StoreHeader from "@/components/StoreHeader";
import { formatKes, uniqueColors } from "@/data/catalog";
import type { Product, ProductVariant } from "@/data/catalog";
import { useShoppingPreview } from "@/contexts/ShoppingPreviewContext";
import { applyPageMetadata } from "@/pageMetadata";
import { productsFrom, samplePageFrom, usePublicSampleRecords } from "@/hooks/useSampleContent";

export type CatalogRouteKey = "shop" | "categories" | "category" | "product" | "search" | "wishlist" | "compare" | "cart";

const pageNames: Record<CatalogRouteKey, string> = {
  shop: "Shop the sample catalogue",
  categories: "Product categories",
  category: "Category collection",
  product: "Product details",
  search: "Search the sample catalogue",
  wishlist: "Your saved sample products",
  compare: "Compare sample products",
  cart: "Your enquiry list",
};

const footerLinks = [
  ["Shop", "/shop"],
  ["Categories", "/categories"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Privacy notice", "/privacy-policy"],
  ["Returns", "/returns"],
] as const;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function humanize(value: string) {
  try {
    return decodeURIComponent(value).replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  } catch {
    return value.replace(/[-_]+/g, " ");
  }
}

function samplePrice(product: Product) {
  return Math.min(...product.variants.map((variant) => variant.price));
}

function sortedByName(products: Product[]) {
  return [...products].sort((a, b) => a.name.localeCompare(b.name));
}

export default function CatalogPage({ page, param }: { page: CatalogRouteKey; param?: string }) {
  const [location, setLocation] = useLocation();
  const [search, setSearch] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("q") ?? "");
  const [sort, setSort] = useState("name");
  const [selectedSku, setSelectedSku] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const { records } = usePublicSampleRecords();
  const catalog = useMemo(() => productsFrom(records), [records]);
  const categories = useMemo(() => ["All pieces", ...new Set(catalog.map((item) => item.category))], [catalog]);
  const {
    cart, cartCount, wishlist, compare, addToCart, changeQuantity,
    removeCartItem, toggleWishlist, toggleCompare,
  } = useShoppingPreview();

  const pageRecordPath: Record<CatalogRouteKey, string> = {
    shop: "/shop", categories: "/categories", category: "/categories/:slug", product: "/products/:slug",
    search: "/search", wishlist: "/wishlist", compare: "/compare", cart: "/cart",
  };
  const pageRecord = samplePageFrom(records, pageRecordPath[page]);
  const requestedCategory = page === "category" && param ? categories.find((category) => slugify(category) === param.toLowerCase()) : undefined;
  const product = page === "product" && param ? catalog.find((item) => item.slug === param) : undefined;
  const pageTitle = page === "category" && param ? `${requestedCategory ?? humanize(param)} collection`
    : page === "product" && param ? product?.name ?? `${humanize(param)} product details`
      : pageRecord?.title ?? pageNames[page];
  const pageDescription = pageRecord?.description ?? "Sample catalogue data stored for editing; contact the team to confirm current details.";

  useEffect(() => {
    if (page === "search") setSearch(new URLSearchParams(window.location.search).get("q") ?? "");
  }, [page, location]);

  useEffect(() => {
    applyPageMetadata({
      title: `${pageTitle} — PRINCE BENJA DESIGNS`,
      description: pageDescription,
      noindex: true,
    });
  }, [pageDescription, pageTitle]);

  useEffect(() => {
    setSelectedSku(product?.variants[0]?.sku ?? "");
  }, [product?.slug]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = catalog.filter((item) => {
      if (page === "category" && (!requestedCategory || item.category !== requestedCategory)) return false;
      if (page === "wishlist" && !wishlist.includes(item.slug)) return false;
      if ((page === "search" || (page === "shop" && term)) && term && !`${item.name} ${item.category} ${item.description} ${item.material}`.toLowerCase().includes(term)) return false;
      return true;
    });
    if (sort === "price-low") list = [...list].sort((a, b) => samplePrice(a) - samplePrice(b));
    else if (sort === "price-high") list = [...list].sort((a, b) => samplePrice(b) - samplePrice(a));
    else list = sortedByName(list);
    return list;
  }, [catalog, page, requestedCategory, search, sort, wishlist]);

  const selectedVariant = product?.variants.find((variant) => variant.sku === selectedSku) ?? product?.variants[0];
  const selectedCompareProducts = compare.flatMap((slug) => catalog.filter((item) => item.slug === slug));

  const handleAdd = (item: Product, variant: ProductVariant) => {
    addToCart(item, variant);
    setAnnouncement(`${item.name} added to your browser-local enquiry list. No order or reservation was created.`);
    setDrawerOpen(true);
  };

  const handleWishlist = (slug: string) => {
    const wasSaved = wishlist.includes(slug);
    toggleWishlist(slug);
    const name = catalog.find((item) => item.slug === slug)?.name ?? "Sample product";
    setAnnouncement(wasSaved ? `${name} removed from your browser-local wishlist.` : `${name} saved to your browser-local wishlist.`);
  };

  const handleCompare = (slug: string) => {
    const wasSelected = compare.includes(slug);
    if (!wasSelected && compare.length >= 3) {
      setAnnouncement("You can compare up to three illustrative products at a time.");
      return;
    }
    toggleCompare(slug);
    const name = catalog.find((item) => item.slug === slug)?.name ?? "Sample product";
    setAnnouncement(wasSelected ? `${name} removed from comparison.` : `${name} added to comparison.`);
  };

  const renderProducts = (products: Product[], emptyTitle: string, emptyCopy: string) => products.length ? (
    <div className="product-grid catalog-product-grid">
      {products.map((item, index) => (
        <ProductCard
          key={item.slug}
          product={item}
          index={index}
          onAdd={handleAdd}
          saved={wishlist.includes(item.slug)}
          compared={compare.includes(item.slug)}
          onToggleWishlist={() => handleWishlist(item.slug)}
          onToggleCompare={() => handleCompare(item.slug)}
        />
      ))}
    </div>
  ) : (
    <div className="empty-state catalog-empty">
      <PackageOpen size={30} aria-hidden="true" />
      <h2>{emptyTitle}</h2>
      <p>{emptyCopy}</p>
      <Link className="button button-outline" href="/shop">Browse the sample catalogue <ArrowRight size={17} aria-hidden="true" /></Link>
    </div>
  );

  const breadcrumb = page === "category" && requestedCategory ? requestedCategory
    : page === "product" && product ? product.name
      : pageTitle;

  return (
    <div className="storefront route-page catalog-page">
      <a className="skip-link" href="#catalog-main-content">Skip to main content</a>
      <StoreHeader cartCount={cartCount} search={search} onSearch={setSearch} onOpenCart={() => setLocation("/cart")} />
      <main className="route-content" id="catalog-main-content">
        <nav className="route-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>{page !== "shop" && <><Link href="/shop">Shop the catalogue</Link><span aria-hidden="true">/</span></>}
          <span aria-current="page">{breadcrumb}</span>
        </nav>
        <header className="catalog-intro route-panel" aria-labelledby="catalog-page-title">
          <span className="eyebrow">PRINCE BENJA DESIGNS / SAMPLE CATALOGUE</span>
          <h1 id="catalog-page-title">{pageTitle}</h1>
          <p className="route-description">{pageDescription}</p>
          <div className="local-state-disclosure" role="note">
            <CircleAlert size={20} aria-hidden="true" />
            <p><strong>Sample catalogue data.</strong> Product names, images, variants and prices are editable examples, not confirmed offers. Saved items and the enquiry list stay in this browser only; they do not reserve stock or create orders or payments.</p>
          </div>
        </header>

        {pageRecord?.sections?.length ? <section className="page-sample-sections" aria-label="Stored sample page content">{pageRecord.sections.map((section, index) => <article className="page-sample-card" key={`${section.heading}-${index}`}><h2>{section.heading}</h2><p>{section.body}</p>{section.items?.length ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}</article>)}</section> : null}

        <p className="catalog-announcement" role="status" aria-live="polite">{announcement}</p>

        {page === "categories" && (
          <section className="catalog-section" aria-labelledby="category-list-title">
            <div className="catalog-section-heading"><div><span className="eyebrow">PRODUCT GROUPS</span><h2 id="category-list-title">Explore categories</h2></div><p>Sample product groups stored with the catalogue.</p></div>
            <div className="category-preview-grid">
              {categories.filter((category) => category !== "All pieces").map((category) => {
                const items = catalog.filter((item) => item.category === category);
                const href = `/categories/${slugify(category)}`;
                return <Link className="category-preview-card" href={href} key={category}>
                  <img src={items[0]?.image ?? catalog[0].image} alt="" loading="lazy" />
                  <span className="eyebrow">SAMPLE CATEGORY</span>
                  <h2>{category}</h2>
                  <p>{items.length} sample {items.length === 1 ? "piece" : "pieces"}</p>
                  <span className="category-preview-link">Browse category <ArrowUpRight size={16} aria-hidden="true" /></span>
                </Link>;
              })}
            </div>
          </section>
        )}

        {page === "product" && product && selectedVariant && (
          <section className="product-detail-layout" aria-labelledby="product-detail-title">
            <div className="product-detail-image">
              <img src={product.image} alt={`${product.name}, sample product photograph`} />
            </div>
            <div className="product-detail-copy">
              <span className="eyebrow">{product.category.toUpperCase()} / SAMPLE LISTING</span>
              <h2 id="product-detail-title">{product.name}</h2>
              <p className="product-detail-description">{product.description}</p>
              <p className="product-detail-material"><strong>Material / details:</strong> {product.material}</p>
              <label className="form-label" htmlFor="product-variant">Choose a sample colour and size</label>
              <select id="product-variant" className="form-control" value={selectedVariant.sku} onChange={(event) => setSelectedSku(event.target.value)}>
                {product.variants.map((variant) => <option key={variant.sku} value={variant.sku}>{variant.color} / {variant.size}</option>)}
              </select>
              <p className="product-detail-price">{formatKes(selectedVariant.price)} <span>sample price, not a quote</span></p>
              <div className="product-detail-actions">
                <button type="button" className="button button-dark" onClick={() => handleAdd(product, selectedVariant)}><ShoppingBag size={18} aria-hidden="true" /> Add to enquiry list</button>
                <button type="button" className="button button-outline" aria-pressed={wishlist.includes(product.slug)} onClick={() => handleWishlist(product.slug)}><Heart size={18} aria-hidden="true" /> {wishlist.includes(product.slug) ? "Saved locally" : "Save locally"}</button>
                <button type="button" className="button button-outline" aria-pressed={compare.includes(product.slug)} onClick={() => handleCompare(product.slug)}><Scale size={18} aria-hidden="true" /> {compare.includes(product.slug) ? "In comparison" : "Compare"}</button>
              </div>
              <p className="field-help">Adding an item only updates a browser-local enquiry list. It does not verify availability, reserve stock or create a purchase.</p>
              <Link className="text-link product-category-link" href={`/categories/${slugify(product.category)}`}>Browse {product.category} <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </section>
        )}
        {page === "product" && !product && (
          <div className="empty-state catalog-empty"><PackageOpen size={30} aria-hidden="true" /><h2>Product not found</h2><p>No sample product record matches “{param ? humanize(param) : "this route"}”.</p><Link className="button button-outline" href="/shop">Browse sample pieces <ArrowRight size={17} aria-hidden="true" /></Link></div>
        )}

        {(page === "shop" || page === "category" || page === "search" || page === "wishlist") && (
          <section className="catalog-section" aria-labelledby="catalog-results-title">
            <div className="catalog-section-heading"><div><span className="eyebrow">{page === "wishlist" ? "SAVED IN THIS BROWSER" : "SAMPLE LISTINGS"}</span><h2 id="catalog-results-title">{page === "category" ? requestedCategory ?? "Category not verified" : page === "search" ? "Search results" : page === "wishlist" ? "Your saved items" : "Browse sample pieces"}</h2></div>
              <p className="catalog-result-count" aria-live="polite">{filteredProducts.length} sample {filteredProducts.length === 1 ? "piece" : "pieces"}</p>
            </div>
            {(page === "shop" || page === "category" || page === "search") && (
              <div className="catalog-toolbar">
                {page === "shop" && <label className="catalog-field"><span>Category</span><select className="form-control" value="all" onChange={(event) => setLocation(event.target.value === "all" ? "/shop" : `/categories/${event.target.value}`)}><option value="all">All sample categories</option>{categories.filter((category) => category !== "All pieces").map((category) => <option key={category} value={slugify(category)}>{category}</option>)}</select></label>}
                {page === "search" && <label className="catalog-field"><span>Search these sample listings</span><input className="form-control" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, category or details" /></label>}
                <label className="catalog-field catalog-sort"><span>Sort</span><select className="form-control" value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name A–Z</option><option value="price-low">Sample price: low to high</option><option value="price-high">Sample price: high to low</option></select></label>
              </div>
            )}
            {page === "search" && !search.trim() ? (
              <div className="empty-state catalog-empty"><PackageOpen size={30} aria-hidden="true" /><h2>Search the sample catalogue</h2><p>Enter a name, category or product detail in the search field above. Results come from the stored sample product records.</p><Link className="button button-outline" href="/shop">Browse all sample pieces <ArrowRight size={17} aria-hidden="true" /></Link></div>
            ) : renderProducts(filteredProducts, page === "wishlist" ? "No saved sample pieces" : "No matching sample pieces", page === "wishlist" ? "Save a sample product using its heart control. Your list remains in this browser only." : "Try a different search or browse all sample pieces.")}
          </section>
        )}

        {page === "compare" && (
          <section className="catalog-section" aria-labelledby="compare-title">
            <div className="catalog-section-heading"><div><span className="eyebrow">BROWSER-LOCAL SELECTION</span><h2 id="compare-title">Compare up to three sample pieces</h2></div><p>{selectedCompareProducts.length} of 3 selected</p></div>
            {selectedCompareProducts.length > 0 && <div className="table-scroll compare-table-wrap"><table className="data-table compare-table"><caption>Sample product details only; specifications and stock are not verified.</caption><thead><tr><th scope="col">Detail</th>{selectedCompareProducts.map((item) => <th scope="col" key={item.slug}><Link href={`/products/${item.slug}`}>{item.name}</Link><button className="compare-remove" type="button" onClick={() => handleCompare(item.slug)} aria-label={`Remove ${item.name} from comparison`}><Trash2 size={16} aria-hidden="true" /> Remove</button></th>)}</tr></thead><tbody>
              <tr><th scope="row">Category</th>{selectedCompareProducts.map((item) => <td key={item.slug}>{item.category}</td>)}</tr>
              <tr><th scope="row">Description</th>{selectedCompareProducts.map((item) => <td key={item.slug}>{item.description}</td>)}</tr>
              <tr><th scope="row">Material / details</th>{selectedCompareProducts.map((item) => <td key={item.slug}>{item.material}</td>)}</tr>
              <tr><th scope="row">Sample variants</th>{selectedCompareProducts.map((item) => <td key={item.slug}>{uniqueColors(item).map((variant) => variant.color).join(", ")} / {item.variants.map((variant) => variant.size).filter((size, index, all) => all.indexOf(size) === index).join(", ")}</td>)}</tr>
              <tr><th scope="row">Sample price range</th>{selectedCompareProducts.map((item) => <td key={item.slug}>{formatKes(Math.min(...item.variants.map((variant) => variant.price)))}–{formatKes(Math.max(...item.variants.map((variant) => variant.price)))} <span className="table-sample-label">sample only</span></td>)}</tr>
            </tbody></table></div>}
            {selectedCompareProducts.length === 0 && <div className="empty-state catalog-empty"><Scale size={30} aria-hidden="true" /><h2>No pieces selected to compare</h2><p>Choose products below. You can compare up to three sample listings; the specifications are sample content only.</p></div>}
            <div className="catalog-section-heading compare-choose-heading"><div><span className="eyebrow">CHOOSE SAMPLE LISTINGS</span><h2>Add or remove a piece</h2></div></div>
            {renderProducts(sortedByName(catalog), "No sample catalogue available", "No sample products are configured.")}
          </section>
        )}

        {page === "cart" && (
          <section className="catalog-section" aria-labelledby="cart-page-title">
            <div className="catalog-section-heading"><div><span className="eyebrow">BROWSER-LOCAL LIST</span><h2 id="cart-page-title">Enquiry list items</h2></div><p aria-live="polite">{cartCount} selected {cartCount === 1 ? "item" : "items"}</p></div>
            {cart.length ? <>
              <ul className="cart-page-list" aria-label="Selected sample enquiry items">{cart.map((line) => <li className="cart-page-line" key={line.id}>
                <Link href={`/products/${line.product.slug}`} className="cart-page-product-image"><img src={line.product.image} alt="" /></Link>
                <div className="cart-page-product-copy"><Link href={`/products/${line.product.slug}`}><strong>{line.product.name}</strong></Link><span>{line.variant.color} / {line.variant.size}</span><span>{formatKes(line.variant.price)} sample price</span></div>
                <div className="quantity-control" role="group" aria-label={`Selected quantity for ${line.product.name}`}><button type="button" aria-label={`Remove one ${line.product.name}`} onClick={() => changeQuantity(line.id, line.quantity - 1)}><Minus size={17} aria-hidden="true" /></button><span aria-live="polite">{line.quantity}</span><button type="button" aria-label={`Add one ${line.product.name}`} onClick={() => changeQuantity(line.id, line.quantity + 1)} disabled={line.quantity >= 99}><Plus size={17} aria-hidden="true" /></button></div>
                <button className="remove-cart-line" type="button" onClick={() => removeCartItem(line.id)} aria-label={`Remove ${line.product.name} from enquiry list`}><Trash2 size={18} aria-hidden="true" /><span>Remove</span></button>
              </li>)}</ul>
              <div className="cart-page-summary"><p>This browser-local list is for an enquiry only. Prices are sample values; tax, delivery and availability are not verified.</p><button className="button button-dark" type="button" disabled aria-disabled="true">Checkout unavailable</button><span>Online checkout, orders and payments are not active.</span></div>
            </> : <div className="empty-state catalog-empty"><ShoppingBag size={30} aria-hidden="true" /><h2>Your enquiry list is empty</h2><p>Add sample pieces to keep a local list while browsing. This does not create an order.</p><Link className="button button-outline" href="/shop">Browse sample pieces <ArrowRight size={17} aria-hidden="true" /></Link></div>}
          </section>
        )}

        <aside className="catalog-secondary-links" aria-label="More storefront pages"><Link href="/categories">Browse categories <ArrowUpRight size={16} aria-hidden="true" /></Link><Link href="/wishlist">Your saved pieces <Heart size={16} aria-hidden="true" /></Link><Link href="/compare">Compare sample pieces <Scale size={16} aria-hidden="true" /></Link></aside>
        <div className="catalog-back-link"><Link className="text-link" href="/"><ArrowLeft size={16} aria-hidden="true" /> Return to storefront</Link></div>
      </main>
      <footer className="site-footer route-footer">
        <div className="footer-main"><Link href="/" className="brand-lockup" aria-label="PRINCE BENJA DESIGNS home"><BrandLogo className="brand-logo-footer" /><span className="brand-words"><strong>PRINCE BENJA</strong><small>DESIGNS</small></span></Link><p>Sample product and business information, available for editing.</p><nav className="footer-links" aria-label="Footer navigation">{footerLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} PRINCE BENJA DESIGNS</span><span>Sample listings; no stock, checkout or policies are verified.</span><Link href="/ops">Operations sample editor <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
      </footer>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={cart} onQuantity={changeQuantity} />
    </div>
  );
}
