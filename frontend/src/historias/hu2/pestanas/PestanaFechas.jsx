import MarcoPagina from "../componentes/MarcoPagina"
import { formatearFecha, validarFechas } from "../utilidades"

// Una fila: punto de color + fecha + hora + mensaje de error
function FilaFecha({ color, titulo, valor, onCambiar, errorFecha, errorHora, idBase }) {
  const hayError = errorFecha !== "" || errorHora !== ""
  return (
    <div className="fe-fila">
      <span className="fe-punto" style={{ background: hayError ? "var(--cfg-peligro)" : color }}></span>
      <div>
        <label className="cfg-etiqueta" htmlFor={idBase + "-fecha"}>{titulo} *</label>
        <input
          id={idBase + "-fecha"}
          type="date"
          className={"cfg-campo" + (errorFecha ? " cfg-campo-error" : "")}
          value={valor.fecha}
          onChange={(e) => onCambiar({ ...valor, fecha: e.target.value })}
        />
        {errorFecha && <p className="cfg-error-texto">{errorFecha}</p>}
      </div>
      <div>
        <label className="cfg-etiqueta" htmlFor={idBase + "-hora"}>Hora</label>
        <input
          id={idBase + "-hora"}
          className={"cfg-campo" + (errorHora ? " cfg-campo-error" : "")}
          placeholder="HH:MM"
          maxLength={5}
          value={valor.hora}
          onChange={(e) => onCambiar({ ...valor, hora: e.target.value })}
        />
        {errorHora && <p className="cfg-error-texto">{errorHora}</p>}
      </div>
    </div>
  )
}

export default function PestanaFechas({ activa, onCambiar, fechas, setFechas, avisar }) {
  // Todo esto se calcula solo, cada vez que cambias una fecha
  const v = validarFechas(fechas)

  function cambiar(cual, nuevo) {
    setFechas({ ...fechas, [cual]: nuevo })
  }

  function guardar() {
    if (v.hayErrores) return
    console.log(fechas)
    avisar("Cronograma guardado. El aviso de fecha límite de los autores se actualizó.")
  }

  return (
    <MarcoPagina
      titulo="Fechas límite"
      subtitulo="Las fechas deben ser consecutivas: recepción, revisión y publicación."
      acciones={
        <button type="button" className="cfg-btn cfg-btn-primario" disabled={v.hayErrores} onClick={guardar}>
          Guardar cronograma
        </button>
      }
      activa={activa}
      onCambiar={onCambiar}
    >
      {v.hayErrores && v.mensajeGeneral && (
        <div className="cfg-banner cfg-banner-error">
          <span className="cfg-banner-icono">!</span>
          <span>{v.mensajeGeneral}</span>
        </div>
      )}

      <div className="fe-grid">
        <div className="cfg-tarjeta fe-tarjeta">
          <FilaFecha
            idBase="rec"
            color="var(--cfg-primario)"
            titulo="Cierre de recepción de trabajos"
            valor={fechas.recepcion}
            onCambiar={(n) => cambiar("recepcion", n)}
            errorFecha={v.vacios.recepcion}
            errorHora={v.horas.recepcion}
          />
          <FilaFecha
            idBase="rev"
            color="var(--cfg-dorado)"
            titulo="Cierre de la etapa de revisión"
            valor={fechas.revision}
            onCambiar={(n) => cambiar("revision", n)}
            errorFecha={v.vacios.revision || v.errorRevision}
            errorHora={v.horas.revision}
          />
          <FilaFecha
            idBase="pub"
            color="var(--cfg-verde)"
            titulo="Publicación de resultados"
            valor={fechas.publicacion}
            onCambiar={(n) => cambiar("publicacion", n)}
            errorFecha={v.vacios.publicacion || v.errorPublicacion}
            errorHora={v.horas.publicacion}
          />

          {!v.hayErrores && (
            <p className="cfg-banner cfg-banner-ok fe-ok">
              Cronograma válido: las tres fechas son consecutivas.
            </p>
          )}
        </div>

        {v.hayErrores ? (
          <div className="cfg-tarjeta fe-lateral">
            <p className="cfg-caja-titulo">Orden esperado</p>
            <ol className="fe-orden">
              <li>Cierre de recepción</li>
              <li>Cierre de la revisión</li>
              <li>Publicación de resultados</li>
            </ol>
            <p className="fe-nota">
              El botón de guardar permanece deshabilitado mientras exista una inconsistencia.
            </p>
          </div>
        ) : (
          <div className="cfg-tarjeta fe-lateral">
            <p className="cfg-caja-titulo">Vista previa pública</p>
            <div className="fe-previa">
              <span>Recepción</span>
              <strong>hasta {formatearFecha(fechas.recepcion.fecha)}</strong>
            </div>
            <div className="fe-previa">
              <span>Revisión</span>
              <strong>hasta {formatearFecha(fechas.revision.fecha)}</strong>
            </div>
            <div className="fe-previa">
              <span>Resultados</span>
              <strong>{formatearFecha(fechas.publicacion.fecha)}</strong>
            </div>
            <p className="fe-nota">
              Al guardar, el aviso de fecha límite de los autores se actualiza automáticamente.
            </p>
          </div>
        )}
      </div>
    </MarcoPagina>
  )
}
