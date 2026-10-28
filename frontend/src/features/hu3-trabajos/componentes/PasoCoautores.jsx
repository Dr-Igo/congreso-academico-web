import { AlertTriangle, ArrowLeft, ArrowRight, Plus, Trash2, Users } from 'lucide-react'
import { TIPOS_TRABAJO } from '../datos'

function PasoCoautores({
  form,
  coauthors,
  correspondingEmail,
  newAuthor,
  errors,
  onNewAuthorChange,
  onCorrespondingChange,
  onRemoveCoauthor,
  onAddCoauthor,
  onBack,
  onContinue,
}) {
  const maximumCoauthors = TIPOS_TRABAJO[form.type].coauthors
  const totalAuthors = coauthors.length

  return (
    <div className="hu3-formulario-layout">
      <div className="hu3-panel hu3-formulario-panel">
        <div className="hu3-panel-encabezado hu3-panel-encabezado--coautores">
          <div>
            <h2>Coautores</h2>
            <p>
              {form.type} · hasta {maximumCoauthors} coautores
            </p>
          </div>
        </div>

        <div className="hu3-autores-tabla">
          <div className="hu3-autores-tabla__cabecera">
            <span>NOMBRE COMPLETO</span>
            <span>CORREO</span>
            <span>INSTITUCIÓN</span>
            <span>CORRESPONDENCIA</span>
            <span aria-hidden="true" />
          </div>

          {coauthors.map((author, index) => (
            <div
              className={
                author.email === correspondingEmail
                  ? 'hu3-autores-tabla__fila hu3-autores-tabla__fila--correspondencia'
                  : 'hu3-autores-tabla__fila'
              }
              key={author.email}
            >
              <strong>{author.name}</strong>
              <span>{author.email}</span>
              <span>{author.institution}</span>

              <label className="hu3-radio-correspondencia">
                <input
                  type="radio"
                  name="corresponding"
                  checked={author.email === correspondingEmail}
                  onChange={() => onCorrespondingChange(author.email)}
                />
                <span>
                  {author.email === correspondingEmail
                    ? index === 0
                      ? 'Autora de correspondencia'
                      : 'Autor de correspondencia'
                    : 'Marcar'}
                </span>
              </label>

              {index > 0 ? (
                <button
                  className="hu3-accion-icono hu3-accion-icono--peligro"
                  title="Quitar coautor"
                  onClick={() => onRemoveCoauthor(author.email)}
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              ) : (
                <span className="hu3-autora-principal">Usted</span>
              )}
            </div>
          ))}
        </div>

        <div className="hu3-agregar-autor">
          <h3>AGREGAR COAUTOR</h3>

          <div className="hu3-agregar-autor__campos">
            <div className="hu3-campo">
              <label htmlFor="author-name">Nombre completo</label>
              <input
                id="author-name"
                value={newAuthor.name}
                onChange={(event) => onNewAuthorChange('name', event.target.value)}
                placeholder="Nombre y apellidos"
                disabled={totalAuthors - 1 >= maximumCoauthors}
              />
              {errors.name && <small className="hu3-error-texto">{errors.name}</small>}
            </div>

            <div className="hu3-campo">
              <label htmlFor="author-email">Correo</label>
              <input
                id="author-email"
                value={newAuthor.email}
                onChange={(event) => onNewAuthorChange('email', event.target.value)}
                placeholder="nombre@universidad.edu.pe"
                disabled={totalAuthors - 1 >= maximumCoauthors}
              />
              {errors.email && <small className="hu3-error-texto">{errors.email}</small>}
            </div>

            <div className="hu3-campo">
              <label htmlFor="author-institution">Institución</label>
              <input
                id="author-institution"
                value={newAuthor.institution}
                onChange={(event) => onNewAuthorChange('institution', event.target.value)}
                placeholder="Universidad o institución"
                disabled={totalAuthors - 1 >= maximumCoauthors}
              />
              {errors.institution && (
                <small className="hu3-error-texto">{errors.institution}</small>
              )}
            </div>

            <button
              className="hu3-btn hu3-btn--secundario hu3-agregar-autor__boton"
              onClick={onAddCoauthor}
              type="button"
              disabled={totalAuthors - 1 >= maximumCoauthors}
            >
              <Plus size={15} />
              Agregar
            </button>
          </div>

          {totalAuthors - 1 >= maximumCoauthors && (
            <p className="hu3-texto-limite-coautores">
              Se alcanzó el máximo de coautores permitido para este tipo de trabajo.
            </p>
          )}
        </div>

        <div className="hu3-coautores-pie">
          <span>
            {totalAuthors} de {maximumCoauthors + 1} autores declarados (autora principal +{' '}
            {maximumCoauthors} coautores como máximo)
          </span>
          <span>El orden de la lista es el orden de firma.</span>
        </div>

        <div className="hu3-formulario-acciones hu3-formulario-acciones--separadas">
          <button className="hu3-btn hu3-btn--secundario" onClick={onBack} type="button">
            <ArrowLeft size={16} />
            Volver a datos generales
          </button>
          <button className="hu3-btn hu3-btn--primario" onClick={onContinue} type="button">
            Continuar
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <aside className="hu3-columna-lateral">
        <div className="hu3-panel hu3-panel-lateral">
          <div className="hu3-panel-lateral__icono">
            <Users size={18} />
          </div>
          <h3>Autor de correspondencia</h3>
          <p>
            Recibe las notificaciones del comité y es responsable de la comunicación oficial. Debe
            haber exactamente uno.
          </p>
        </div>

        <div className="hu3-panel hu3-panel-aviso">
          <h3>
            <AlertTriangle size={17} />
            Conflicto de revisión
          </h3>
          <p>Los coautores declarados no podrán ser asignados como revisores de este trabajo.</p>
        </div>
      </aside>
    </div>
  )
}

export default PasoCoautores
