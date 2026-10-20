import { Link, Navigate, useLocation } from 'react-router-dom'
import { getRoleHome, getSession, ROLE_LABELS } from '../lib/auth'

function RegistrationSuccessPage() {
  const location = useLocation()
  const session = getSession()

  if (!session) return <Navigate replace to="/iniciar-sesion" />

  const name = location.state?.name || session.name
  const isAuthor = session.role === 'autor' || session.role === 'ambos'

  return (
    <section className="hu1-success-page">
      <div className="hu1-success-content">
        <div className="hu1-notice hu1-notice--success" role="status">
          <span aria-hidden="true">✓</span>
          <span>Cuenta creada correctamente. Le enviamos un correo de verificación a {session.email}.</span>
        </div>

        <div className="hu1-welcome-panel">
          <p className="hu1-kicker">Bienvenida</p>
          <h1>
            {name}, su cuenta de {isAuthor ? 'autor(a)' : ROLE_LABELS[session.role].toLowerCase()} está activa
          </h1>
          <p>
            {isAuthor
              ? 'Ya puede registrar sus trabajos. La recepción cierra el 30/09/2026 a las 23:59; después de esa fecha los envíos quedan en modo lectura.'
              : 'Ya puede utilizar las opciones habilitadas para su perfil dentro del congreso.'}
          </p>

          <div className="hu1-welcome-actions">
            {isAuthor && (
              <Link className="hu1-button hu1-button--primary" to="/mis-trabajos">
                Registrar mi primer trabajo
              </Link>
            )}
            <Link className="hu1-button hu1-button--outline" to="/mi-cuenta">
              Completar mi perfil
            </Link>
            {!isAuthor && (
              <Link className="hu1-button hu1-button--primary" to={getRoleHome(session.role)}>
                Ir a mi página principal
              </Link>
            )}
          </div>
        </div>

        {isAuthor && (
          <div className="hu1-next-steps">
            <article className="hu1-step-card">
              <h2>1. Datos del trabajo</h2>
              <p>Título, tipo, eje temático, resumen y palabras clave.</p>
            </article>
            <article className="hu1-step-card">
              <h2>2. Coautores</h2>
              <p>Declare a sus coautores y al autor de correspondencia.</p>
            </article>
            <article className="hu1-step-card">
              <h2>3. Envío</h2>
              <p>Adjunte el enlace al documento y envíe antes del cierre.</p>
            </article>
          </div>
        )}
      </div>
    </section>
  )
}

export default RegistrationSuccessPage
