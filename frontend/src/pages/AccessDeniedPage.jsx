import { Link } from 'react-router-dom'
import { getRoleHome, getSession, ROLE_LABELS } from '../lib/auth'

function AccessDeniedPage() {
  const session = getSession()
  const destination = session ? getRoleHome(session.role) : '/iniciar-sesion'

  return (
    <section className="hu1-empty-page">
      <div className="hu1-empty-content">
        <span className="hu1-empty-icon" aria-hidden="true">!</span>
        <h1>No tiene permiso para ver esta página</h1>
        <p>
          La bandeja de revisión es exclusiva del rol revisor. Si cree que debería tener acceso,
          solicite el cambio de rol al comité organizador.
        </p>
        <div className="hu1-empty-actions">
          <Link className="hu1-button hu1-button--primary" to={destination}>
            {session?.role === 'autor' ? 'Volver a mis trabajos' : 'Volver a mi página'}
          </Link>
          <a className="hu1-button hu1-button--outline" href="mailto:congreso@ulima.edu.pe">
            Escribir al comité
          </a>
        </div>
        {session && (
          <p className="hu1-error-detail">
            Código de error: 403 · Sesión de {session.name} (rol {ROLE_LABELS[session.role].toLowerCase()})
          </p>
        )}
      </div>
    </section>
  )
}

export default AccessDeniedPage
