# InkSpills

A responsive buy-or-rent ebook store built from the XD design in `design/InkSpills_UI_Revamp_2026.xd`.
The full plan is in `docs/PLAN.md`. Read the relevant sections before starting each step, and follow its schema, routes and flows.

## Current release: v1.0 demo
- Every feature works end to end, but payments use Stripe TEST MODE only. Never add live keys.
- Show the demo banner on every page: "Demo store. Payments use Stripe test mode; no real charges."
- Sign in with Apple, live payments, Supabase Pro and a custom domain are v2.0 (PLAN.md section 12). Do not build them.

## Phases
- Phase 0 (setup) is done by Harin. Do not re-initialise the project.
- Phase 1, Pages and UI: steps 1a, 1b, 1c, 1d. Pages read from sample-data services in `src/app/data/sample/`.
- Phase 2, Functionality: steps 2a, 2b, 2c. Swap in `src/app/data/supabase/` services with the SAME interfaces; pages should barely change.
- Phase 3, Testing: end-to-end, responsive, accessibility, the PLAN.md section 11 checklist.
- Do one step per session. Show a plan before writing code. Each step ships its own unit tests and ends with tests passing and a short summary.
- Never run git commit or git push. Leave all changes uncommitted; I review and commit them myself.

## Stack (decided)
- Angular 22: standalone components, signals, zoneless, SSR with hydration, per-route render modes, Signal Forms, Angular Aria
- Styling: SCSS plus CSS custom properties in `src/styles/tokens.scss`. No UI kit.
- Supabase: Postgres with RLS on every table, Auth (email and Google), Storage (public `covers`, private `ebooks`), Cron
- Server logic: Supabase Edge Functions (Deno, TypeScript). No Express.
- Payments: Stripe Payment Element, test mode, CAD
- Email: Resend, called only from Edge Functions
- Hosting: Netlify (`@netlify/angular-runtime`, Node 22.12+), CI on GitHub Actions
- Tests: Vitest (unit and component), Playwright (end to end)

## Product rules
- Every book is an ebook: no shipping, stock or returns. Buying gives lasting access; renting gives access until `rentals.ends_at`.
- Rentals last 1 to 4 weeks. Reminder email 2 days before the end. Extending adds weeks. Buying a rented book takes the rent already paid off the price, never below zero. A rental cancelled within 24 hours gets a full refund.
- Ebook copy: "Read instantly in your browser" (not "Ships in 2 days"), "Access until <date>" (not "Due back"). No shipping address at checkout.
- Blue (#2176FF fill, #1A5FD6 text) means buy. Red (#FF0202 fill, #D60000 text) means rent and countdowns. Gold (#FDCA40) is for ratings only.
- Fonts: Newsreader for headings and long-form text, Inter for the interface. The logo is an SVG.

## Engineering rules
- Extract colours, text and images from the XD file ONCE (step 1a) into project files. After that, never unpack the XD file again.
- Store money as integer cents. The server re-prices every order; browser totals are display only.
- Orders, purchases and rentals are written only by Edge Functions with the secret key, after Stripe confirms payment.
- The Stripe webhook verifies its signature and is idempotent (`processed_events`), so the same event never creates two orders.
- Ebook files are served only through `open-book` as short-lived signed URLs, to readers with a purchase or an active rental.
- Never put secrets in the Angular build. They live in Supabase function secrets and Netlify environment variables.
- Every database change is a Supabase CLI migration in `supabase/migrations`. Seed data goes in `supabase/seed.sql`, with public-domain EPUBs for the demo.
- Pricing, tax and rental rules live in `supabase/functions/_shared/` and are unit-tested.
- Layouts must work at 375, 768, 1024 and 1440 px. Desktop matches the XD artboards; tablet and mobile follow PLAN.md section 4.
- Keep changes small and focused; do not refactor code outside the current step.

## Scope rules
- Do only what the current step's prompt lists. If something else seems needed, ask first and wait.
- No new dependencies, files, folders or docs beyond the step without asking first.
- Do not refactor, rename or restyle code outside the current step.
- Do not start subagents unless I ask.
- While working, run only the tests for what you changed; run the full test suite and build once at the end.
- Ask at most one round of questions per step, and keep the final summary short: what changed, what's left, decisions needed.
- If the same error, failing test or build problem survives two fix attempts, stop. Explain the root cause you suspect, what you tried, and the options, then wait for me.
- Never change or delete a test, weaken a type, or add `any` or a ts-ignore just to make a failure go away.
- If a command hangs or a task is taking far longer than the step should, stop and tell me instead of retrying.

## Skills
- Apply the andrej-karpathy-skills:karpathy-guidelines skill on every coding step.
- Use any other skill only when I name it in the prompt, or when it clearly fits the current step and you tell me which one you are using.
- Do not run process-heavy skills (brainstorming, multi-agent planning, subagent-driven development, superpowers) for this project; docs/PLAN.md and the step prompts are already the plan.
- Do not use the frontend-design skill; match the XD design exactly instead of inventing new styles.
