import { useState } from "react"
import Modal from "./Modal"

// Pantalla 2.6: cerrar la recepción de trabajos.
// El botón rojo se activa solo si marcas la casilla Y escribes CERRAR.
export default function ModalCambioEstado({ borradores, enviados, onCancelar, onConfirmar }) {
  const [entiendo, setEntiendo] = useState(false)
  const [palabra, setPalabra] = useState("")

  const puedeCerrar = entiendo && palabra === "CERRAR"

  return (
    <Modal
      titulo="Cerrar la recepción de trabajos"
      onCerrar={onCancelar}
      peligro
      ancho={660}
      pie={
        <>
          <button type="button" className="cfg-btn cfg-btn-borde" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            type="button"
            className="cfg-btn cfg-btn-peligro"
            disabled={!puedeCerrar}
            onClick={onConfirmar}
          >
            Cerrar la recepción
          </button>
        </>
      }
    >
      <div className="cfg-cambio">
        <span className="cfg-pastilla cfg-pastilla-azul">Recepción abierta</span>
        <span className="cfg-flecha">→</span>
        <span className="cfg-pastilla cfg-pastilla-ambar">En revisión</span>
      </div>

      <div className="cfg-alerta-peligro">
        <p className="cfg-alerta-titulo">Esta acción tiene efectos inmediatos</p>
        <p className="cfg-alerta-texto">
          Los autores ya no podrán editar ni enviar trabajos. Los {borradores} borradores sin
          enviar quedarán fuera del proceso y los {enviados} trabajos enviados pasarán a la
          etapa de asignación de revisores.
        </p>
      </div>

      <label className="cfg-casilla">
        <input
          type="checkbox"
          checked={entiendo}
          onChange={(e) => setEntiendo(e.target.checked)}
        />
        <span>Entiendo que los autores ya no podrán editar sus trabajos.</span>
      </label>

      <label className="cfg-etiqueta" htmlFor="palabra-cerrar">
        Escriba CERRAR para confirmar
      </label>
      <input
        id="palabra-cerrar"
        className="cfg-campo"
        placeholder="CERRAR"
        value={palabra}
        onChange={(e) => setPalabra(e.target.value)}
        autoComplete="off"
      />
    </Modal>
  )
}
