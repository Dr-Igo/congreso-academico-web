import { useState } from "react"
import MarcoPagina from "../componentes/MarcoPagina"
import ModalCambioEstado from "../componentes/ModalCambioEstado"
import { formatearFecha, sumarPesos, validarFechas } from "../utilidades"

function Fila({ nombre, valor, color = "" }) {
  return (
    <div className="ed-fila">
      <span>{nombre}</span>
      <strong className={color}>{valor}</strong>
    </div>
  )
}

export default function PestanaEdicion({
  activa, onCambiar, edicion, setEdicion, ejes, tipos, fechas, criterios,
  estado, onCerrarRecepcion, avisar,
}) {
  const [modalEstado, setModalEstado] = useState(false)

  // ----- valores calculados (no son useState) -----
  const errorNombre = edicion.nombre.trim() === "" ? "Ingrese el nombre de la edición." : ""
  const errorAnio = /^\d{4}$/.test(edicion.anio) ? "" : "Ingrese un año de 4 dígitos."
  const errorSede = edicion.sede.trim() === "" ? "Ingrese la sede." : ""
  const hayErrores = errorNombre !== "" || errorAnio !== "" || errorSede !== ""

  const totalPesos = sumarPesos(criterios)
  const fechasOk = !validarFechas(fechas).hayErrores
  const trabajosRecibidos = ejes.reduce((suma, e) => suma + e.trabajos, 0)
  const abierta = estado === "abierta"

  function cambiar(campo, valor) {
    setEdicion({ ...edicion, [campo]: valor })
  }

  function guardar(e) {
    e.preventDefault()
    if (hayErrores) return
    console.log(edicion)
    avisar("Datos de la edición guardados.")
  }

  const acciones = (
    <>
      <button
        type="button"
        className="cfg-btn cfg-btn-borde"
        disabled={!abierta}
        onClick={() => setModalEstado(true)}
      >
        Cambiar estado de la edición
      </button>
      <button type="submit" form="form-edicion" className="cfg-btn cfg-btn-primario" disabled={hayErrores}>
        Guardar cambios
      </button>
    </>
  )

  return (
    <MarcoPagina
      titulo="Configuración de la edición"
      subtitulo="Defina la edición vigente antes de abrir la recepción de trabajos."
      acciones={acciones}
      activa={activa}
      onCambiar={onCambiar}
    >
      <div className="ed-grid">
        {/* Tarjeta izquierda */}
        <form id="form-edicion" onSubmit={guardar} className="cfg-tarjeta ed-tarjeta">
          <div className="ed-tarjeta-cab">
            <h2 className="ed-tarjeta-titulo">Datos generales</h2>
            <span className={"cfg-pastilla " + (abierta ? "cfg-pastilla-azul" : "cfg-pastilla-ambar")}>
              {abierta ? "Estado: recepción abierta" : "Estado: en revisión"}
            </span>
          </div>

          <div className="ed-fila-2">
            <div>
              <label className="cfg-etiqueta" htmlFor="ed-nombre">Nombre de la edición</label>
              <input
                id="ed-nombre"
                className={"cfg-campo" + (errorNombre ? " cfg-campo-error" : "")}
                value={edicion.nombre}
                onChange={(e) => cambiar("nombre", e.target.value)}
              />
              {errorNombre && <p className="cfg-error-texto">{errorNombre}</p>}
            </div>
            <div>
              <label className="cfg-etiqueta" htmlFor="ed-anio">Año</label>
              <input
                id="ed-anio"
                className={"cfg-campo" + (errorAnio ? " cfg-campo-error" : "")}
                value={edicion.anio}
                maxLength={4}
                onChange={(e) => cambiar("anio", e.target.value)}
              />
              {errorAnio && <p className="cfg-error-texto">{errorAnio}</p>}
            </div>
          </div>

          <div className="cfg-grupo">
            <label className="cfg-etiqueta" htmlFor="ed-sede">Sede</label>
            <input
              id="ed-sede"
              className={"cfg-campo" + (errorSede ? " cfg-campo-error" : "")}
              value={edicion.sede}
              onChange={(e) => cambiar("sede", e.target.value)}
            />
            {errorSede && <p className="cfg-error-texto">{errorSede}</p>}
          </div>

          <div className="cfg-grupo">
            <label className="cfg-etiqueta" htmlFor="ed-desc">Descripción pública</label>
            <textarea
              id="ed-desc"
              className="cfg-campo ed-texto"
              maxLength={400}
              value={edicion.descripcion}
              onChange={(e) => cambiar("descripcion", e.target.value)}
            />
            <p className="ed-ayuda">
              Se muestra en la página pública del congreso. Máximo 400 caracteres.
            </p>
          </div>
        </form>

        {/* Columna derecha */}
        <div className="ed-lateral">
          <div className="cfg-tarjeta ed-caja">
            <p className="cfg-caja-titulo">Resumen de lo configurado</p>
            <Fila
              nombre="Ejes temáticos"
              valor={ejes.length > 0 ? ejes.length + " · listo" : "Pendiente: sin ejes"}
              color={ejes.length > 0 ? "cfg-verde" : "cfg-ambar"}
            />
            <Fila
              nombre="Tipos de trabajo"
              valor={tipos.length > 0 ? tipos.length + " · listo" : "Pendiente: sin tipos"}
              color={tipos.length > 0 ? "cfg-verde" : "cfg-ambar"}
            />
            <Fila
              nombre="Fechas límite"
              valor={fechasOk ? "3 · listo" : "Pendiente: fechas inconsistentes"}
              color={fechasOk ? "cfg-verde" : "cfg-ambar"}
            />
            <Fila
              nombre="Criterios de evaluación"
              valor={totalPesos === 100 ? criterios.length + " · listo" : "Pendiente: pesos suman " + totalPesos}
              color={totalPesos === 100 ? "cfg-verde" : "cfg-ambar"}
            />
          </div>

          <div className="ed-aviso">
            {abierta ? (
              <>
                <p className="ed-aviso-titulo">Recepción abierta</p>
                <p className="ed-aviso-texto">
                  Cierra el {formatearFecha(fechas.recepcion.fecha)} a las {fechas.recepcion.hora}.
                  Mientras esté abierta, los autores pueden editar sus trabajos.
                </p>
              </>
            ) : (
              <>
                <p className="ed-aviso-titulo">En revisión</p>
                <p className="ed-aviso-texto">
                  La recepción está cerrada. Los autores ya no pueden editar ni enviar trabajos.
                </p>
              </>
            )}
          </div>

          <div className="cfg-tarjeta ed-caja">
            <p className="cfg-caja-titulo">Actividad</p>
            <Fila nombre="Trabajos recibidos" valor={trabajosRecibidos} />
            <Fila nombre="Revisores registrados" valor="9" />
          </div>
        </div>
      </div>

      {modalEstado && (
        <ModalCambioEstado
          borradores={2}
          enviados={12}
          onCancelar={() => setModalEstado(false)}
          onConfirmar={() => {
            onCerrarRecepcion()
            setModalEstado(false)
            avisar("La recepción de trabajos se cerró. La edición está en revisión.")
          }}
        />
      )}
    </MarcoPagina>
  )
}
