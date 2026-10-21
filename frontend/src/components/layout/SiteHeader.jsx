import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearSession, getSession, ROLE_LABELS } from '../../lib/auth'

const linkClassName = ({ isActive }) =>
  isActive ? 'hu1-nav-link hu1-nav-link--active' : 'hu1-nav-link'

function SiteHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = getSession()
  const role = session?.role
  const homePath = role === 'autor' || role === 'ambos' ? '/acceso-denegado' : '/'
  const committeeSection = new URLSearchParams(location.search).get('seccion') || 'trabajos'
  const committeeReviewClassName = (section) =>
    location.pathname === '/gestion-revisiones' && committeeSection === section
      ? 'hu1-nav-link hu1-nav-link--active'
      : 'hu1-nav-link'
  const initials = session?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  const handleLogout = () => {
    clearSession()
    navigate('/', {
      replace: true,
      state: { successMessage: 'Sesión cerrada correctamente.' },
    })
  }

  return (
    <header className="hu1-header">
      <div className="hu1-brand-bar">
        <div className="hu1-container hu1-brand-row">
          <Link className="hu1-brand" to="/" aria-label="Ir al inicio">
            <span className="hu1-brand-mark" aria-hidden="true">C</span>
            <span className="hu1-brand-copy">
              <strong>Congreso Académico Estudiantil</strong>
              <small>Universidad de Lima · Edición 2026</small>
            </span>
          </Link>

          <div className="hu1-edition-status">
            <span>Estado de la edición</span>
            <strong><i aria-hidden="true" />{session ? 'En revisión' : 'Recepción abierta'}</strong>
          </div>
        </div>
      </div>

      <div className="hu1-navigation-bar">
        <div className="hu1-container hu1-navigation-row">
          <nav aria-label="Navegación principal">
            {role !== 'comite' && (
              <NavLink className={linkClassName} end to={homePath}>Inicio</NavLink>
            )}

            {!session && (
              <>
                <a className="hu1-nav-link" href="/#bases">Bases del congreso</a>
                <a className="hu1-nav-link" href="/#ejes">Ejes temáticos</a>
                <a className="hu1-nav-link" href="/#programa">Programa</a>
              </>
            )}

            {(role === 'autor' || role === 'ambos') && (
              <>
                <NavLink className={linkClassName} to="/nuevo-trabajo">Nuevo trabajo</NavLink>
                <NavLink className={linkClassName} end to="/mis-trabajos">Mis trabajos</NavLink>
                <NavLink className={linkClassName} to="/mi-presentacion">Mi presentación</NavLink>
                <NavLink className={linkClassName} to="/mi-cuenta">Mi cuenta</NavLink>
              </>
            )}

            {role === 'revisor' && (
              <>
                <NavLink className={linkClassName} to="/bandeja-revisor">Mi bandeja</NavLink>
                <NavLink className={linkClassName} to="/mi-cuenta">Mi cuenta</NavLink>
              </>
            )}

            {role === 'comite' && (
              <>
                <NavLink className={linkClassName} to="/configuracion-edicion">Configuración</NavLink>
                <Link className={committeeReviewClassName('trabajos')} to="/gestion-revisiones">
                  Trabajos recibidos
                </Link>
                <Link className={committeeReviewClassName('revisores')} to="/gestion-revisiones?seccion=revisores">
                  Revisores
                </Link>
                <Link className={committeeReviewClassName('seguimiento')} to="/gestion-revisiones?seccion=seguimiento">
                  Seguimiento
                </Link>
              </>
            )}
          </nav>

          {!session ? (
            <div className="hu1-header-actions">
              <NavLink className="hu1-button hu1-button--outline hu1-button--small" to="/iniciar-sesion">
                Iniciar sesión
              </NavLink>
              <NavLink className="hu1-button hu1-button--primary hu1-button--small" to="/registro">
                Crear cuenta
              </NavLink>
            </div>
          ) : (
            <div className="hu1-session-actions">
              <Link
                className="hu1-user-menu"
                to="/mi-cuenta"
                title="Abrir Mi cuenta"
                aria-label={`Abrir Mi cuenta de ${session.name}`}
              >
                <span className="hu1-user-symbol" aria-hidden="true" />
                <span className="hu1-user-copy">
                  <strong>{session.name}</strong>
                  <small>Rol: {ROLE_LABELS[role]}</small>
                </span>
                <span className="hu1-user-initials" aria-hidden="true">{initials}</span>
              </Link>
              <button
                className="hu1-logout-button"
                onClick={handleLogout}
                type="button"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
