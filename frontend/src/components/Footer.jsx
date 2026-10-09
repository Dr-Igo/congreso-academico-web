import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div>
          <strong>Congreso Académico Estudiantil</strong>
          <p>Facultad de Ingeniería · Universidad de Lima</p>
          <p>Av. Javier Prado Este 4600, Santiago de Surco, Lima.</p>
        </div>
        <div>
          <strong>El congreso</strong>
          <a href="/#bases">Bases y requisitos</a>
          <a href="/#ejes">Ejes temáticos</a>
          <a href="/#programa">Programa</a>
        </div>
        <div>
          <strong>Participantes</strong>
          <Link to="/registro">Registro de participante</Link>
          <Link to="/iniciar-sesion">Acceso al sistema</Link>
        </div>
        <div>
          <strong>Contacto</strong>
          <a href="mailto:congreso@ulima.edu.pe">congreso@ulima.edu.pe</a>
          <p>(01) 437 6767 anexo 30450</p>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Universidad de Lima. Todos los derechos reservados.</div>
    </footer>
  )
}

export default Footer
