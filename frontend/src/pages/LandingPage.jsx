import { Link, useLocation } from 'react-router-dom'

const topics = [
  ['Inteligencia artificial y datos', 'Aprendizaje automático, analítica y ciencia de datos aplicada.'],
  ['Ingeniería de software', 'Arquitectura, calidad, pruebas y procesos de desarrollo.'],
  ['Sostenibilidad y ciudad', 'Movilidad, gestión del agua y ciudades resilientes.'],
  ['Innovación y emprendimiento', 'Modelos de negocio, transferencia tecnológica y startups.'],
  ['Salud y sociedad', 'Salud pública, bienestar estudiantil y política social.'],
  ['Economía y mercados', 'Mercados financieros, comercio y desarrollo económico.'],
]

const dates = [
  ['Cierre de recepción de trabajos', '30/09/2026'],
  ['Cierre de la etapa de revisión', '20/10/2026'],
  ['Publicación de resultados', '28/10/2026'],
  ['Días del congreso', '12/11/2026 – 13/11/2026'],
]

const criteria = [
  ['Originalidad', '25 %'],
  ['Rigor metodológico', '30 %'],
  ['Claridad de la exposición', '20 %'],
  ['Relevancia y aporte', '25 %'],
]

function LandingPage() {
  const location = useLocation()
  const successMessage = location.state?.successMessage

  return (
    <>
      {successMessage && (
        <div className="notification notification--success" role="status">
          <span aria-hidden="true">✓</span>
          {successMessage}
        </div>
      )}

      <section className="hero-section">
        <div className="content-container hero-content">
          <div>
            <p className="eyebrow">Convocatoria abierta · Lima, 12 y 13 de noviembre de 2026</p>
            <h1>VIII Congreso Académico Estudiantil</h1>
            <p className="hero-summary">
              Presenta tu investigación ante el comité y la comunidad universitaria.
              Recibimos artículos completos, resúmenes extendidos, pósteres y casos
              de estudio en seis ejes temáticos.
            </p>
            <div className="hero-actions">
              <Link className="button button--accent" to="/iniciar-sesion">Enviar mi trabajo</Link>
              <a className="button button--ghost-on-dark" href="#bases">Consultar las bases</a>
            </div>
          </div>
          <div className="deadline-card" aria-label="Fecha límite de recepción">
            <span>Recepción abierta</span>
            <strong>30 de septiembre</strong>
            <p>Hasta las 23:59</p>
          </div>
        </div>
      </section>

      <section className="section" id="ejes">
        <div className="content-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--dark">Áreas de investigación</p>
              <h2>Ejes temáticos</h2>
            </div>
            <a className="text-link" href="#bases">Ver bases completas →</a>
          </div>
          <div className="topic-grid">
            {topics.map(([title, description], index) => (
              <article className="topic-card" key={title}>
                <span className="topic-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted" id="bases">
        <div className="content-container information-grid">
          <article className="information-card">
            <p className="eyebrow eyebrow--dark">Cronograma</p>
            <h2>Fechas importantes</h2>
            <dl className="detail-list">
              {dates.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </article>
          <article className="information-card">
            <p className="eyebrow eyebrow--dark">Evaluación</p>
            <h2>Criterios y ponderación</h2>
            <dl className="detail-list">
              {criteria.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </article>
        </div>
      </section>

      <section className="section" id="programa">
        <div className="content-container call-to-action">
          <div>
            <p className="eyebrow eyebrow--dark">Participa en la edición 2026</p>
            <h2>Comparte tu investigación con la comunidad universitaria</h2>
            <p>Registra tu cuenta y prepara tu trabajo antes del cierre de recepción.</p>
          </div>
          <Link className="button button--primary" to="/registro">Crear mi cuenta</Link>
        </div>
      </section>
    </>
  )
}

export default LandingPage
