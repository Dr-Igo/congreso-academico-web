import { Link, Navigate, useLocation } from 'react-router-dom'
import { getRoleHome, getSession, ROLE_LABELS } from '../lib/auth'

function RegistrationSuccessPage() {
  const location = useLocation()
  const session = getSession()

  if (!session) return <Navigate replace to="/iniciar-sesion" />

  const name = location.state?.name || session.name
  const isAuthor = session.role === 'autor' || session.role === 'ambos'

  return (
    <section className="success-page">
      <div className="success-card">
        <span className="success-icon" aria-hidden="true">✓</span>
        <p className="eyebrow eyebrow--dark">Registro completado</p>
        <h1>¡Bienvenido(a), {name}!</h1>
        <p className="success-lead">
          Su cuenta fue creada correctamente como <strong>{ROLE_LABELS[session.role]}</strong>.
          Ya puede utilizar las opciones habilitadas para su perfil.
        </p>

        <div className="success-summary">
          <span>Cuenta registrada</span>
          <strong>{session.email}</strong>
        </div>

        <div className="success-actions">
          {isAuthor && (
            <Link className="button button--primary" to="/mis-trabajos">
              Registrar mi primer trabajo
            </Link>
          )}
          <Link className={isAuthor ? 'button button--secondary' : 'button button--primary'} to="/mi-cuenta">
            Completar mi perfil
          </Link>
          {!isAuthor && (
            <Link className="button button--secondary" to={getRoleHome(session.role)}>
              Ir a mi página principal
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default RegistrationSuccessPage
