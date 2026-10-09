import { useMemo, useState } from 'react'
import Button from './Button.jsx'
import { AlertCircle } from './Icons.jsx'
import Modal from './Modal.jsx'
import { MIN_REVIEWERS, STAGE_CLOSE, TODAY } from '../../data/seed.js'
import { conflictFor, fmtDate } from '../../lib/utils.js'


const MIN_REASON = 10

/** Reasigna una revisión a otro revisor o retira al revisor; el motivo es obligatorio y queda registrado. */
export default function ReassignModal({ review, work, reviewer, reviewers, reviews, onClose, onConfirm }) {
  const [mode, setMode] = useState('reassign') // 'reassign' | 'remove'
  const [newReviewerId, setNewReviewerId] = useState('')
  const [deadline, setDeadline] = useState(STAGE_CLOSE)
  const [reason, setReason] = useState('')

  const options = useMemo(
    () =>
      reviewers
        .filter((r) => r.id !== reviewer.id && !reviews.some((x) => x.workId === work.id && x.reviewerId === r.id))
        .map((r) => {
          const c = conflictFor(r, work)
          return {
            ...r,
            disabled: !!c,
            note: c === 'coauthor' ? 'coautor del trabajo' : c === 'institution' ? 'misma institución' : '',
            load: reviews.filter((x) => x.reviewerId === r.id).length,
          }
        })
        .sort((a, b) => Number(a.disabled) - Number(b.disabled) || a.load - b.load),
    [reviewers, reviews, reviewer, work],
  )

  const remaining = reviews.filter((r) => r.workId === work.id).length - 1
  const trimmed = reason.trim()

  let error = null
  if (mode === 'reassign' && !newReviewerId) error = 'Elija al nuevo revisor'
  else if (mode === 'reassign' && (!deadline || deadline < TODAY)) error = 'Indique una fecha límite válida'
  else if (trimmed.length < MIN_REASON) error = `Registre el motivo (mínimo ${MIN_REASON} caracteres)`
  const valid = !error

  return (
    <Modal
      title={mode === 'reassign' ? 'Reasignar revisión' : 'Retirar revisor'}
      subtitle={
        <>
          <span className="font-semibold text-ink">{work.code}</span> · {work.title}
        </>
      }
      maxWidth="max-w-[560px]"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`text-[12px] ${!valid && trimmed.length > 0 ? 'text-danger' : 'text-muted'}`} aria-live="polite">
            {valid ? 'El motivo quedará registrado en el historial.' : error}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant={mode === 'remove' ? 'danger' : 'primary'}
              disabled={!valid}
              onClick={() =>
                onConfirm({
                  reviewId: review.id,
                  mode,
                  newReviewerId: mode === 'reassign' ? newReviewerId : null,
                  deadline: mode === 'reassign' ? deadline : null,
                  reason: trimmed,
                })
              }
            >
              {mode === 'reassign' ? 'Reasignar y notificar' : 'Retirar revisor'}
            </Button>
          </div>
        </div>
      }
    >
      <dl className="mb-4 grid grid-cols-2 gap-3 rounded-sm border border-line bg-bg px-3 py-2.5 text-[12px]">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Revisor actual</dt>
          <dd className="mt-0.5 font-semibold text-ink">{reviewer.name}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Fecha límite vigente</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-ink">{fmtDate(review.deadline)}</dd>
        </div>
      </dl>

      <fieldset className="mb-4">
        <legend className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Acción</legend>
        <div className="flex flex-wrap gap-4 text-[13px]">
          {[
            ['reassign', 'Reasignar a otro revisor'],
            ['remove', 'Solo retirar al revisor'],
          ].map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-ink">
              <input type="radio" name="mode" value={value} checked={mode === value} onChange={() => setMode(value)} className="size-4 accent-primary" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {mode === 'reassign' && (
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_170px]">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Nuevo revisor</span>
            <select
              data-autofocus
              value={newReviewerId}
              onChange={(e) => setNewReviewerId(e.target.value)}
              className="mt-1 block h-9 w-full rounded-sm border border-line bg-surface px-2 text-[13px] text-ink"
            >
              <option value="">Seleccione un revisor…</option>
              {options.map((o) => (
                <option key={o.id} value={o.id} disabled={o.disabled}>
                  {o.name} · {o.load} rev.{o.note ? ` — ${o.note}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Nueva fecha límite</span>
            <input
              type="date"
              value={deadline}
              min={TODAY}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block h-9 w-full rounded-sm border border-line bg-surface px-2 text-[13px] text-ink"
            />
          </label>
        </div>
      )}

      {mode === 'remove' && remaining < MIN_REVIEWERS && (
        <div className="mb-4 flex items-start gap-2.5 rounded-sm border border-warning/50 bg-warning-soft px-3 py-2.5 text-[12px] text-warning">
          <AlertCircle className="mt-0.5 shrink-0" />
          <p>
            El trabajo quedaría con {remaining} {remaining === 1 ? 'revisor' : 'revisores'} y el mínimo es {MIN_REVIEWERS}. Asigne otro revisor desde “Trabajos recibidos”.
          </p>
        </div>
      )}

      <label className="block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          Motivo <span className="text-danger">*</span>
        </span>
        <textarea
          data-autofocus={mode === 'remove' ? '' : undefined}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="Ej.: el revisor no respondió a los recordatorios y la fecha límite venció."
          className="mt-1 block w-full resize-none rounded-sm border border-line bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-muted"
        />
        <span className="mt-0.5 block text-right text-[10px] text-muted">{reason.length}/300</span>
      </label>
    </Modal>
  )
}
