import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="hu1-footer">
      <div className="hu1-container hu1-footer-grid">
        <div>
          <strong className="hu1-footer-brand">Congreso Académico Estudiantil</strong>
          <p>Facultad de Ingeniería · Universidad de Lima, Av. Javier</p>
          <p>Prado Este 4600, Santiago de Surco, Lima.</p>
        </div>
        <div>
          <strong className="hu1-footer-title">El congreso</strong>
          <a href="/#bases">Bases y requisitos</a>
          <a href="/#ejes">Ejes temáticos</a>
          <a href="/#programa">Programa</a>
        </div>
        <div>
          <strong className="hu1-footer-title">Participantes</strong>
          <Link to="/registro">Guía para autores</Link>
          <Link to="/iniciar-sesion">Guía para revisores</Link>
          <a href="/#preguntas">Preguntas frecuentes</a>
        </div>
        <div>
          <strong className="hu1-footer-title">Contacto</strong>
          <a href="mailto:congreso@ulima.edu.pe">congreso@ulima.edu.pe</a>
          <p>(01) 437 6767 anexo 30450</p>
        </div>
      </div>
      <div className="hu1-footer-bottom">
        <div className="hu1-container">
          <span>© 2026 Universidad de Lima. Todos los derechos reservados.</span>
          <span><a href="/#terminos">Términos de uso</a><a href="/#privacidad">Política de privacidad</a></span>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
