import { useState } from "react"
import MarcoPagina from "../componentes/MarcoPagina"
import Modal, { ModalConfirmar } from "../componentes/Modal"
import EstadoVacio from "../componentes/EstadoVacio"
import { FORMATOS } from "../datos"

// Saca el número de un texto como "8 000 palabras" -> 8000
function numeroDe(texto) {
  const soloDigitos = texto.replace(/\s/g, "").match(/\d+/)
  return soloDigitos ? Number(soloDigitos[0]) : 0
}

// ---------- Ventana para crear o editar un tipo ----------
function ModalTipo({ tipo, tipos, onCancelar, onGuardar }) {
  const [nombre, setNombre] = useState(tipo ? tipo.nombre : "")
  const [extension, setExtension] = useState(tipo ? tipo.extension : "")
  const [formato, setFormato] = useState(tipo ? tipo.formato : FORMATOS[0])
  const [coautores, setCoautores] = useState(tipo ? tipo.coautores : false)
  const [maxCoautores, setMaxCoautores] = useState(tipo ? String(tipo.maxCoautores) : "")

  // ----- errores calculados -----
  const nombreLimpio = nombre.trim()
  const repetido = tipos.some(
    (t) => t.id !== (tipo ? tipo.id : null) && t.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  )
  const errorNombre = repetido ? "Ya existe un tipo con ese nombre." : ""
  const errorExtension =
    extension.trim() !== "" && numeroDe(extension) <= 0
      ? "La extensión debe ser mayor a cero."
      : ""
  const errorCoautores =
    coautores && maxCoautores !== "" && Number(maxCoautores) < 1
      ? "Debe ser al menos 1 coautor."
      : ""

  const puedeGuardar =
    nombreLimpio !== "" &&
    !repetido &&
    numeroDe(extension) > 0 &&
    (!coautores || (maxCoautores !== "" && Number(maxCoautores) >= 1))

  function guardar(e) {
    e.preventDefault()
    if (!puedeGuardar) return
    onGuardar({
      nombre: nombreLimpio,
      extension: extension.trim(),
      formato,
      coautores,
      maxCoautores: coautores ? Number(maxCoautores) : 0,
    })
  }

  return (
    <form onSubmit={guardar}>
      <Modal
        titulo={tipo ? "Editar tipo de trabajo" : "Nuevo tipo de trabajo"}
        onCerrar={onCancelar}
        pie={
          <>
            <button type="button" className="cfg-btn cfg-btn-borde" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="button" className="cfg-btn cfg-btn-primario" disabled={!puedeGuardar} onClick={guardar}>
              Guardar tipo
            </button>
          </>
        }
      >
        <label className="cfg-etiqueta" htmlFor="tipo-nombre">Nombre *</label>
        <input
          id="tipo-nombre"
          className={"cfg-campo" + (errorNombre ? " cfg-campo-error" : "")}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoFocus
        />
        {errorNombre && <p className="cfg-error-texto">{errorNombre}</p>}

        <div className="cfg-dos-col cfg-grupo">
          <div>
            <label className="cfg-etiqueta" htmlFor="tipo-ext">Extensión máxima *</label>
            <input
              id="tipo-ext"
              className={"cfg-campo" + (errorExtension ? " cfg-campo-error" : "")}
              placeholder="Ej.: 8 000 palabras"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
            />
            {errorExtension && <p className="cfg-error-texto">{errorExtension}</p>}
          </div>
          <div>
            <label className="cfg-etiqueta" htmlFor="tipo-formato">Formato esperado *</label>
            <select
              id="tipo-formato"
              className="cfg-campo"
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
            >
              {FORMATOS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="cfg-etiqueta cfg-etiqueta-seccion">Coautores</p>
        <label className="cfg-casilla cfg-casilla-simple">
          <input
            type="checkbox"
            checked={coautores}
            onChange={(e) => {
              setCoautores(e.target.checked)
              if (e.target.checked && maxCoautores === "") setMaxCoautores("2")
            }}
          />
          <span>Admite coautores</span>
        </label>

        <label className="cfg-etiqueta" htmlFor="tipo-max">Número máximo de coautores</label>
        <input
          id="tipo-max"
          type="number"
          min="1"
          className={"cfg-campo cfg-campo-corto" + (errorCoautores ? " cfg-campo-error" : "")}
          value={coautores ? maxCoautores : ""}
          disabled={!coautores}
          onChange={(e) => setMaxCoautores(e.target.value)}
        />
        {errorCoautores && <p className="cfg-error-texto">{errorCoautores}</p>}
      </Modal>
    </form>
  )
}

// ---------- Pestaña ----------
export default function PestanaTipos({ activa, onCambiar, tipos, setTipos, avisar }) {
  const [modal, setModal] = useState(null) // null | "nuevo" | un tipo
  const [porEliminar, setPorEliminar] = useState(null)

  const subtitulo =
    tipos.length === 0
      ? "Sin tipos de trabajo configurados"
      : tipos.length + (tipos.length === 1 ? " tipo habilitado" : " tipos habilitados") + " para esta edición"

  function guardarTipo(datos) {
    if (modal === "nuevo") {
      setTipos([...tipos, { id: Date.now(), ...datos }])
      avisar("Tipo de trabajo creado.")
    } else {
      setTipos(tipos.map((t) => (t.id === modal.id ? { ...t, ...datos } : t)))
      avisar("Tipo de trabajo actualizado.")
    }
    setModal(null)
  }

  function eliminar() {
    setTipos(tipos.filter((t) => t.id !== porEliminar.id))
    setPorEliminar(null)
    avisar("Tipo de trabajo eliminado.")
  }

  return (
    <MarcoPagina
      titulo="Tipos de trabajo"
      subtitulo={subtitulo}
      acciones={
        <button type="button" className="cfg-btn cfg-btn-primario" onClick={() => setModal("nuevo")}>
          Nuevo tipo de trabajo
        </button>
      }
      activa={activa}
      onCambiar={onCambiar}
    >
      {tipos.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hay tipos de trabajo"
          texto="Los tipos definen la extensión y el formato que deben cumplir los autores. Cree al menos uno antes de abrir la recepción."
          textoBoton="Crear el primer tipo"
          onClick={() => setModal("nuevo")}
        />
      ) : (
        <>
        <div className="cfg-tarjeta cfg-tabla-caja">
          <table className="cfg-tabla cfg-tabla-alta">
            <colgroup>
              <col style={{ width: 322 }} />
              <col style={{ width: 225 }} />
              <col style={{ width: 224 }} />
              <col style={{ width: 282 }} />
              <col style={{ width: 147 }} />
            </colgroup>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Extensión máxima</th>
                <th>Formato esperado</th>
                <th>Admite coautores</th>
                <th className="cfg-der">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => (
                <tr key={tipo.id}>
                  <td className="cfg-fuerte">{tipo.nombre}</td>
                  <td>{tipo.extension}</td>
                  <td>{tipo.formato}</td>
                  <td className={"cfg-fuerte " + (tipo.coautores ? "cfg-verde" : "cfg-suave")}>
                    {tipo.coautores ? "Sí · hasta " + tipo.maxCoautores : "No"}
                  </td>
                  <td className="cfg-der">
                    <button type="button" className="cfg-enlace" onClick={() => setModal(tipo)}>
                      Editar
                    </button>
                    <span className="cfg-sep"> · </span>
                    <button type="button" className="cfg-enlace" onClick={() => setPorEliminar(tipo)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cfg-info">
          El alta y la edición de un tipo de trabajo se realizan en modal, con los mismos campos
          de la tabla y validación de extensión mayor a cero.
        </p>
        </>
      )}

      {modal && (
        <ModalTipo
          tipo={modal === "nuevo" ? null : modal}
          tipos={tipos}
          onCancelar={() => setModal(null)}
          onGuardar={guardarTipo}
        />
      )}

      {porEliminar && (
        <ModalConfirmar
          titulo="Eliminar tipo de trabajo"
          texto={"¿Desea eliminar el tipo «" + porEliminar.nombre + "»? Esta acción no se puede deshacer."}
          textoBoton="Eliminar tipo"
          onCancelar={() => setPorEliminar(null)}
          onConfirmar={eliminar}
        />
      )}
    </MarcoPagina>
  )
}
