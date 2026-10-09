const SESSION_KEY = 'congreso-session'
const PARTICIPANT_KEY = 'congreso-account'
const COMMITTEE_KEY = 'congreso-committee-account'

export const ROLE_LABELS = {
  autor: 'Autor',
  revisor: 'Revisor',
  ambos: 'Autor y revisor',
  comite: 'Comité organizador',
}

export const REVIEW_INTERESTS = [
  'Inteligencia artificial y datos',
  'Ingeniería de software',
  'Sostenibilidad y ciudad',
  'Innovación y emprendimiento',
  'Salud y sociedad',
  'Economía y mercados',
]

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

export function getSession() {
  return readJson(SESSION_KEY)
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function getAccountByEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase()
  const accounts = [readJson(PARTICIPANT_KEY), readJson(COMMITTEE_KEY)]
  return accounts.find((account) => account?.email?.toLowerCase() === normalizedEmail) ?? null
}

export function saveAccount(account) {
  const key = account.role === 'comite' ? COMMITTEE_KEY : PARTICIPANT_KEY
  localStorage.setItem(key, JSON.stringify(account))
}

export function updateStoredPassword(email, password) {
  const account = getAccountByEmail(email)
  if (!account) return false
  saveAccount({ ...account, password })
  return true
}

export function getRoleHome(role) {
  if (role === 'comite') return '/gestion-revisiones'
  if (role === 'revisor') return '/bandeja-revisor'
  return '/mis-trabajos'
}

export function roleCanAccess(role, allowedRoles) {
  return !allowedRoles?.length || allowedRoles.includes(role)
}
