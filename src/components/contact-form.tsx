'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState, type FormEvent } from 'react'
import { Reveal } from './reveal'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type FieldName = 'name' | 'email' | 'subject' | 'message'

const FIELDS: readonly FieldName[] = ['name', 'email', 'subject', 'message']

export function ContactForm({ restaurantEmail }: { restaurantEmail: string }) {
  const t = useTranslations('contact')
  const locale = useLocale() as Locale

  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})

  function validate(values: Record<FieldName, string>) {
    const next: Partial<Record<FieldName, string>> = {}
    if (!values.name.trim()) next.name = t('errors.name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = t('errors.email')
    if (!values.subject.trim()) next.subject = t('errors.subject')
    if (values.message.trim().length < 10) next.message = t('errors.message')
    return next
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const values: Record<FieldName, string> = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      subject: String(data.get('subject') ?? ''),
      message: String(data.get('message') ?? ''),
    }

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, locale, company: String(data.get('company') ?? '') }),
      })

      if (response.status === 429) {
        setStatus('error')
        setErrors({ message: t('errors.rate') })
        return
      }

      if (!response.ok) {
        setStatus('error')
        return
      }

      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <Reveal variant="fade" className="hairline border-t pt-10">
        <p className="t-display-s">{t('successTitle')}</p>
        <p className="t-body text-cenere mt-3 max-w-sm">{t('successBody')}</p>
      </Reveal>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col">
      {FIELDS.map((field) => {
        const isMessage = field === 'message'
        const error = errors[field]

        return (
          <label key={field} className="group hairline border-t py-6 last:border-b-0">
            <span className="t-caption text-cenere block">{t(field)}</span>

            {isMessage ? (
              <textarea
                name={field}
                rows={5}
                aria-invalid={error ? true : undefined}
                className={cn(
                  't-body placeholder:text-cenere/40 mt-3 w-full resize-none bg-transparent outline-none',
                  error && 'text-ottone',
                )}
              />
            ) : (
              <input
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                autoComplete={field === 'email' ? 'email' : field === 'name' ? 'name' : 'off'}
                aria-invalid={error ? true : undefined}
                className={cn(
                  't-body placeholder:text-cenere/40 mt-3 w-full bg-transparent outline-none',
                  error && 'text-ottone',
                )}
              />
            )}

            {error ? <span className="t-caption text-ottone mt-2 block">{error}</span> : null}
          </label>
        )
      })}

      {/* Honeypot. Off-screen rather than display:none, which some bots detect. */}
      <div aria-hidden className="absolute top-auto left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="hairline mt-10 flex flex-wrap items-center gap-8 border-t pt-10">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="t-caption border-ottone/45 hover:border-inchiostro hover:bg-inchiostro hover:text-gesso border px-7 py-4 transition-colors duration-500 disabled:opacity-40"
        >
          {status === 'sending' ? t('sending') : t('send')}
        </button>

        {status === 'error' ? (
          <p className="t-caption text-ottone max-w-xs">
            {t('errorTitle')}. {t('errorBody', { email: restaurantEmail })}
          </p>
        ) : null}
      </div>
    </form>
  )
}
