import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { businessFrom, usePublicSampleRecords } from "@/hooks/useSampleContent";

type StoreHeaderProps = {
  cartCount: number;
  search: string;
  onSearch: (value: string) => void;
  onOpenCart: () => void;
};

export default function StoreHeader({ cartCount, search, onSearch, onOpenCart }: StoreHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { records } = usePublicSampleRecords();
  const businessDetails = businessFrom(records);
  const closeMenu = () => setMobileOpen(false);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    if (query) setLocation(`/search?q=${encodeURIComponent(query)}`);
    closeMenu();
  };

  return (
    <>
      <div className="topline">
        <span>TRAVEL BAGS</span>
        <span className="topline-message">Travel bags and accessories for wherever you're headed.</span>
        <a href={businessDetails.whatsapp.href} aria-label={`WhatsApp ${businessDetails.whatsapp.display}`}><span className="topline-contact-full">WhatsApp · {businessDetails.whatsapp.display}</span><span className="topline-contact-mobile">WhatsApp us</span><ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
      <header className="site-header">
        <div className="header-main">
          <button className="mobile-menu-button icon-button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <Link href="/" className="brand-lockup" aria-label="Prince Benja Designs home" onClick={closeMenu}>
            <BrandLogo className="brand-logo-header" />
            <span className="brand-words"><strong>PRINCE BENJA</strong><small>DESIGNS</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/shop">Shop</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/new-arrivals">New arrivals</Link>
            <Link href="/wholesale">Wholesale</Link>
          </nav>
          <div className="header-actions">
            <form className="search-box" role="search" onSubmit={submitSearch}>
              <button type="submit" aria-label="Search products"><Search size={17} aria-hidden="true" /></button>
              <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search bags & essentials" aria-label="Search products" />
              {search && <button type="button" aria-label="Clear search" onClick={() => onSearch("")}><X size={14} /></button>}
            </form>
            <button className="bag-button" onClick={onOpenCart} aria-label={`Open enquiry list, ${cartCount} selected items`}>
              <ShoppingBag size={19} strokeWidth={1.7} aria-hidden="true" /><span>Enquiry list</span><b aria-hidden="true">{cartCount}</b>
            </button>
          </div>
        </div>
        <nav className={`mobile-nav ${mobileOpen ? "mobile-nav-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!mobileOpen} inert={!mobileOpen}>
          <Link href="/shop" onClick={closeMenu}>Shop <span>01</span></Link>
          <Link href="/categories" onClick={closeMenu}>Categories <span>02</span></Link>
          <Link href="/new-arrivals" onClick={closeMenu}>New arrivals <span>03</span></Link>
          <Link href="/wholesale" onClick={closeMenu}>Wholesale <span>04</span></Link>
          <Link href="/ops" onClick={closeMenu}>Operations workspace <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </nav>
      </header>
    </>
  );
}
