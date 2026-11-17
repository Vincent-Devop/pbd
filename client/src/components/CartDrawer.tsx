import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { CartLine, formatKes } from "@/data/catalog";
import { businessFrom, usePublicSampleRecords } from "@/hooks/useSampleContent";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: CartLine[];
  onQuantity: (id: string, quantity: number) => void;
};

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CartDrawer({ open, onClose, items, onQuantity }: CartDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const { records } = usePublicSampleRecords();
  const businessDetails = businessFrom(records);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("drawer-open");
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("drawer-open");
      previouslyFocusedRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const enquiryText = `Hello, I would like to ask about current availability for: ${items.map((item) => `${item.quantity} × ${item.product.name} (${item.variant.color}, ${item.variant.size})`).join("; ")}. Please confirm current prices and availability. These are sample catalogue listings.`;

  const keepFocusInDrawer = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const elements = drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
    if (!elements?.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        ref={drawerRef}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onKeyDown={keepFocusInDrawer}
      >
        <div className="drawer-heading">
          <div>
            <span className="eyebrow">SAMPLE ENQUIRY</span>
            <h2 id="cart-title">Your enquiry list <span>({itemCount})</span></h2>
          </div>
          <button ref={closeButtonRef} type="button" className="icon-button close-drawer" onClick={onClose} aria-label="Close enquiry list">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-cart-icon"><ShoppingBag size={26} aria-hidden="true" /></span>
            <h3>No items selected.</h3>
            <p>Choose sample catalogue items to ask about. This list stays in this browser only; it is not an account, order or server-side cart.</p>
            <button type="button" className="button button-dark" onClick={onClose}>Continue browsing <ArrowRight size={17} aria-hidden="true" /></button>
          </div>
        ) : (
          <>
            <ul className="cart-lines" aria-label="Selected sample catalogue items">
              {items.map((item) => (
                <li className="cart-line" key={item.id}>
                  <img src={item.product.image} alt="" />
                  <div className="cart-line-copy">
                    <strong>{item.product.name}</strong>
                    <span>{item.variant.color} · {item.variant.size}</span>
                    <b>{formatKes(item.variant.price)} <span>sample price</span></b>
                  </div>
                  <div className="quantity-control" role="group" aria-label={`Selected quantity for ${item.product.name}`}>
                    <button type="button" aria-label={`Remove one ${item.product.name}`} onClick={() => onQuantity(item.id, item.quantity - 1)}><Minus size={17} aria-hidden="true" /></button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button type="button" aria-label={`Add one ${item.product.name}`} onClick={() => onQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= 99}><Plus size={17} aria-hidden="true" /></button>
                  </div>
                </li>
              ))}
            </ul>
            <section className="enquiry-next-step" aria-labelledby="enquiry-next-title">
              <h3 id="enquiry-next-title">Your list is for reference</h3>
              <p>Product details and prices are sample values, not a quote. This list stays only in this browser. The WhatsApp message asks the team to confirm current availability; it does not create an order, reserve stock or make a payment.</p>
              <a className="button button-dark checkout-submit" href={`${businessDetails.whatsapp.href}?text=${encodeURIComponent(enquiryText)}`} target="_blank" rel="noreferrer" aria-label={`Ask about ${itemCount} selected sample items on WhatsApp`}>
                Ask on WhatsApp <ArrowRight size={17} aria-hidden="true" />
              </a>
            </section>
          </>
        )}
      </aside>
    </div>
  );
}
