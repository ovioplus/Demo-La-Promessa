'use client'

import { useTransition } from 'react'
import { cn } from '@/lib/cn'

/**
 * A button that runs a bound server action. Used for create, delete and
 * reorder, which carry no form data beyond the id already bound into them.
 */
export function ActionButton({
  action,
  confirm,
  tone = 'quiet',
  className,
  title,
  children,
}: {
  action: () => Promise<void>
  /** When set, the action only runs if the person confirms. */
  confirm?: string
  tone?: 'quiet' | 'danger' | 'outline'
  className?: string
  title?: string
  children: React.ReactNode
}) {
  const [pending, startTransition] = useTransition()

  const tones = {
    quiet: 'text-cenere hover:text-inchiostro',
    danger: 'text-cenere hover:text-ottone',
    outline: 'border border-ottone/45 px-5 py-2.5 hover:border-inchiostro hover:bg-inchiostro hover:text-gesso',
  }

  return (
    <button
      type="button"
      disabled={pending}
      title={title}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return
        startTransition(() => {
          void action()
        })
      }}
      className={cn(
        't-caption transition-colors duration-300 disabled:opacity-40',
        tones[tone],
        className,
      )}
    >
      {children}
    </button>
  )
}
