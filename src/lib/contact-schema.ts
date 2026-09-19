import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(10).max(4000),
  locale: z.enum(['it', 'en']).default('it'),
  /** Honeypot. Rendered off-screen, so a real visitor never fills it in. */
  company: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
