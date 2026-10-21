import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './components/hu4.css'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import { TABS } from './components/headerConstants.js'
import { Container } from './components/PageHeader.jsx'
import ToastHost from './components/Toast.jsx'
import { REVIEWERS, REVIEWS, TODAY, WORKS } from './data/seed.js'
import { plural } from './utils.js'
import { clearSession } from '../../../lib/auth.js'
import PlaceholderView from './pages/PlaceholderView.jsx'
import ReviewersView from './pages/ReviewersView.jsx'
import TrackingView from './pages/TrackingView.jsx'
import WorksView from './pages/WorksView.jsx'

export default function App() {
  const routeNavigate = useNavigate()
  const [view, setView] = useState('works')
  const [works, setWorks] = useState(WORKS)
  const [reviewers, setReviewers] = useState(REVIEWERS)
  const [reviews, setReviews] = useState(REVIEWS)
 const [, setAuditLog] = useState([]) // motivos y justificaciones registradas
  const [demoEmpty, setDemoEmpty] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)
  const idSeq = useRef(100)

  const notify = useCallback((message, type = 'success') => {
    setToasts((t) => [...t, { id: ++toastId.current, message, type }].slice(-3))
  }, [])
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const log = (entry) => setAuditLog((l) => [{ at: TODAY, ...entry }, ...l])

  // ── Asignar y notificar (individual o en lote) ──────────────────
  const handleAssign = ({ workIds, reviewerIds, deadline, justification }) => {
    const created = workIds.flatMap((workId) =>
      reviewerIds.map((reviewerId) => ({
        id: `RV-${++idSeq.current}`,
        workId,
        reviewerId,
        status: 'pendiente',
        deadline,
      })),
    )
    setReviews((r) => [...r, ...created])
    setWorks((ws) => ws.map((w) => (workIds.includes(w.id) && w.estado === 'Enviado' ? { ...w, estado: 'En revisión' } : w)))
    if (justification) log({ type: 'assign-same-institution', workIds, reviewerIds, text: justification })
    notify(
      `Revisores asignados y notificados: ${plural(reviewerIds.length, 'revisor', 'revisores')} en ${plural(workIds.length, 'trabajo', 'trabajos')}. Fecha límite: ${deadline.split('-').reverse().join('/')}.`,
    )
  }

  // ── Reasignar o retirar con motivo ──────────────────────────────
  const handleReassign = ({ reviewId, mode, newReviewerId, deadline, reason }) => {
    const target = reviews.find((r) => r.id === reviewId)
    const newReviewer = reviewers.find((r) => r.id === newReviewerId)
    const oldReviewer = reviewers.find((r) => r.id === target.reviewerId)
    const work = works.find((w) => w.id === target.workId)

    if (mode === 'reassign') {
      setReviews((rs) => rs.map((r) => (r.id === reviewId ? { ...r, reviewerId: newReviewerId, deadline, status: 'pendiente' } : r)))
      notify(`${work.code}: revisión reasignada de ${oldReviewer.name} a ${newReviewer.name}.`)
    } else {
      const left = reviews.filter((r) => r.id !== reviewId)
      setReviews(left)
      if (work.estado === 'En revisión' && !left.some((r) => r.workId === work.id)) {
        setWorks((ws) => ws.map((w) => (w.id === work.id ? { ...w, estado: 'Enviado' } : w)))
      }
      notify(`${work.code}: se retiró a ${oldReviewer.name}.`)
    }
    log({ type: mode, reviewId, workId: work.id, from: oldReviewer.id, to: newReviewerId, text: reason })
  }

  // ── Invitar revisor ─────────────────────────────────────────────
  const handleInvite = ({ name, email, institution, lines }) => {
    setReviewers((rs) => [...rs, { id: `R${rs.length + 1}`, name, email, institution, lines, gender: /^(dra\.|sra\.)/i.test(name) ? 'F' : 'M' }])
    notify(`Invitación enviada a ${email}.`)
  }

  const tab = TABS.find((t) => t.key === view)
  const editionState = view === 'works' && demoEmpty ? 'Recepción abierta' : 'En revisión'

  const handleNavigation = (nextView) => {
    if (nextView === 'config') {
      routeNavigate('/configuracion-edicion')
      return
    }

    setView(nextView)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        active={view}
        onNavigate={handleNavigation}
        editionState={editionState}
        onLogout={() => {
          clearSession()
          routeNavigate('/')
        }}
      />

      <main className="flex-1 py-6">
        <Container>
          {view === 'works' && (
            <WorksView
              works={works}
              reviews={reviews}
              reviewers={reviewers}
              demoEmpty={demoEmpty}
              onAssign={handleAssign}
              onGoConfig={() => setView('config')}
              notify={notify}
            />
          )}
          {view === 'reviewers' && <ReviewersView reviewers={reviewers} reviews={reviews} onInvite={handleInvite} />}
          {view === 'tracking' && (
            <TrackingView works={works} reviewers={reviewers} reviews={reviews} onReassign={handleReassign} notify={notify} />
          )}
          {!['works', 'reviewers', 'tracking'].includes(view) && <PlaceholderView tabKey={view} label={tab.label} />}

          {view === 'works' && (
            <label className="mt-6 inline-flex cursor-pointer items-center gap-2 text-[11px] text-muted">
              <input type="checkbox" checked={demoEmpty} onChange={(e) => setDemoEmpty(e.target.checked)} className="size-3.5 accent-primary" />
              Demo: simular estado vacío (sin trabajos enviados)
            </label>
          )}
        </Container>
      </main>

      <Footer />
      <ToastHost toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
