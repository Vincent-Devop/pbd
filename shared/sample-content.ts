export type ProductVariant = {
  sku: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  material: string;
  variants: ProductVariant[];
  note?: string;
};

export type SampleSection = {
  heading: string;
  body: string;
  items?: string[];
};

export type SamplePageData = {
  path: string;
  title: string;
  description: string;
  sections: SampleSection[];
};

export type SampleOperationData = {
  name: string;
  description: string;
  columns: string[];
  rows: Record<string, string>[];
  note: string;
};

export type ConfirmedBusinessData = {
  whatsapp: { display: string; href: string };
  mainBranch: {
    slug: string;
    name: string;
    address: string;
    directionsHref: string;
  };
};

export type SampleRecordType = "page" | "product" | "operation" | "business";
export type SampleRecordSeed = {
  recordType: SampleRecordType;
  recordKey: string;
  label: string;
  data: Record<string, unknown>;
  isSample: boolean;
};

export const confirmedBusinessData: ConfirmedBusinessData = {
  whatsapp: {
    display: "+254 768 524 870",
    href: "https://wa.me/254768524870",
  },
  mainBranch: {
    slug: "pipeline-branch",
    name: "Pipeline Branch",
    address: "Pipeline Stage, adjacent to Think Twice, Nairobi",
    directionsHref: "https://www.google.com/maps/search/?api=1&query=Pipeline+Stage%2C+adjacent+to+Think+Twice%2C+Nairobi",
  },
};

const suitcaseVariants: ProductVariant[] = [
  { sku: "SAMPLE-SUIT-BLK-S", color: "Black", colorHex: "#262a27", size: "Small", price: 5500 },
  { sku: "SAMPLE-SUIT-BLK-M", color: "Black", colorHex: "#262a27", size: "Medium", price: 6500 },
  { sku: "SAMPLE-SUIT-BLK-L", color: "Black", colorHex: "#262a27", size: "Large", price: 8500 },
  { sku: "SAMPLE-SUIT-SND-S", color: "Sand", colorHex: "#c9b69b", size: "Small", price: 5500 },
  { sku: "SAMPLE-SUIT-SND-M", color: "Sand", colorHex: "#c9b69b", size: "Medium", price: 6500 },
  { sku: "SAMPLE-SUIT-SND-L", color: "Sand", colorHex: "#c9b69b", size: "Large", price: 8500 },
  { sku: "SAMPLE-SUIT-FOR-S", color: "Forest", colorHex: "#214b3e", size: "Small", price: 5500 },
  { sku: "SAMPLE-SUIT-FOR-M", color: "Forest", colorHex: "#214b3e", size: "Medium", price: 6500 },
  { sku: "SAMPLE-SUIT-FOR-L", color: "Forest", colorHex: "#214b3e", size: "Large", price: 8500 },
];

export const sampleProducts: Product[] = [
  {
    slug: "executive-travel-suitcase",
    name: "Executive Travel Suitcase",
    category: "Suitcases",
    image: "/images/product-suitcase.jpg",
    description: "A considered carry-on for the long way round.",
    material: "Hard shell · smooth-roll wheels",
    variants: suitcaseVariants,
    note: "Sample listing",
  },
  {
    slug: "canvas-weekender",
    name: "Canvas Weekender",
    category: "Duffles",
    image: "/images/product-weekender.jpg",
    description: "Room for a change of plans and a little extra.",
    material: "Canvas · leather-touch handles",
    variants: [
      { sku: "SAMPLE-DUF-FOR-36", color: "Forest", colorHex: "#214b3e", size: "36 L", price: 4200 },
      { sku: "SAMPLE-DUF-FOR-52", color: "Forest", colorHex: "#214b3e", size: "52 L", price: 5400 },
      { sku: "SAMPLE-DUF-SND-36", color: "Sand", colorHex: "#c9b69b", size: "36 L", price: 4200 },
      { sku: "SAMPLE-DUF-SND-52", color: "Sand", colorHex: "#c9b69b", size: "52 L", price: 5400 },
    ],
    note: "Sample listing",
  },
  {
    slug: "everyday-travel-backpack",
    name: "Everyday Travel Backpack",
    category: "Backpacks",
    image: "/images/product-backpack.jpg",
    description: "A well-organised companion for daily departures.",
    material: "Technical weave · padded back panel",
    variants: [
      { sku: "SAMPLE-BPK-BLK-STD", color: "Black", colorHex: "#262a27", size: "Standard", price: 3500 },
      { sku: "SAMPLE-BPK-FOR-STD", color: "Forest", colorHex: "#214b3e", size: "Standard", price: 3500 },
    ],
    note: "Sample listing",
  },
  {
    slug: "modular-packing-set",
    name: "Modular Packing Set",
    category: "Accessories",
    image: "/images/product-packing-set.jpg",
    description: "Small systems that make a suitcase feel spacious.",
    material: "Lightweight woven fabric · set of 3",
    variants: [
      { sku: "SAMPLE-ORG-SND-SET", color: "Sand", colorHex: "#c9b69b", size: "3-piece set", price: 1800 },
      { sku: "SAMPLE-ORG-SGE-SET", color: "Sage", colorHex: "#879783", size: "3-piece set", price: 1800 },
    ],
    note: "Sample listing",
  },
];

export const sampleCategories = ["All pieces", ...new Set(sampleProducts.map((product) => product.category))];

function page(
  recordKey: string,
  path: string,
  title: string,
  description: string,
  sections: SampleSection[],
): SampleRecordSeed {
  const data: SamplePageData = { path, title, description, sections };
  return { recordType: "page", recordKey, label: title, data, isSample: true };
}

export const samplePageRecords: SampleRecordSeed[] = [
  page("/", "/", "Ready for the road ahead.", "Travel bags and everyday essentials for wherever the day takes you.", [
    { heading: "Sample catalogue", body: "Four example travel products are stored for editing. Their names, descriptions, images, variants and prices are sample content, not confirmed current stock or offers." },
    { heading: "Main branch", body: `${confirmedBusinessData.mainBranch.name} — ${confirmedBusinessData.mainBranch.address}. Visit details and hours should be confirmed with the team.` },
  ]),
  page("/shop", "/shop", "Shop travel bags and accessories", "Browse sample product listings and edit their details in the operations workspace.", [
    { heading: "Sample categories", body: "The catalogue is organized into example product groups.", items: ["Suitcases", "Duffles", "Backpacks", "Accessories"] },
    { heading: "Price and availability", body: "Displayed KES prices are samples. Contact the team to confirm current products, pricing and availability." },
  ]),
  page("/categories", "/categories", "Browse product categories", "Sample category records are stored with the catalogue and can be edited.", [
    { heading: "Category list", body: "These example groups organize the sample catalogue.", items: ["Suitcases", "Duffles", "Backpacks", "Accessories"] },
  ]),
  page("/categories/:slug", "/categories/:slug", "Sample category collection", "A category page uses the selected category and stored sample products.", [
    { heading: "Collection details", body: "This is editable category content. Product availability and specifications are not verified business records." },
  ]),
  page("/brands/:slug", "/brands/:slug", "Brand collection", "Sample brand collection content for the storefront.", [
    { heading: "Brand information", body: "Brand details can be replaced with business-approved content before launch. No supplier or manufacturer relationship is claimed by this sample." },
  ]),
  page("/products/:slug", "/products/:slug", "Product details", "Stored sample product details include variants, materials, images and KES sample prices.", [
    { heading: "Sample listing", body: "Product and variant information is editable. Confirm specifications, price and stock before making a customer offer." },
  ]),
  page("/new-arrivals", "/new-arrivals", "New arrivals — sample collection", "An editable example collection, not a statement that products have recently arrived.", [
    { heading: "Collection records", body: "Use this space for business-confirmed arrivals when available.", items: ["Sample travel suitcase", "Sample weekend bag"] },
  ]),
  page("/best-sellers", "/best-sellers", "Best sellers — sample collection", "An editable example collection, not a ranking based on verified sales.", [
    { heading: "Sample selections", body: "These entries demonstrate the layout only; no sales ranking is represented as genuine.", items: ["Executive Travel Suitcase", "Everyday Travel Backpack"] },
  ]),
  page("/offers", "/offers", "Offers and campaigns", "Editable campaign records are available for review; no active discount is configured.", [
    { heading: "Sample campaign", body: "Status: draft sample, inactive. No discount, saving, expiry date or sale price is offered." },
  ]),
  page("/wholesale", "/wholesale", "Wholesale enquiries", "Ask the team for current wholesale availability and terms.", [
    { heading: "Sample enquiry workflow", body: "Example stages: enquiry received, details reviewed, terms confirmed. No wholesale account, price tier or credit terms are active." },
  ]),
  page("/wholesale/register", "/wholesale/register", "Wholesale registration", "Sample application fields are shown to make the content editable; this page does not submit or store applications.", [
    { heading: "Example application fields", body: "Business name, contact name, preferred contact channel and product interests. Do not enter customer or business information here; no application is submitted." },
  ]),
  page("/search", "/search", "Search the catalogue", "Search the stored sample products by name, category or product details.", [
    { heading: "Example searches", body: "Try a product name, a category or a material listed in the sample catalogue.", items: ["Suitcase", "Backpacks", "Canvas"] },
  ]),
  page("/wishlist", "/wishlist", "Saved products", "Browse sample products and locally saved selections.", [
    { heading: "Saved items", body: "Wishlist selections are kept in this browser only and are not customer-account records." },
  ]),
  page("/compare", "/compare", "Compare sample products", "Compare editable sample product details side by side.", [
    { heading: "Comparison fields", body: "Example comparisons include category, product details, material, colour, size and sample-price range." },
  ]),
  page("/cart", "/cart", "Enquiry list", "Review locally selected sample items before asking the team about availability.", [
    { heading: "Sample enquiry list", body: "The list is stored in this browser only. It does not reserve stock, create an order or initiate payment." },
  ]),
  page("/checkout", "/checkout", "Checkout information", "Sample checkout content is provided for editing; order submission and payment are not active.", [
    { heading: "Example checkout fields", body: "Contact details, fulfilment choice and order summary are illustrative workflow fields only. Do not submit personal or payment information; no order is created." },
  ]),
  page("/order-confirmation/:reference", "/order-confirmation/:reference", "Sample order record", "A sample confirmation layout. No real order is created or verified by this page.", [
    { heading: "Example reference", body: "SAMPLE-ORD-001 — draft example only; payment status is not paid and no purchase exists." },
  ]),
  page("/track-order", "/track-order", "Order tracking information", "An editable example of order-status content; no customer order lookup is connected.", [
    { heading: "Sample status sequence", body: "Draft example → confirmed order → fulfilment update. These are illustrative states, not a real order." },
  ]),
  page("/about", "/about", "About PRINCE BENJA DESIGNS", "Editable introduction content for the storefront.", [
    { heading: "Sample introduction", body: "A concise introduction to the travel bags and accessories collection. Replace this sample copy with business-approved history and details before publication." },
  ]),
  page("/contact", "/contact", "Contact PRINCE BENJA DESIGNS", `WhatsApp ${confirmedBusinessData.whatsapp.display} for product enquiries and branch assistance.`, [
    { heading: "WhatsApp", body: confirmedBusinessData.whatsapp.display },
    { heading: "Main branch", body: `${confirmedBusinessData.mainBranch.name}: ${confirmedBusinessData.mainBranch.address}. Ask the team about visit details and opening hours.` },
  ]),
  page("/branches", "/branches", "Main branch", `${confirmedBusinessData.mainBranch.name} is located at ${confirmedBusinessData.mainBranch.address}.`, [
    { heading: confirmedBusinessData.mainBranch.name, body: confirmedBusinessData.mainBranch.address },
    { heading: "Visit assistance", body: `WhatsApp ${confirmedBusinessData.whatsapp.display} for opening hours and visit information.` },
  ]),
  page("/branches/:slug", "/branches/:slug", "Branch details", "Branch information uses the confirmed main-branch record.", [
    { heading: confirmedBusinessData.mainBranch.name, body: confirmedBusinessData.mainBranch.address },
  ]),
  page("/blog", "/blog", "Journal", "Sample editorial entries for travel planning and product-care topics.", [
    { heading: "Sample article", body: "A practical packing list for a short trip. This is demonstration editorial content, not a customer testimonial or business claim." },
  ]),
  page("/blog/:slug", "/blog/:slug", "Sample journal article", "Editable example editorial content.", [
    { heading: "Pack with intention", body: "Start with the length of your trip, the items you need to carry and the way you prefer to organize them. Treat this article as sample copy until reviewed by the business." },
  ]),
  page("/faq", "/faq", "Frequently asked questions", "Sample questions and safe answers for common product and visit enquiries.", [
    { heading: "How do I confirm product availability?", body: `WhatsApp ${confirmedBusinessData.whatsapp.display} and ask about the item you are interested in.` },
    { heading: "Where is the main branch?", body: confirmedBusinessData.mainBranch.address },
    { heading: "What are the opening hours?", body: "Hours have not been supplied; please ask the team before visiting." },
  ]),
  page("/reviews", "/reviews", "Customer reviews", "Sample review records are clearly marked and are not genuine customer testimonials.", [
    { heading: "Sample review record", body: "Sample shopper — ‘This is example review text for layout editing; it is not genuine customer feedback.’ Replace it with an approved, authentic review before publication." },
  ]),
  page("/privacy-policy", "/privacy-policy", "Privacy information", "Sample privacy content for editing; approved business and legal text is still required before publication.", [
    { heading: "Sample privacy notice", body: "This development sample does not submit or store customer details. Before launch, add approved information about data collected, purpose, retention, access requests and the responsible contact." },
  ]),
  page("/terms", "/terms", "Terms of service", "Sample terms content for editing; no business contract terms are asserted here.", [
    { heading: "Sample terms notice", body: "Displayed product names, images, variants and prices are sample data. Confirm current availability and applicable terms directly with the business. Replace this content with reviewed business-approved terms before publication." },
  ]),
  page("/returns", "/returns", "Returns and refunds information", "Sample returns content for editing; no return or refund entitlement is stated as business policy.", [
    { heading: "Sample returns notice", body: `Please contact ${confirmedBusinessData.whatsapp.display} to ask about current returns or refund terms. Add the approved policy before publication.` },
  ]),
  page("/delivery-policy", "/delivery-policy", "Delivery and collection information", "Sample delivery content for editing; delivery areas, fees and timing are not confirmed.", [
    { heading: "Sample delivery notice", body: `WhatsApp ${confirmedBusinessData.whatsapp.display} to ask about current delivery or collection options, coverage, fees and timing.` },
  ]),
  page("/ops", "/ops", "Operations workspace", "Sample operations records are editable by authorized administrators; they are not live business transactions.", [
    { heading: "Sample data", body: "Catalogue, inventory, order, payment, branch and reporting records in this workspace are examples only. No customer payment or live stock operation is performed." },
  ]),
  page("/404", "/404", "Page not found", "The requested page could not be found.", [
    { heading: "Continue browsing", body: "Return to the home page or browse the sample catalogue." },
  ]),
];

export const sampleOperationRecords: SampleRecordSeed[] = [
  {
    recordType: "operation", recordKey: "overview", label: "Operations overview",
    data: { name: "Overview", description: "A summary of editable sample records.", columns: ["Record group", "Sample count", "Status"], rows: [
      { "Record group": "Catalogue products", "Sample count": "4", Status: "Sample data" },
      { "Record group": "Public page records", "Sample count": String(samplePageRecords.length), Status: "Sample data" },
      { "Record group": "Operations modules", "Sample count": "16", Status: "Sample data" },
      { "Record group": "Confirmed main branch", "Sample count": "1", Status: "Verified location details" },
    ], note: "Counts describe seeded examples only. They are not sales, revenue or live inventory." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "inventory", label: "Inventory", data: {
      name: "Inventory", description: "Example variant balances and stock states.", columns: ["Sample SKU", "Product variant", "On hand", "Reserved", "Available"], rows: [
        { "Sample SKU": "SAMPLE-STK-001", "Product variant": "Executive Travel Suitcase · Black · Small", "On hand": "8 sample units", Reserved: "2 sample units", Available: "6 sample units" },
        { "Sample SKU": "SAMPLE-STK-002", "Product variant": "Canvas Weekender · Forest · 36 L", "On hand": "5 sample units", Reserved: "0 sample units", Available: "5 sample units" },
      ], note: "All quantities are demonstration values, not physical stock. No stock is reserved or adjusted." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "orders", label: "Orders", data: {
      name: "Orders", description: "Example order states without customer PII or payment success.", columns: ["Sample reference", "Items", "Order state", "Payment state"], rows: [
        { "Sample reference": "SAMPLE-ORD-001", Items: "Executive Travel Suitcase · 1", "Order state": "Draft example", "Payment state": "Not paid" },
        { "Sample reference": "SAMPLE-ORD-002", Items: "Canvas Weekender · 1", "Order state": "Draft example", "Payment state": "Not paid" },
      ], note: "These are not real orders. No purchase, reservation, fulfilment or charge exists." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "branches", label: "Branches", data: {
      name: "Branches", description: "Confirmed main-branch information plus sample operational fields.", columns: ["Branch", "Address", "Hours", "Status"], rows: [
        { Branch: confirmedBusinessData.mainBranch.name, Address: confirmedBusinessData.mainBranch.address, Hours: "Ask the team", Status: "Location confirmed" },
      ], note: "Only the displayed branch name and location were confirmed. No hours or additional branches are inferred." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "payments", label: "Payments", data: {
      name: "Payments", description: "Example payment records show safe, unpaid states.", columns: ["Sample reference", "Method", "Amount", "Status"], rows: [
        { "Sample reference": "SAMPLE-PAY-001", Method: "M-Pesa", Amount: "Example only", Status: "Not initiated" },
        { "Sample reference": "SAMPLE-PAY-002", Method: "Cash", Amount: "Example only", Status: "Not collected" },
      ], note: "No payment provider is connected. These examples cannot initiate, confirm or reconcile a payment." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "procurement", label: "Procurement", data: {
      name: "Procurement", description: "Sample purchasing workflow records.", columns: ["Sample reference", "Supplier", "Status", "Total"], rows: [
        { "Sample reference": "SAMPLE-PO-001", Supplier: "Sample supplier record", Status: "Draft example", Total: "Not set" },
      ], note: "Supplier identity, purchase costs and approvals are not verified business data." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "wholesale", label: "Wholesale", data: {
      name: "Wholesale", description: "Example wholesale account and quotation states.", columns: ["Sample reference", "Account", "Status", "Terms"], rows: [
        { "Sample reference": "SAMPLE-WHOLESALE-001", Account: "Sample business account", Status: "Application example", Terms: "To be confirmed" },
      ], note: "No real wholesale account, approved price tier, credit or quotation is configured." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "customers", label: "Customers", data: {
      name: "Customers", description: "An anonymized customer-record example with no real personal data.", columns: ["Sample reference", "Display name", "Contact", "Orders"], rows: [
        { "Sample reference": "SAMPLE-CUSTOMER-001", "Display name": "Sample customer", Contact: "Not supplied", Orders: "Example only" },
      ], note: "No actual customer details are stored in this sample record." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "delivery", label: "Delivery", data: {
      name: "Delivery", description: "Example delivery and collection workflow states.", columns: ["Sample reference", "Area", "Method", "Status"], rows: [
        { "Sample reference": "SAMPLE-DEL-001", Area: "Confirm with team", Method: "Delivery or collection", Status: "Not configured" },
      ], note: `Ask ${confirmedBusinessData.whatsapp.display} about current service areas, fees and timing.` }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "promotions", label: "Promotions and marketing", data: {
      name: "Promotions and marketing", description: "A campaign example in inactive draft state.", columns: ["Sample reference", "Campaign", "Discount", "Status"], rows: [
        { "Sample reference": "SAMPLE-CAM-001", Campaign: "Sample campaign", Discount: "None configured", Status: "Draft · inactive" },
      ], note: "No real promotion, coupon, expiry or saving is active." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "staff", label: "Staff and access", data: {
      name: "Staff and access", description: "Example role labels for access planning.", columns: ["Sample reference", "Role", "Branch scope", "Account state"], rows: [
        { "Sample reference": "SAMPLE-STAFF-001", Role: "Branch manager", "Branch scope": "Sample only", "Account state": "No account" },
      ], note: "These rows do not grant access. Permissions are enforced by server authorization." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "finance", label: "Financial management", data: {
      name: "Financial management", description: "Example reporting definitions without fabricated transaction values.", columns: ["Metric", "Definition", "Sample value"], rows: [
        { Metric: "Net sales", Definition: "Gross sales − discounts − returns", "Sample value": "No transaction data" },
        { Metric: "Gross profit", Definition: "Net sales − cost of goods sold", "Sample value": "No transaction data" },
      ], note: "No financial transactions or cost records are present." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "notifications", label: "Notifications", data: {
      name: "Notifications", description: "Example message templates that have not been sent.", columns: ["Sample reference", "Event", "Channel", "Status"], rows: [
        { "Sample reference": "SAMPLE-MSG-001", Event: "Order status update", Channel: "Template only", Status: "Not sent" },
      ], note: "No customer notification provider is connected." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "analytics", label: "Analytics and reporting", data: {
      name: "Analytics and reporting", description: "Example report definitions without live business data.", columns: ["Report", "Period", "Value", "State"], rows: [
        { Report: "Sales summary", Period: "Not set", Value: "No sales data", State: "Sample definition" },
        { Report: "Stock movement", Period: "Not set", Value: "No live ledger", State: "Sample definition" },
      ], note: "No sales, customer or stock analytics have been collected." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "pos", label: "Point of sale", data: {
      name: "Point of sale", description: "An example point-of-sale ticket with no completed transaction.", columns: ["Sample ticket", "Item", "Quantity", "Sale state"], rows: [
        { "Sample ticket": "SAMPLE-POS-001", Item: "Executive Travel Suitcase", Quantity: "1 sample unit", "Sale state": "Draft · no sale" },
      ], note: "No sale, cash session, stock deduction or payment is created." }, isSample: true,
  },
  {
    recordType: "operation", recordKey: "receipts", label: "Receipts", data: {
      name: "Receipts", description: "An example receipt record that remains unissued.", columns: ["Sample reference", "Order reference", "Payment verification", "Receipt state"], rows: [
        { "Sample reference": "SAMPLE-REC-001", "Order reference": "SAMPLE-ORD-001", "Payment verification": "Not verified", "Receipt state": "Not issued" },
      ], note: "This is not proof of purchase or payment." }, isSample: true,
  },
];

const productRecords: SampleRecordSeed[] = sampleProducts.map((product) => ({
  recordType: "product",
  recordKey: product.slug,
  label: product.name,
  data: product as unknown as Record<string, unknown>,
  isSample: true,
}));

const confirmedBusinessRecord: SampleRecordSeed = {
  recordType: "business",
  recordKey: "confirmed-profile",
  label: "Confirmed business contact and main branch",
  data: confirmedBusinessData as unknown as Record<string, unknown>,
  isSample: false,
};

export const sampleRecords: SampleRecordSeed[] = [
  ...samplePageRecords,
  ...productRecords,
  ...sampleOperationRecords,
  confirmedBusinessRecord,
];

export function getSamplePageKey(route: string) {
  return route;
}
