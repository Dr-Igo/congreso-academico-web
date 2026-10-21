import { useMemo, useState } from 'react'
import Button from './Button.jsx'
import Checkbox from './Checkbox.jsx'
import { AlertCircle } from './Icons.jsx'
import Modal from './Modal.jsx'
import SearchInput from './SearchInput.jsx'
import { th } from './PageHeader.jsx'
import { MAX_REVIEWERS, MIN_REVIEWERS, STAGE_CLOSE, TODAY } from '../data/seed.js'
import { coauthorLabel, conflictFor, norm, plural } from '../utils.js'

/**
 * Asignación de revisores a uno o varios trabajos (lote).
 *  - Coautoría: bloqueante (checkbox deshabilitado).
 *  - Misma institución: exige activar la casilla del comité y registrar una justificación.
 *  - Mínimo 2 y máximo 3 revisores por trabajo.
 */
export default function AssignModal({ works, reviewers, reviews, onClose, onConfirm }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState([])
  const [allowInstitution, setAllowInstitution] = useState(false)
  const [justification, setJustification] = useState('')
  const [deadline, setDeadline] = useState(STAGE_CLOSE)

  const batch = works.length > 1

  const candidates = useMemo(() => {
    return reviewers
      .map((r) => {
        const coauthor = []
        const instConflict = []
        const already = []
        works.forEach((w) => {
          if (reviews.some((x) => x.workId === w.id && x.reviewerId === r.id)) already.push(w.code)
          const c = conflictFor(r, w)
          if (c === 'coauthor') coauthor.push(w.code)
          if (c === 'institution') instConflict.push(w.code)
        })
        return {
          ...r,
          coauthor,
          instConflict,
          already,
          load: reviews.filter((x) => x.reviewerId === r.id).length,
          matches: works.some((w) => r.lines.includes(w.axis)),
          blocked: coauthor.length > 0 || already.length > 0,
        }
      })
      .sort((a, b) => Number(b.matches) - Number(a.matches) || a.name.localeCompare(b.name, 'es'))
  }, [reviewers, reviews, works])

  const visible = candidates.filter((c) => {
    const q = norm(query.trim())
    return !q || norm([c.name, c.institution, ...c.lines].join(' ')).includes(q)
  })

  const nCoauthor = candidates.filter((c) => c.coauthor.length).length
  const nInstitution = candidates.filter((c) => !c.blocked && c.instConflict.length).length
  const selectedCands = candidates.filter((c) => selected.includes(c.id))
  const needsJustification = allowInstitution && selectedCands.some((c) => c.instConflict.length > 0)
  const exceeding = works.find((w) => reviews.filter((r) => r.workId === w.id).length + selected.length > MAX_REVIEWERS)

  let error = null
  if (selected.length < MIN_REVIEWERS) error = `Seleccione al menos ${MIN_REVIEWERS} revisores sin conflicto`
  else if (exceeding) error = `${exceeding.code} superaría el máximo de ${MAX_REVIEWERS} revisores`
  else if (needsJustification && justification.trim().length < 10) error = 'Registre la justificación del comité (mínimo 10 caracteres)'
  else if (!deadline) error = 'Indique la fecha límite de la revisión'
  else if (deadline < TODAY) error = 'La fecha límite no puede ser anterior a hoy'
  const valid = !error

  const hasConflicts = nCoauthor > 0 || nInstitution > 0
  const showError = !valid && (selected.length > 0 || hasConflicts)

  const isDisabled = (c) =>
    c.blocked || (c.instConflict.length > 0 && !allowInstitution) || (!selected.includes(c.id) && selected.length >= MAX_REVIEWERS)

  const toggle = (c) =>
    setSelected((s) => (s.includes(c.id) ? s.filter((id) => id !== c.id) : s.length >= MAX_REVIEWERS ? s : [...s, c.id]))

  const onToggleInstitution = (checked) => {
    setAllowInstitution(checked)
    if (!checked) {
      setSelected((s) => s.filter((id) => !candidates.find((c) => c.id === id)?.instConflict.length))
      setJustification('')
    }
  }

  const bannerParts = []
  if (nCoauthor > 0)
    bannerParts.push(`${nCoauthor === 1 ? '1 revisor es coautor' : `${nCoauthor} revisores son coautores`} ${batch ? 'de alguno de los trabajos' : 'del trabajo'}`)
  if (nInstitution > 0)
    bannerParts.push(`${nCoauthor > 0 ? (nInstitution === 1 ? 'otro pertenece' : 'otros pertenecen') : nInstitution === 1 ? '1 revisor pertenece' : `${nInstitution} revisores pertenecen`} a la misma institución del autor de correspondencia`)

  const subtitle = batch ? (
    <>
      <span className="font-semibold text-ink">{plural(works.length, 'trabajo seleccionado', 'trabajos seleccionados')}</span> · {works.map((w) => w.code.replace('TRB-2026-', '')).join(', ')}
      <ul className="mt-1.5 max-h-[72px] space-y-0.5 overflow-y-auto pr-1">
        {works.map((w) => (
          <li key={w.id} className="truncate">
            <span className="font-semibold text-ink">{w.code}</span> · {w.title}
          </li>
        ))}
      </ul>
    </>
  ) : (
    <>
      <span className="font-semibold text-ink">{works[0].code}</span> · {works[0].title} · {works[0].axis}
    </>
  )

  return (
    <Modal
      title="Asignar revisores"
      subtitle={subtitle}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`text-[12px] ${showError ? 'font-medium text-danger' : 'text-muted'}`} aria-live="polite">
            {valid ? plural(selected.length, 'revisor seleccionado', 'revisores seleccionados') : showError ? error : `Seleccione de ${MIN_REVIEWERS} a ${MAX_REVIEWERS} revisores`}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              disabled={!valid}
              onClick={() =>
                onConfirm({
                  workIds: works.map((w) => w.id),
                  reviewerIds: selected,
                  deadline,
                  justification: needsJustification ? justification.trim() : null,
                })
              }
            >
              Asignar y notificar
            </Button>
          </div>
        </div>
      }
    >
      {hasConflicts && (
        <div role="alert" className="mb-3 flex items-start gap-2.5 rounded-sm border border-danger/40 bg-danger-soft px-3 py-2.5 text-[12px] text-danger">
          <AlertCircle className="mt-0.5 shrink-0" />
          <p>
            <strong className="font-bold">Conflicto detectado:</strong> {bannerParts.join(' y ')}.
            {nCoauthor > 0 && ' No es posible asignar a un coautor.'}
          </p>
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <SearchInput
          autoFocus
          value={query}
          onChange={setQuery}
          placeholder="Buscar revisor por nombre, institución o línea de interés…"
          className="min-w-[220px] flex-1"
        />
        <span className="text-[12px] text-muted">
          Mínimo {MIN_REVIEWERS} · máximo {MAX_REVIEWERS} revisores
        </span>
      </div>

      <div className="max-h-[280px] overflow-auto rounded-sm border border-line">
        <table className="w-full min-w-[620px] border-collapse text-[12px]">
          <thead className="sticky top-0 z-10 bg-bg">
            <tr className="border-b border-line">
              <th className={`${th} w-10`}>
                <span className="sr-only">Seleccionar</span>
              </th>
              <th className={th}>Revisor</th>
              <th className={th}>Líneas de interés</th>
              <th className={th}>Carga actual</th>
              <th className={th}>Conflicto detectado</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => {
              const isSel = selected.includes(c.id)
              const disabled = isDisabled(c)
              const rowTone = isSel
                ? 'bg-primary-soft'
                : c.coauthor.length
                  ? 'bg-danger-soft'
                  : c.instConflict.length && !c.blocked
                    ? 'bg-warning-soft'
                    : ''
              return (
                <tr key={c.id} className={`border-b border-line last:border-b-0 ${rowTone}`}>
                  <td className="px-3 py-2">
                    <Checkbox
                      label={`Seleccionar a ${c.name}`}
                      checked={isSel}
                      disabled={disabled}
                      onChange={() => toggle(c)}
                      title={
                        c.coauthor.length
                          ? 'Conflicto bloqueante: es coautor del trabajo'
                          : c.already.length
                            ? 'Ya está asignado a este trabajo'
                            : c.instConflict.length && !allowInstitution
                              ? 'Active la casilla del comité para asignar a un revisor de la misma institución'
                              : undefined
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <p className={`font-semibold ${c.blocked ? 'text-muted' : 'text-ink'}`}>{c.name}</p>
                    <p className="text-[11px] text-muted">{c.institution}</p>
                  </td>
                  <td className={`px-3 py-2 ${c.blocked ? 'text-muted' : 'text-ink'}`}>{c.lines.join(' · ')}</td>
                  <td className={`whitespace-nowrap px-3 py-2 ${c.blocked ? 'text-muted' : 'text-ink'}`}>{plural(c.load, 'revisión', 'revisiones')}</td>
                  <td className="px-3 py-2">
                    <ConflictCell c={c} batch={batch} />
                  </td>
                </tr>
              )
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Ningún revisor coincide con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {nInstitution > 0 && (
        <div className="mt-3">
          <label className="flex cursor-pointer items-start gap-2 text-[12px] font-medium text-warning">
            <input
              type="checkbox"
              checked={allowInstitution}
              onChange={(e) => onToggleInstitution(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-sm accent-warning"
            />
            Asignar de todos modos al revisor de la misma institución (requiere justificación del comité).
          </label>
          {allowInstitution && (
            <label className="mt-2 block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Justificación del comité</span>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Ej.: no hay otro revisor disponible con experiencia en este eje."
                className="mt-1 block w-full resize-none rounded-sm border border-line bg-surface px-3 py-2 text-[12px] text-ink placeholder:text-muted"
              />
            </label>
          )}
        </div>
      )}

      <div className="mt-4">
        <label className="block w-full sm:w-[220px]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Fecha límite de la revisión</span>
          <input
            type="date"
            value={deadline}
            min={TODAY}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block h-9 w-full rounded-sm border border-line bg-surface px-3 text-[13px] text-ink"
          />
        </label>
      </div>
    </Modal>
  )
}

function ConflictCell({ c, batch }) {
  const codes = (list) => (batch ? <span className="block text-[10px] font-normal text-muted">{list.map((x) => x.replace('TRB-2026-', '')).join(', ')}</span> : null)
  if (c.coauthor.length)
    return (
      <span className="font-semibold text-danger">
        {coauthorLabel(c)}
        {codes(c.coauthor)}
      </span>
    )
  if (c.already.length)
    return (
      <span className="font-semibold text-muted">
        Ya asignado
        {codes(c.already)}
      </span>
    )
  if (c.instConflict.length)
    return (
      <span className="font-semibold text-warning">
        Misma institución
        {codes(c.instConflict)}
      </span>
    )
  return <span className="font-semibold text-success">Sin conflicto</span>
}
