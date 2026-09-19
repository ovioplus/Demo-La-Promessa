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
Vercel. react-three-fiber for one hero moment. Resend for the contact form.
Drizzle and Neon arrive in phase 2 and are deliberately not installed yet.

## Phases

- **Phase 1 (done, this is what is deployed):** the public site. Menu and hours
  are seeded content committed to the repo. No dashboard, no database, no CMS.
- **Phase 2 (not started, gated on the client approving the design):** an owner
  dashboard for the menu (sections, tasting menus, dishes, prices, allergens)
  and the opening hours, all bilingual, backed by Postgres on Neon.

**Do not start phase 2 until the client has signed off on the look and feel.**

## The two things to understand before changing anything

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

### 2. Photography is one file

`src/content/images.ts` is the only place a file path appears. Everything in
`/public/images` is a placeholder under the Unsplash License, chosen to hold one
register: dark, warm, single light source, no cold blues. **The alt text
describes the placeholder, not the real dish, so it has to be rewritten when the
real photographs arrive.**

After swapping any file in `/public/images`, delete `.next/cache/images`. Next
keys its optimizer cache on the source path, so a new file at an old path serves
the old bytes and you will chase a ghost for ten minutes.

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
```

CI runs typecheck, lint and build on every push and PR.

## Environment

Only the contact form needs any environment at all; everything else is static
content and builds without it. See `.env.example`. The one that will need
changing soon is `CONTACT_FROM_EMAIL`: mail currently goes out from an
ovioplus.ai address because lapromessa.it is not verified in Resend yet, with
the visitor set as reply-to.

## Session Log

<!-- Newest entry first. One entry per session that changed non-trivial state or made a decision worth remembering. Keep entries short: a few lines, not a restatement of every commit. -->

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
