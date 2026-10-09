import { Link, useLocation } from 'react-router-dom'
import { getRoleHome, getSession } from '../lib/auth'

function AccessDeniedPage() {
  const location = useLocation()
  const session = getSession()
  const destination = session ? getRoleHome(session.role) : '/iniciar-sesion'

  return (
    <section className="empty-page access-denied-page">
      <div>
        <span className="access-denied-icon" aria-hidden="true">!</span>
        <p className="eyebrow eyebrow--dark">Acceso restringido</p>
        <h1>No tiene permiso para ver esta página</h1>
        <p>
          La sección solicitada está disponible para otro tipo de participante.
          {location.state?.requestedPath && ' Puede continuar desde su página principal.'}
        </p>
        <div className="empty-page-actions">
          <Link className="button button--primary" to={destination}>
            {session ? 'Ir a mi página principal' : 'Iniciar sesión'}
          </Link>
          <Link className="button button--secondary" to="/">Volver al inicio</Link>
        </div>
      </div>
    </section>
  )
}

export default AccessDeniedPage
