import { useState } from "react"
import MarcoPagina from "../componentes/MarcoPagina"
import Modal, { ModalConfirmar } from "../componentes/Modal"
import EstadoVacio from "../componentes/EstadoVacio"

// ---------- Ventana para crear o editar un eje ----------
function ModalEje({ eje, ejes, onCancelar, onGuardar }) {
  const [nombre, setNombre] = useState(eje ? eje.nombre : "")
  const [descripcion, setDescripcion] = useState(eje ? eje.descripcion : "")
  const [responsable, setResponsable] = useState(eje ? eje.responsable : "")
  const [trabajos, setTrabajos] = useState(eje ? String(eje.trabajos) : "0")

  const nombreLimpio = nombre.trim()
  const repetido = ejes.some(
    (e) => e.id !== (eje ? eje.id : null) && e.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  )
  const errorNombre = repetido ? "Ya existe un eje con ese nombre." : ""
  const puedeGuardar = nombreLimpio !== "" && !repetido

  function guardar(e) {
    e.preventDefault()
    if (!puedeGuardar) return
    const cantidad = Math.max(0, parseInt(trabajos, 10) || 0)
    onGuardar({
      nombre: nombreLimpio,
      descripcion: descripcion.trim(),
      responsable: responsable.trim(),
      trabajos: cantidad,
    })
  }

  return (
    <form onSubmit={guardar}>
      <Modal
        titulo={eje ? "Editar eje temático" : "Nuevo eje temático"}
        onCerrar={onCancelar}
        pie={
          <>
            <button type="button" className="cfg-btn cfg-btn-borde" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="button" className="cfg-btn cfg-btn-primario" disabled={!puedeGuardar} onClick={guardar}>
              Guardar eje
            </button>
          </>
        }
      >
        <label className="cfg-etiqueta" htmlFor="eje-nombre">Nombre *</label>
        <input
          id="eje-nombre"
          className={"cfg-campo" + (errorNombre ? " cfg-campo-error" : "")}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoFocus
        />
        {errorNombre && <p className="cfg-error-texto">{errorNombre}</p>}

        <div className="cfg-grupo">
          <label className="cfg-etiqueta" htmlFor="eje-desc">Descripción</label>
          <input
            id="eje-desc"
            className="cfg-campo"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="cfg-grupo">
          <label className="cfg-etiqueta" htmlFor="eje-resp">Responsable</label>
          <input
            id="eje-resp"
            className="cfg-campo"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
          />
        </div>
        <div className="cfg-grupo">
        <label className="cfg-etiqueta" htmlFor="eje-trabajos">Trabajos recibidos</label>
        <input
          id="eje-trabajos"
          className="cfg-campo"
          type="number"
          min="0"
          value={trabajos}
          onChange={(e) => setTrabajos(e.target.value)}
        />
        </div>
      </Modal>
    </form>
  )
}

// ---------- Pestaña ----------
export default function PestanaEjes({ activa, onCambiar, ejes, setEjes, avisar }) {
  const [modal, setModal] = useState(null) // null | "nuevo" | un eje (para editar)
  const [porEliminar, setPorEliminar] = useState(null)
  const [bloqueo, setBloqueo] = useState("")

  const totalTrabajos = ejes.reduce((suma, e) => suma + e.trabajos, 0)
  const subtitulo =
    ejes.length === 0
      ? "Sin ejes configurados"
      : ejes.length + (ejes.length === 1 ? " eje configurado" : " ejes configurados") +
        " · " + totalTrabajos + " trabajos recibidos en total"

  function guardarEje(datos) {
    if (modal === "nuevo") {
      setEjes([...ejes, { id: Date.now(), ...datos }])
      avisar("Eje temático creado.")
    } else {
      setEjes(ejes.map((e) => (e.id === modal.id ? { ...e, ...datos } : e)))
      avisar("Eje temático actualizado.")
    }
    setModal(null)
  }

  function pedirEliminar(eje) {
    if (eje.trabajos > 0) {
      setBloqueo(
        "No se puede eliminar «" + eje.nombre + "»: tiene " + eje.trabajos +
        (eje.trabajos === 1 ? " trabajo recibido" : " trabajos recibidos") +
        ". Primero reasigne los trabajos."
      )
    } else {
      setBloqueo("")
      setPorEliminar(eje)
    }
  }

  function eliminar() {
    setEjes(ejes.filter((e) => e.id !== porEliminar.id))
    setPorEliminar(null)
    avisar("Eje temático eliminado.")
  }

  function abrirNuevo() {
    setBloqueo("")
    setModal("nuevo")
  }

  return (
    <MarcoPagina
      titulo="Ejes temáticos"
      subtitulo={subtitulo}
      acciones={
        <button type="button" className="cfg-btn cfg-btn-primario" onClick={abrirNuevo}>
          Nuevo eje temático
        </button>
      }
      activa={activa}
      onCambiar={onCambiar}
    >
      {bloqueo && (
        <div className="cfg-banner cfg-banner-error">
          <span className="cfg-banner-icono">!</span>
          <span>{bloqueo}</span>
        </div>
      )}

      {ejes.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hay ejes temáticos"
          texto="Los ejes organizan los trabajos y determinan a qué revisores se pueden asignar. Cree al menos uno antes de abrir la recepción."
          textoBoton="Crear el primer eje"
          onClick={abrirNuevo}
        />
      ) : (
        <>
          <div className="cfg-tarjeta cfg-tabla-caja">
            <table className="cfg-tabla">
              <colgroup>
                <col style={{ width: 286 }} />
                <col style={{ width: 371 }} />
                <col style={{ width: 266 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 147 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Responsable</th>
                  <th className="cfg-der">Trabajos</th>
                  <th className="cfg-der">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ejes.map((eje) => (
                  <tr key={eje.id}>
                    <td className="cfg-fuerte">{eje.nombre}</td>
                    <td className="cfg-suave cfg-tabla-desc">{eje.descripcion}</td>
                    <td className="cfg-suave">{eje.responsable}</td>
                    <td className="cfg-der cfg-fuerte">{eje.trabajos}</td>
                    <td className="cfg-der">
                      <button type="button" className="cfg-enlace" onClick={() => setModal(eje)}>
                        Editar
                      </button>
                      <span className="cfg-sep"> · </span>
                      <button type="button" className="cfg-enlace" onClick={() => pedirEliminar(eje)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cfg-nota">
            Un eje con trabajos recibidos no puede eliminarse; primero reasigne los trabajos.
          </p>
        </>
      )}

      {modal && (
        <ModalEje
          eje={modal === "nuevo" ? null : modal}
          ejes={ejes}
          onCancelar={() => setModal(null)}
          onGuardar={guardarEje}
        />
      )}

      {porEliminar && (
        <ModalConfirmar
          titulo="Eliminar eje temático"
          texto={"¿Desea eliminar el eje «" + porEliminar.nombre + "»? Esta acción no se puede deshacer."}
          textoBoton="Eliminar eje"
          onCancelar={() => setPorEliminar(null)}
          onConfirmar={eliminar}
        />
      )}
    </MarcoPagina>
  )
}
