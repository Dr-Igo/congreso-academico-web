import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'
import Checkbox from '../components/Checkbox.jsx'
import FilterSelect from '../components/FilterSelect.jsx'
import { Close, Download, InboxEmpty } from '../components/Icons.jsx'
import PageHeader, { th } from '../components/PageHeader.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchInput from '../components/SearchInput.jsx'
import { StatusBadge } from '../components/Badge.jsx'
import AssignModal from '../components/AssignModal.jsx'
import { AXES, DRAFTS_OUT, MAX_REVIEWERS, RECEPTION_DEADLINE, WORK_STATES, WORK_TYPES } from '../data/seed.js'
import { downloadCsv, fmtDate, norm, plural } from '../utils.js'

const PAGE_SIZE = 8

const METRICS = [
  { key: 'sent', label: 'Enviados', color: 'border-t-info' },
  { key: 'review', label: 'En revisión', color: 'border-t-warning' },
  { key: 'none', label: 'Sin revisores', color: 'border-t-danger' },
  { key: 'decided', label: 'Con decisión', color: 'border-t-success' },
]

export default function WorksView({ works, reviews, reviewers, demoEmpty, onAssign, onGoConfig, notify }) {
  const [axis, setAxis] = useState('')
  const [estado, setEstado] = useState('')
  const [tipo, setTipo] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const [assigning, setAssigning] = useState(null) // trabajos que se están asignando

  const list = useMemo(() => (demoEmpty ? [] : works), [demoEmpty, works])
  const reviewsOf = (workId) => reviews.filter((r) => r.workId === workId)
  // Un trabajo con decisión o con el máximo de revisores ya no admite más asignaciones.
  const ineligibleReason = (w) => {
    if (w.estado === 'Aceptado' || w.estado === 'Rechazado') return 'Trabajo con decisión: no admite nuevas asignaciones'
    if (reviewsOf(w.id).length >= MAX_REVIEWERS) return `Ya tiene el máximo de ${MAX_REVIEWERS} revisores`
    return null
  }

  const metrics = useMemo(
    () => ({
      sent: list.length,
      review: list.filter((w) => w.estado === 'En revisión').length,
      none: list.filter((w) => !reviews.some((r) => r.workId === w.id)).length,
      decided: list.filter((w) => w.estado === 'Aceptado' || w.estado === 'Rechazado').length,
    }),
    [list, reviews],
  )

  const filtered = useMemo(() => {
    const q = norm(query.trim())
    return list.filter(
      (w) =>
        (!axis || w.axis === axis) &&
        (!estado || w.estado === estado) &&
        (!tipo || w.type === tipo) &&
        (!q || norm([w.code, w.title, w.author, ...w.coauthors].join(' ')).includes(q)),
    )
  }, [list, axis, estado, tipo, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const activeChips = [
    axis && { label: `Eje: ${axis}`, clear: () => setAxis('') },
    estado && { label: `Estado: ${estado}`, clear: () => setEstado('') },
    tipo && { label: `Tipo: ${tipo}`, clear: () => setTipo('') },
    query.trim() && { label: `Búsqueda: “${query.trim()}”`, clear: () => setQuery('') },
  ].filter(Boolean)

  const withReset = (setter) => (v) => {
    setter(v)
    setPage(1)
  }
  const clearAll = () => {
    setAxis('')
    setEstado('')
    setTipo('')
    setQuery('')
    setPage(1)
  }

  const eligibleRows = rows.filter((w) => !ineligibleReason(w))
  const allChecked = eligibleRows.length > 0 && eligibleRows.every((w) => selected.includes(w.id))
  const someChecked = eligibleRows.some((w) => selected.includes(w.id))
  const toggleAll = () =>
    setSelected((s) =>
      allChecked ? s.filter((id) => !eligibleRows.some((w) => w.id === id)) : [...new Set([...s, ...eligibleRows.map((w) => w.id)])],
    )
  const toggleOne = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const selectedWorks = list.filter((w) => selected.includes(w.id))
  const openAssign = () => setAssigning(selectedWorks)

  const exportList = () => {
    const header = ['Código', 'Título', 'Autor', 'Eje temático', 'Tipo de trabajo', 'Revisores asignados', 'Revisiones entregadas', 'Estado']
    const data = filtered.map((w) => {
      const rs = reviewsOf(w.id)
      return [w.code, w.title, w.author, w.axis, w.type, rs.length, rs.filter((r) => r.status === 'entregada').length, w.estado]
    })
    downloadCsv('trabajos-recibidos.csv', [header, ...data])
    notify(`Listado exportado: ${plural(data.length, 'trabajo', 'trabajos')} en trabajos-recibidos.csv.`, 'success')
  }

  const subtitle = list.length
    ? `${list.length + DRAFTS_OUT} trabajos · ${list.length} enviados · ${plural(DRAFTS_OUT, 'borrador', 'borradores')} fuera de proceso`
    : 'Sin trabajos enviados por el momento'

  return (
    <>
      <PageHeader
        title="Trabajos recibidos"
        subtitle={subtitle}
        actions={
          list.length > 0 && (
            <>
              <Button variant="secondary" onClick={exportList}>
                <Download /> Exportar listado
              </Button>
              <Button disabled={selected.length === 0} onClick={openAssign}>
                Asignar revisores{selected.length > 0 && ` (${selected.length} ${selected.length === 1 ? 'seleccionado' : 'seleccionados'})`}
              </Button>
            </>
          )
        }
      />

      {list.length > 0 && (
        <section aria-label="Resumen" className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.key} className={`rounded-sm border border-line border-t-[3px] bg-surface px-4 py-3 ${m.color}`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{m.label}</p>
              <p className="mt-0.5 font-serif text-[26px] font-semibold leading-none text-ink">{metrics[m.key]}</p>
            </div>
          ))}
        </section>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <FilterSelect label="Eje" value={axis} onChange={withReset(setAxis)} options={AXES} className="w-full sm:w-[210px]" />
        <FilterSelect label="Estado" value={estado} onChange={withReset(setEstado)} options={WORK_STATES} className="w-full sm:w-[165px]" />
        {list.length > 0 && (
          <FilterSelect label="Tipo" value={tipo} onChange={withReset(setTipo)} options={WORK_TYPES} className="w-full sm:w-[180px]" />
        )}
        <SearchInput
          value={query}
          onChange={withReset(setQuery)}
          placeholder="Buscar por código, título o autor…"
          className="w-full sm:ml-auto sm:w-[290px]"
        />
      </div>

      {activeChips.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-muted">Filtros activos:</span>
          {activeChips.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary-soft px-2 py-1 font-medium text-primary">
              {c.label}
              <button type="button" onClick={c.clear} aria-label={`Quitar filtro ${c.label}`} className="hover:text-primary-dark">
                <Close width={11} height={11} />
              </button>
            </span>
          ))}
          <button type="button" onClick={clearAll} className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark">
            Limpiar todo
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState onGoConfig={onGoConfig} />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-line bg-bg">
                  <th className={`${th} w-10`}>
                    <Checkbox label="Seleccionar todos los trabajos de esta página" checked={allChecked} indeterminate={someChecked} disabled={eligibleRows.length === 0} onChange={toggleAll} />
                  </th>
                  <th className={th}>Código</th>
                  <th className={th}>Título</th>
                  <th className={th}>Eje temático</th>
                  <th className={th}>Tipo de trabajo</th>
                  <th className={th}>Revisores</th>
                  <th className={th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((w) => {
                  const rs = reviewsOf(w.id)
                  const delivered = rs.filter((r) => r.status === 'entregada').length
                  const reason = ineligibleReason(w)
                  const isSel = selected.includes(w.id)
                  return (
                    <tr key={w.id} className={`border-b border-line last:border-b-0 ${isSel ? 'bg-primary-soft' : 'hover:bg-bg'}`}>
                      <td className="px-3 py-2.5 align-top">
                        <Checkbox label={`Seleccionar ${w.code}`} title={reason ?? undefined} checked={isSel} disabled={!!reason} onChange={() => toggleOne(w.id)} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 align-top font-semibold text-ink">{w.code}</td>
                      <td className="max-w-[320px] px-3 py-2.5 align-top">
                        <p className="font-semibold leading-snug text-ink">{w.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted">{w.author}</p>
                      </td>
                      <td className="px-3 py-2.5 align-top text-ink">{w.axis}</td>
                      <td className="px-3 py-2.5 align-top text-ink">{w.type}</td>
                      <td className="px-3 py-2.5 align-top">
                        {rs.length === 0 ? (
                          <span className="font-semibold text-danger">Sin asignar</span>
                        ) : (
                          <span className="text-ink">
                            {rs.length} {rs.length === 1 ? 'asignado' : 'asignados'} · {delivered} {delivered === 1 ? 'entregada' : 'entregadas'}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <StatusBadge estado={w.estado} />
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <p className="font-serif text-[16px] font-semibold text-ink">Ningún trabajo coincide con los filtros</p>
                      <p className="mt-1 text-[12px] text-muted">Pruebe con otro eje, estado o término de búsqueda.</p>
                      <Button variant="secondary" className="mt-3" onClick={clearAll}>
                        Limpiar filtros
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={current}
            pageCount={pageCount}
            onChange={setPage}
            summary={
              filtered.length === 0
                ? 'Sin resultados'
                : `Mostrando ${(current - 1) * PAGE_SIZE + 1}–${(current - 1) * PAGE_SIZE + rows.length} de ${plural(filtered.length, 'trabajo', 'trabajos')}${
                    selected.length ? ` · ${plural(selected.length, 'seleccionado', 'seleccionados')}` : ''
                  }`
            }
          />
        </div>
      )}

      {assigning && (
        <AssignModal
          works={assigning}
          reviewers={reviewers}
          reviews={reviews}
          onClose={() => setAssigning(null)}
          onConfirm={(payload) => {
            onAssign(payload)
            setSelected([])
            setAssigning(null)
          }}
        />
      )}
    </>
  )
}

function EmptyState({ onGoConfig }) {
  return (
    <div className="flex flex-col items-center rounded-sm border border-line bg-surface px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-sm border border-line bg-bg text-primary">
        <InboxEmpty />
      </span>
      <h2 className="mt-4 font-serif text-[18px] font-semibold text-ink">Todavía no hay trabajos enviados</h2>
      <p className="mt-1.5 max-w-[420px] text-[12px] leading-relaxed text-muted">
        La recepción está abierta hasta el {fmtDate(RECEPTION_DEADLINE)}. Cuando los autores envíen sus trabajos aparecerán aquí para asignar revisores.
      </p>
      <Button variant="secondary" className="mt-4" onClick={onGoConfig}>
        Revisar la configuración de la edición
      </Button>
    </div>
  )
}
