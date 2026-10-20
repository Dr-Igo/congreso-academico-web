import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clearSession, getSession, ROLE_LABELS } from '../../lib/auth'

const linkClassName = ({ isActive }) =>
  isActive ? 'hu1-nav-link hu1-nav-link--active' : 'hu1-nav-link'

function Hu1Header() {
  const navigate = useNavigate()
  const session = getSession()
  const role = session?.role
  const homePath = role === 'autor' || role === 'ambos' ? '/acceso-denegado' : '/'
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
            <NavLink className={linkClassName} end to={homePath}>Inicio</NavLink>

            {!session && (
              <>
                <a className="hu1-nav-link" href="/#bases">Bases del congreso</a>
                <a className="hu1-nav-link" href="/#ejes">Ejes temáticos</a>
                <a className="hu1-nav-link" href="/#programa">Programa</a>
              </>
            )}

            {(role === 'autor' || role === 'ambos') && (
              <>
                <NavLink className={linkClassName} to="/mis-trabajos">Nuevo trabajo</NavLink>
                <NavLink className={linkClassName} to="/mis-trabajos">Mis trabajos</NavLink>
                <NavLink className={linkClassName} to="/mis-trabajos">Mi presentación</NavLink>
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
                <NavLink className={linkClassName} to="/gestion-revisiones">Revisiones</NavLink>
                <NavLink className={linkClassName} to="/mi-cuenta">Mi cuenta</NavLink>
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
            <button
              className="hu1-user-menu"
              onClick={handleLogout}
              title="Cerrar sesión"
              type="button"
            >
              <span className="hu1-user-symbol" aria-hidden="true" />
              <span className="hu1-user-copy">
                <strong>{session.name}</strong>
                <small>Rol: {ROLE_LABELS[role]}</small>
              </span>
              <span className="hu1-user-initials" aria-hidden="true">{initials}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Hu1Header
