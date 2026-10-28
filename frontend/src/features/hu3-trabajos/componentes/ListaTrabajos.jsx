import { ArrowRight, FolderOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { ESTADOS_TRABAJO, RECEPCION_ABIERTA } from '../datos'
import { obtenerClaseEstado } from '../utilidades'

function TarjetaTrabajo({ work, onDetail, onEdit, onWithdraw }) {
  const canEdit = RECEPCION_ABIERTA && (work.status === 'Borrador' || work.status === 'Enviado')
  const canWithdraw = RECEPCION_ABIERTA && (work.status === 'Borrador' || work.status === 'Enviado')
  const hasDecision = work.status === 'Aceptado' || work.status === 'Rechazado'

  let footerText = `Registrado el ${work.created}`

  if (work.status === 'Borrador') {
    footerText = 'Sin enviar'
  }

  if (hasDecision) {
    footerText = 'Decisión publicada'
  }

  return (
    <article className="hu3-trabajo-card">
      <div className="hu3-trabajo-card__encabezado">
        <span className="hu3-codigo">{work.id}</span>
        <span className={obtenerClaseEstado(work.status)}>{work.status}</span>
      </div>

      <button className="hu3-trabajo-card__titulo" onClick={onDetail} type="button">
        {work.title}
      </button>

      <p className="hu3-trabajo-card__autores">
        {work.authors.map((author) => author.name).join(', ')}
      </p>

      <div className="hu3-etiquetas">
        <span className="hu3-etiqueta">{work.axis}</span>
        <span className="hu3-etiqueta">{work.type}</span>
      </div>

      <div className="hu3-trabajo-card__pie">
        <span>{footerText}</span>

        <div className="hu3-trabajo-card__acciones">
          <button onClick={onDetail} type="button">
            {hasDecision ? 'Ver dictamen' : 'Ver detalle'}
            <ArrowRight size={14} />
          </button>

          {canEdit && (
            <button className="hu3-accion-icono" onClick={onEdit} type="button" title="Editar">
              <Pencil size={14} />
            </button>
          )}

          {canWithdraw && (
            <button
              className="hu3-accion-icono hu3-accion-icono--peligro"
              onClick={onWithdraw}
              type="button"
              title={work.status === 'Borrador' ? 'Eliminar borrador' : 'Retirar trabajo'}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function ListaTrabajos({
  works,
  filteredWorks,
  filter,
  query,
  onFilterChange,
  onQueryChange,
  onClearFilters,
  onNewWork,
  onDetail,
  onEdit,
  onWithdraw,
}) {
  return (
    <section className="hu3-contenido">
      <div className="hu3-encabezado-pagina">
        <div>
          <p className="hu3-sobretitulo">ÁREA DE AUTOR</p>
          <h1>Mis trabajos</h1>
          <p className="hu3-subtitulo">Consulta y administra tus trabajos como autora o coautora.</p>
        </div>

        <button
          className="hu3-btn hu3-btn--primario"
          onClick={onNewWork}
          type="button"
          disabled={!RECEPCION_ABIERTA}
        >
          <Plus size={17} />
          Nuevo trabajo
        </button>
      </div>

      <div className="hu3-filtros">
        <div className="hu3-filtros__estados">
          {ESTADOS_TRABAJO.map((status) => {
            const count =
              status === 'Todos'
                ? works.length
                : works.filter((work) => work.status === status).length

            return (
              <button
                className={filter === status ? 'hu3-filtro hu3-filtro--activo' : 'hu3-filtro'}
                key={status}
                onClick={() => onFilterChange(status)}
                type="button"
              >
                {status}
                <span>{count}</span>
              </button>
            )
          })}
        </div>

        <label className="hu3-buscador">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por título o código…"
          />
        </label>
      </div>

      {filteredWorks.length === 0 ? (
        <div className="hu3-vacio">
          <div className="hu3-vacio__icono">
            <FolderOpen size={27} />
          </div>

          <h2>
            {works.length === 0
              ? 'Todavía no tienes trabajos registrados'
              : 'No se encontraron trabajos'}
          </h2>

          <p>
            {works.length === 0
              ? 'Registra tu trabajo antes del cierre de la recepción. ' +
                'Puedes guardarlo como borrador y completarlo después.'
              : 'Prueba con otro término de búsqueda o cambia el filtro de estado.'}
          </p>

          {works.length === 0 ? (
            <>
              <button
                className="hu3-btn hu3-btn--primario"
                onClick={onNewWork}
                type="button"
                disabled={!RECEPCION_ABIERTA}
              >
                Registrar mi primer trabajo
              </button>
              <a className="hu3-enlace-vacio" href="/#bases">
                Revisar las bases del congreso
              </a>
            </>
          ) : (
            <button className="hu3-btn hu3-btn--secundario" onClick={onClearFilters} type="button">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="hu3-trabajos-grid">
          {filteredWorks.map((work) => (
            <TarjetaTrabajo
              key={work.id}
              work={work}
              onDetail={() => onDetail(work)}
              onEdit={() => onEdit(work)}
              onWithdraw={() => onWithdraw(work)}
            />
          ))}
        </div>
      )}

      <div className="hu3-lista-pie">
        <span>
          Mostrando {filteredWorks.length} de {works.length} trabajos
        </span>
        <span className="hu3-paginacion">
          Anterior <b>1</b> Siguiente
        </span>
      </div>
    </section>
  )
}

export default ListaTrabajos
