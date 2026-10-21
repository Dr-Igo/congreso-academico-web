import { TODAY } from './data/seed.js'

const toDate = (iso) => new Date(`${iso}T00:00:00`)

/** Días entre dos fechas ISO (a - b). */
export const daysBetween = (a, b = TODAY) => Math.round((toDate(a) - toDate(b)) / 86400000)

/** 2026-10-20 → 20/10/2026 */
export const fmtDate = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

/** Normaliza para búsquedas sin tildes ni mayúsculas. */
export const norm = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

export const isOverdue = (review) => review.status === 'pendiente' && daysBetween(review.deadline) < 0

/** Estadísticas de un revisor derivadas de la lista de revisiones. */
export function reviewerStats(reviewerId, reviews) {
  const mine = reviews.filter((r) => r.reviewerId === reviewerId)
  return {
    assigned: mine.length,
    delivered: mine.filter((r) => r.status === 'entregada').length,
    overdue: mine.filter(isOverdue).length,
  }
}

/**
 * Conflicto de un revisor con un trabajo.
 *  - coauthor: es coautor → bloqueante.
 *  - institution: misma institución que el autor de correspondencia → requiere justificación.
 */
export function conflictFor(reviewer, work) {
  if (work.coauthorIds.includes(reviewer.id)) return 'coauthor'
  if (reviewer.institution === work.authorInstitution) return 'institution'
  return null
}

export const coauthorLabel = (reviewer) => (reviewer.gender === 'F' ? 'Coautora del trabajo' : 'Coautor del trabajo')

/** Descarga un CSV (con BOM para que Excel respete las tildes). */
export function downloadCsv(filename, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = rows.map((r) => r.map(esc).join(',')).join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
