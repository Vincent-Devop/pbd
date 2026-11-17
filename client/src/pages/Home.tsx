import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Box, MapPin, MessageCircle, PackageCheck, Truck } from "lucide-react";
import { Link } from "wouter";
import CartDrawer from "@/components/CartDrawer";
import BrandLogo from "@/components/BrandLogo";
import ProductCard from "@/components/ProductCard";
import StoreHeader from "@/components/StoreHeader";
import type { Product, ProductVariant } from "@/data/catalog";
import { useShoppingPreview } from "@/contexts/ShoppingPreviewContext";
import { applyPageMetadata, storefrontMetadata } from "@/pageMetadata";
import { businessFrom, productsFrom, samplePageFrom, usePublicSampleRecords } from "@/hooks/useSampleContent";

export default function Home() {
  const { records } = usePublicSampleRecords();
  const catalog = useMemo(() => productsFrom(records), [records]);
  const categories = useMemo(() => ["All pieces", ...new Set(catalog.map((product) => product.category))], [catalog]);
  const businessDetails = businessFrom(records);
  const homePage = samplePageFrom(records, "/");

  useEffect(() => {
    applyPageMetadata(storefrontMetadata);
  }, []);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, cartCount, addToCart, changeQuantity } = useShoppingPreview();

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return catalog.filter((product) => {
      const matchesCategory = activeCategory === "All pieces" || product.category === activeCategory;
      const matchesSearch = !term || `${product.name} ${product.category} ${product.description} ${product.material}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [catalog, search, activeCategory]);

  const addToBag = (product: Product, variant: ProductVariant) => {
    addToCart(product, variant);
    setCartOpen(true);
  };

  return (
    <div className="storefront">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <StoreHeader cartCount={cartCount} search={search} onSearch={setSearch} onOpenCart={() => setCartOpen(true)} />
      <main id="main-content">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><i /> TRAVEL · MADE FOR THE MOVE</span>
            <h1>{homePage?.title ?? <>Ready for the<br /><em>road ahead.</em></>}</h1>
            <p className="hero-lede">{homePage?.description ?? "Travel bags and everyday essentials for wherever the day takes you — thoughtfully chosen, close to home."}</p>
            <div className="hero-buttons"><a className="button button-dark" href="#collection">Explore the collection <ArrowRight size={16} /></a><a className="button button-outline" href={businessDetails.whatsapp.href} aria-label={`Message PRINCE BENJA DESIGNS on WhatsApp at ${businessDetails.whatsapp.display}`}><MessageCircle size={16} aria-hidden="true" /> WhatsApp us <ArrowUpRight size={15} aria-hidden="true" /></a></div>
            <div className="hero-footnote"><span className="hero-index">01 <i /> 04</span><span>Carry a little further.</span></div>
          </div>
          <div className="hero-visual">
            <img src="/images/hero-luggage.jpg" alt="Traveler pulling a suitcase through a bright terminal" />
            <div className="hero-image-caption"><span>TRAVEL, CONSIDERED</span></div>
            <div className="hero-roundel" aria-label="For the next departure"><span>FOR THE</span><b>NEXT<br />DEPARTURE</b></div>
          </div>
          <a className="scroll-cue" href="#collection" aria-label="Scroll to the collection"><ArrowDown size={14} /> SCROLL TO EXPLORE</a>
        </section>

        <section className="value-strip" aria-label="Store information">
          <div><span className="value-icon"><Truck size={18} aria-hidden="true" /></span><div><strong>Delivery & collection</strong><small>Ask us about current options</small></div></div>
          <div><span className="value-icon"><MapPin size={18} aria-hidden="true" /></span><div><strong>{businessDetails.mainBranch.name}</strong><small>Nairobi · visit details below</small></div></div>
          <div><span className="value-icon"><BadgeCheck size={18} aria-hidden="true" /></span><div><strong>Wholesale enquiries</strong><small>Contact us for current terms</small></div></div>
          <div><span className="value-icon"><MessageCircle size={18} aria-hidden="true" /></span><div><strong>Sample pricing</strong><small>Confirm before ordering</small></div></div>
        </section>

        <section className="collection-section section-pad" id="collection">
          <div className="section-heading collection-heading">
            <div><span className="eyebrow">THE COLLECTION / 01</span><h2>Find your<br /><em>next favourite.</em></h2></div>
            <p>Pieces to make travelling lighter — and the everyday feel a little more considered.</p>
          </div>
          <div className="collection-toolbar">
            <div className="category-tabs" role="group" aria-label="Filter by product category">{categories.map((category) => <button type="button" aria-pressed={activeCategory === category} className={activeCategory === category ? "category-active" : ""} key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
            <span className="result-count" aria-live="polite">{visibleProducts.length.toString().padStart(2, "0")} sample pieces</span>
          </div>
          {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product, index) => <ProductCard key={product.slug} product={product} index={index} onAdd={addToBag} />)}</div> : <div className="no-results"><Box size={26} /><h3>No pieces found.</h3><p>Try another search or choose a different category.</p><button type="button" className="text-link" onClick={() => { setSearch(""); setActiveCategory("All pieces"); }}>Clear filters <ArrowRight size={14} /></button></div>}
          <div className="home-catalog-links"><Link className="button button-outline" href="/shop">View the shop <ArrowUpRight size={16} aria-hidden="true" /></Link><Link className="text-link" href="/categories">Browse categories <ArrowRight size={16} aria-hidden="true" /></Link></div>
        </section>

        {homePage?.sections?.length ? <section className="page-sample-sections section-pad" aria-label="Stored homepage sample content">{homePage.sections.map((section, index) => <article className="page-sample-card" key={`${section.heading}-${index}`}><span className="eyebrow">EDITABLE SAMPLE CONTENT</span><h2>{section.heading}</h2><p>{section.body}</p>{section.items?.length ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}</article>)}</section> : null}

        <section className="story-section" id="essentials">
          <div className="story-image"><img src="/images/story-travel-planning.jpg" alt="Travel map, camera, and bag laid out for a weekend trip" loading="lazy" /><span className="image-stamp">SMALL DETAILS<br />BIG DIFFERENCE</span></div>
          <div className="story-copy"><span className="eyebrow">A GOOD JOURNEY STARTS HERE</span><h2>Pack well.<br /><em>Go further.</em></h2><p>From the first zip to the last-minute add-on, find the small essentials that keep your plans moving.</p><a href="#collection" className="button button-outline">Shop travel essentials <ArrowRight size={16} /></a><span className="story-note"><PackageCheck size={16} /> Sample listings shown; message us to confirm current availability.</span></div>
        </section>

        <section className="fulfilment-section section-pad">
          <div className="section-heading"><div><span className="eyebrow">DELIVERY & BRANCH INFORMATION / 02</span><h2>Closer to<br /><em>your next stop.</em></h2></div><p>Ask about delivery or collection at our Nairobi branch. Current availability, coverage, charges and timing are confirmed on enquiry.</p></div>
          <div className="fulfilment-cards">
            <article className="fulfilment-card fulfilment-dark"><span className="fulfilment-number">01 / DELIVERY & COLLECTION</span><span className="fulfilment-icon"><Truck size={20} aria-hidden="true" /></span><h3>Choose how to collect.</h3><p>Message us to ask about delivery or branch collection, including current fees and timing.</p><Link href="/delivery-policy" className="card-link">Delivery information <ArrowUpRight size={15} /></Link></article>
            <article className="fulfilment-card fulfilment-light"><span className="fulfilment-number">02 / PIPELINE BRANCH</span><span className="fulfilment-icon"><MapPin size={20} aria-hidden="true" /></span><h3>{businessDetails.mainBranch.name}</h3><p>{businessDetails.mainBranch.address}</p><Link href="/branches" className="card-link">Branch details <ArrowUpRight size={15} /></Link></article>
            <div className="fulfilment-side-note"><span className="eyebrow">SAMPLE CATALOGUE</span><p>Sample products and prices help fill the catalogue. Ask our team to confirm current availability and terms.</p><span className="route-mark">ASK US DIRECTLY</span></div>
          </div>
        </section>

        <section className="wholesale-section" id="wholesale">
          <div className="wholesale-copy"><span className="eyebrow">WHOLESALE ENQUIRIES</span><h2>Buying for<br /><em>your business?</em></h2><p>Tell us what you need and we’ll share current wholesale availability and terms.</p><Link href="/wholesale" className="button button-paper"><MessageCircle size={16} /> Wholesale enquiries <ArrowUpRight size={15} /></Link><small>Pricing and account terms are confirmed on enquiry.</small></div>
          <div className="wholesale-side"><div className="wholesale-scribble">Good things<br /><em>travel together.</em></div></div>
        </section>

        <section className="visit-section section-pad" id="visit">
          <div className="visit-heading"><span className="eyebrow">VISIT OUR MAIN BRANCH</span><h2>Find us in<br /><em>Nairobi.</em></h2></div>
          <div className="visit-detail"><span className="visit-pin"><MapPin size={21} aria-hidden="true" /></span><div><span className="eyebrow">{businessDetails.mainBranch.name.toUpperCase()}</span><h3>{businessDetails.mainBranch.name}</h3><p>{businessDetails.mainBranch.address}</p><a className="button button-outline" href={businessDetails.mainBranch.directionsHref}>Open directions <ArrowUpRight size={15} aria-hidden="true" /></a></div></div>
          <div className="visit-bottom"><div className="visit-line" /><span>WhatsApp us for opening hours and visit assistance.</span><a href={businessDetails.whatsapp.href} aria-label={`WhatsApp ${businessDetails.whatsapp.display}`}>WhatsApp · {businessDetails.whatsapp.display} <ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </section>

        <section className="closing-banner"><span className="eyebrow">THE NEXT JOURNEY IS YOURS</span><p>Make room for<br /><em>what’s next.</em></p><a href="#collection" className="button button-paper">Explore the collection <ArrowRight size={16} /></a></section>
      </main>
      <footer className="site-footer">
        <div className="footer-main"><Link href="/" className="brand-lockup"><BrandLogo className="brand-logo-footer" /><span className="brand-words"><strong>PRINCE BENJA</strong><small>DESIGNS</small></span></Link><p>Travel bags and everyday essentials. Sample catalogue prices; ask us to confirm current availability.</p><div className="footer-links"><Link href="/shop">Shop</Link><Link href="/wholesale">Wholesale enquiries</Link><Link href="/contact">WhatsApp contact</Link><Link href="/branches">Main branch</Link></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} PRINCE BENJA DESIGNS</span><span>Sample listings; confirm current prices and availability.</span><Link href="/ops">Operations workspace <ArrowUpRight size={15} /></Link></div>
        <p className="social-note">WhatsApp: {businessDetails.whatsapp.display} · {businessDetails.mainBranch.name}: {businessDetails.mainBranch.address}.</p>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onQuantity={changeQuantity} />
    </div>
  );
}
