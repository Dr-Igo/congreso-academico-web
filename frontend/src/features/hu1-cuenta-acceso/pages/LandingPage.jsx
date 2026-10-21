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
  ['Días del congreso', '12/11/2026 - 13/11/2026'],
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
        <div className="hu1-container hu1-home-message hu1-notice hu1-notice--success" role="status">
          <span aria-hidden="true">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      <section className="hu1-landing-hero" id="programa">
        <div className="hu1-container">
          <div>
            <p className="hu1-landing-kicker">Convocatoria abierta · Lima, 12 y 13 de noviembre de 2026</p>
            <h1>VIII Congreso Académico Estudiantil</h1>
            <p className="hu1-landing-summary">
              Presenta tu investigación ante el comité y la comunidad universitaria. Recibimos
              artículos completos, resúmenes extendidos, pósteres y casos de estudio en seis
              ejes temáticos.
            </p>
          </div>
          <div className="hu1-landing-actions">
            <Link className="hu1-button hu1-button--gold" to="/iniciar-sesion">Enviar mi trabajo</Link>
            <a className="hu1-button hu1-button--light" href="#bases">Descargar las bases</a>
          </div>
        </div>
      </section>

      <section className="hu1-landing-section" id="ejes">
        <div className="hu1-container">
          <div className="hu1-section-top">
            <h2>Ejes temáticos</h2>
            <a className="hu1-text-link" href="#bases">Ver bases completas</a>
          </div>

          <div className="hu1-topic-grid">
            {topics.map(([title, description]) => (
              <article className="hu1-topic-card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>

          <div className="hu1-landing-details" id="bases">
            <article className="hu1-detail-block">
              <h2>Fechas límite</h2>
              <dl className="hu1-detail-list">
                {dates.map(([label, value]) => (
                  <div className="hu1-detail-row" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </article>

            <article className="hu1-detail-block">
              <h2>Criterios de evaluación</h2>
              <dl className="hu1-detail-list">
                {criteria.map(([label, value]) => (
                  <div className="hu1-detail-row" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

export default LandingPage
