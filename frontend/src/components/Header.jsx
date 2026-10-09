import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

const navClassName = ({ isActive }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = localStorage.getItem('congreso-session')

  const handleLogout = () => {
    localStorage.removeItem('congreso-session')
    navigate('/', {
      replace: true,
      state: { successMessage: 'Sesión cerrada correctamente.' },
    })
  }

  return (
    <header className="site-header">
      <div className="institution-bar">
        <div className="content-container">
          <Link className="brand" to="/" aria-label="Ir al inicio">
            <span className="brand-mark" aria-hidden="true">C</span>
            <span>
              <strong>Congreso Académico Estudiantil</strong>
              <small>Universidad de Lima · Edición 2026</small>
            </span>
          </Link>
          <div className="edition-status">
            <span>Estado de la edición</span>
            <strong>Recepción abierta</strong>
          </div>
        </div>
      </div>

      <div className="navigation-bar">
        <div className="content-container">
          <nav aria-label="Navegación principal">
            <NavLink className={navClassName} end to="/">Inicio</NavLink>
            <a className="nav-link" href="/#bases">Bases del congreso</a>
            <a className="nav-link" href="/#ejes">Ejes temáticos</a>
            <a className="nav-link" href="/#programa">Programa</a>
          </nav>
          <div className="header-actions">
            {session ? (
              <>
                <span className="session-label" key={location.key}>Sesión activa</span>
                <button className="button button--small button--secondary" onClick={handleLogout} type="button">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink className={navClassName} to="/iniciar-sesion">Iniciar sesión</NavLink>
                <Link className="button button--small button--primary" to="/registro">Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
