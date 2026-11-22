# InkSpills Website Build Plan

Version 1.0 (demo release), updated Nov 22, 2026

## 1. Summary

InkSpills is a responsive ebook store where readers buy books to keep or rent them by the week. It is built from the XD design `design/InkSpills_UI_Revamp_2026.xd`.

Version 1.0 is a **demo release**: every feature works end to end, but payments run in Stripe test mode and no real money moves. Live payments and the other launch items come in version 2.0.

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Angular 22: standalone components, signals, zoneless, SSR with hydration, Signal Forms, Angular Aria | Current major version; SSR makes book pages indexable by search engines |
| Styling | SCSS with CSS custom properties from the XD style guide | The design is custom; a UI kit would fight it |
| Database | Supabase Postgres with row-level security (RLS) | Relational data and per-user access rules in one place |
| Login | Supabase Auth: email and password, Google (Apple in v2.0) | Matches the Log in and Sign up screens |
| Server logic | Supabase Edge Functions (TypeScript, Deno) | Checkout, payment webhook, rental actions, ebook access, reminders |
| Scheduled jobs | Supabase Cron (pg_cron) | Daily rental reminders and expiry |
| Payments | Stripe Payment Element in **test mode** | Same code as live; going live in v2.0 is a key swap |
| Email | Resend, called from Edge Functions | Receipts and rental reminders |
| Hosting | Netlify (`@netlify/angular-runtime`, Node 22.12+) | Supports Angular 22 SSR; free plan |
| Code and CI | GitHub and GitHub Actions | Tests and deploys on every merge |
| Tests | Vitest (unit, component), Playwright (end to end) | |

No Express server. If one is ever needed (heavy admin reporting, bulk imports), the pricing, tax and rental rules live in one plain TypeScript module that any runtime can import.

## 2. Phases

| Phase | Who | What | Done when |
| --- | --- | --- | --- |
| 0 Setup | Harin | Tools, Angular app, Supabase project, Git, GitHub (see section 3) | `ng serve` runs, local Supabase runs, first commit pushed |
| 1 Pages and UI | Claude Code | Every page and component, using sample-data services | All screens match the XD at 375, 768, 1024 and 1440 px |
| 2 Functionality | Claude Code | Database, auth, real data, demo checkout, rentals, reader, reminders | A test card turns a cart into readable purchases and rentals |
| 3 Testing | Claude Code | End-to-end, responsive and accessibility checks, bug fixes | Checklist in section 11 is ticked |

Work one step per session. Every step ships its own unit tests and ends with a short summary and a commit.

**Phase 1 steps**

- 1a: Pull design tokens, colours, fonts, text and images out of the XD file into project files once. Build all shared UI components.
- 1b: Header, footer, Home, Books catalog, Book details, About us.
- 1c: Log in, Sign up, Forgot password, Cart, Checkout, Order completed.
- 1d: Account pages (Personal details, Purchased, Rented, Wishlist), Log out dialog, ebook reader screen, Help, legal placeholders, 404, empty states.

Pages read from sample-data services that have the same TypeScript interfaces as the real Supabase services. Phase 2 swaps the implementation, not the pages.

**Phase 2 steps**

- 2a: Migrations, RLS, seed data, covers in Storage; sign up, log in, Google sign-in, profile; real catalog, search and book pages.
- 2b: Cart store (guest and signed-in), save for later, promo codes, HST, Stripe test checkout, webhook, Order completed, receipt email.
- 2c: Purchased and Rented books, countdown, extend, buy with rent credit, cancel within 24 hours, ebook reader with protected access and saved progress, wishlist, reviews, reminder cron.

## 3. Phase 0: setup steps (Harin)

1. Install Node.js 22.12 or later, Git and Docker Desktop. Install the Angular CLI: `npm i -g @angular/cli@22`.
2. Create the app: `ng new inkspills --ssr --style=scss`, then `cd inkspills`.
3. Add `CLAUDE.md` to the root, the XD file at `design/InkSpills_UI_Revamp_2026.xd` and this file at `docs/PLAN.md`.
4. Install Supabase packages: `npm i @supabase/supabase-js` and `npm i -D supabase`.
5. At supabase.com create project `inkspills-staging` (Canada region if offered). Save the database password. Copy the project URL and publishable (anon) key. Never put the secret (service role) key in the Angular app.
6. Run `npx supabase init`, `npx supabase login`, `npx supabase link --project-ref <ref>`, then `npx supabase start` (Docker must be running).
7. Run `ng generate environments`. Put the local Supabase URL and key in `environment.development.ts` and the staging ones in `environment.ts`.
8. Create a private GitHub repo: `git remote add origin <url>`, `git add .`, `git commit -m "Project setup"`, `git push -u origin main`.
9. Optional now: connect the repo in Netlify, build command `npm run build`, environment variable `NODE_VERSION=22`.
10. Check: `ng serve` shows the starter page and `npx supabase status` lists the local services.

Stripe test-mode and Resend accounts are needed at step 2b.

## 4. Design reference

The XD file has 15 desktop artboards at 1440 px plus a style guide. Blue means buy and keep; red means rent and countdowns.

| Area | Artboards | Must do |
| --- | --- | --- |
| Auth | Log in, Log in with invalid email, Sign up | Email and password, Google, Apple (button hidden until v2.0), keep me signed in, inline validation, terms and rental policy consent |
| Shop | Home, Book details, Book details with added-to-cart toast, About us | Hero, genre chips, New arrivals, Recommended and Best sellers rails, buy and rent panel, reviews with rating breakdown, Readers also liked |
| Purchase | Cart, Checkout, Order completed | 3-step progress, buy or rent per item, 1 to 4 rental weeks, save for later, promo code, HST, billing address, card or mobile wallet, order summary, next steps |
| Account | Personal details, Purchased books, Rented books, Logging out | Profile and password, reminder toggle, receipts, countdown bar, extend, buy with rent credit, log out confirmation |

**Design tokens**

| Token | Value | Use |
| --- | --- | --- |
| Ink Blue | #2176FF (text #1A5FD6) | Logo, buy, primary actions |
| Spill Red | #FF0202 (text #D60000) | Logo, rent, countdowns |
| Ink | #0F1B33 | Headings, text, footer background |
| Slate | #4A5568 / #8590A3 | Body text / muted text and placeholders |
| Serif body | #2B3548 | Long-form book and author text |
| Page | #F3F6FC | Panels and inputs |
| Line | #E3E8F0 | Borders and dividers |
| Gold | #FDCA40 | Star ratings only |
| Green | #0C7A3C / #12A150 | Paid tag / discount amount |
| Footer text | #9AA6BD, #C9D2E3, #7F8BA3 | Footer copy, links, legal line |
| Headings | Newsreader 76 / 64 / 54 / 48 / 34 / 24 / 20 px | Titles, sections, card titles |
| Interface | Inter 18 / 16 / 15 / 14 / 13 / 12 / 11 px | Body, buttons, labels, tags |
| Wordmark | Goudy Bookletter 1911 stand-in | Export the logo as SVG; do not load this font |

**Screens the design implies but does not show:** Books catalog and search results, Wishlist, Forgot password and reset, Help, FAQ and Contact, Returned rentals tab, Write a review, Extend rental, receipt view, ebook reader, empty states, 404.

**Responsive rules:** desktop from 1200 px as drawn. Tablet from 768 px: two-column grids, account sidebar becomes a tab strip. Mobile below 768 px: menu button, search behind an icon, book rails as swipeable rows, login collage hidden, cart summary under the items with a sticky checkout button.

**Copy changes for ebooks:** "Ships in 2 days" becomes "Read instantly in your browser". "Due back Dec 1" becomes "Access until Dec 1". Remove "Ship to this address too" from Checkout; keep the billing address for sales tax.

**Demo banner:** a thin bar on every page: "Demo store. Payments use Stripe test mode; no real charges."

## 5. Architecture

- The browser loads pages from Netlify (SSR and prerendered) and then talks to Supabase directly for login, catalog, cart and account data. RLS decides what each user sees.
- Netlify's SSR reads the public catalog from Supabase to render Home and book pages.
- The browser calls Edge Functions for checkout, rental actions and opening ebooks.
- Stripe sends payment results to the `stripe-webhook` Edge Function. Only Edge Functions write orders, purchases and rentals.
- Supabase Cron calls `send-rental-reminders` daily. Edge Functions send email through Resend.

## 6. Edge Functions

| Function | Called by | Does |
| --- | --- | --- |
| `create-checkout` | Checkout page | Re-prices the cart from the database, applies promo, adds HST, creates a pending order and a Stripe PaymentIntent (test mode) |
| `stripe-webhook` | Stripe | Verifies signature, ignores already-processed events, marks order paid, creates purchases and rentals, clears cart, sends receipt |
| `rental-action` | Rented books page | Extends 1 to 4 weeks, or buys with rent already paid taken off |
| `cancel-rental` | Account | Full refund within 24 hours of renting |
| `open-book` | Reader | Checks for a purchase or active rental, returns a signed ebook URL that expires in minutes |
| `send-rental-reminders` | Cron, daily | Emails readers whose rental ends in 2 days, if reminders are on; marks ended rentals expired |

## 7. Database

All money is integer cents in CAD. The server re-prices every order; browser totals are display only.

| Table | Key columns | Access |
| --- | --- | --- |
| `profiles` | id (= auth user), full_name, date_of_birth, phone, rental_reminders, created_at | Owner reads and updates |
| `authors` | id, name, initials, role_line, bio | Public read |
| `genres` | id, slug, name (Poetry, Fiction, Fantasy, Self-help, Money, Food and travel, Faith, Art and design) | Public read |
| `books` | id, slug, title, author_id, genre_id, tagline, about, pages, year, publisher, category, file_format, ebook_path, buy_price_cents, rent_week_cents, cover_path, rating_avg, rating_count, staff_pick, created_at | Public read (except ebook_path) |
| `reviews` | id, book_id, user_id, rating 1-5, body, acquired (bought / rented), created_at | Public read; owner writes for a book they bought or rented |
| `cart_items` | user_id, book_id, mode (buy / rent), weeks 1-4, saved_for_later | Owner only |
| `wishlist` | user_id, book_id | Owner only |
| `orders` | id, user_id, status (pending / paid / failed / refunded), subtotal, tax, discount, total, stripe_payment_intent, billing (json), created_at | Owner reads; Edge Functions write |
| `order_items` | order_id, book_id, mode, weeks, unit_cents, line_cents | Owner reads; Edge Functions write |
| `purchases` | user_id, book_id, order_id, paid_cents, purchased_at | Owner reads; Edge Functions write |
| `rentals` | id, user_id, book_id, order_id, starts_at, ends_at, paid_cents, status (active / returned / converted / expired), reminded_at | Owner reads; Edge Functions write |
| `reading_progress` | user_id, book_id, location, percent, updated_at | Owner only |
| `promo_codes` | code, kind (percent / fixed / free week), value, min_rental_weeks, expires_at | Edge Functions only |
| `tax_rates` | province, rate (ON 13% HST) | Public read |
| `processed_events` | stripe_event_id, processed_at | Edge Functions only |
| `newsletter` | email, promos, price_drops | Anyone inserts; no browser reads |

Rules:

- RLS on every table; owner tables use `auth.uid() = user_id`.
- A trigger creates `profiles` on sign-up from the name and date of birth sent with it.
- A trigger on `reviews` keeps `books.rating_avg` and `rating_count` current.
- Storage: public bucket `covers` (WebP, about 600 px wide), private bucket `ebooks` with no browser access.
- Every change is a migration in `supabase/migrations`; `supabase/seed.sql` holds about 30 books from the design, using public-domain EPUBs (Standard Ebooks, Project Gutenberg) for the demo.

## 8. Angular structure

| Route | Screen | Rendering | Guard |
| --- | --- | --- | --- |
| `/` | Home | Prerender | |
| `/books?genre=&q=` | Catalog and search | Server | |
| `/books/:slug` | Book details | Server, with meta tags and book structured data | |
| `/about` | About us | Prerender | |
| `/login`, `/signup`, `/forgot-password`, `/auth/callback` | Auth | Browser | Signed-out only |
| `/cart` | Cart | Browser | |
| `/checkout` | Checkout | Browser | Signed in |
| `/orders/:id` | Order completed | Browser | Signed in, owner |
| `/account/details`, `/account/purchased`, `/account/rented`, `/account/wishlist` | Account | Browser | Signed in |
| `/read/:slug` | Ebook reader | Browser | Signed in, has access |
| `/help`, `/terms`, `/privacy`, `/rental-policy` | Static | Prerender | |
| `**` | 404 | Server | |

Folders:

- `src/app/core/`: Supabase client (created once, SSR-safe), `AuthStore`, guards, error handler, SEO service.
- `src/app/data/`: models, service interfaces, `sample/` implementations (Phase 1) and `supabase/` implementations (Phase 2), chosen by a provider.
- `src/app/shared/ui/`: buttons (buy, rent, secondary, dark), price pill, tag, text input with error state, checkbox, toggle, rating stars, book card, book rail, genre chips, progress stepper, countdown bar, toast, dialog, header, footer, demo banner.
- `src/app/features/`: home, catalog, book, auth, cart, checkout, orders, account, reader, static.
- `src/styles/`: `tokens.scss`, typography, breakpoints, reset.
- `supabase/functions/_shared/`: pricing, tax and rental rules, imported by Edge Functions and unit-tested.

State and forms:

- `CartStore` on signals: localStorage for guests, merged into `cart_items` at login.
- `AuthStore` wraps Supabase sessions; "Keep me signed in" picks local or session storage.
- Signal Forms for login, sign-up, checkout and profile. Angular Aria for tabs, menus and dialogs.

## 9. Key flows

**Sign up and log in**

1. Sign up sends name, date of birth, email and password to Supabase Auth; a trigger creates the profile.
2. Supabase emails a confirmation link to `/auth/callback`.
3. Google uses an OAuth redirect to the same callback.
4. Email is validated as the user types, using the error text from the invalid-email artboard.
5. Forgot password sends a reset link to a set-new-password page.

**Cart to completed order (demo payments)**

1. Each cart item is Buy or Rent; renting picks 1 to 4 weeks and shows the access-until date.
2. Checkout requires login; a guest cart merges first.
3. Checkout calls `create-checkout`, which prices everything server-side and returns a Stripe client secret.
4. The Stripe Payment Element takes a test card (4242 4242 4242 4242, any future date, any CVC).
5. Stripe calls `stripe-webhook`, which records the order, purchases and rentals (ends_at = now + weeks x 7 days), clears the cart and emails the receipt.
6. The browser waits on `/orders/:id` until the order is paid, then shows Order completed.
7. Locally, `stripe listen --forward-to` sends webhooks to the local function.

**Rental lifecycle**

1. Active: Rented books shows days left out of total days.
2. Two days before the end: reminder email, `reminded_at` set.
3. Extend: a new test payment moves `ends_at` forward.
4. Buy: price is buy price minus rent paid, never below zero; rental becomes `converted`, a purchase is added.
5. Cancel within 24 hours: full refund; rental removed.
6. End: rental becomes `expired`, moves to the Returned tab, and `open-book` refuses access. The book page offers to rent again or buy.

**Ebook reading**

1. "Start reading" or "View" opens `/read/:slug`.
2. The reader calls `open-book`, gets a short-lived signed URL and renders the EPUB with epub.js or foliate-js.
3. Font size, light and dark themes, table of contents, progress bar.
4. Progress saves to `reading_progress` every few page turns and restores on any device.
5. No download button. Full DRM is out of scope.

## 10. Hosting, environments and cost

| Environment | Frontend | Backend | Payments |
| --- | --- | --- | --- |
| Local | `ng serve` | Supabase CLI in Docker with seed data | Stripe test mode, Stripe CLI forwarding webhooks |
| Preview | Netlify deploy preview per pull request | `inkspills-staging` | Stripe test mode |
| Demo (v1.0) | Netlify, `*.netlify.app` URL | `inkspills-staging` | Stripe test mode |

CI with GitHub Actions on each pull request: lint, unit tests, build. On merge to main: `supabase db push`, `supabase functions deploy`, Netlify builds. Secrets (Stripe secret key, webhook secret, Resend key, Supabase secret key) live only in Supabase function secrets and Netlify environment variables.

v1.0 cost: $0 a month (Supabase Free, Netlify Free, Stripe test mode, Resend free tier). Note that free Supabase projects pause after 1 week of inactivity; open the demo at least weekly or restore it from the dashboard before showing it.

## 11. Phase 3 checklist

**Testing**

- [ ] Unit tests for pricing, tax, promo and rent-credit rules
- [ ] Component tests for book card, price pill, cart line, countdown bar
- [ ] Playwright: sign up, add buy and rent items, pay with a test card, read the book, see it in Purchased and Rented
- [ ] Webhook: the same Stripe event twice creates one order
- [ ] RLS: user A cannot read user B's orders, cart, rentals or progress
- [ ] Expired rental cannot open the ebook
- [ ] Every screen at 375, 768, 1024 and 1440 px

**Security**

- [ ] RLS on every table; no table open by default
- [ ] Secret keys only in Edge Functions
- [ ] Webhook signature verified before any write
- [ ] Server re-prices every order
- [ ] `ebooks` bucket has no public or browser access

**Quality**

- [ ] Keyboard paths through header, forms, dialogs and reader; visible focus
- [ ] Contrast check on #8590A3 text and red tags
- [ ] Lighthouse 90+ for performance and SEO on Home and Book details
- [ ] Sitemap, robots.txt, share images, book structured data
- [ ] Demo banner on every page

## 12. Deferred to v2.0 (live release)

- Stripe live mode: verified Stripe account, live keys, live webhook endpoint
- Sign in with Apple (needs an Apple Developer account)
- Supabase Pro (no pausing, daily backups) and a separate production project
- Custom domain and HTTPS
- Final terms, privacy, cookie and rental policy pages
- Licensed ebook catalogue and cover rights
- Tax for provinces outside Ontario (`tax_rates` or Stripe Tax)
- Error tracking (Sentry) and log alerts
- Admin screen for adding books (Supabase Studio until then)

## 13. Open questions

- [ ] Which ebook titles can v2.0 legally sell?
- [ ] Tablet and mobile artboards in XD, or follow the responsive rules in section 4?
