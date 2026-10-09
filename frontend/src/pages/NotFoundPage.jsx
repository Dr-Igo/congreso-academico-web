import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="empty-page">
      <span className="error-code">404</span>
      <h1>No encontramos la página que busca</h1>
      <p>El enlace podría haber cambiado o la dirección ingresada no existe.</p>
      <Link className="button button--primary" to="/">Ir al inicio</Link>
    </section>
  )
}

export default NotFoundPage
