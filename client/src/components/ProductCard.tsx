import { useMemo, useState } from "react";
import { Heart, Plus, Scale } from "lucide-react";
import { Link } from "wouter";
import { formatKes, uniqueColors } from "@/data/catalog";
import type { Product, ProductVariant } from "@/data/catalog";

type ProductCardProps = {
  product: Product;
  index: number;
  onAdd: (product: Product, variant: ProductVariant) => void;
  saved?: boolean;
  compared?: boolean;
  onToggleWishlist?: () => void;
  onToggleCompare?: () => void;
};

export default function ProductCard({ product, index, onAdd, saved = false, compared = false, onToggleWishlist, onToggleCompare }: ProductCardProps) {
  const colors = useMemo(() => uniqueColors(product), [product]);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.color ?? "");
  const sizes = product.variants.filter((variant) => variant.color === selectedColor);
  const [selectedSku, setSelectedSku] = useState(sizes[0]?.sku ?? product.variants[0]?.sku ?? "");
  const selected = product.variants.find((variant) => variant.sku === selectedSku) ?? sizes[0] ?? product.variants[0];

  const chooseColor = (color: string) => {
    setSelectedColor(color);
    const nextVariant = product.variants.find((variant) => variant.color === color);
    if (nextVariant) setSelectedSku(nextVariant.sku);
  };

  return (
    <article className="product-card" style={{ animationDelay: `${index * 55}ms` }}>
      <div className="product-image-wrap">
        <Link className="product-image-link" href={`/products/${product.slug}`} aria-label={`View ${product.name} details`}>
          <img src={product.image} alt={`${product.name}, sample product photograph`} loading={index > 1 ? "lazy" : "eager"} />
        </Link>
        {(onToggleWishlist || onToggleCompare) && <div className="product-card-utilities" aria-label={`${product.name} actions`}>
          {onToggleWishlist && <button type="button" className="product-card-utility" aria-label={saved ? `Remove ${product.name} from local wishlist` : `Save ${product.name} to local wishlist`} aria-pressed={saved} onClick={onToggleWishlist}><Heart size={18} aria-hidden="true" fill={saved ? "currentColor" : "none"} /></button>}
          {onToggleCompare && <button type="button" className="product-card-utility" aria-label={compared ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`} aria-pressed={compared} onClick={onToggleCompare}><Scale size={18} aria-hidden="true" /></button>}
        </div>}
        <button type="button" className="quick-add" aria-label={`Add ${product.name}, ${selected.size}, ${selected.color}, to the enquiry list`} onClick={() => onAdd(product, selected)}><Plus size={18} aria-hidden="true" /><span>Add to enquiry</span></button>
      </div>
      <div className="product-info">
        <div className="product-meta"><span>{product.category}</span></div>
        <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
        <p className="product-description">{product.description}</p>
        <div className="product-choice-row">
          <div className="swatches" role="group" aria-label={`Colour options for ${product.name}`}>
            {colors.map((variant) => (
              <button key={variant.color} type="button" className={`swatch ${selectedColor === variant.color ? "swatch-active" : ""}`} style={{ "--swatch": variant.colorHex } as React.CSSProperties} title={variant.color} aria-label={`Choose ${variant.color} for ${product.name}`} aria-pressed={selectedColor === variant.color} onClick={() => chooseColor(variant.color)} />
            ))}
          </div>
          {sizes.length > 1 ? (
            <select aria-label={`Select size for ${product.name}`} value={selected.sku} onChange={(event) => setSelectedSku(event.target.value)}>
              {sizes.map((variant) => <option key={variant.sku} value={variant.sku}>{variant.size}</option>)}
            </select>
          ) : <span className="size-label">{selected.size}</span>}
        </div>
        <div className="product-price-row"><span>{formatKes(selected.price)}</span><small>sample price</small></div>
      </div>
    </article>
  );
}
