export type PageMetadata = {
  title: string;
  description: string;
  noindex?: boolean;
};

export const storefrontMetadata: PageMetadata = {
  title: "PRINCE BENJA DESIGNS — Travel bags & accessories",
  description:
    "Travel bags and everyday essentials from PRINCE BENJA DESIGNS. Sample catalogue listings and prices; contact us to confirm current availability.",
};

export const operationsMetadata: PageMetadata = {
  title: "Sample data editor — PRINCE BENJA DESIGNS",
  description:
    "An administrator-only editor for sample storefront and operations content stored in Development Neon staging.",
  noindex: true,
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function applyPageMetadata({ title, description, noindex = false }: PageMetadata) {
  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);

  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (noindex) {
    setMeta("name", "robots", "noindex, nofollow");
  } else {
    robots?.remove();
  }
}
