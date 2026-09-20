# La Promessa, read this first, every session

This is the website for **La Promessa**, a one-star restaurant in Florence, and
the first client build on what is meant to become a reusable template for other
restaurants. Treat this file and the Session Log at the bottom as the thing that
survives a deleted chat session, and keep it that way.

## What this is, and what it is not

A **completely standalone project**. Its own repo, its own Vercel project, its
own database (phase 2), its own content. It is not part of the OvioPlus
platform and it is not part of the OvioPlus marketing site.

It shares exactly one thing with OvioPlus: an outbound booking link, defined in
`src/lib/booking.ts` and nowhere else. Nothing else in this codebase knows
OvioPlus exists. Keep it that way: the moment a second file imports platform
concepts, the template stops being reusable.

Sibling repos, for reference only (local paths from here):

- `../ovioplus-platform` (GitHub `ovioplus/ovioplus-platform`), the product.
  This repo's stack, tsconfig, eslint config and CI were copied from it
  deliberately so all three can be maintained together.
- `../website` (GitHub `ovioplus/website`), the OvioPlus marketing site.

## Stack

Next.js 15 App Router, TypeScript strict (plus `noUncheckedIndexedAccess`),
Tailwind v4 (CSS-first, tokens in `src/app/globals.css`), next-intl v4, pnpm,
Vercel. react-three-fiber for one hero moment. Resend for the contact form and
for the dashboard's sign-in links. Drizzle ORM on Neon Postgres. Auth.js v5.

## Phases

- **Phase 1 (done, this is what is deployed):** the public site. Menu and hours
  are seeded content committed to the repo. No dashboard, no database, no CMS.
- **Phase 2 (built):** an owner dashboard at `/dashboard` for the menu
  (sections, tasting menus, dishes, prices, allergens) and the opening hours,
  all bilingual, backed by Postgres on Neon.

Both were built before the client review, on the owner's instruction, so the
whole thing could be shown in one pass and come back as a single round of
feedback rather than two.

## The four things to understand before changing anything

### 1. The content boundary is the whole template argument

Every page reads content through the four async accessors in
`src/content/index.ts`: `getRestaurant`, `getMenu`, `getHours`, `getGallery`.
No page and no component ever imports `src/content/menu.ts` or its siblings
directly.

Those functions are async even though they currently return objects from
memory. That is the point. In phase 2 only their bodies change, from returning
a seeded object to querying Drizzle. No page moves, no component moves, no type
moves. If you add content, add it behind an accessor.

Allergens are typed (`Allergen`, the 14 in EU Regulation 1169/2011) rather than
free text, because declaring them is a legal obligation and a `string` would let
a dashboard user silently ship a dish with none. Their human labels live in the
message files, not the content, because the vocabulary is fixed by law and must
not be per-restaurant.

### 2. The database is optional, and that is load-bearing

With `DATABASE_URL` unset, `getMenu` and `getHours` return the committed seed
files. With it set, they read Postgres and the dashboard drives them. That is
not a fallback bolted on for safety; three things depend on it:

- **CI builds with no database at all.** The workflow deliberately does not set
  `DATABASE_URL`, so a build prerenders the whole public site from the repo.
- **A fresh clone runs.** `pnpm dev` gives a complete site with no Neon account.
- **The seed files are the initial state.** `pnpm db:seed` reads those same
  files, so there is one source of truth for "what this restaurant starts as"
  and nothing is duplicated between the repo and the database.

The public accessors are wrapped in `unstable_cache` and tagged, so the public
pages stay statically rendered and are only regenerated when a dashboard save
calls `revalidateTag`. The dashboard reads through `src/features/dashboard/queries.ts`
instead, which is uncached and includes hidden rows.

### 3. Every server action re-checks the session

`src/app/[locale]/dashboard/(app)/layout.tsx` gates rendering. It does not gate
writing. A server action is a public HTTP endpoint that never passes through a
layout, so every action in `src/features/dashboard/actions.ts` begins with
`await requireOwner()`. If you add an action, that line is not optional.

Auth is resource-based rather than middleware-based, the same convention as
ovioplus-platform, which also means next-intl's middleware stays the only
middleware and there are no two to compose.

### 4. Photography is one file, and it is imported, not pathed

`src/content/images.ts` is the only place a file path appears. Everything in
`/public/images` is a placeholder under the Unsplash License, chosen to hold one
register: dark, warm, single light source, no cold blues. **The alt text
describes the placeholder, not the real dish, so it has to be rewritten when the
real photographs arrive.**

The photographs are **statically imported** rather than referenced by path
string. That is what lets Next generate the blurred placeholder and the
intrinsic dimensions at build time. Swapping is unchanged: drop a file in under
the same name and the import picks it up.

Two consequences worth knowing:

- A static import's real URL is `/_next/static/media/<name>.<hash>.jpg`, and the
  hash changes whenever the file does. Anything that needs those URLs must read
  them from the rendered markup, not build them from the filenames. See
  `scripts/warm-images.mjs`, which got this wrong once.
- `placeholder="blur"` only works for a static import. Passing it with a plain
  path and no explicit `blurDataURL` throws at render, so `ImageFrame` and
  `PageHeader` set it conditionally.

After swapping any file in `/public/images`, delete `.next/cache/images`. Next
keys its optimizer cache on the source path, so a new file at an old path serves
the old bytes and you will chase a ghost for ten minutes.

**Before any client viewing, run `pnpm warm:images`.** Next optimises on first
request, so without it the first person to open the site waits roughly a second
per photograph while the optimiser works. That person should not be the client.

## Conventions

- **No em-dashes anywhere.** Code, copy, commit messages, this file. Use colons,
  commas, parentheses. This is a hard rule from the owner.
- Commit messages are a short subject line only. No body, no trailer.
- Prettier: no semicolons, single quotes, 110 columns.
- Italian is the default locale and lives at the bare path (`/`, `/menu`).
  English is prefixed (`/en`). Slugs are localised: route internally by the
  English key (`/story`) and next-intl rewrites to `/la-storia` for Italian.
- Every route except the home page opens with a dark `notte` band
  (`src/components/page-header.tsx`). That is structural, not decorative: the
  site header is transparent until you scroll, so a dark block at the top of
  every page is what lets the header have two states instead of one per route.
- The site has exactly one button (`BookButton`). Everything else that navigates
  is a text link that grows a rule. If you are about to add a second button,
  reconsider.

## Commands

```
pnpm dev          # dev server on :3000
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint .
pnpm build        # next build

pnpm db:generate  # write a migration from the schema
pnpm db:migrate   # apply migrations (programmatic, prints real errors)
pnpm db:seed      # load the seed files; refuses a non-empty db without --force
pnpm db:studio    # drizzle studio
```

A local Postgres for development, since Docker Hub is blocked on this network
but ECR Public mirrors the official images:

```
docker run -d --name lapromessa-pg -e POSTGRES_PASSWORD=dev -e POSTGRES_USER=dev \
  -e POSTGRES_DB=lapromessa -p 55432:5432 \
  public.ecr.aws/docker/library/postgres:17-alpine
```

CI runs typecheck, lint and build on every push and PR.

## Environment

See `.env.example`. Nothing is required to build: with no environment at all the
site serves the seed content and the dashboard reports itself unconfigured.

- `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`: the contact form
  and the dashboard's sign-in links. `CONTACT_FROM_EMAIL` is an ovioplus.ai
  address because lapromessa.it is not verified in Resend yet; the visitor goes
  in reply-to. One variable to change once the domain is verified.
- `DATABASE_URL` (pooled) and `DIRECT_URL` (un-pooled, migrations only): Neon.
- `AUTH_SECRET`: `openssl rand -base64 32`.
- `OWNER_EMAILS`: comma separated allowlist for the dashboard. Empty means
  nobody gets in.

## Session Log

<!-- Newest entry first. One entry per session that changed non-trivial state or made a decision worth remembering. Keep entries short: a few lines, not a restatement of every commit. -->

### 2026-09-20 (later still), Neon connected, and a sender-address trap

Neon project created and wired (details above), migrated and seeded. Production
now reads the menu and the hours from Postgres.

While setting the Resend variables, found a bug I had written in phase 1:
`CONTACT_FROM_EMAIL` was validated with `z.string().email()`, which **rejects**
`La Promessa <no-reply@ovioplus.ai>`. That is the form Resend wants and the form
`.env.example` tells you to use. It went unnoticed because zod does not validate
`.default()` values, so the fallback worked and the failure only appeared the
moment somebody set the variable explicitly, which the deploy instructions say
to do. Both contact addresses now accept a bare address or `Name <address>`.
Six cases covered by hand, including the two rejections.

Also set `CONTACT_TO_EMAIL` in Vercel, which had never been set at all and is
required with no default: even with a working Resend key the contact form would
have returned 500.

**Still open:** `RESEND_API_KEY` is now genuinely the only missing variable.
`CONTACT_TO_EMAIL` currently points at the owner's own address so the demo
delivers somewhere real; it should become the restaurant's address at handover.

### 2026-09-20 (later), photographs felt slow

Reported as "images seem to lag". Measured rather than guessed: transfer was
never the problem (the hero is 81kB optimised, 0.33s warm). Three things were
stacking up instead.

1. **No placeholder.** Every photograph was a plain path string, so there was no
   `blurDataURL` and an image that had not arrived was an empty rectangle.
   Switched `src/content/images.ts` to static imports and turned on
   `placeholder="blur"` everywhere. Verified: nine inline base64 placeholders in
   the built gallery HTML.
2. **The reveal fired late.** The observer's `rootMargin` was
   `0px 0px -12% 0px`, which deliberately held the animation back until the
   element was well inside the viewport. Now `0px 0px 10% 0px`, so the wipe is
   already opening by the time you look at it.
3. **The wipe was long.** 1.15s clip and 1.4s inner scale, now 0.9s and 1.1s.
   Still unhurried, no longer slow. The mask and fade timings were left alone.

Also added `pnpm warm:images`, because Next optimises on first request and the
client should not be the one paying for it. **The first version of that script
was wrong** and is worth remembering: it built URLs from the filenames in
`public/images`, but static imports serve from
`/_next/static/media/<name>.<hash>.jpg`, so it warmed 66 URLs the site never
requests. It now scrapes the real URLs out of the rendered pages: 98 variants,
all twelve routes.

### 2026-09-20, phase 2: the dashboard

Built the owner dashboard at `/dashboard`, on the owner's instruction to ship
both phases before the client review so the feedback arrives once rather than
twice. Neon plus Drizzle, Auth.js v5 with emailed single-use links, and
bilingual editors for the menu and the opening hours.

**Judgment calls worth remembering:**

1. **postgres.js, not `@neondatabase/serverless`.** The divergence from
   ovioplus-platform is deliberate. One driver that speaks plain Postgres works
   against both Neon and a local container, which meant the whole database path
   could be verified locally before Neon existed; and the seed and the reorder
   actions want real multi-statement transactions, which the HTTP driver does
   not give you. At this traffic profile (public pages cached, one dashboard
   user) the serverless driver's advantage is theoretical.

2. **The database is optional.** See the section above. This is what lets CI
   build with no Postgres and a fresh clone run with no account.

3. **Money is integer cents.** `price_cents`, never a float. The editor accepts
   `34`, `34.50` and `34,50`, because an Italian owner types the comma.

4. **Allergens stay a closed union.** `text[]` typed as `Allergen[]`, validated
   by zod against the same 14-item list on every write. A dashboard must not be
   able to invent an allergen, and a legally required field must not be free
   text.

5. **Italian and English side by side, never behind a tab.** A language tab lets
   someone save a dish having filled in one language, and a half-translated menu
   is worse than an untranslated one.

6. **The owner allowlist is an env var, not a table.** A template instance is
   one restaurant, so there is no "manage users" screen to build and secure.
   The cost is real and is listed under still-open below.

7. **Sign-in never reveals who is an owner.** A non-allowlisted address gets the
   identical "check your inbox" screen and no email.

**Two things that cost time, do not reintroduce them:**

- **`export const dynamic = 'force-dynamic'` has to be on each dashboard page,
  not just their layout.** The ancestor `[locale]` segment has
  `generateStaticParams`, and the layout's setting loses to it. Without the
  per-page export the dashboard is prerendered and whatever the build saw (an
  anonymous visitor, therefore a redirect to sign-in) is baked in for everyone.
  Worth knowing: the build summary still prints these routes as `●`, which is
  misleading. Check `.next/prerender-manifest.json` for the truth, not the table.
- **A `'use server'` file may only export async functions.** Exporting a plain
  constant from `actions.ts` fails the build at "Collecting page data" with an
  error that names the page, not the file.

**Verified end to end** against a local Postgres: edit a dish price in the
dashboard, the row changes, `revalidateTag` fires, and the public menu page
renders the new price with the correct allergens. The gate returns 307 to
sign-in with no cookie, with a forged cookie, and 200 with a real session.

**Still open:**

- **Resend is still not wired to a live key.** This blocks the dashboard as well
  as the contact form: with no `RESEND_API_KEY` no sign-in link can be sent, so
  nobody can actually log in to production yet. Local testing used a session row
  inserted by hand. This is the last thing standing between the client and a
  working demo.
- **Adding a second dashboard user needs Vercel access**, because the allowlist
  is an env var. Fine for one restaurant, worth revisiting if this template is
  sold to owners who want to delegate.
- **The restaurant profile and the gallery are still files**, not database rows:
  chef name, address, phone, the photographs. Phase 2 was scoped to the menu and
  the hours. The content boundary means moving them later changes only the
  bodies of `getRestaurant` and `getGallery`.
- **No reordering for sections, tasting menus or notes.** Dishes can be moved up
  and down; the others render in insertion order.
- Everything from the phase 1 entry below that is still marked open, in
  particular the placeholder content and photography.

### 2026-09-19, phase 1 built end to end

Repo created from nothing. Public site complete and building: home, menu,
story, gallery, reservations, contact, plus a 404, bilingual IT/EN throughout,
with the menu, hours and gallery seeded in `src/content`.

**Judgment calls worth remembering:**

1. **Next 15, not 16.** `create-next-app` now scaffolds Next 16. Pinned back to
   `^15.5.20` to match `ovioplus-platform` exactly, since the stated reason for
   matching the stack is maintaining three repos together. Same for pnpm, the
   tsconfig, and the eslint flat config, all copied from that repo.

2. **`lint` is `eslint .`, not `next lint`.** The one deliberate divergence from
   the platform repo. `next lint` is deprecated and is removed in Next 16, and
   it prints a deprecation banner on every run. Same flat config, same rules.

3. **URL locales, not a cookie.** The platform picks the locale from a cookie
   with no URL prefix, which is right for an app behind a login and wrong for a
   public site that needs a distinct indexable URL per language. Also
   `localeDetection: false`: with detection on, next-intl reads Accept-Language
   and bounces an English browser from `/` to `/en`, so the Italian home page is
   never what an Italian-default site actually serves.

4. **Reservations is a page, not just a link.** Every restaurant at this level
   has a booking policy (release dates, deposit, cancellation, dietary notice).
   Stating it with some dignity before handing off to OvioPlus is more credible
   than a bare button, and it gives the phase 2 opening-hours data a natural
   home.

5. **Auth for phase 2: Auth.js v5 with an email magic link through Resend**, and
   an owner allowlist table in this project's own Neon database. Not Clerk.
   Reuses infrastructure we already have, adds no third-party bill or per-tenant
   configuration, stores no passwords, and onboarding restaurant number two is
   one database row. Decided, not yet implemented.

6. **The 3D is one moment and it is gated hard.** A struck-brass seal,
   `src/components/seal/`. The face detail is a bump map drawn on a canvas at
   runtime, so the whole thing costs zero additional network bytes: the geometry
   is a circle and a cylinder. It mounts only on desktop width, with a fine
   pointer, WebGL2, no `prefers-reduced-motion`, no save-data, and at least 4
   cores, and only after `requestIdleCallback`. Verified on a 375px reload:
   zero canvases and three.js never enters the network at all. The fallback is
   an inline SVG rather than a rendered still, so it is sharp at any size and
   cannot drift out of sync with the real thing.

**Two bugs that cost real time, do not reintroduce them:**

- **`clip-path` breaks IntersectionObserver.** The image reveal originally put
  `clip-path: inset(0 0 100%)` on the same element the observer watched. That
  collapses the element's intersection rect to zero, so it reports as never
  visible and never reveals: every photograph on the site was invisible. The
  clip now lives on an inner `.reveal-clip` node and the observer watches the
  outer one. See the comment in `globals.css`; keep the two responsibilities on
  separate nodes.
- **A cylinder cap's UVs are laid out in its local XZ plane.** Using the cap as
  the seal face delivered the monogram rotated a quarter turn. The face is now
  its own `circleGeometry`, which maps the unit square straight onto it.

**Database.** Neon project **`la-promessa`** (`muddy-cell-76186430`),
aws-eu-central-1, Postgres 18, in the `ovioplus` Neon org
(`org-twilight-frost-09251036`) but a completely separate project from
`ovioplus` (`late-lake-47546531`). Database name is Neon's default `neondb`;
the project name is what disambiguates it. `DATABASE_URL` is the `-pooler`
endpoint, `DIRECT_URL` the un-pooled one, both set in Vercel production only.
Migrated and seeded on 2026-09-20: 4 sections, 12 dishes, 3 tasting menus,
3 notes, 7 service rows, 2 closures.

Local development points at a Docker container instead, deliberately: keeping
`DIRECT_URL` in `.env.local` aimed at Neon would put `pnpm db:seed --force` one
typo away from wiping the client's content.

**Deployment.** Vercel project `la-promessa` under the `ovio-plus` team, beside
`ovioplus-platform` and `website`, connected to this GitHub repo so pushes to
`main` deploy. Live at **https://lapromessa.vercel.app**. Note the URL:
`la-promessa.vercel.app` is already taken by someone outside this account, and
Vercel's own generated name was `la-promessa-jade.vercel.app`, so the hyphen was
dropped to get something presentable. The domain is bound to the project, so it
follows future production deploys.

**Still open:**

- **Real content.** Everything in `src/content/restaurant.ts` is invented and
  marked `PLACEHOLDER`: chef name, address, phone, email, Instagram. The menu
  and hours are plausible but invented too. Needs the client's real details.
- **Real photography.** See the note on `src/content/images.ts` above.
- **Resend is not wired to a live key.** The route and the form are complete and
  validated end to end, but `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are not set
  in Vercel yet, so submitting the form in production will return a 500 and log
  `[contact] environment is not configured`.
- The rate limit on `/api/contact` is an in-memory Map, so it only holds for the
  lifetime of one serverless instance. Fine for a contact form on a
  single-restaurant site. If it ever needs to be real, `ovioplus-platform`
  already has the Upstash setup to copy.
