import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Eye,
  FileText,
  Link as LinkIcon,
  X,
} from 'lucide-react'
import { EJES_TEMATICOS, TIPOS_TRABAJO } from '../datos'

function PasoDatosGenerales({
  form,
  errors,
  onFieldChange,
  onTypeChange,
  onKeywordInputChange,
  onAddKeyword,
  onRemoveKeyword,
  onSaveDraft,
  onContinue,
}) {
  const hasErrors = Object.keys(errors).length > 0
  const selectedType = TIPOS_TRABAJO[form.type]

  const handleKeywordKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      onAddKeyword()
    }
  }

  return (
    <div className="hu3-formulario-layout">
      <div className="hu3-panel hu3-formulario-panel">
        <div className="hu3-panel-encabezado">
          <div>
            <h2>Datos del trabajo</h2>
            <p>Completa la información principal de tu propuesta.</p>
          </div>
          <span className="hu3-obligatorio">* Obligatorio</span>
        </div>

        {hasErrors && (
          <div className="hu3-alerta hu3-alerta--error">
            <AlertTriangle size={18} />
            <div>
              <strong>No se pudo continuar: revisa los campos marcados.</strong>
              <p>Corrige los errores que aparecen debajo de cada campo.</p>
            </div>
          </div>
        )}

        <div className="hu3-campo">
          <label htmlFor="title">
            Título del trabajo <em>*</em>
          </label>
          <input
            id="title"
            maxLength="180"
            value={form.title}
            onChange={(event) => onFieldChange('title', event.target.value)}
            placeholder="Escribe el título completo de tu investigación"
          />
          <div className="hu3-campo-meta">
            <span className={errors.title ? 'hu3-error-texto' : ''}>
              {errors.title || 'Máximo 180 caracteres.'}
            </span>
            <span>{form.title.length}/180</span>
          </div>
        </div>

        <div className="hu3-campos-dos-columnas">
          <div className="hu3-campo">
            <label htmlFor="type">
              Tipo de trabajo <em>*</em>
            </label>
            <select
              id="type"
              value={form.type}
              onChange={(event) => onTypeChange(event.target.value)}
            >
              {Object.keys(TIPOS_TRABAJO).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="hu3-campo">
            <label htmlFor="axis">
              Eje temático <em>*</em>
            </label>
            <select
              className={errors.axis ? 'hu3-campo-invalido' : ''}
              id="axis"
              value={form.axis}
              onChange={(event) => onFieldChange('axis', event.target.value)}
            >
              <option value="">Selecciona un eje</option>
              {EJES_TEMATICOS.map((axis) => (
                <option key={axis} value={axis}>
                  {axis}
                </option>
              ))}
            </select>
            {errors.axis && <small className="hu3-error-texto">{errors.axis}</small>}
          </div>
        </div>

        <div className="hu3-campo">
          <label htmlFor="abstract">
            Resumen <em>*</em>
          </label>
          <textarea
            id="abstract"
            rows="6"
            maxLength="1600"
            value={form.abstract}
            onChange={(event) => onFieldChange('abstract', event.target.value)}
            placeholder="Describe el objetivo, la metodología y los principales aportes del trabajo…"
          />
          <div className="hu3-campo-meta">
            <span className={errors.abstract ? 'hu3-error-texto' : ''}>
              {errors.abstract || 'Máximo 1 500 caracteres.'}
            </span>
            <span className={form.abstract.length > 1500 ? 'hu3-error-texto' : ''}>
              {form.abstract.length}/1500
            </span>
          </div>
        </div>

        <div className="hu3-campo">
          <label htmlFor="keyword-input">
            Palabras clave <em>*</em>
          </label>

          <div className="hu3-palabras-clave">
            {form.keywords.map((keyword) => (
              <span className="hu3-palabra-clave" key={keyword}>
                {keyword}
                <button
                  aria-label={`Eliminar ${keyword}`}
                  onClick={() => onRemoveKeyword(keyword)}
                  type="button"
                >
                  <X size={13} />
                </button>
              </span>
            ))}

            <input
              id="keyword-input"
              value={form.keywordInput}
              onChange={(event) => onKeywordInputChange(event.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="Escribe una palabra y presiona Enter…"
            />

            <button className="hu3-palabra-agregar" onClick={onAddKeyword} type="button">
              Agregar
            </button>
          </div>

          <div className="hu3-campo-meta">
            <span className={errors.keywords ? 'hu3-error-texto' : ''}>
              {errors.keywords || 'Agrega entre 3 y 8 palabras clave.'}
            </span>
            <span>{form.keywords.length}/8</span>
          </div>
        </div>

        <div className="hu3-campo">
          <label htmlFor="url">
            Enlace al documento <em>*</em>
          </label>
          <div className="hu3-input-icono">
            <LinkIcon size={17} />
            <input
              id="url"
              value={form.url}
              onChange={(event) => onFieldChange('url', event.target.value)}
              placeholder="https://drive.ulima.edu.pe/mi-trabajo.pdf"
            />
          </div>
          <small className={errors.url ? 'hu3-error-texto' : 'hu3-ayuda-texto'}>
            {errors.url || 'El enlace debe permitir acceso de lectura al comité y a los revisores.'}
          </small>
        </div>

        <div className="hu3-formulario-acciones">
          <button className="hu3-btn hu3-btn--secundario" onClick={onSaveDraft} type="button">
            <FileText size={16} />
            Guardar como borrador
          </button>
          <button className="hu3-btn hu3-btn--primario" onClick={onContinue} type="button">
            Continuar a coautores
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <aside className="hu3-columna-lateral">
        <div className="hu3-panel hu3-panel-lateral">
          <div className="hu3-panel-lateral__icono">
            <BookOpen size={18} />
          </div>
          <h3>Requisitos del tipo elegido</h3>
          <p>
            <strong>{form.type}</strong> · {selectedType.maximo.toLocaleString('es-PE')}{' '}
            {selectedType.unidad} · {selectedType.formato}.
          </p>
          <p>Admite hasta {selectedType.coautores} coautores.</p>
          <div className="hu3-separador" />
          <p className="hu3-texto-suave">
            Puedes cambiar el tipo mientras el trabajo permanezca editable.
          </p>
        </div>

        <div className="hu3-panel hu3-panel-aviso">
          <h3>
            <Eye size={17} />
            Antes de enviar
          </h3>
          <ul>
            <li>El documento no debe contener los nombres de los autores: la revisión es ciega.</li>
            <li>Verifica que el enlace permita la lectura del archivo.</li>
            <li>Podrás editar el trabajo hasta el cierre de la recepción.</li>
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default PasoDatosGenerales
