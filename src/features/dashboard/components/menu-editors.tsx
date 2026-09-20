import { useTranslations } from 'next-intl'
import { ActionButton } from './action-button'
import { BilingualField, Card, EditorShell, Field } from './fields'
import {
  createDish,
  deleteDish,
  deleteNote,
  deleteSection,
  deleteTasting,
  moveDish,
  saveDish,
  saveNote,
  saveSection,
  saveTasting,
} from '../actions'
import type { AdminDish, AdminNote, AdminSection, AdminTasting } from '../queries'
import { ALLERGENS } from '@/content/types'

/** 3400 to '34', 3450 to '34.50'. An empty price stays empty. */
function centsToInput(cents: number | null): string {
  if (cents === null) return ''
  return cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2)
}

export function DishEditor({ dish, index, count }: { dish: AdminDish; index: number; count: number }) {
  const t = useTranslations('dashboard.menu')
  const f = useTranslations('dashboard.form')
  const allergenLabel = useTranslations('allergens')
  const menuLabel = useTranslations('menu')

  const title = dish.nameIt || dish.nameEn || t('newDish')

  return (
    <details className="hairline border-t py-1 [&[open]>summary]:text-ottone">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5">
        <span className="t-display-s truncate">{title}</span>
        <span className="t-caption flex shrink-0 items-center gap-3 text-cenere">
          {!dish.visible ? <span className="text-ottone">{t('hidden')}</span> : null}
          {dish.signature ? <span>{menuLabel('signature')}</span> : null}
          <span className="tabular-nums">{centsToInput(dish.priceCents)}</span>
        </span>
      </summary>

      <div className="pb-8 pt-2">
        <EditorShell action={saveDish} id={dish.id}>
          <div className="flex flex-col gap-5">
            <BilingualField
              label={t('dishName')}
              italianLabel={f('italian')}
              englishLabel={f('english')}
              nameIt="nameIt"
              nameEn="nameEn"
              defaultValueIt={dish.nameIt}
              defaultValueEn={dish.nameEn}
              required
            />

            <BilingualField
              label={t('dishDescription')}
              italianLabel={f('italian')}
              englishLabel={f('english')}
              nameIt="descriptionIt"
              nameEn="descriptionEn"
              defaultValueIt={dish.descriptionIt}
              defaultValueEn={dish.descriptionEn}
              multiline
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t('price')} hint={t('priceHelp')}>
                <input
                  name="price"
                  inputMode="decimal"
                  defaultValue={centsToInput(dish.priceCents)}
                  placeholder="34"
                  className="field-input"
                />
              </Field>

              <div className="flex items-end gap-6 pb-1">
                <label className="t-caption flex items-center gap-2.5">
                  <input type="checkbox" name="signature" defaultChecked={dish.signature} />
                  {t('signature')}
                </label>
                <label className="t-caption flex items-center gap-2.5">
                  <input type="checkbox" name="visible" defaultChecked={dish.visible} />
                  {t('visible')}
                </label>
              </div>
            </div>

            <fieldset>
              <legend className="t-caption text-cenere">{t('allergens')}</legend>
              <p className="mt-1.5 text-[0.6875rem] leading-snug text-cenere/70">{t('allergensHelp')}</p>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {ALLERGENS.map((allergen) => (
                  <label key={allergen} className="t-caption flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="allergens"
                      value={allergen}
                      defaultChecked={dish.allergens.includes(allergen)}
                    />
                    {allergenLabel(allergen)}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </EditorShell>

        <div className="mt-5 flex items-center gap-6 border-t hairline pt-4">
          {index > 0 ? (
            <ActionButton action={moveDish.bind(null, dish.id, 'up')} title={f('moveUp')}>
              {f('moveUp')}
            </ActionButton>
          ) : null}
          {index < count - 1 ? (
            <ActionButton action={moveDish.bind(null, dish.id, 'down')} title={f('moveDown')}>
              {f('moveDown')}
            </ActionButton>
          ) : null}
          <ActionButton action={deleteDish.bind(null, dish.id)} confirm={f('deleteConfirm')} tone="danger">
            {f('delete')}
          </ActionButton>
        </div>
      </div>
    </details>
  )
}

export function SectionEditor({ section }: { section: AdminSection }) {
  const t = useTranslations('dashboard.menu')
  const f = useTranslations('dashboard.form')

  return (
    <Card className="flex flex-col gap-6">
      <EditorShell action={saveSection} id={section.id}>
        <BilingualField
          label={t('sectionTitleLabel')}
          italianLabel={f('italian')}
          englishLabel={f('english')}
          nameIt="titleIt"
          nameEn="titleEn"
          defaultValueIt={section.titleIt}
          defaultValueEn={section.titleEn}
          required
        />
      </EditorShell>

      <div>
        {section.dishes.length === 0 ? (
          <p className="t-caption border-t hairline py-5 text-cenere">{t('emptySection')}</p>
        ) : (
          section.dishes.map((dish, index) => (
            <DishEditor key={dish.id} dish={dish} index={index} count={section.dishes.length} />
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t hairline pt-5">
        <ActionButton action={createDish.bind(null, section.id)} tone="outline">
          {t('addDish')}
        </ActionButton>
        <ActionButton
          action={deleteSection.bind(null, section.id)}
          confirm={f('deleteConfirm')}
          tone="danger"
        >
          {f('delete')}
        </ActionButton>
      </div>
    </Card>
  )
}

export function TastingEditor({ tasting }: { tasting: AdminTasting }) {
  const t = useTranslations('dashboard.menu')
  const f = useTranslations('dashboard.form')

  return (
    <Card className="flex flex-col gap-5">
      <EditorShell action={saveTasting} id={tasting.id}>
        <div className="flex flex-col gap-5">
          <BilingualField
            label={t('tastingName')}
            italianLabel={f('italian')}
            englishLabel={f('english')}
            nameIt="nameIt"
            nameEn="nameEn"
            defaultValueIt={tasting.nameIt}
            defaultValueEn={tasting.nameEn}
            required
          />

          <BilingualField
            label={t('dishDescription')}
            italianLabel={f('italian')}
            englishLabel={f('english')}
            nameIt="descriptionIt"
            nameEn="descriptionEn"
            defaultValueIt={tasting.descriptionIt}
            defaultValueEn={tasting.descriptionEn}
            multiline
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label={t('courses')}>
              <input
                name="courses"
                inputMode="numeric"
                defaultValue={String(tasting.courses)}
                className="field-input"
              />
            </Field>
            <Field label={t('price')}>
              <input
                name="price"
                inputMode="decimal"
                defaultValue={centsToInput(tasting.priceCents)}
                className="field-input"
              />
            </Field>
            <Field label={t('pairing')} hint={t('pairingHelp')}>
              <input
                name="pairingPrice"
                inputMode="decimal"
                defaultValue={centsToInput(tasting.pairingPriceCents)}
                className="field-input"
              />
            </Field>
          </div>

          <label className="t-caption flex items-center gap-2.5">
            <input type="checkbox" name="visible" defaultChecked={tasting.visible} />
            {t('visible')}
          </label>
        </div>
      </EditorShell>

      <div className="border-t hairline pt-4">
        <ActionButton
          action={deleteTasting.bind(null, tasting.id)}
          confirm={f('deleteConfirm')}
          tone="danger"
        >
          {f('delete')}
        </ActionButton>
      </div>
    </Card>
  )
}

export function NoteEditor({ note }: { note: AdminNote }) {
  const t = useTranslations('dashboard.menu')
  const f = useTranslations('dashboard.form')

  return (
    <Card className="flex flex-col gap-5">
      <EditorShell action={saveNote} id={note.id}>
        <BilingualField
          label={t('noteText')}
          italianLabel={f('italian')}
          englishLabel={f('english')}
          nameIt="textIt"
          nameEn="textEn"
          defaultValueIt={note.textIt}
          defaultValueEn={note.textEn}
          multiline
          required
        />
      </EditorShell>

      <div className="border-t hairline pt-4">
        <ActionButton action={deleteNote.bind(null, note.id)} confirm={f('deleteConfirm')} tone="danger">
          {f('delete')}
        </ActionButton>
      </div>
    </Card>
  )
}
