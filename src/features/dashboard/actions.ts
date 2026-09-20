'use server'

import { and, asc, eq, gt, lt, sql } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { ZodType } from 'zod'
import { requireOwner } from '@/auth/guard'
import { CACHE_TAGS } from '@/content'
import { getDb } from '@/db/client'
import * as table from '@/db/schema'
import { closureSchema, dishSchema, noteSchema, sectionSchema, serviceSchema, tastingSchema } from './schema'

/**
 * Every write in the dashboard goes through this file.
 *
 * Each action re-checks the owner session rather than trusting that the layout
 * gate ran: a server action is a public HTTP endpoint, and the only thing
 * standing between it and the open internet is the check on its first line.
 */

export type ActionState =
  | { status: 'idle' }
  | { status: 'ok' }
  /** `field` is a message key under `dashboard.form`, resolved in the client. */
  | { status: 'error'; field?: string; message: string }

function checked(form: FormData, name: string): boolean {
  return form.get(name) === 'on' || form.get(name) === 'true'
}

function parse<T>(schema: ZodType<T>, input: unknown): { ok: true; data: T } | { ok: false; state: ActionState } {
  const result = schema.safeParse(input)
  if (result.success) return { ok: true, data: result.data }

  const issue = result.error.issues[0]
  return {
    ok: false,
    state: { status: 'error', field: issue?.path.join('.'), message: issue?.message ?? 'required' },
  }
}

/** Both editors live under /dashboard, and both feed the public pages. */
function revalidateMenu() {
  revalidateTag(CACHE_TAGS.menu)
  revalidatePath('/dashboard/menu')
}

function revalidateHours() {
  revalidateTag(CACHE_TAGS.hours)
  revalidatePath('/dashboard/hours')
}

async function nextPosition(tableRef: typeof table.dishes | typeof table.menuSections | typeof table.tastingMenus | typeof table.menuNotes, where?: ReturnType<typeof eq>) {
  const db = getDb()
  const [row] = await db
    .select({ max: sql<number | null>`max(${tableRef.position})` })
    .from(tableRef)
    .where(where)
  return (row?.max ?? -1) + 1
}

/* -------------------------------------------------------------------------- */
/* Dishes                                                                      */
/* -------------------------------------------------------------------------- */

export async function saveDish(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireOwner()

  const parsed = parse(dishSchema, {
    id: form.get('id'),
    nameIt: form.get('nameIt'),
    nameEn: form.get('nameEn'),
    descriptionIt: form.get('descriptionIt') ?? '',
    descriptionEn: form.get('descriptionEn') ?? '',
    priceCents: form.get('price') ?? '',
    allergens: form.getAll('allergens'),
    signature: checked(form, 'signature'),
    visible: checked(form, 'visible'),
  })
  if (!parsed.ok) return parsed.state

  const { id, ...values } = parsed.data
  await getDb()
    .update(table.dishes)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(table.dishes.id, id))

  revalidateMenu()
  return { status: 'ok' }
}

export async function createDish(sectionId: string): Promise<void> {
  await requireOwner()
  await getDb()
    .insert(table.dishes)
    .values({
      sectionId,
      nameIt: '',
      nameEn: '',
      visible: false,
      position: await nextPosition(table.dishes, eq(table.dishes.sectionId, sectionId)),
    })
  revalidateMenu()
}

export async function deleteDish(id: string): Promise<void> {
  await requireOwner()
  await getDb().delete(table.dishes).where(eq(table.dishes.id, id))
  revalidateMenu()
}

export async function moveDish(id: string, direction: 'up' | 'down'): Promise<void> {
  await requireOwner()
  const db = getDb()

  const [current] = await db.select().from(table.dishes).where(eq(table.dishes.id, id))
  if (!current) return

  // The neighbour is the nearest row in the same section on the chosen side.
  const [neighbour] = await db
    .select()
    .from(table.dishes)
    .where(
      and(
        eq(table.dishes.sectionId, current.sectionId),
        direction === 'up'
          ? lt(table.dishes.position, current.position)
          : gt(table.dishes.position, current.position),
      ),
    )
    .orderBy(direction === 'up' ? sql`position desc` : asc(table.dishes.position))
    .limit(1)

  if (!neighbour) return

  await db.transaction(async (tx) => {
    await tx.update(table.dishes).set({ position: neighbour.position }).where(eq(table.dishes.id, current.id))
    await tx.update(table.dishes).set({ position: current.position }).where(eq(table.dishes.id, neighbour.id))
  })

  revalidateMenu()
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                    */
/* -------------------------------------------------------------------------- */

export async function saveSection(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireOwner()

  const parsed = parse(sectionSchema, {
    id: form.get('id'),
    titleIt: form.get('titleIt'),
    titleEn: form.get('titleEn'),
  })
  if (!parsed.ok) return parsed.state

  const { id, ...values } = parsed.data
  await getDb()
    .update(table.menuSections)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(table.menuSections.id, id))

  revalidateMenu()
  return { status: 'ok' }
}

export async function createSection(): Promise<void> {
  await requireOwner()
  await getDb()
    .insert(table.menuSections)
    .values({
      // The slug only has to be unique and stable; the owner never sees it.
      slug: `sezione-${Date.now().toString(36)}`,
      titleIt: '',
      titleEn: '',
      position: await nextPosition(table.menuSections),
    })
  revalidateMenu()
}

export async function deleteSection(id: string): Promise<void> {
  await requireOwner()
  // Dishes cascade: see the foreign key in src/db/schema/menu.ts.
  await getDb().delete(table.menuSections).where(eq(table.menuSections.id, id))
  revalidateMenu()
}

/* -------------------------------------------------------------------------- */
/* Tasting menus                                                               */
/* -------------------------------------------------------------------------- */

export async function saveTasting(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireOwner()

  const parsed = parse(tastingSchema, {
    id: form.get('id'),
    nameIt: form.get('nameIt'),
    nameEn: form.get('nameEn'),
    descriptionIt: form.get('descriptionIt') ?? '',
    descriptionEn: form.get('descriptionEn') ?? '',
    courses: form.get('courses') ?? 0,
    priceCents: form.get('price') ?? '',
    pairingPriceCents: form.get('pairingPrice') ?? '',
    visible: checked(form, 'visible'),
  })
  if (!parsed.ok) return parsed.state

  const { id, ...values } = parsed.data
  await getDb()
    .update(table.tastingMenus)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(table.tastingMenus.id, id))

  revalidateMenu()
  return { status: 'ok' }
}

export async function createTasting(): Promise<void> {
  await requireOwner()
  await getDb()
    .insert(table.tastingMenus)
    .values({
      slug: `degustazione-${Date.now().toString(36)}`,
      nameIt: '',
      nameEn: '',
      visible: false,
      position: await nextPosition(table.tastingMenus),
    })
  revalidateMenu()
}

export async function deleteTasting(id: string): Promise<void> {
  await requireOwner()
  await getDb().delete(table.tastingMenus).where(eq(table.tastingMenus.id, id))
  revalidateMenu()
}

/* -------------------------------------------------------------------------- */
/* Notes                                                                       */
/* -------------------------------------------------------------------------- */

export async function saveNote(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireOwner()

  const parsed = parse(noteSchema, {
    id: form.get('id'),
    textIt: form.get('textIt'),
    textEn: form.get('textEn'),
  })
  if (!parsed.ok) return parsed.state

  const { id, ...values } = parsed.data
  await getDb()
    .update(table.menuNotes)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(table.menuNotes.id, id))

  revalidateMenu()
  return { status: 'ok' }
}

export async function createNote(): Promise<void> {
  await requireOwner()
  await getDb()
    .insert(table.menuNotes)
    .values({ textIt: '', textEn: '', position: await nextPosition(table.menuNotes) })
  revalidateMenu()
}

export async function deleteNote(id: string): Promise<void> {
  await requireOwner()
  await getDb().delete(table.menuNotes).where(eq(table.menuNotes.id, id))
  revalidateMenu()
}

/* -------------------------------------------------------------------------- */
/* Opening hours                                                               */
/* -------------------------------------------------------------------------- */

export async function saveService(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireOwner()

  const parsed = parse(serviceSchema, {
    id: form.get('id'),
    opensAt: form.get('opensAt'),
    closesAt: form.get('closesAt'),
    labelIt: form.get('labelIt'),
    labelEn: form.get('labelEn'),
  })
  if (!parsed.ok) return parsed.state

  const { id, ...values } = parsed.data
  await getDb()
    .update(table.openingHours)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(table.openingHours.id, id))

  revalidateHours()
  return { status: 'ok' }
}

export async function createService(weekday: number): Promise<void> {
  await requireOwner()
  const db = getDb()

  const [row] = await db
    .select({ max: sql<number | null>`max(${table.openingHours.position})` })
    .from(table.openingHours)
    .where(eq(table.openingHours.weekday, weekday))

  await db.insert(table.openingHours).values({
    weekday,
    opensAt: '19:30',
    closesAt: '22:00',
    labelIt: 'Cena',
    labelEn: 'Dinner',
    position: (row?.max ?? -1) + 1,
  })

  revalidateHours()
}

export async function deleteService(id: string): Promise<void> {
  await requireOwner()
  await getDb().delete(table.openingHours).where(eq(table.openingHours.id, id))
  revalidateHours()
}

/* -------------------------------------------------------------------------- */
/* Special closures                                                            */
/* -------------------------------------------------------------------------- */

export async function saveClosure(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireOwner()

  const parsed = parse(closureSchema, {
    id: form.get('id'),
    startsOn: form.get('startsOn'),
    endsOn: form.get('endsOn'),
    reasonIt: form.get('reasonIt'),
    reasonEn: form.get('reasonEn'),
  })
  if (!parsed.ok) return parsed.state

  const { id, ...values } = parsed.data
  await getDb()
    .update(table.specialClosures)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(table.specialClosures.id, id))

  revalidateHours()
  return { status: 'ok' }
}

export async function createClosure(): Promise<void> {
  await requireOwner()
  const today = new Date().toISOString().slice(0, 10)
  await getDb()
    .insert(table.specialClosures)
    .values({ startsOn: today, endsOn: today, reasonIt: '', reasonEn: '' })
  revalidateHours()
}

export async function deleteClosure(id: string): Promise<void> {
  await requireOwner()
  await getDb().delete(table.specialClosures).where(eq(table.specialClosures.id, id))
  revalidateHours()
}
