import { z } from 'zod'
import { ALLERGENS } from '@/content/types'

/** 'HH:MM', 24 hour. */
const time = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'invalidTime')

/**
 * Accepts '34', '34.50' and '34,50', because an Italian owner will type the
 * comma. Returns cents so money never becomes a float.
 */
const optionalPriceCents = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))
  .refine((value) => value === null || /^\d{1,6}([.,]\d{1,2})?$/.test(value), 'invalidPrice')
  .transform((value) => (value === null ? null : Math.round(Number(value.replace(',', '.')) * 100)))

const requiredPriceCents = optionalPriceCents.refine((value) => value !== null, 'required')

const localizedRequired = z.string().trim().min(1, 'required').max(300)
const localizedOptional = z.string().trim().max(2000).default('')

export const dishSchema = z.object({
  id: z.uuid(),
  nameIt: localizedRequired,
  nameEn: localizedRequired,
  descriptionIt: localizedOptional,
  descriptionEn: localizedOptional,
  priceCents: optionalPriceCents,
  allergens: z.array(z.enum(ALLERGENS)).default([]),
  signature: z.boolean().default(false),
  visible: z.boolean().default(true),
})

export const sectionSchema = z.object({
  id: z.uuid(),
  titleIt: localizedRequired,
  titleEn: localizedRequired,
})

export const tastingSchema = z.object({
  id: z.uuid(),
  nameIt: localizedRequired,
  nameEn: localizedRequired,
  descriptionIt: localizedOptional,
  descriptionEn: localizedOptional,
  courses: z.coerce.number().int().min(0).max(40),
  priceCents: requiredPriceCents,
  pairingPriceCents: optionalPriceCents,
  visible: z.boolean().default(true),
})

export const noteSchema = z.object({
  id: z.uuid(),
  textIt: localizedRequired.max(2000),
  textEn: localizedRequired.max(2000),
})

export const serviceSchema = z.object({
  id: z.uuid(),
  opensAt: time,
  closesAt: time,
  labelIt: localizedRequired,
  labelEn: localizedRequired,
})

export const closureSchema = z
  .object({
    id: z.uuid(),
    startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'required'),
    endsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'required'),
    reasonIt: localizedRequired,
    reasonEn: localizedRequired,
  })
  .refine((value) => value.endsOn >= value.startsOn, { message: 'invalidRange', path: ['endsOn'] })
