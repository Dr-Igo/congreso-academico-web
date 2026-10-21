import { useMemo, useState } from 'react'
import Badge from '../components/Badge.jsx'
import Button, { LinkButton } from '../components/Button.jsx'
import { AlertCircle, Check } from '../components/Icons.jsx'
import PageHeader, { th } from '../components/PageHeader.jsx'
import ReassignModal from '../components/ReassignModal.jsx'
import { STAGE_CLOSE } from '../data/seed.js'
import { daysBetween, fmtDate, plural } from '../utils.js'

export default function TrackingView({ works, reviewers, reviews, onReassign, notify }) {
  const [onlyOverdue, setOnlyOverdue] = useState(false)
  const [reminded, setReminded] = useState([])
  const [reassigning, setReassigning] = useState(null)

  const pending = useMemo(
    () =>
      reviews
        .filter((r) => r.status === 'pendiente')
        .map((r) => ({
          ...r,
          work: works.find((w) => w.id === r.workId),
          reviewer: reviewers.find((x) => x.id === r.reviewerId),
          diff: daysBetween(r.deadline), // < 0 → vencida
        }))
        .sort((a, b) => a.deadline.localeCompare(b.deadline) || a.work.code.localeCompare(b.work.code)),
    [reviews, works, reviewers],
  )

  const overdue = pending.filter((p) => p.diff < 0)
  const inTerm = pending.length - overdue.length
  const delivered = reviews.length - pending.length
  const visible = onlyOverdue ? overdue : pending

  const remind = (p) => {
    setReminded((s) => [...s, p.id])
    notify(`Recordatorio enviado a ${p.reviewer.name} (${p.work.code}).`, 'success')
  }
  const remindAll = () => {
    if (pending.length === 0) return
    setReminded(pending.map((p) => p.id))
    notify(`Recordatorio enviado a ${plural(new Set(pending.map((p) => p.reviewerId)).size, 'revisor', 'revisores')} con ${plural(pending.length, 'revisión pendiente', 'revisiones pendientes')}.`, 'success')
  }

  return (
    <>
      <PageHeader
        title="Seguimiento de revisiones"
        subtitle={`Pendientes ordenadas por fecha límite · cierre de la etapa: ${fmtDate(STAGE_CLOSE)}`}
        actions={
          <Button variant="secondary" onClick={remindAll} disabled={pending.length === 0}>
            Recordatorio a todos los pendientes
          </Button>
        }
      />

      {overdue.length > 0 ? (
        <div role="alert" className="mb-4 flex flex-wrap items-center gap-3 rounded-sm border border-warning/50 bg-warning-soft px-4 py-3 text-warning">
          <AlertCircle className="shrink-0" width={18} height={18} />
          <p className="min-w-0 flex-1 text-[13px]">
            <strong className="font-bold">{plural(overdue.length, 'revisión vencida', 'revisiones vencidas')}.</strong> Considere reasignar para no retrasar la publicación de resultados.
          </p>
          <Button variant="warning" className="h-8 px-3 text-[12px]" aria-pressed={onlyOverdue} onClick={() => setOnlyOverdue((v) => !v)}>
            {onlyOverdue ? 'Ver todas las pendientes' : 'Ver solo vencidas'}
          </Button>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-3 rounded-sm border border-success/40 bg-success-soft px-4 py-3 text-[13px] text-success">
          <Check className="shrink-0" width={18} height={18} />
          <p className="font-medium">No hay revisiones vencidas. Todas las pendientes están dentro del plazo.</p>
        </div>
      )}

      <div className="overflow-hidden rounded-sm border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-line bg-bg">
                <th className={th}>Código</th>
                <th className={th}>Trabajo</th>
                <th className={th}>Revisor</th>
                <th className={th}>Fecha límite</th>
                <th className={th}>Estado</th>
                <th className={`${th} text-right`}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const late = p.diff < 0
                const days = Math.abs(p.diff)
                const wasReminded = reminded.includes(p.id)
                return (
                  <tr key={p.id} className={`border-b border-line last:border-b-0 ${late ? 'bg-danger-soft' : 'hover:bg-bg'}`}>
                    <td className="whitespace-nowrap px-3 py-2.5 align-top font-semibold text-ink">{p.work.code}</td>
                    <td className="max-w-[300px] px-3 py-2.5 align-top font-semibold leading-snug text-ink">{p.work.title}</td>
                    <td className="px-3 py-2.5 align-top text-ink">{p.reviewer.name}</td>
                    <td className={`whitespace-nowrap px-3 py-2.5 align-top font-semibold tabular-nums ${late ? 'text-danger' : 'text-ink'}`}>{fmtDate(p.deadline)}</td>
                    <td className="px-3 py-2.5 align-top">
                      {late ? (
                        <Badge tone="danger">Vencida · {days === 1 ? '1 día' : `${days} días`}</Badge>
                      ) : p.diff === 0 ? (
                        <Badge tone="warning">Vence hoy</Badge>
                      ) : (
                        <Badge tone="warning">Pendiente · {p.diff === 1 ? '1 día' : `${p.diff} días`}</Badge>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right align-top">
                      <span className="inline-flex items-center gap-3">
                        {late ? (
                          <LinkButton tone="danger" onClick={() => setReassigning(p)}>
                            Reasignar
                          </LinkButton>
                        ) : (
                          <>
                            <LinkButton disabled={wasReminded} tone={wasReminded ? 'muted' : 'primary'} onClick={() => remind(p)}>
                              {wasReminded ? 'Recordado ✓' : 'Recordar'}
                            </LinkButton>
                            <LinkButton tone="muted" onClick={() => setReassigning(p)}>
                              Reasignar
                            </LinkButton>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[12px] text-muted">
                    {onlyOverdue ? 'No hay revisiones vencidas.' : 'No hay revisiones pendientes.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <section aria-label="Resumen de revisiones" className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Revisiones entregadas" value={`${delivered} de ${reviews.length}`} tone="text-success" />
        <Metric label="Pendientes en plazo" value={inTerm} tone="text-warning" />
        <Metric label="Vencidas" value={overdue.length} tone="text-danger" />
      </section>

      {reassigning && (
        <ReassignModal
          review={reassigning}
          work={reassigning.work}
          reviewer={reassigning.reviewer}
          reviewers={reviewers}
          reviews={reviews}
          onClose={() => setReassigning(null)}
          onConfirm={(payload) => {
            onReassign(payload)
            setReassigning(null)
          }}
        />
      )}
    </>
  )
}

function Metric({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-line bg-surface px-4 py-3">
      <span className="text-[12px] text-muted">{label}</span>
      <span className={`font-serif text-[20px] font-semibold tabular-nums ${tone}`}>{value}</span>
    </div>
  )
}
