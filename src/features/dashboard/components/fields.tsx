import { EditorForm } from './editor-form'
import type { ActionState } from '../actions'
import { cn } from '@/lib/cn'

/**
 * One entity's form: the row id as a hidden field, the entity's own fields as
 * children, and the save button supplied by EditorForm.
 */
export function EditorShell({
  action,
  id,
  children,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>
  id: string
  children: React.ReactNode
}) {
  return (
    <EditorForm action={action}>
      <input type="hidden" name="id" value={id} />
      {children}
    </EditorForm>
  )
}

/** Label, control, optional hint. Server component: no state lives here. */
export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={cn('block', className)}>
      <span className="t-caption block text-cenere">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint ? <span className="mt-1.5 block text-[0.6875rem] leading-snug text-cenere/70">{hint}</span> : null}
    </label>
  )
}

/**
 * The Italian and the English of one field, side by side.
 *
 * Side by side rather than behind a language tab on purpose: a tab lets an
 * owner save a dish having filled in only one language, and a half-translated
 * menu is worse than an untranslated one.
 */
export function BilingualField({
  label,
  hint,
  italianLabel,
  englishLabel,
  nameIt,
  nameEn,
  defaultValueIt,
  defaultValueEn,
  multiline = false,
  required = false,
}: {
  label: string
  hint?: string
  italianLabel: string
  englishLabel: string
  nameIt: string
  nameEn: string
  defaultValueIt: string
  defaultValueEn: string
  multiline?: boolean
  required?: boolean
}) {
  const Control = multiline ? 'textarea' : 'input'

  return (
    <fieldset className="min-w-0">
      <legend className="t-caption text-cenere">{label}</legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <span className="block">
          <span className="t-caption mb-1.5 block text-ottone">{italianLabel}</span>
          <Control
            name={nameIt}
            defaultValue={defaultValueIt}
            required={required}
            rows={multiline ? 2 : undefined}
            className={cn('field-input', multiline && 'resize-y')}
          />
        </span>
        <span className="block">
          <span className="t-caption mb-1.5 block text-cenere">{englishLabel}</span>
          <Control
            name={nameEn}
            defaultValue={defaultValueEn}
            required={required}
            rows={multiline ? 2 : undefined}
            className={cn('field-input', multiline && 'resize-y')}
          />
        </span>
      </div>
      {hint ? <p className="mt-1.5 text-[0.6875rem] leading-snug text-cenere/70">{hint}</p> : null}
    </fieldset>
  )
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('hairline border bg-gesso-deep/40 p-5 md:p-6', className)}>{children}</div>
  )
}
