import { AlertTriangle, ArrowLeft, ExternalLink, FileText, Send } from 'lucide-react'

function PasoRevision({
  form,
  coauthors,
  correspondingEmail,
  onBack,
  onSaveDraft,
  onSend,
}) {
  return (
    <div className="hu3-panel hu3-revision-panel">
      <div className="hu3-panel-encabezado">
        <div>
          <h2>Revisa tu trabajo antes de enviarlo</h2>
          <p>Comprueba los datos. Puedes volver a editarlos antes de confirmar.</p>
        </div>
      </div>

      <div className="hu3-revision-titulo">
        <span className="hu3-sobretitulo">VISTA PREVIA DEL ENVÍO</span>
        <h2>{form.title || 'Título del trabajo'}</h2>
        <div className="hu3-etiquetas">
          <span className="hu3-etiqueta">{form.type}</span>
          <span className="hu3-etiqueta">{form.axis || 'Sin eje temático'}</span>
        </div>
      </div>

      <div className="hu3-revision-grid">
        <div>
          <label className="hu3-dato-etiqueta">RESUMEN</label>
          <p>{form.abstract || 'Sin resumen ingresado.'}</p>

          <label className="hu3-dato-etiqueta">PALABRAS CLAVE</label>
          <div className="hu3-etiquetas">
            {form.keywords.map((keyword) => (
              <span className="hu3-palabra-clave hu3-palabra-clave--estatica" key={keyword}>
                {keyword}
              </span>
            ))}
          </div>

          <label className="hu3-dato-etiqueta">ENLACE AL DOCUMENTO</label>
          <a className="hu3-enlace-documento" href={form.url} target="_blank" rel="noreferrer">
            {form.url}
            <ExternalLink size={14} />
          </a>
        </div>

        <div>
          <label className="hu3-dato-etiqueta">AUTORES DECLARADOS</label>
          {coauthors.map((author) => (
            <div className="hu3-revision-autor" key={author.email}>
              <strong>{author.name}</strong>
              <span>{author.institution}</span>
              <small>
                {author.email === correspondingEmail ? 'Autor de correspondencia' : 'Coautor'}
              </small>
            </div>
          ))}

          <div className="hu3-alerta hu3-alerta--advertencia hu3-alerta--compacta">
            <AlertTriangle size={17} />
            <p>
              Al enviar, el trabajo quedará registrado ante el comité y podrá continuar al proceso
              de revisión.
            </p>
          </div>
        </div>
      </div>

      <div className="hu3-formulario-acciones hu3-formulario-acciones--separadas">
        <button className="hu3-btn hu3-btn--secundario" onClick={onBack} type="button">
          <ArrowLeft size={16} />
          Volver
        </button>

        <div className="hu3-grupo-botones">
          <button className="hu3-btn hu3-btn--secundario" onClick={onSaveDraft} type="button">
            <FileText size={16} />
            Guardar borrador
          </button>
          <button className="hu3-btn hu3-btn--primario" onClick={onSend} type="button">
            <Send size={16} />
            Enviar al comité
          </button>
        </div>
      </div>
    </div>
  )
}

export default PasoRevision
