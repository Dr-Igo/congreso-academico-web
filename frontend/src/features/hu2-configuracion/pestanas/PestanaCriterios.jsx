import { useState } from "react"
import MarcoPagina from "../componentes/MarcoPagina"
import Modal, { ModalConfirmar } from "../componentes/Modal"
import EstadoVacio from "../componentes/EstadoVacio"
import { sumarPesos } from "../utilidades"

// ---------- Ventana para crear o editar un criterio ----------
function ModalCriterio({ criterio, criterios, onCancelar, onGuardar }) {
  const [nombre, setNombre] = useState(criterio ? criterio.nombre : "")
  const [descripcion, setDescripcion] = useState(criterio ? criterio.descripcion : "")
  const [peso, setPeso] = useState(criterio ? String(criterio.peso) : "")

  const nombreLimpio = nombre.trim()
  const repetido = criterios.some(
    (c) => c.id !== (criterio ? criterio.id : null) && c.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  )
  const errorNombre = repetido ? "Ya existe un criterio con ese nombre." : ""
  const errorPeso =
    peso !== "" && (Number(peso) < 1 || Number(peso) > 100)
      ? "El peso debe estar entre 1 y 100."
      : ""
  const puedeGuardar = nombreLimpio !== "" && !repetido && peso !== "" && errorPeso === ""

  function guardar(e) {
    e.preventDefault()
    if (!puedeGuardar) return
    onGuardar({ nombre: nombreLimpio, descripcion: descripcion.trim(), peso: Number(peso) })
  }

  return (
    <form onSubmit={guardar}>
      <Modal
        titulo={criterio ? "Editar criterio" : "Nuevo criterio"}
        onCerrar={onCancelar}
        pie={
          <>
            <button type="button" className="cfg-btn cfg-btn-borde" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="button" className="cfg-btn cfg-btn-primario" disabled={!puedeGuardar} onClick={guardar}>
              Guardar criterio
            </button>
          </>
        }
      >
        <label className="cfg-etiqueta" htmlFor="cri-nombre">Nombre *</label>
        <input
          id="cri-nombre"
          className={"cfg-campo" + (errorNombre ? " cfg-campo-error" : "")}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoFocus
        />
        {errorNombre && <p className="cfg-error-texto">{errorNombre}</p>}

        <div className="cfg-grupo">
          <label className="cfg-etiqueta" htmlFor="cri-desc">Descripción</label>
          <input
            id="cri-desc"
            className="cfg-campo"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="cfg-grupo">
          <label className="cfg-etiqueta" htmlFor="cri-peso">Peso (%) *</label>
          <input
            id="cri-peso"
            type="number"
            min="1"
            max="100"
            className={"cfg-campo cfg-campo-corto" + (errorPeso ? " cfg-campo-error" : "")}
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
          {errorPeso && <p className="cfg-error-texto">{errorPeso}</p>}
        </div>
      </Modal>
    </form>
  )
}

// ---------- Pestaña ----------
export default function PestanaCriterios({ activa, onCambiar, criterios, setCriterios, avisar }) {
  const [modal, setModal] = useState(null) // null | "nuevo" | un criterio
  const [porEliminar, setPorEliminar] = useState(null)

  // Valores calculados (no son useState)
  const total = sumarPesos(criterios)
  const diferencia = 100 - total

  function guardarCriterio(datos) {
    if (modal === "nuevo") {
      setCriterios([...criterios, { id: Date.now(), ...datos }])
      avisar("Criterio creado.")
    } else {
      setCriterios(criterios.map((c) => (c.id === modal.id ? { ...c, ...datos } : c)))
      avisar("Criterio actualizado.")
    }
    setModal(null)
  }

  function eliminar() {
    setCriterios(criterios.filter((c) => c.id !== porEliminar.id))
    setPorEliminar(null)
    avisar("Criterio eliminado.")
  }

  function guardarTodo() {
    console.log(criterios)
    avisar(
      total === 100
        ? "Criterios guardados."
        : "Criterios guardados. Recuerde que los pesos deben sumar 100."
    )
  }

  // El aviso de arriba cambia según el total
  let banner
  if (total === 100) {
    banner = (
      <div className="cfg-banner cfg-banner-ok cfg-banner-doble">
        <span><strong>Listo:</strong> los pesos suman 100 de 100.</span>
        <strong>Completo</strong>
      </div>
    )
  } else if (total < 100) {
    banner = (
      <div className="cfg-banner cfg-banner-aviso cfg-banner-doble">
        <span>
          <strong>Advertencia:</strong> los pesos suman {total} de 100. Ajuste los criterios antes de
          abrir la etapa de revisión.
        </span>
        <strong>Faltan {diferencia} {diferencia === 1 ? "punto" : "puntos"}</strong>
      </div>
    )
  } else {
    banner = (
      <div className="cfg-banner cfg-banner-error cfg-banner-doble">
        <span>
          <strong>Error:</strong> los pesos suman {total} de 100. Reduzca los pesos antes de abrir
          la etapa de revisión.
        </span>
        <strong>Sobran {-diferencia} {-diferencia === 1 ? "punto" : "puntos"}</strong>
      </div>
    )
  }

  const claseTotal = total === 100 ? "cfg-verde" : total > 100 ? "cfg-peligro-texto" : "cfg-ambar"

  return (
    <MarcoPagina
      titulo="Criterios de evaluación"
      subtitulo="Los pesos de todos los criterios deben sumar 100."
      acciones={
        <>
          <button type="button" className="cfg-btn cfg-btn-borde" onClick={() => setModal("nuevo")}>
            Nuevo criterio
          </button>
          <button type="button" className="cfg-btn cfg-btn-primario" onClick={guardarTodo}>
            Guardar criterios
          </button>
        </>
      }
      activa={activa}
      onCambiar={onCambiar}
    >
      {criterios.length > 0 && banner}

      {criterios.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hay criterios de evaluación"
          texto="Los criterios guían a los revisores al evaluar cada trabajo. Sus pesos deben sumar 100."
          textoBoton="Crear el primer criterio"
          onClick={() => setModal("nuevo")}
        />
      ) : (
        <div className="cfg-tarjeta cfg-tabla-caja">
          <table className="cfg-tabla cfg-tabla-alta">
            <colgroup>
              <col style={{ width: 330 }} />
              <col style={{ width: 598 }} />
              <col style={{ width: 102 }} />
              <col style={{ width: 170 }} />
            </colgroup>
            <thead>
              <tr>
                <th>Criterio</th>
                <th>Descripción</th>
                <th className="cfg-der">Peso</th>
                <th className="cfg-der cfg-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {criterios.map((c) => (
                <tr key={c.id}>
                  <td className="cfg-fuerte">{c.nombre}</td>
                  <td className="cfg-suave cfg-tabla-desc">{c.descripcion}</td>
                  <td className="cfg-der cfg-fuerte">{c.peso}</td>
                  <td className="cfg-der cfg-acciones">
                    <button type="button" className="cfg-enlace" onClick={() => setModal(c)}>
                      Editar
                    </button>
                    <span className="cfg-sep"> · </span>
                    <button type="button" className="cfg-enlace" onClick={() => setPorEliminar(c)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="cfg-fila-total">
                <td className="cfg-fuerte">Total</td>
                <td></td>
                <td className={"cfg-der cfg-fuerte " + claseTotal}>{total}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ModalCriterio
          criterio={modal === "nuevo" ? null : modal}
          criterios={criterios}
          onCancelar={() => setModal(null)}
          onGuardar={guardarCriterio}
        />
      )}

      {porEliminar && (
        <ModalConfirmar
          titulo="Eliminar criterio"
          texto={"¿Desea eliminar el criterio «" + porEliminar.nombre + "»? Esta acción no se puede deshacer."}
          textoBoton="Eliminar criterio"
          onCancelar={() => setPorEliminar(null)}
          onConfirmar={eliminar}
        />
      )}
    </MarcoPagina>
  )
}
