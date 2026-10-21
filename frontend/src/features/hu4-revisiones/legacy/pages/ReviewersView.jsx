import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'
import FilterSelect from '../components/FilterSelect.jsx'
import PageHeader, { th } from '../components/PageHeader.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchInput from '../components/SearchInput.jsx'
import InviteModal from '../components/InviteModal.jsx'
import { INTEREST_LINES } from '../data/seed.js'
import { norm, plural, reviewerStats } from '../utils.js'

const PAGE_SIZE = 8

export default function ReviewersView({ reviewers, reviews, onInvite }) {
  const [line, setLine] = useState('')
  const [institution, setInstitution] = useState('')
  const [onlyOverdue, setOnlyOverdue] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [inviting, setInviting] = useState(false)

  const withStats = useMemo(() => reviewers.map((r) => ({ ...r, ...reviewerStats(r.id, reviews) })), [reviewers, reviews])
  const institutions = useMemo(() => [...new Set(reviewers.map((r) => r.institution))].sort((a, b) => a.localeCompare(b, 'es')), [reviewers])

  const totalAssigned = reviews.length
  const totalOverdue = withStats.reduce((n, r) => n + r.overdue, 0)
  const reviewersWithOverdue = withStats.filter((r) => r.overdue > 0).length

  const filtered = withStats.filter((r) => {
    const q = norm(query.trim())
    return (
      (!line || r.lines.includes(line)) &&
      (!institution || r.institution === institution) &&
      (!onlyOverdue || r.overdue > 0) &&
      (!q || norm(r.name).includes(q))
    )
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const reset = (setter) => (v) => {
    setter(v)
    setPage(1)
  }

  return (
    <>
      <PageHeader
        title="Revisores"
        subtitle={`${plural(reviewers.length, 'revisor registrado', 'revisores registrados')} · ${plural(totalAssigned, 'revisión asignada', 'revisiones asignadas')} · ${plural(totalOverdue, 'vencida', 'vencidas')}`}
        actions={
          <Button variant="secondary" onClick={() => setInviting(true)}>
            Invitar revisor
          </Button>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <FilterSelect label="Línea" value={line} onChange={reset(setLine)} options={INTEREST_LINES} className="w-full sm:w-[230px]" />
        <FilterSelect label="Institución" value={institution} onChange={reset(setInstitution)} options={institutions} className="w-full sm:w-[230px]" />
        <button
          type="button"
          aria-pressed={onlyOverdue}
          onClick={() => reset(setOnlyOverdue)(!onlyOverdue)}
          className={`h-9 rounded-sm border px-3 text-[13px] font-semibold transition-colors ${
            onlyOverdue ? 'border-primary bg-primary text-white' : 'border-primary/30 bg-primary-soft text-primary hover:border-primary'
          }`}
        >
          Con revisiones vencidas · {reviewersWithOverdue}
        </button>
        <SearchInput value={query} onChange={reset(setQuery)} placeholder="Buscar revisor…" className="w-full sm:ml-auto sm:w-[260px]" />
      </div>

      <div className="overflow-hidden rounded-sm border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-line bg-bg">
                <th className={th}>Revisor</th>
                <th className={th}>Institución</th>
                <th className={th}>Líneas de interés</th>
                <th className={`${th} text-right`}>Asignadas</th>
                <th className={`${th} text-right`}>Entregadas</th>
                <th className={`${th} text-right`}>Vencidas</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-b-0 hover:bg-bg">
                  <td className="px-3 py-2.5 font-semibold text-ink">{r.name}</td>
                  <td className="px-3 py-2.5 text-ink">{r.institution}</td>
                  <td className="px-3 py-2.5 text-ink">{r.lines.join(' · ')}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-ink">{r.assigned}</td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-success">{r.delivered}</td>
                  <td className={`px-3 py-2.5 text-right tabular-nums ${r.overdue > 0 ? 'font-bold text-danger' : 'text-ink'}`}>{r.overdue}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[12px] text-muted">
                    Ningún revisor coincide con los filtros.
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
              : `Mostrando ${(current - 1) * PAGE_SIZE + 1}–${(current - 1) * PAGE_SIZE + rows.length} de ${plural(filtered.length, 'revisor', 'revisores')}`
          }
        />
      </div>

      <p className="mt-3 text-[12px] text-muted">Desde esta tabla el comité identifica sobrecarga y revisiones vencidas antes de asignar.</p>

      {inviting && (
        <InviteModal
          institutions={institutions}
          onClose={() => setInviting(false)}
          onConfirm={(data) => {
            onInvite(data)
            setInviting(false)
          }}
        />
      )}
    </>
  )
}
