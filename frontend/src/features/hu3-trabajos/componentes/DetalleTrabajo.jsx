import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ExternalLink,
  Trash2,
} from 'lucide-react'
import { RECEPCION_ABIERTA } from '../datos'
import { obtenerClaseEstado } from '../utilidades'

function Dato({ label, value }) {
  return (
    <div className="hu3-dato">
      <label>{label}</label>
      <strong>{value}</strong>
    </div>
  )
}

function ItemVerificacion({ ok, text }) {
  return (
    <div className={ok ? 'hu3-check hu3-check--ok' : 'hu3-check hu3-check--pendiente'}>
      <span>{ok ? <Check size={15} /> : '•'}</span>
      <strong>{text}</strong>
    </div>
  )
}

function Seguimiento({ status, date }) {
  const steps = [
    {
      label: 'Enviado al comité',
      date: `${date} · 21:15`,
    },
    {
      label: 'Revisores asignados',
      date: status === 'Enviado' ? 'Pendiente' : '02/10/2026 · 09:40',
    },
    {
      label: 'Revisión en curso · 2 de 3 entregadas',
      date: status === 'En revisión' ? 'actualizado el 12/10/2026' : 'Pendiente',
    },
    {
      label: 'Publicación de resultados',
      date: '28/10/2026',
    },
  ]

  let activeStep = 0

  if (status === 'En revisión') {
    activeStep = 2
  }

  return (
    <div className="hu3-seguimiento">
      {steps.map((step, index) => {
        const completed = index < activeStep
        const current = index === activeStep
        let stepClass = 'hu3-seguimiento__paso'

        if (completed) {
          stepClass += ' hu3-seguimiento__paso--completo'
        }

        if (current) {
          stepClass += ' hu3-seguimiento__paso--actual'
        }

        return (
          <div className={stepClass} key={step.label}>
            <span className="hu3-seguimiento__punto">
              {completed ? <Check size={11} /> : null}
            </span>
            <div>
              <strong>{step.label}</strong>
              <small>{step.date}</small>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ListaCoautores({ authors }) {
  return (
    <div className="hu3-panel hu3-coautores-detalle">
      <h2>Coautores</h2>

      <div className="hu3-coautores-detalle__lista">
        {authors.map((author) => (
          <div className="hu3-coautores-detalle__fila" key={author.email}>
            <span>
              {author.name} · {author.institution}
            </span>
            <strong>{author.role || (author.corresponding ? 'Autor/a de correspondencia' : 'Coautor/a')}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetalleBorrador({ work, onBack, onEdit, onSend, onWithdraw }) {
  const completeGeneral = Boolean(work.title && work.axis && work.axis !== 'Sin eje temático' && work.type)
  const completeSummary = Boolean(
    work.abstract &&
      work.abstract !== 'Resumen pendiente de completar.' &&
      work.keywords &&
      work.keywords.length >= 3,
  )
  const completeLink = Boolean(work.url && work.url.startsWith('https://'))
  const hasCorresponding = work.authors.filter((author) => author.corresponding).length > 0

  return (
    <section className="hu3-contenido">
      <div className="hu3-aviso-guardado">
        <CheckCircle2 size={19} />
        <strong>
          Borrador guardado el {work.savedAt || work.created}. Aún no ha sido enviado al comité.
        </strong>
        <button onClick={onBack} type="button">
          Ir a mis trabajos
        </button>
      </div>

      <div className="hu3-detalle-encabezado hu3-detalle-encabezado--compacto">
        <div>
          <div className="hu3-codigo-estado">
            <span className="hu3-codigo">{work.id}</span>
            <span className={obtenerClaseEstado(work.status)}>{work.status}</span>
          </div>
          <h1>{work.title}</h1>
        </div>

        <div className="hu3-detalle-acciones">
          <button
            className="hu3-btn hu3-btn--secundario"
            onClick={onEdit}
            type="button"
            disabled={!RECEPCION_ABIERTA}
          >
            Seguir editando
          </button>
          <button
            className="hu3-btn hu3-btn--peligro-borde"
            onClick={onWithdraw}
            type="button"
            disabled={!RECEPCION_ABIERTA}
          >
            <Trash2 size={16} />
            Eliminar borrador
          </button>
          <button
            className="hu3-btn hu3-btn--primario"
            onClick={onSend}
            type="button"
            disabled={!RECEPCION_ABIERTA}
          >
            Enviar al comité
          </button>
        </div>
      </div>

      <div className="hu3-borrador-layout">
        <div className="hu3-panel hu3-borrador-resumen">
          <h2>Resumen del borrador</h2>

          <div className="hu3-borrador-datos">
            <Dato label="TIPO" value={work.type} />
            <Dato label="EJE TEMÁTICO" value={work.axis} />
            <Dato label="COAUTORES" value={`${Math.max(0, work.authors.length - 1)} declarados`} />

            <div className="hu3-dato">
              <label>ENLACE AL DOCUMENTO</label>
              {completeLink ? (
                <a className="hu3-enlace-documento" href={work.url} target="_blank" rel="noreferrer">
                  Ver documento
                  <ExternalLink size={14} />
                </a>
              ) : (
                <strong>Pendiente</strong>
              )}
            </div>
          </div>

          <div className="hu3-bloque-detalle">
            <label>RESUMEN</label>
            <p>{work.abstract}</p>
          </div>
        </div>

        <aside className="hu3-borrador-lateral">
          <div className="hu3-panel hu3-lista-verificacion">
            <span className="hu3-sobretitulo">LISTA DE VERIFICACIÓN</span>
            <ItemVerificacion
              ok={completeGeneral}
              text={completeGeneral ? 'Datos generales completos' : 'Falta completar los datos generales'}
            />
            <ItemVerificacion
              ok={completeSummary}
              text={
                completeSummary
                  ? 'Resumen y palabras clave'
                  : 'Falta completar resumen y palabras clave'
              }
            />
            <ItemVerificacion
              ok={completeLink}
              text={completeLink ? 'Enlace al documento' : 'Falta agregar el enlace al documento'}
            />
            <ItemVerificacion
              ok={hasCorresponding}
              text={
                hasCorresponding
                  ? 'Autor de correspondencia confirmado'
                  : 'Falta confirmar al autor de correspondencia'
              }
            />
          </div>

          <div className="hu3-borrador-advertencia">
            Los borradores no participan del proceso de revisión. Debe enviarlo antes del cierre de la
            recepción.
          </div>
        </aside>
      </div>

      <div className="hu3-volver-fila">
        <button className="hu3-btn hu3-btn--secundario" onClick={onBack} type="button">
          <ArrowLeft size={16} />
          Volver a mis trabajos
        </button>
      </div>
    </section>
  )
}

function DetalleConDecision({ work, onPresentation, onToast }) {
  const accepted = work.status === 'Aceptado'

  return (
    <div className="hu3-decision-layout">
      <div className="hu3-decision-principal">
        <div
          className={
            accepted
              ? 'hu3-resultado hu3-resultado--aceptado'
              : 'hu3-resultado hu3-resultado--rechazado'
          }
        >
          <span className="hu3-sobretitulo">RESULTADO PUBLICADO EL 28/10/2026</span>
          <h2>
            {accepted
              ? 'Trabajo aceptado para presentación oral'
              : 'Trabajo no aceptado en esta edición'}
          </h2>
          <p>
            Puntaje promedio <strong>{work.score} de 20</strong> · 3 revisores
            {accepted && work.session ? (
              <>
                {' '}· Sesión asignada: <strong>{work.session.name}</strong>.
              </>
            ) : null}
          </p>
        </div>

        <div className="hu3-panel hu3-retroalimentacion">
          <h2>Retroalimentación consolidada de los revisores</h2>
          {work.feedback.map((feedback) => (
            <div className="hu3-retroalimentacion__item" key={feedback.reviewer}>
              <strong>{feedback.reviewer}</strong>
              <p>{feedback.text}</p>
            </div>
          ))}
        </div>
      </div>

      <aside className="hu3-decision-lateral">
        <div className="hu3-panel hu3-puntajes">
          <span className="hu3-sobretitulo">PUNTAJE POR CRITERIO</span>
          {work.scores.map((score) => (
            <div className="hu3-criterio" key={score[0]}>
              <span>{score[0]}</span>
              <strong>{score[1].toFixed(1)}</strong>
            </div>
          ))}
          <div className="hu3-criterio hu3-criterio--total">
            <span>Promedio ponderado</span>
            <strong>{work.score.toFixed(1)}</strong>
          </div>
        </div>

        {accepted ? (
          <div className="hu3-panel hu3-siguiente-paso">
            <span className="hu3-sobretitulo">SIGUIENTE PASO</span>
            <p>
              Consulta la fecha, hora y sala de tu exposición en la sección Mi presentación.
            </p>
            <button className="hu3-btn hu3-btn--primario hu3-btn--ancho" onClick={onPresentation} type="button">
              Ver mi presentación
            </button>
            <button
              className="hu3-btn hu3-btn--secundario hu3-btn--ancho"
              onClick={() =>
                onToast({
                  type: 'success',
                  text: 'La versión final podrá registrarse cuando el comité habilite esa etapa.',
                })
              }
              type="button"
            >
              Subir versión final
            </button>
          </div>
        ) : (
          <div className="hu3-panel hu3-siguiente-paso">
            <span className="hu3-sobretitulo">¿TIENE DUDAS?</span>
            <p>
              Puede solicitar una aclaración al comité organizador dentro de los 5 días siguientes a
              la publicación.
            </p>
            <button
              className="hu3-btn hu3-btn--secundario hu3-btn--ancho"
              onClick={() =>
                onToast({
                  type: 'info',
                  text: 'Contacto del comité: congreso@ulima.edu.pe',
                })
              }
              type="button"
            >
              Escribir al comité
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

function DetalleSinDecision({ work }) {
  const isReview = work.status === 'En revisión'
  const sentLabel = isReview ? 'ENVIADO' : 'FECHA DE REGISTRO'

  return (
    <div className="hu3-detalle-layout">
      <div className="hu3-detalle-principal">
        <div className="hu3-panel hu3-detalle-panel">
          <h2>Datos del trabajo</h2>

          <div className="hu3-datos-grid">
            <Dato label="TIPO" value={work.type} />
            <Dato label="EJE TEMÁTICO" value={work.axis} />
            <Dato label={sentLabel} value={work.created} />
          </div>

          <div className="hu3-bloque-detalle">
            <label>RESUMEN</label>
            <p>{work.abstract}</p>
          </div>

          <div className="hu3-palabras-detalle">
            {work.keywords.map((keyword) => (
              <span className="hu3-palabra-detalle" key={keyword}>
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <ListaCoautores authors={work.authors} />
      </div>

      <aside className="hu3-detalle-lateral">
        <div className={isReview ? 'hu3-dictamen hu3-dictamen--revision' : 'hu3-dictamen'}>
          <span className="hu3-sobretitulo">DICTAMEN</span>
          <h2>{work.status}</h2>
          <p>
            {isReview
              ? 'La retroalimentación se mostrará aquí cuando el comité publique la decisión, el 28/10/2026 a las 12:00.'
              : 'El trabajo fue recibido y está pendiente de asignación de revisores.'}
          </p>
        </div>

        <div className="hu3-panel hu3-seguimiento-panel">
          <span className="hu3-sobretitulo">SEGUIMIENTO</span>
          <Seguimiento status={work.status} date={work.created} />
        </div>
      </aside>
    </div>
  )
}

function DetalleTrabajo({
  work,
  onBack,
  onEdit,
  onSend,
  onWithdraw,
  onPresentation,
  onToast,
}) {
  if (work.status === 'Borrador') {
    return (
      <DetalleBorrador
        work={work}
        onBack={onBack}
        onEdit={onEdit}
        onSend={onSend}
        onWithdraw={onWithdraw}
      />
    )
  }

  const hasDecision = work.status === 'Aceptado' || work.status === 'Rechazado'

  return (
    <section className="hu3-contenido">
      <div className="hu3-migas">
        <button onClick={onBack} type="button">
          Mis trabajos
        </button>
        <span>/</span>
        <span>{work.id}</span>
      </div>

      <div className="hu3-detalle-encabezado">
        <div>
          <div className="hu3-codigo-estado">
            <span className="hu3-codigo">{work.id}</span>
            <span className={obtenerClaseEstado(work.status)}>{work.status}</span>
          </div>
          <h1>{work.title}</h1>
        </div>

        <div className="hu3-detalle-acciones">
          <a className="hu3-btn hu3-btn--secundario" href={work.url} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            Ver documento
          </a>

          {work.status === 'Enviado' && (
            <button
              className="hu3-btn hu3-btn--peligro-borde"
              onClick={onWithdraw}
              type="button"
              disabled={!RECEPCION_ABIERTA}
            >
              <Trash2 size={16} />
              Retirar trabajo
            </button>
          )}

          {work.status === 'Aceptado' && (
            <button className="hu3-btn hu3-btn--primario" onClick={onPresentation} type="button">
              Ver mi presentación
            </button>
          )}
        </div>
      </div>

      {hasDecision ? (
        <DetalleConDecision work={work} onPresentation={onPresentation} onToast={onToast} />
      ) : (
        <DetalleSinDecision work={work} />
      )}

      <div className="hu3-volver-fila">
        <button className="hu3-btn hu3-btn--secundario" onClick={onBack} type="button">
          <ArrowLeft size={16} />
          Volver a mis trabajos
        </button>
      </div>
    </section>
  )
}

export default DetalleTrabajo
