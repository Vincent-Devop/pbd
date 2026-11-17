# PRINCE BENJA DESIGNS — Implementation plan

## Product scope and serving

The requested public routes are: `/`; `/shop`; `/categories`; `/categories/:slug`; `/brands/:slug`; `/products/:slug`; `/new-arrivals`; `/best-sellers`; `/offers`; `/wholesale`; `/wholesale/register`; `/search`; `/wishlist`; `/compare`; `/cart`; `/checkout`; `/order-confirmation/:reference`; `/track-order`; `/about`; `/contact`; `/branches`; `/branches/:slug`; `/blog`; `/blog/:slug`; `/faq`; `/reviews`; `/privacy-policy`; `/terms`; `/returns`; and `/delivery-policy`.

Populate every requested page with editable sample records instead of leaving it as a blank or preview-labelled shell. Persist page, product and operations sample records in isolated Neon staging and make them editable through a server-authorized `/ops` editor. Clearly identify sample values; do not present them as verified inventory, sales, reviews, promotions or policies. Keep commerce actions honest: do not imply checkout, payment, order, customer-account or live-stock functionality that is not connected. Build in independently verifiable stages. Do not publish the website.

Preserve the current application stack: React 19, TypeScript, Vite, Wouter, Express, tRPC and Drizzle, but use Neon/PostgreSQL as explicitly requested instead of MySQL. Use the protected Development-only `PBD_NEON_DEV_STAGING_DATABASE_URL` secret for migrations, tests and sample seeding. The adapter and Drizzle CLI must fail closed if Development scope is absent or the configured Neon host does not match the approved staging identity, and must never fall back to `DATABASE_URL`, the managed database or the supplied live-production Neon URL. Do not connect to, read, migrate or seed the live-production database. Keep public routes and API-backed behavior within the project's existing conventions. Keep the user-supplied PB Designs logo and take only the colors and font stacks from version `e7d49faf960bf0b17214cd42b976430d0309a485`; preserve the current layout, spacing, radii, and other styling.

## Current-state constraints and safety boundaries

- The backend currently contains a single users table and platform OAuth/session scaffolding. There are no product, branch, inventory, order, customer, payment, fulfilment, page-content or audit models/APIs.
- The platform-managed database capability may be enabled, but the application and Drizzle CLI use Neon/PostgreSQL only. The supplied Neon URL is live production; do not connect to, read, migrate or seed it. Development DB operations require the approved isolated Neon staging endpoint.
- Existing product names, images and KES prices are illustrative. Store clearly labelled, editable sample records in isolated staging only; do not present samples as verified inventory, sales, reviews, promotions or policies. Do not invent actual branch hours, business history, tax treatment, legal terms or certifications. Use the user-confirmed contact/location details only.
- No payment provider, merchant account, verified M-Pesa callbacks, bank details, courier, email service or production customer-auth policy is configured. Do not simulate successful payments or imply these integrations work. Payment integration requires an authorized provider sandbox and credentials supplied only through the protected project-secret flow. Never mark a transaction paid from client input or a screenshot.
- Keep order and payment statuses separate; represent money as integer minor units plus explicit currency; use transactional inventory reservation and idempotency before accepting live orders. Public APIs must not expose cost prices, customer information, branch inventory ledgers or financial reports.
- No tax/legal policy is to be invented. Privacy, terms, returns, delivery, consumer disclosures, KRA tax/invoicing and Kenya Data Protection Act obligations require business/legal review and current approved text before production use.

## Architecture and project structure

- `client/src/App.tsx`: Wouter route table, shared storefront layout, error/404 handling and public route pages.
- `client/src/pages/`: route pages grouped by discover/catalogue, product, customer shopping journey and informational content; each route gets accurate metadata and accessible loading/empty/error/success states.
- `client/src/components/`: reusable header/navigation, cards, filters, galleries, dialogs/drawers, form controls, notices, route breadcrumbs and layout primitives.
- `client/src/index.css`: authoritative CSS custom properties and Tailwind 4 theme bindings for color, type, spacing, radii, surfaces, shadows, motion, breakpoints and semantic states. Align static initial HTML/fallback pages to the same source values where feasible.
- `client/src/data/` and `shared/sample-content.ts`: source types and deterministic sample fixtures for public pages, products and operations records; persisted content is supplied through typed server procedures.
- `server/routers.ts`, `server/domain/` (proposed): validated tRPC procedures and business services, with server-side authorization, protected content editing and public/private projections.
- `drizzle/schema.ts` and `drizzle/postgres/`: PostgreSQL models and migrations for Neon. Generate and test schema changes against the Development-only isolated staging endpoint; never against live production.
- `server/*.test.ts`, new client/domain tests and approved E2E tooling: verify business rules, API authorization, order/payment transitions, concurrency, accessibility and customer journeys.
- `client/public/manus-routes.json`: complete route manifest including dynamic route patterns, synchronized with the application route table.
- `plan.md`, `TODO.md`, `app.config.ts`: design/implementation record, explicit outcomes and existing platform branding metadata.

## Design system

Use the colors and font stacks from version `e7d49faf960bf0b17214cd42b976430d0309a485` as the authoritative shared color/type foundation; do not copy its layout or other styling:

- Palette: lavender background `#F3EFF9`, deep lavender `#EAE2F3`, soft purple `#ECE4F6`, purple wash `#E1D5F0`, primary royal purple `#512487`, deep purple `#351655`, dark purple `#30144F`, and plum ink `#28183A`; secondary text `#493858`, muted text `#594A67`, border `#887797`, and inverse text `#FBF8FF`.
- Semantic states: success `#18794E`, warning `#946200`, error `#B42335`, information `#2457A7`. Validate every foreground/background combination; adjust derived foreground tokens if needed to meet WCAG 2.2 AA without changing the approved brand hues unnecessarily.
- Typography: Inter, `"Avenir Next"`, Avenir, `"Segoe UI"`, sans-serif for body/UI; Iowan Old Style/Palatino Linotype/Book Antiqua/Georgia for display headings. Keep the existing 16px base, responsive display scale, 1.4–1.7 body line-height, and restrained 400/500/600/700 weights.
- Spacing: 4px-based scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px); radii 6/10/16/20px plus pill; refined shadows and light/medium/strong glass surfaces.
- Use glass selectively; dense copy and forms use sufficiently opaque surfaces. Standard transitions are restrained and disabled for nonessential motion under `prefers-reduced-motion`.
- Keep semantic text labels for statuses, visible focus rings, keyboard operation, logical reading order, accessible validation/messages, meaningful image alt text, and touch targets ideally 44×44px. Verify contrast rather than assuming the palette is compliant.

## Delivery phases

1. **Requirements and foundation:** Preserve the supplied logo and current scope decisions; make the implementation plan and outcome list explicit. The isolated Neon staging endpoint is supplied through protected Development-only secret input. Use user-confirmed contact/location details; confirm remaining product/image sources, customer-account approach, policies and provider/integration dependencies. No publication.
2. **Shared design system and application shell:** Centralize tokens; apply them to storefront, static fallbacks and the Development-only `/ops` sample-data editor; add shared route layout, button-style navigation, accessible states, metadata and a complete synchronized route manifest. Build route-level information architecture without presenting unimplemented integrations as live.
3. **Catalogue discovery and product content:** Add shop/category/brand/search/new/best-seller/offer/product-detail routes, typed product/variant structures, image gallery/variant UI and filtering/sorting/pagination. Use only disclosed demo data until verified import and public catalogue APIs exist.
4. **Customer shopping UX and wholesale:** Implement local wishlist, comparison and cart interactions; account/registration, wholesale request and enquiry flows only when their backend persistence, privacy and authorization rules are available. Any checkout must use server-calculated prices and persisted order state; do not show payment success unless verified.
5. **Backend and editable sample content:** In isolated Neon staging, persist every public route's sample page data, sample products and sample operations records. Expose public read-only projections and admin-only validated editing in `/ops`; seed missing fixtures without overwriting later edits. Do not add live customer records, transactions, payments or inventory claims in this phase.
6. **Payments, finance and production integrations:** After provider sandbox/merchant details and business approval, implement separate M-Pesa, cash and bank-transfer processes, callback verification/idempotency, manual authorization/reconciliation, receipts, refunds/reversals and financial reporting. Never use real payments during development or imply integration readiness before end-to-end verification.
7. **Informational content, SEO and assurance:** Fill approved about/contact/branch/blog/FAQ/reviews/policy content; implement route metadata, canonical/Open Graph, robots/sitemap, structured data and responsive image/performance work. Add unit/API/E2E/a11y/security testing, backup/restore and monitoring checks in staging. Production readiness and launch remain separate decisions; no publish without explicit authorization.

## Design direction and brand

- **Design Movement:** Refined lavender-and-royal-purple editorial luxury, using the specified version's colors and font stacks only.
- **Core Principles:** Luxury with restraint; high-contrast readable surfaces; consistent reusable tokens; honest separation of demonstration content from verified business functionality.
- **Color Philosophy:** Use the referenced lavender surfaces, dark-plum typography and royal-purple actions; keep text and controls high-contrast on sufficiently opaque surfaces.
- **Layout Paradigm:** Asymmetric editorial merchandising on discovery pages, practical responsive catalog/detail layouts, and a clear step-by-step checkout only when backed by real server workflows.
- **Signature Elements:** User-supplied PB Designs logo, lavender editorial surfaces, and dark-purple accents. Do not add PB/NB-style decorative marks or image badges.
- **Interaction Philosophy:** Direct, keyboard-operable shopping flows with explicit feedback; no dead buttons or simulated success states.
- **Animation:** 180–220ms restrained transitions; respect reduced motion.
- **Typography System:** Inter with Avenir Next/Avenir fallbacks for body/UI, Iowan Old Style/Palatino display with system fallbacks and a clear readable hierarchy.
- **Brand Essence:** Thoughtful travel bags and accessories; assured, crafted, welcoming.
- **Brand Voice:** Direct, warm and quietly confident. Example lines: “Pack for the miles that matter.” “Ask our team what’s available.”
- **Wordmark & Logo:** User-supplied transparent PB Designs badge paired with the PRINCE BENJA DESIGNS text lockup.
- **Signature Brand Color:** Royal purple `#512487`, supported by lavender `#F3EFF9` and deep purple `#351655`; keep all text/control contrasts accessible.
