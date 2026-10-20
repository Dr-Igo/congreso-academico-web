import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="hu1-empty-page">
      <div className="hu1-empty-content">
        <span className="hu1-error-code">404</span>
        <h1>No encontramos la página que busca</h1>
        <p>
          El enlace pudo cambiar o el trabajo ya no está publicado. Puede volver al inicio o consultar
          el programa del congreso.
        </p>
        <div className="hu1-empty-actions">
          <Link className="hu1-button hu1-button--primary" to="/">Ir al inicio</Link>
          <a className="hu1-button hu1-button--outline" href="/#programa">Ver el programa</a>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
