/// <reference types="next" />
/// <reference types="next/image-types/global" />

/**
 * These are the same two references Next writes into `next-env.d.ts`, kept here
 * as a committed file on purpose.
 *
 * `next-env.d.ts` is gitignored (Next regenerates it) and it is only written
 * during `next build`. CI runs `pnpm typecheck` before `pnpm build`, so on a
 * fresh checkout tsc had no declaration for importing a .jpg and every static
 * image import in src/content/images.ts failed with TS2307. Deleting this file
 * brings that back.
 */
