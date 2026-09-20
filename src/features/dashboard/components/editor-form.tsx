'use client'

import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { ActionState } from '../actions'
import { cn } from '@/lib/cn'

const KNOWN_ERRORS = ['required', 'invalidPrice', 'invalidTime', 'invalidRange'] as const
type KnownError = (typeof KNOWN_ERRORS)[number]

function isKnownError(value: string): value is KnownError {
  return (KNOWN_ERRORS as readonly string[]).includes(value)
}

function SaveBar({ state }: { state: ActionState }) {
  const t = useTranslations('dashboard.form')
  const { pending } = useFormStatus()

  return (
    <div className="mt-5 flex flex-wrap items-center gap-4">
      <button
        type="submit"
        disabled={pending}
        className="t-caption border border-ottone/45 px-5 py-2.5 transition-colors duration-300 hover:border-inchiostro hover:bg-inchiostro hover:text-gesso disabled:opacity-40"
      >
        {pending ? t('saving') : t('save')}
      </button>

      {!pending && state.status === 'ok' ? <span className="t-caption text-ottone">{t('saved')}</span> : null}

      {!pending && state.status === 'error' ? (
        <span className="t-caption text-ottone">
          {isKnownError(state.message) ? t(state.message) : t('required')}
        </span>
      ) : null}
    </div>
  )
}

/**
 * Wraps one entity's fields with its save action.
 *
 * The fields themselves stay server-rendered and are passed in as children, so
 * this is the only client component in the editor and it holds nothing but the
 * pending and result state.
 */
export function EditorForm({
  action,
  className,
  children,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>
  className?: string
  children: React.ReactNode
}) {
  const [state, formAction] = useActionState(action, { status: 'idle' } as ActionState)

  return (
    <form action={formAction} className={cn(className)}>
      {children}
      <SaveBar state={state} />
    </form>
  )
}
