import { useTranslations } from 'next-intl'
import { ActionButton } from './action-button'
import { BilingualField, Card, EditorShell, Field } from './fields'
import { createService, deleteClosure, deleteService, saveClosure, saveService } from '../actions'
import type { AdminClosure, AdminService } from '../queries'
import type { Weekday } from '@/content/types'

/** Monday first, matching the public site. */
const WEEK_ORDER: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 0]

export function WeekEditor({ services }: { services: AdminService[] }) {
  const t = useTranslations('dashboard.hours')
  const days = useTranslations('days')

  return (
    <div className="flex flex-col gap-4">
      {WEEK_ORDER.map((day) => {
        const forDay = services.filter((service) => service.weekday === day)

        return (
          <Card key={day} className="flex flex-col gap-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="t-display-s">{days(String(day))}</h3>
              {forDay.length === 0 ? <span className="t-caption text-ottone">{t('closed')}</span> : null}
            </div>

            {forDay.map((service) => (
              <ServiceEditor key={service.id} service={service} />
            ))}

            <div className="border-t hairline pt-4">
              <ActionButton action={createService.bind(null, day)} tone="outline">
                {t('addService')}
              </ActionButton>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function ServiceEditor({ service }: { service: AdminService }) {
  const t = useTranslations('dashboard.hours')
  const f = useTranslations('dashboard.form')

  return (
    <div className="hairline border-t pt-5">
      <EditorShell action={saveService} id={service.id}>
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('opensAt')}>
              <input name="opensAt" defaultValue={service.opensAt} placeholder="19:30" className="field-input" />
            </Field>
            <Field label={t('closesAt')}>
              <input name="closesAt" defaultValue={service.closesAt} placeholder="22:00" className="field-input" />
            </Field>
          </div>

          <BilingualField
            label={t('serviceLabel')}
            italianLabel={f('italian')}
            englishLabel={f('english')}
            nameIt="labelIt"
            nameEn="labelEn"
            defaultValueIt={service.labelIt}
            defaultValueEn={service.labelEn}
            required
          />
        </div>
      </EditorShell>

      <div className="mt-4">
        <ActionButton action={deleteService.bind(null, service.id)} confirm={f('deleteConfirm')} tone="danger">
          {f('delete')}
        </ActionButton>
      </div>
    </div>
  )
}

export function ClosureEditor({ closure }: { closure: AdminClosure }) {
  const t = useTranslations('dashboard.hours')
  const f = useTranslations('dashboard.form')

  return (
    <Card className="flex flex-col gap-5">
      <EditorShell action={saveClosure} id={closure.id}>
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('from')}>
              <input type="date" name="startsOn" defaultValue={closure.startsOn} className="field-input" />
            </Field>
            <Field label={t('to')}>
              <input type="date" name="endsOn" defaultValue={closure.endsOn} className="field-input" />
            </Field>
          </div>

          <BilingualField
            label={t('reason')}
            italianLabel={f('italian')}
            englishLabel={f('english')}
            nameIt="reasonIt"
            nameEn="reasonEn"
            defaultValueIt={closure.reasonIt}
            defaultValueEn={closure.reasonEn}
            required
          />
        </div>
      </EditorShell>

      <div className="border-t hairline pt-4">
        <ActionButton action={deleteClosure.bind(null, closure.id)} confirm={f('deleteConfirm')} tone="danger">
          {f('delete')}
        </ActionButton>
      </div>
    </Card>
  )
}
