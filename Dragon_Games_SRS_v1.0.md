# Software Requirements Specification (SRS)
## Dragon Games — Web Platform

| Field | Value |
|---|---|
| Project | Dragon Games TCG Club Web Platform |
| Client | Dragon Games (Novi Sad, Serbia) |
| Document version | 1.0 (Draft) |
| Date | May 2026 |
| Status | Draft for client review |
| Replaces | https://www.dragon.rs/ (legacy site, unmaintained) |

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for the new web platform of **Dragon Games**, a Trading Card Game (TCG) and board-games club and shop based in Novi Sad, Serbia, operating since 1994. The platform replaces the legacy `dragon.rs` website (dated late-2000s design, no longer maintained) with a modern, animated, mobile-first, bilingual (Serbian / English) experience covering three core capabilities:

1. **Informational presence** — club identity, locations, tournament calendar, news, game guides.
2. **Catalog & inquiry-based e-commerce** — browsable product catalog with cart and order submission, **without online card payments** in V1. Includes a full admin panel for category, product, stock, and order management.
3. **Member forum** — community discussion and tournament coordination space (Phase 2 / V2).

### 1.2 Scope
**In scope (V1.0 — Phase 1):**
- Public informational pages (home, about, locations, tournaments, news, guides, contact)
- Bilingual UI (Serbian default, English toggle, persisted in user preferences)
- Public product catalog with browsing, filtering, search, product detail pages
- Inquiry-based ordering (cart → submit order without payment → admin contacts customer for offline payment / pickup / delivery)
- Tournament calendar with public listings and admin CRUD
- News / blog with admin CMS
- Authentication for members (V1 includes registration / login to support order history, newsletter, favorites — even though forum is V2)
- Admin panel for products, categories, stock, orders, tournaments, news, users, content
- Modern animated UI with motion design (see §6)
- Mobile-first responsive design
- SEO fundamentals

**In scope (V2.0 — Phase 2):**
- Member forum (categories, threads, posts, moderation, reactions, mentions)
- Tournament RSVP and roster management
- Member profiles with deck-list embeds (optional)

**Out of scope (V1):**
- Online card / wallet payments (PayPal, Stripe, NestPay, etc.)
- Loyalty / points system
- Native mobile apps (web is mobile-first responsive)
- Singles marketplace / card-by-card pricing engine
- Card-by-card inventory at the level of MTG/Yu-Gi-Oh singles trading (V1 inventory is at SKU/product level — booster boxes, decks, accessories, sealed product, not individual cards)

### 1.3 Definitions, Acronyms, Abbreviations
| Term | Meaning |
|---|---|
| TCG | Trading Card Game |
| MTG | Magic: The Gathering |
| YGO | Yu-Gi-Oh! TCG |
| PTCG | Pokémon Trading Card Game |
| Riftbound | League of Legends TCG by Riot Games |
| WPN | Wizards Play Network (MTG official store designation) |
| OTS | Official Tournament Store (Yu-Gi-Oh) |
| SKU | Stock Keeping Unit — unique inventory identifier |
| i18n / l10n | Internationalization / Localization |
| RSD | Serbian Dinar |
| FNM | Friday Night Magic |
| CMS | Content Management System |
| CRUD | Create / Read / Update / Delete |
| RBAC | Role-Based Access Control |
| LCP / CLS / INP | Core Web Vitals metrics |
| SRP | Search Engine Result Page |

### 1.4 References
- Legacy site: `https://www.dragon.rs/`
- Facebook: `facebook.com/klubdragonnovisad`
- Instagram: `@dragon_novi_sad`
- WCAG 2.2 AA accessibility guidelines
- OWASP ASVS 4.0 for security baseline
- GDPR / Serbia Zakon o zaštiti podataka o ličnosti (ZZPL)

### 1.5 Document Conventions
- **MUST / SHALL** — mandatory requirement
- **SHOULD** — recommended but not blocking
- **MAY** — optional / nice-to-have
- Requirements are numbered `FR-X.Y` (functional) and `NFR-X.Y` (non-functional) for traceability.

---

## 2. Overall Description

### 2.1 Product Perspective
The platform is a greenfield replacement of the legacy site. Dragon Games is:
- A **WPN-certified** MTG store and **OTS-certified** Yu-Gi-Oh store.
- Operating two physical locations:
  - **Shop**: Stražilovska 3, Novi Sad
  - **Club / tournament venue**: Kralja Aleksandra 4, Novi Sad
- Club hours: **Wednesday – Sunday, 15:00 – 21:00**
- Active on Facebook, Instagram, and via Viber (`063624038`)

The platform must reflect the club's identity (community-driven, hobbyist-friendly, 30+ years of operation) while presenting it through modern 2026 web design that competes visually with international references (e.g., Linear, Vercel, Riot, Card Kingdom, TCGPlayer).

### 2.2 Product Functions (High-Level)
- Showcase club identity, locations, hours, and contact information
- Maintain a public catalog of products (TCG sealed product, board games, RPG books, miniatures, accessories)
- Allow visitors to inquire / reserve products via cart submission without online payment
- Allow admin to manage catalog, stock, categories, orders, tournaments, news
- Announce and showcase tournaments with calendar and event detail pages
- Publish news and tournament reports
- Provide game guides for newcomers (intro to MTG / Yu-Gi-Oh / Pokémon / Riftbound)
- Support Serbian / English language switching
- (V2) Host member forum

### 2.3 User Classes and Characteristics

| User class | Description | Volume estimate (Y1) | Tech literacy |
|---|---|---|---|
| **Guest visitor** | Anonymous browser, finds site via Google / social. Reads, browses catalog, may submit inquiry without account. | ~5,000 / month | Mixed (low → high) |
| **Registered member** | Local hobbyist with account. Receives newsletter, sees order history, has favorites. V2: posts on forum. | ~300 by end of Y1 | Medium to high |
| **Admin (Owner / Manager)** | Dragon Games staff with full content + commerce control. Likely 1–2 people. | 1–2 users | Medium (UI must be friendly, not require SQL) |
| **(V2) Moderator** | Trusted member with forum-only moderation rights. | 2–4 users | Medium-high |

### 2.4 Operating Environment
- **Client devices**: Modern desktop browsers (Chrome, Firefox, Safari, Edge — last 2 versions) and mobile browsers (iOS Safari, Android Chrome, last 2 versions). Mobile traffic is expected to dominate (≥ 65%).
- **Server**: Cloud-hosted (Vercel / similar for frontend, Supabase / managed Postgres for backend). EU region preferred for latency and data residency.
- **CDN**: Global CDN for static assets and images.
- **Admin panel**: Same web app, role-gated routes — no separate desktop application required.

### 2.5 Design and Implementation Constraints

| ID | Constraint |
|---|---|
| C-1 | Default language is **Serbian (Latin script)**. English is selectable via top-right language switcher. Switcher state persists across sessions. |
| C-2 | **No online card payments in V1.** All orders flow into an admin-handled inquiry pipeline. |
| C-3 | All prices displayed in **RSD primary**, EUR secondary (configurable). |
| C-4 | Currency conversion rate is **manually configurable** by admin (no live FX feed required in V1). |
| C-5 | Hosting in EU region for GDPR + ZZPL compliance. |
| C-6 | Site must be functional on a **3G mobile connection** in central Novi Sad (LCP < 2.5s). |
| C-7 | Image upload size capped at **8 MB per file** in admin; backend automatically derives WebP/AVIF variants. |
| C-8 | All animations must respect `prefers-reduced-motion`. |
| C-9 | Site must remain functional with **JavaScript disabled** for core informational pages (graceful degradation). E-commerce and admin may require JS. |
| C-10 | Personal data handling must comply with Serbian ZZPL and GDPR where applicable. |

### 2.6 Assumptions and Dependencies
- Admin will provide initial catalog data (product images, descriptions, prices) or import via CSV.
- Dragon Games owns or has rights to all product imagery used on the site (or uses official distributor / publisher imagery under fair use for product listings).
- Domain `dragon.rs` is owned by the client and DNS access can be granted for migration.
- Existing customer database from the old site, if any, will be evaluated separately for migration.
- The legacy `dragon.rs` site will be archived (no automatic content migration unless explicitly requested).

---

## 3. Functional Requirements — Informational Site

### 3.1 Home Page (FR-1)

| ID | Requirement |
|---|---|
| FR-1.1 | The home page MUST present an animated hero section featuring the Dragon Games identity (logo, tagline, animated card or dragon motif). |
| FR-1.2 | The hero MUST include a **primary CTA** ("Browse catalog" / "Pregledaj katalog") and **secondary CTA** ("Upcoming tournaments" / "Predstojeći turniri"). |
| FR-1.3 | Below the hero, the page MUST display sections (in this order, scrollable): Featured TCGs (MTG, Pokémon, Yu-Gi-Oh, Riftbound), Featured products carousel, Upcoming tournaments (next 3), Latest news (last 3 posts), Locations card (shop + club with map preview), Newsletter signup. |
| FR-1.4 | All sections MUST animate into view on scroll (fade + translate, respecting reduced motion). |
| FR-1.5 | Featured TCG cards MUST link to a filtered catalog view for that game. |
| FR-1.6 | The home page MUST load with LCP ≤ 2.5s on 3G (Moto G4 baseline). |

### 3.2 About Page (FR-2)

| ID | Requirement |
|---|---|
| FR-2.1 | Display club history (since 1994), mission, and what makes Dragon Games unique (WPN, OTS, community-driven). |
| FR-2.2 | Display team / staff (optional photos and short bios if client provides content). |
| FR-2.3 | Embed an optional video / image gallery of the club interior and past events. |
| FR-2.4 | Content MUST be admin-editable via the CMS without code changes. |

### 3.3 Locations Page (FR-3)

| ID | Requirement |
|---|---|
| FR-3.1 | Display both physical locations: Stražilovska 3 (shop) and Kralja Aleksandra 4 (club). |
| FR-3.2 | Each location MUST include: address, embedded map (OpenStreetMap or Google Maps), photo gallery, opening hours, phone, Viber link, and "Get directions" deep link. |
| FR-3.3 | Hours display MUST be timezone-aware and reflect "Open now" / "Closed" status with a live indicator. |

### 3.4 Tournament Calendar (FR-4)

| ID | Requirement |
|---|---|
| FR-4.1 | Display a public calendar of upcoming tournaments with **list view** and **calendar (month) view** toggle. |
| FR-4.2 | Each event card MUST show: title, game (MTG/YGO/PTCG/Riftbound/Other), format (e.g., Standard, Modern, Pioneer, Pauper, Commander, Prerelease, FNM), date/time, entry fee (RSD), prize info, capacity, status (open / full / cancelled). |
| FR-4.3 | Past tournaments MUST be browsable with results (optional reports). |
| FR-4.4 | Filters: by game, format, date range, status. |
| FR-4.5 | Each event MUST have a public detail page with full description, rules, prize structure, and an "Add to calendar" button (downloadable `.ics`). |
| FR-4.6 | V2: Registered members MAY RSVP to events; admin sees roster. |
| FR-4.7 | The system MUST send email notifications to admin when an inquiry / RSVP is received (V2). |

### 3.5 News / Blog (FR-5)

| ID | Requirement |
|---|---|
| FR-5.1 | Admin can create, edit, publish, schedule, unpublish, and delete news posts via a WYSIWYG editor. |
| FR-5.2 | Posts MUST support: title, slug, cover image, body (rich text with images), tags, author, publish date, draft status. |
| FR-5.3 | Public news listing with pagination and tag filtering. |
| FR-5.4 | Individual post pages with shareable URL, Open Graph metadata, and social share buttons. |
| FR-5.5 | RSS feed MUST be available at `/rss.xml`. |

### 3.6 Game Guides (FR-6)

| ID | Requirement |
|---|---|
| FR-6.1 | Dedicated landing page per supported TCG (MTG, YGO, PTCG, Riftbound), with introductory content for newcomers. |
| FR-6.2 | Each guide page MUST include: brief overview, how to start, recommended starter products (linked to catalog), tournament formats Dragon hosts for that game, FAQ section. |
| FR-6.3 | Content is admin-editable. |

### 3.7 Contact Page (FR-7)

| ID | Requirement |
|---|---|
| FR-7.1 | Display phone, Viber, email, social links, both physical addresses with maps, and a contact form. |
| FR-7.2 | Form fields: name, email, subject, message. Submissions sent to admin email + stored in DB. |
| FR-7.3 | Form MUST include anti-spam protection (Cloudflare Turnstile or hCaptcha, invisible if possible). |

### 3.8 Newsletter (FR-8)

| ID | Requirement |
|---|---|
| FR-8.1 | Newsletter signup with email-only (no name required). |
| FR-8.2 | Double opt-in confirmation email. |
| FR-8.3 | Subscribers stored in DB, exportable to CSV by admin. |
| FR-8.4 | One-click unsubscribe link in every newsletter email (GDPR / ZZPL requirement). |
| FR-8.5 | V1.5+: Integrate with email provider (Resend / Mailgun / Brevo) for sending campaigns. V1 may stop at collection. |

---

## 4. Functional Requirements — E-Commerce (Inquiry-Based, No Payments)

### 4.1 Catalog Browsing (FR-9)

| ID | Requirement |
|---|---|
| FR-9.1 | The catalog MUST be browsable without authentication. |
| FR-9.2 | Top-level navigation reflects the category tree (e.g., TCG → MTG → Booster Packs / Decks / Accessories / etc.). |
| FR-9.3 | Each product listing card MUST display: image, name, price (RSD primary, EUR optional), stock badge (In stock / Low stock / Out of stock / Pre-order), and category tag. |
| FR-9.4 | Listings MUST support pagination (page-based or infinite scroll, 24 items per page default). |
| FR-9.5 | Filters MUST include: category (hierarchical), price range, stock status, language (for cards), edition / set (if attribute exists), tags. Filter state MUST be reflected in the URL (shareable). |
| FR-9.6 | Sort options: newest, price asc, price desc, name A-Z, popularity (admin-pinned). |

### 4.2 Search (FR-10)

| ID | Requirement |
|---|---|
| FR-10.1 | Global search bar in the header MUST search across product names, descriptions, SKUs, and category names. |
| FR-10.2 | Search results page MUST show matching products with the same filters as the catalog. |
| FR-10.3 | Search MUST be diacritic-insensitive for Serbian Latin (e.g., "savršen" matches "savrsen"). |
| FR-10.4 | Search MUST be typo-tolerant for query length ≥ 4 (Postgres trigram or MeiliSearch). |
| FR-10.5 | Empty / no-results state MUST suggest popular categories or featured products. |

### 4.3 Product Detail Page (FR-11)

| ID | Requirement |
|---|---|
| FR-11.1 | Display gallery (≥ 1 image, supports up to 6), name, price (RSD + optional EUR), stock status, SKU, full description (rich text), attributes (language, edition, set, condition, etc.), category breadcrumb, related products. |
| FR-11.2 | "Add to cart" button — enabled when in stock, disabled with explanation when out of stock. Allow quantity selector (1–N, where N is current stock). |
| FR-11.3 | If product has variants (e.g., language: EN/JP), variant selector affects price, stock, and image. |
| FR-11.4 | Registered members can add to **favorites** (heart icon). |
| FR-11.5 | Each product page MUST have a canonical URL, OG metadata, and structured data (Schema.org `Product`). |

### 4.4 Cart and Inquiry Checkout (FR-12)

| ID | Requirement |
|---|---|
| FR-12.1 | Cart MUST persist across sessions for registered users (server-side) and for guests (browser local storage). |
| FR-12.2 | Cart page lists items with image, name, variant, unit price, quantity selector, line subtotal, and remove button. Displays grand total in RSD. |
| FR-12.3 | "Submit inquiry" / "Pošalji upit" button leads to a checkout form (NOT a payment form). |
| FR-12.4 | Checkout form fields: full name, email, phone, **preferred fulfillment** (pickup at shop / pickup at club / delivery), **delivery address** (conditional on delivery), **preferred payment method** (cash on pickup / cash on delivery / bank transfer), order notes. |
| FR-12.5 | On submit, the system MUST: (a) create an order in DB with status `pending`, (b) send confirmation email to customer (Serbian or English depending on UI lang), (c) notify admin via email + dashboard, (d) **reserve stock** by deducting from `available_quantity` while keeping `on_hand_quantity` (so admin sees both). |
| FR-12.6 | Customer MUST receive an order reference number (e.g., `DG-2026-00123`). |
| FR-12.7 | If customer is registered, order MUST be saved in their order history. |
| FR-12.8 | Inquiry-based checkout MUST clearly state that "Final price and payment will be confirmed by Dragon Games staff via phone / email." |

### 4.5 Member Account (FR-13)

| ID | Requirement |
|---|---|
| FR-13.1 | Registration: email + password OR magic link (passwordless). Optional OAuth (Google) in V1.5. |
| FR-13.2 | Email verification required before posting (V2) or before first order confirmation (V1). |
| FR-13.3 | Profile page: name, email, phone, addresses (multiple), language preference. |
| FR-13.4 | Order history with status (`pending`, `confirmed`, `ready for pickup`, `shipped`, `completed`, `cancelled`). |
| FR-13.5 | Favorites list with quick-add-to-cart. |
| FR-13.6 | Password reset via email link. |
| FR-13.7 | Account deletion (right to erasure under ZZPL/GDPR) — soft delete with anonymization after 30-day grace period. |

---

## 5. Functional Requirements — Admin Panel

### 5.1 Authentication and RBAC (FR-14)

| ID | Requirement |
|---|---|
| FR-14.1 | Admin login MUST be separate route (`/admin`) with the same auth provider but role-gated. |
| FR-14.2 | Admin accounts MUST require **2FA** (TOTP) on login. |
| FR-14.3 | Roles: `admin` (full access), `staff` (catalog + orders only, no user / settings access), `moderator` (V2, forum only). |
| FR-14.4 | All admin actions MUST be logged in an audit table (who, when, what changed, before/after JSON diff). |
| FR-14.5 | Admin sessions MUST expire after 8 hours of inactivity. |

### 5.2 Dashboard (FR-15)

| ID | Requirement |
|---|---|
| FR-15.1 | Landing dashboard MUST show: pending orders count, low-stock items count, upcoming tournaments (next 7 days), recent contact form messages, total members, recent newsletter signups. |
| FR-15.2 | KPI tiles: total products, total in-stock value (RSD), orders this month, revenue captured (informational, based on submitted orders). |

### 5.3 Product Management (FR-16)

| ID | Requirement |
|---|---|
| FR-16.1 | Admin can **create / edit / archive** products. (Soft delete preferred — archived products remain in historical orders.) |
| FR-16.2 | Product fields: name (sr + en), slug, SKU, category, tags, price (RSD), EUR price (auto-calculated from RSD × rate, or override), cost (admin-only, for margin), stock quantity, low-stock threshold, description (sr + en, rich text), short description, attributes (key/value pairs — game, set, language, condition, edition, etc.), images (drag-drop upload, reorderable, primary image), variants (optional, with own SKU/price/stock), status (draft / published / archived), featured flag, pre-order flag. |
| FR-16.3 | Bulk CSV import for new sets / restocks. Upload CSV, map columns, preview, commit. |
| FR-16.4 | Bulk edit: select multiple products, apply price change, category change, stock adjustment, status change. |
| FR-16.5 | Image upload MUST auto-generate responsive sizes (WebP/AVIF, 320 / 640 / 1024 / 1920 widths). |
| FR-16.6 | Stock adjustments MUST be logged with reason (`sale`, `restock`, `correction`, `damage`, `return`). |

### 5.4 Category Management (FR-17)

| ID | Requirement |
|---|---|
| FR-17.1 | Categories are **hierarchical** (parent → child → grandchild). Example: `TCG → Magic: The Gathering → Booster Packs`. |
| FR-17.2 | Admin can create new top-level categories (e.g., to add a new TCG like Riftbound, Lorcana, One Piece) without developer intervention. |
| FR-17.3 | Each category has: name (sr + en), slug, parent, description, hero image, sort order, status. |
| FR-17.4 | Drag-and-drop reordering and reparenting in admin. |
| FR-17.5 | Deleting a category with assigned products MUST require reassignment or be blocked with a clear message. |

### 5.5 Order Management (FR-18)

| ID | Requirement |
|---|---|
| FR-18.1 | Order list view with filters: status, date range, fulfillment method, customer. |
| FR-18.2 | Order detail view: customer info, line items, totals, fulfillment, payment method, notes, status history. |
| FR-18.3 | Admin can update order status (`pending` → `confirmed` → `ready for pickup` / `shipped` → `completed`, or `cancelled`). Status changes trigger customer email notifications. |
| FR-18.4 | Admin can edit line items (correct quantities, remove items) before confirmation. |
| FR-18.5 | Admin can add internal notes (not visible to customer) and customer-visible notes. |
| FR-18.6 | Cancelled orders MUST restore reserved stock. |
| FR-18.7 | Export orders to CSV (for bookkeeping). |

### 5.6 Tournament Management (FR-19)

| ID | Requirement |
|---|---|
| FR-19.1 | Admin can create / edit / cancel tournaments with all event fields (see §3.4). |
| FR-19.2 | Tournament templates: admin can save common formats (e.g., "FNM Standard 600 RSD") as templates to clone quickly. |
| FR-19.3 | Admin can attach a post-event report (rich text + images) that appears on the past-events page. |
| FR-19.4 | V2: View RSVP roster, mark attendance, manage waitlist. |

### 5.7 Content Management (FR-20)

| ID | Requirement |
|---|---|
| FR-20.1 | Admin can edit static pages (About, Locations, Game Guides) via the same WYSIWYG editor as news. |
| FR-20.2 | Admin can manage hero banners on the home page (image, copy sr+en, CTA, link, schedule). |
| FR-20.3 | Admin can manage site settings: business info, currency rate (RSD ↔ EUR), opening hours, social links, contact email recipients. |

### 5.8 User Management (FR-21)

| ID | Requirement |
|---|---|
| FR-21.1 | View members list with filters: status, registration date, last login. |
| FR-21.2 | Promote / demote roles (admin only). |
| FR-21.3 | Suspend / ban accounts (for V2 forum abuse) with reason logged. |
| FR-21.4 | View per-member order history. |

### 5.9 Newsletter (FR-22)

| ID | Requirement |
|---|---|
| FR-22.1 | View subscriber list with subscription date, confirmed status, source. |
| FR-22.2 | Export to CSV. |
| FR-22.3 | V1.5+: Compose and send campaigns via integrated provider. |

---

## 6. Functional Requirements — UI / UX & Motion Design

### 6.1 Design Principles (FR-23)
The visual language MUST embody **modern 2026 design**, with the following characteristics:

| ID | Principle |
|---|---|
| FR-23.1 | **Dark-first** primary theme with an optional light theme toggle. Default theme should evoke "tavern at night" — deep neutrals, accent colors per TCG (MTG mana colors, Pokémon types, etc., subtly applied). |
| FR-23.2 | **Typography**: One bold display variable font (e.g., *Geist*, *Inter Display*, or a fantasy-styled display font for headers like *Cinzel* or *Sora*) + one neutral sans for body. Serbian Latin character support is **mandatory** (č, ć, š, ž, đ). |
| FR-23.3 | **Spacing system**: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px scale. |
| FR-23.4 | **Radius**: 8 px on cards, 12 px on hero panels, full-pill on tags. |
| FR-23.5 | **Imagery**: high-contrast, dramatic product photography. Subtle grain / film overlay optional. |
| FR-23.6 | **Iconography**: One consistent icon library (Lucide or Phosphor). |

### 6.2 Motion and Interaction (FR-24)
**Reference quality bar**: Linear (`linear.app`), Vercel (`vercel.com`), Apple product pages, Riot Games (`riotgames.com`). The site SHOULD feel "alive" without being chaotic.

| ID | Requirement |
|---|---|
| FR-24.1 | **Page transitions**: Smooth fade + slight translate-Y on route change (View Transitions API where supported, fallback to Framer Motion). |
| FR-24.2 | **Scroll reveal**: Section content fades in with a 24px translate-Y as it enters viewport. Stagger child elements where appropriate. |
| FR-24.3 | **Hero animation**: An animated hero element (e.g., subtly floating card with parallax tilt on mouse move, or a slow-rotating 3D dragon emblem via Three.js / WebGL, or a Lottie animation). MUST degrade gracefully when WebGL is unavailable. |
| FR-24.4 | **Card hover**: Catalog product cards have a subtle 3D tilt on hover (4° max) with a soft glow matching the product's game (MTG = blue/red/etc., Pokémon = yellow, etc.). |
| FR-24.5 | **Tournament countdown**: For the next upcoming event, a live countdown timer animates the digits (CSS / requestAnimationFrame). |
| FR-24.6 | **Microinteractions**: Buttons, toggles, language switch, add-to-cart all have spring-based feedback animations (~150–250ms). |
| FR-24.7 | **Loading states**: Skeleton loaders for product grids; shimmer for hero content. No blank flashes. |
| FR-24.8 | **Animation library**: Framer Motion (React) for component motion; GSAP ScrollTrigger optional for complex scroll choreography on the home page. |
| FR-24.9 | **All animations** MUST disable / simplify when `prefers-reduced-motion: reduce` is set. |
| FR-24.10 | **Animation budget**: No single page MUST exceed 60fps frame budget on mid-range mobile (target: Moto G Power / iPhone 11). |

### 6.3 Layout (FR-25)

| ID | Requirement |
|---|---|
| FR-25.1 | **Mobile-first responsive**. Breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. |
| FR-25.2 | **Header** is sticky on scroll with a subtle background blur. Contains: logo (links to home), main nav (catalog dropdown by TCG, tournaments, news, guides, contact), search, cart icon (with count badge), user menu, **language switcher (top right)**. |
| FR-25.3 | **Footer**: locations, hours, contact, social links, newsletter signup, legal links (privacy policy, terms), language switcher (mirrored). |
| FR-25.4 | **Container max-width**: 1280px with comfortable side padding. Hero / featured sections may bleed full-width. |

### 6.4 Language Switcher (FR-26)

| ID | Requirement |
|---|---|
| FR-26.1 | Top-right header element MUST show current language (`SR` / `EN`) with a toggle to switch. |
| FR-26.2 | Switching language MUST: persist in user preferences (cookie + DB for logged-in users), reload current page in selected locale, preserve scroll position where possible. |
| FR-26.3 | URLs MUST be locale-prefixed: `/sr/...` (default, optional to omit) and `/en/...`. |
| FR-26.4 | All UI strings MUST be externalized to translation files (e.g., `messages/sr.json`, `messages/en.json`) — **no hardcoded strings in components**. |
| FR-26.5 | Admin can manage translations of product names, descriptions, categories, news, and static pages via side-by-side editor. |
| FR-26.6 | If a translation is missing for content, fallback to Serbian with a subtle "Available in Serbian only" badge in EN view. |

---

## 7. Functional Requirements — Forum (V2 / Phase 2)

> This section is included in the V1 SRS as the V2 roadmap. Schema and routes SHOULD be designed in V1 to accommodate V2 without large refactor.

| ID | Requirement |
|---|---|
| FR-27.1 | Forum is access-controlled — read for all members, post for verified members only. |
| FR-27.2 | Hierarchy: **Category → Thread → Post**. Categories include: General, MTG, Yu-Gi-Oh, Pokémon, Riftbound, Other TCGs, Board Games, Tournaments, Trade & Marketplace, Off-topic. |
| FR-27.3 | Threads support: title, body (rich text + images), tags, pinned status (mod), locked status (mod), reactions (👍 ❤️ 🎉 🤔 😄). |
| FR-27.4 | Posts support: body (rich text), reply-to (threaded depth max 2), edit history, soft delete. |
| FR-27.5 | Mentions (`@username`) trigger in-app and email notifications. |
| FR-27.6 | Member profiles show: avatar, username, join date, post count, recent activity. |
| FR-27.7 | Moderation: report button on threads/posts, mod queue, ban / mute, edit / delete others' content. |
| FR-27.8 | Rate limiting: max 5 posts per minute per user. |
| FR-27.9 | Search across forum content with full-text search. |
| FR-27.10 | **Tournament integration**: a tournament page MAY have an auto-created discussion thread linked to it. |

---

## 8. Non-Functional Requirements

### 8.1 Performance (NFR-1)

| ID | Requirement | Target |
|---|---|---|
| NFR-1.1 | Largest Contentful Paint (LCP) on home page, 3G Moto G4 | ≤ 2.5s |
| NFR-1.2 | Cumulative Layout Shift (CLS) | ≤ 0.1 |
| NFR-1.3 | Interaction to Next Paint (INP) | ≤ 200ms |
| NFR-1.4 | API response (P95) under typical load | ≤ 400ms |
| NFR-1.5 | Product image, primary, served as AVIF or WebP, max | ≤ 120 KB at 1024px |
| NFR-1.6 | Concurrent users supported without degradation | ≥ 200 |

### 8.2 Security (NFR-2)
Aligned with OWASP ASVS 4.0 Level 2 baseline.

| ID | Requirement |
|---|---|
| NFR-2.1 | All traffic over HTTPS only (HSTS, 1y, includeSubDomains). |
| NFR-2.2 | Passwords stored with Argon2id (or bcrypt cost ≥ 12 if Argon2 unavailable). |
| NFR-2.3 | Session tokens are HttpOnly, Secure, SameSite=Lax. |
| NFR-2.4 | Admin panel requires 2FA. |
| NFR-2.5 | CSRF protection on all state-changing requests. |
| NFR-2.6 | Input validation server-side; ORM with parameterized queries. |
| NFR-2.7 | File uploads: type and size validated server-side, virus scan optional, served from sanitized paths. |
| NFR-2.8 | Rate limiting on auth endpoints (5/min/IP), contact form (3/min/IP), search (60/min/IP). |
| NFR-2.9 | Security headers: CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy minimal. |
| NFR-2.10 | Secrets stored in env vars / vault, never in code. Rotated quarterly. |
| NFR-2.11 | Dependency scanning (Dependabot / Renovate) and SAST in CI. |
| NFR-2.12 | Audit log retained 12 months. |

### 8.3 Privacy and Legal (NFR-3)

| ID | Requirement |
|---|---|
| NFR-3.1 | Cookie banner with categories (necessary / analytics / marketing) — analytics and marketing off by default. |
| NFR-3.2 | Privacy policy page in sr + en. |
| NFR-3.3 | Terms of service / Uslovi korišćenja page in sr + en. |
| NFR-3.4 | Data export (member's data on request, JSON). |
| NFR-3.5 | Data deletion (right to erasure) — workflow as in FR-13.7. |
| NFR-3.6 | Newsletter consent stored with timestamp, IP, source. |

### 8.4 Accessibility (NFR-4)

| ID | Requirement |
|---|---|
| NFR-4.1 | WCAG 2.2 AA compliance for all public pages. |
| NFR-4.2 | Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text. |
| NFR-4.3 | All interactive elements keyboard-navigable with visible focus rings. |
| NFR-4.4 | All non-decorative images have alt text (sr + en). |
| NFR-4.5 | Form fields have associated labels and error messages programmatically tied (aria-describedby). |
| NFR-4.6 | Skip-to-content link in header. |
| NFR-4.7 | `prefers-reduced-motion` respected everywhere. |
| NFR-4.8 | Screen reader tested with NVDA + VoiceOver on critical flows (browse → cart → submit). |

### 8.5 SEO (NFR-5)

| ID | Requirement |
|---|---|
| NFR-5.1 | Server-side rendered or statically generated public pages. |
| NFR-5.2 | Sitemap generated automatically at `/sitemap.xml`, including both locales. |
| NFR-5.3 | `robots.txt` with public allowance, admin disallowed. |
| NFR-5.4 | Structured data (JSON-LD): Organization, LocalBusiness (for each location), Product, Event (for tournaments), Article (for news). |
| NFR-5.5 | Canonical tags on every page; `hreflang` for sr/en pairs. |
| NFR-5.6 | OG and Twitter Card metadata on every public page. |
| NFR-5.7 | Page titles and meta descriptions configurable per page by admin. |

### 8.6 Reliability and Availability (NFR-6)

| ID | Requirement |
|---|---|
| NFR-6.1 | Uptime target: **99.5%** monthly (≈ 3.6h downtime/month allowed). |
| NFR-6.2 | Automated daily backups of the database, 30-day retention, off-site. |
| NFR-6.3 | Restore procedure tested at least quarterly. |
| NFR-6.4 | Uptime monitoring (UptimeRobot or similar) with alerts to admin email + SMS / Viber. |
| NFR-6.5 | Error tracking via Sentry (or equivalent), with PII scrubbing. |

### 8.7 Observability (NFR-7)

| ID | Requirement |
|---|---|
| NFR-7.1 | Application logs (structured, JSON) with correlation IDs. |
| NFR-7.2 | Web analytics — privacy-friendly (Plausible / Umami / Vercel Analytics), no Google Analytics by default. |
| NFR-7.3 | Performance monitoring (Web Vitals tracked in production). |

### 8.8 Maintainability (NFR-8)

| ID | Requirement |
|---|---|
| NFR-8.1 | Codebase under version control (Git). Conventional commits, protected `main` branch. |
| NFR-8.2 | CI pipeline: lint, type-check, unit tests, build, preview deploy. |
| NFR-8.3 | Test coverage on critical paths (auth, cart, order submission, admin order management): ≥ 70% line coverage. |
| NFR-8.4 | README + ADRs (architectural decision records) maintained. |
| NFR-8.5 | Onboarding doc: new dev can run locally in ≤ 30 minutes. |

### 8.9 Localization (NFR-9)

| ID | Requirement |
|---|---|
| NFR-9.1 | All static UI strings externalized to translation JSON / namespace files. |
| NFR-9.2 | Date / time formatted per locale (`sr-RS` and `en-GB`). |
| NFR-9.3 | Currency: RSD primary always; EUR as secondary toggle. |
| NFR-9.4 | Pluralization rules respected for Serbian (3 plural forms: one, few, other). |
| NFR-9.5 | Translation files version-controlled; missing keys logged but not crash. |

---

## 9. Technical Architecture (Recommendation)

> This section is a recommended stack; the client / developer may adjust. Recommendations chosen for low operational cost, fast development, and good fit for the scale (small to medium traffic, single-admin operation).

### 9.1 Stack Overview

| Layer | Recommendation | Rationale |
|---|---|---|
| **Frontend framework** | **Next.js 15+ (App Router, RSC)** with React 19 | SSR/SSG for SEO, fast DX, mature ecosystem |
| **Language** | TypeScript (strict mode) | Type safety across product/cart/order models |
| **Styling** | Tailwind CSS v4 + CSS variables for theming | Speed + consistency |
| **UI components** | shadcn/ui as base, customized | Pre-built accessible primitives |
| **Animation** | Framer Motion + optional GSAP ScrollTrigger; Three.js / R3F if 3D hero | Industry-standard, well-supported |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **i18n** | next-intl | App Router native, ICU pluralization for Serbian |
| **Auth** | Supabase Auth or Clerk | Magic link + email/password + 2FA |
| **Database** | PostgreSQL (Supabase managed) | Relational, JSON columns for flexible attributes, full-text search |
| **ORM** | Drizzle ORM or Prisma | Type-safe queries |
| **File storage** | Supabase Storage or Cloudflare R2 | Cheap, CDN-fronted |
| **Search** | Postgres FTS (V1) → MeiliSearch (V1.5 if scale demands) | Start simple |
| **Email** | Resend or Brevo | Cheap transactional + newsletter |
| **Hosting** | Vercel (frontend) + Supabase (backend) | Zero-ops, EU regions available |
| **Analytics** | Plausible or Umami (self-hosted optional) | Privacy-friendly, no GDPR consent banner needed |
| **Error tracking** | Sentry | Industry standard |
| **CI/CD** | GitHub Actions | Free for the scale |
| **Monitoring** | UptimeRobot + Vercel built-ins | Sufficient for SLA |

### 9.2 High-Level Architecture
- **Client** (browser, mobile-first) ↔ **Next.js (Vercel Edge / Node Functions)** ↔ **Postgres (Supabase)** + **Storage (Supabase Storage / R2)** + **Email (Resend)**
- Admin panel is the same Next.js app, protected routes under `/admin`.
- All API endpoints are Next.js Route Handlers, authenticated via Supabase session.
- Public pages use Server Components for SEO; cart and admin are Client Components.

### 9.3 Data Model (Logical)
Key entities (simplified — full schema in implementation phase):

- `users` (id, email, password_hash, role, locale, 2fa_secret, created_at, …)
- `addresses` (user_id, label, street, city, postal_code, country)
- `categories` (id, parent_id, name_sr, name_en, slug, sort_order, status, …)
- `products` (id, sku, name_sr, name_en, slug, category_id, description_sr, description_en, price_rsd, stock_on_hand, stock_reserved, low_stock_threshold, status, featured, …)
- `product_variants` (id, product_id, sku, attributes_json, price_rsd, stock_on_hand, …)
- `product_images` (id, product_id, url, alt_sr, alt_en, sort_order, is_primary)
- `product_attributes` (product_id, key, value_sr, value_en) — for filterable attributes
- `tags` and `product_tags`
- `orders` (id, ref_no, user_id_nullable, customer_name, email, phone, fulfillment_method, address, status, notes_internal, notes_customer, totals, created_at, …)
- `order_items` (order_id, product_id, variant_id, name_snapshot, unit_price_snapshot, qty)
- `order_status_history` (order_id, from_status, to_status, changed_by, note, changed_at)
- `tournaments` (id, name_sr, name_en, game, format, starts_at, ends_at, entry_fee_rsd, capacity, prize_description, status, …)
- `tournament_rsvps` (V2)
- `news_posts` (id, title_sr, title_en, slug, body_sr, body_en, cover_image, author_id, published_at, status, …)
- `static_pages` (key, title_sr, title_en, body_sr, body_en, updated_at)
- `settings` (key, value_json) — RSD/EUR rate, business info, hours, etc.
- `newsletter_subscribers` (email, confirmed_at, source, unsubscribe_token, …)
- `audit_log` (actor_id, action, entity_type, entity_id, before_json, after_json, created_at)
- `contact_messages` (name, email, subject, body, created_at)
- (V2) `forum_categories`, `forum_threads`, `forum_posts`, `forum_reactions`, `forum_reports`

### 9.4 Environments
- `development` (local)
- `preview` (per-PR Vercel preview deployments)
- `staging` (auto-deployed from `develop` or `main`, separate Supabase project)
- `production` (auto-deployed from `main` tagged release)

---

## 10. Project Phasing and Roadmap

### V1.0 — Informational + Catalog + Admin (MVP)
**Target duration**: ~10–14 weeks (1 engineer + part-time designer)

Milestones:
1. **M1 — Foundations** (Wk 1–2): repo, CI, design system, i18n scaffold, auth.
2. **M2 — Informational** (Wk 3–5): home, about, locations, contact, news, game guides, footer, header, language switcher, hero animation.
3. **M3 — Catalog** (Wk 6–8): categories, products, filters, search, product detail, cart.
4. **M4 — Order flow** (Wk 9–10): inquiry checkout, order emails, order history.
5. **M5 — Admin panel** (Wk 9–12, parallel): products, categories, stock, orders, tournaments, news, settings.
6. **M6 — Polish, perf, SEO, a11y, launch prep** (Wk 13–14): perf budgets, a11y audit, SEO setup, content migration, UAT, soft launch.

### V1.5 — Refinements
- Email marketing campaigns from admin
- Advanced search (MeiliSearch) if needed
- OAuth providers (Google)
- Loyalty points (lightweight)

### V2.0 — Forum and Community
**Target duration**: +6–8 weeks after V1.0 stable

Includes the full forum (§7), tournament RSVPs, member profiles, mentions, notifications, moderation tooling.

---

## 11. Acceptance Criteria (V1)

V1 is considered complete and accepted when **all** of the following are met:

1. All FR-1 to FR-26 (excluding V2 marked) implemented and demoed.
2. All NFR-1 to NFR-9 targets verified in staging.
3. Performance budget (LCP ≤ 2.5s on throttled 3G Moto G4 simulation) met on home, catalog, and product pages.
4. Accessibility: home, catalog, product, cart, checkout pass Axe DevTools with zero critical issues.
5. Lighthouse mobile score ≥ 90 for Performance, Accessibility, Best Practices, SEO on home and product pages.
6. Full admin demo: admin creates a new category, adds a product with images and variants, marks featured, sees it on home, creates a tournament, publishes news, processes an inquiry order from submitted → completed.
7. Bilingual demo: every page visited in both `sr` and `en`, all UI strings localized, no English leaks in Serbian view.
8. Security: pen-test or scripted vulnerability scan with no high/critical findings open. 2FA enforced on admin.
9. Backup + restore drill successful.
10. Content migration: legacy contact info, locations, hours migrated and verified.
11. Domain cutover: `dragon.rs` points to new platform with redirects from key legacy URLs if any exist.

---

## 12. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Admin (non-technical) struggles with the panel | Medium | High | Invest in UX of admin (drag-drop, inline help, friendly error messages); user-test with the owner before launch; record short Loom walkthroughs |
| Catalog data is messy / missing images | High | Medium | Provide CSV template + image upload helper early; allow "draft" products visible only to admin |
| Animation-heavy pages hurt performance on mobile | Medium | Medium | Performance budget enforced in CI; reduced-motion fallback; lazy-load heavy hero |
| Translation drift (SR / EN out of sync) | High | Low | Build admin translation editor with "missing translations" report; fallback to SR for EN gaps |
| Stock counts go stale (offline sales in shop not reflected online) | Very High | High | V1: simple "ask admin to update". V1.5: investigate POS integration if Dragon uses one. Mark online stock as "indicative; final stock confirmed on inquiry" in the inquiry note |
| Scope creep into singles marketplace | Medium | High | Explicitly out of scope in §1.2; revisit after V2 |
| Forum moderation burden in V2 | Medium | Medium | Start invite-only or verified-only; auto-rate-limits; moderator role |

---

## 13. Open Questions for Client Review

These items need a decision from Dragon Games before / during implementation:

1. **Logo and brand**: Do we reuse the existing Dragon Games logo, refresh it, or design new?
2. **Photography**: Will Dragon provide product photography, or use distributor / publisher images? Who owns the rights?
3. **Delivery**: Which couriers (PostExpress, BEX, AKS, DExpress)? Flat rate or per-order? Free above threshold?
4. **Returns / refunds**: V1 policy needed in terms of service.
5. **Tournament prize tracking**: Manual notes only, or structured prize records?
6. **Bookkeeping export format**: Any specific format the accountant needs (Saldora etc.)?
7. **Existing customer database** on legacy site: migrate or fresh start?
8. **Email domain**: `@dragon.rs` for transactional email; deliverability setup (SPF/DKIM/DMARC) required.
9. **Cookie banner**: Confirm analytics provider choice (Plausible recommended — no consent banner needed for analytics-only).
10. **Forum scope (V2)**: Is the marketplace category in scope, or kept off-platform on Discord / Facebook?

---

## 14. Appendix A — Sitemap (V1)

```
/                                           Home
/sr  /en                                    Locale roots
/katalog | /catalog                         Catalog root
/katalog/[kategorija]                       Category page (n-level)
/proizvod/[slug] | /product/[slug]          Product detail
/korpa | /cart                              Cart
/upit | /inquiry                            Inquiry checkout
/turniri | /tournaments                     Tournament calendar
/turniri/[slug]                             Tournament detail
/vesti | /news                              News listing
/vesti/[slug]                               News post
/vodici | /guides                           Guides hub
/vodici/mtg | /yu-gi-oh | /pokemon | /riftbound
/o-nama | /about                            About
/lokacije | /locations                      Locations
/kontakt | /contact                         Contact
/prijava | /login
/registracija | /register
/nalog | /account                           Member dashboard
/nalog/porudzbine | /account/orders
/nalog/omiljeno | /account/favorites
/pravila-privatnosti | /privacy
/uslovi-koriscenja | /terms
/admin                                      Admin root (gated)
/admin/dashboard
/admin/proizvodi | /admin/products
/admin/kategorije | /admin/categories
/admin/porudzbine | /admin/orders
/admin/turniri | /admin/tournaments
/admin/vesti | /admin/news
/admin/sadrzaj | /admin/content
/admin/korisnici | /admin/users
/admin/newsletter
/admin/podesavanja | /admin/settings
/admin/audit-log
```

## 15. Appendix B — User Journeys (V1)

### B.1 First-time visitor browsing for a Pokémon booster box
1. Lands on `/` via Google.
2. Hero CTA "Pregledaj katalog" → `/katalog`.
3. Filters: TCG → Pokémon → Booster Box.
4. Clicks product → reads detail, sees "In stock — 4 left".
5. Adds to cart (1 unit). Cart drawer animates in.
6. Clicks "Submit inquiry / Pošalji upit".
7. Fills checkout form (name, email, phone, "pickup at shop", note: "Coming Saturday").
8. Submits. Sees confirmation page with order ref `DG-2026-00057`.
9. Receives email confirmation in Serbian.
10. Admin sees pending order in dashboard, calls customer to confirm.

### B.2 Returning member finding their next tournament
1. Logs in via magic link.
2. Goes to `/turniri`, filters: Game = MTG, Format = Pioneer.
3. Sees "FNM Pioneer — Petak 22.5.2026 19:00, 600 RSD".
4. Clicks → reads detail → "Add to calendar" (.ics download).
5. (V2) RSVPs; admin sees on roster.

### B.3 Admin restocking after a shipment
1. Logs in to `/admin`, passes 2FA.
2. Goes to Products → filters by category "Magic: The Gathering / Booster Packs".
3. Selects 4 products, "Bulk edit" → adjusts stock with reason `restock`.
4. Uploads new product (new set release) via single form OR uploads CSV with new SKUs.
5. Sets featured on the new set's display box.
6. Publishes a news post: "Stigao je novi set!" with image, schedules for release day.

---

## 16. Appendix C — Sample Wireframe Notes (Non-Binding)

> Wireframes will be produced in a separate design phase. The following are textual hints for the design team.

- **Header**: Logo left, primary nav center (collapses to hamburger < md), right cluster `[Search icon] [Cart with badge] [User icon] [SR ▾]`. Sticky with `backdrop-blur` after 80px scroll.
- **Home hero**: Full-bleed, ~80vh on desktop, ~70vh mobile. Animated background (subtle particle field or floating cards). Headline (Serbian by default), subhead, two CTAs. Scroll indicator chevron.
- **Catalog grid**: Sidebar filters on `lg+`, top-drawer filters on mobile. Product card: image 4:3 with rounded top, name 2-line clamp, price prominent, stock badge top-right, hover tilt + glow.
- **Product detail**: Two columns desktop (gallery left, info right), single column mobile. Sticky add-to-cart on mobile.
- **Tournament page**: Toggle list / calendar at top. Event card has color-coded game badge (MTG = colored mana pip, YGO = purple, PTCG = yellow, Riftbound = teal).
- **Admin**: Left sidebar nav. Top breadcrumb. Tables with sticky header, inline edit where possible. Toasts for success/error.

---

*End of SRS v1.0 Draft.*

*Prepared for Stefan / Dragon Games — May 2026.*
