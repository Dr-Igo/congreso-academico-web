// Ventana modal general: fondo oscuro + caja blanca con título, cuerpo y pie.
// Si peligro es true, la franja de arriba es roja.
export default function Modal({ titulo, onCerrar, pie, peligro = false, ancho = 640, children }) {
  return (
    <div className="cfg-modal-fondo">
      <div
        className={"cfg-modal" + (peligro ? " cfg-modal-peligro" : "")}
        style={{ maxWidth: ancho }}
        role="dialog"
        aria-modal="true"
      >
        <div className="cfg-modal-cab">
          <h2 className="cfg-modal-titulo">{titulo}</h2>
          <button type="button" className="cfg-modal-x" onClick={onCerrar} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3l12 12M15 3L3 15" />
            </svg>
          </button>
        </div>
        <div className="cfg-modal-cuerpo">{children}</div>
        <div className="cfg-modal-pie">{pie}</div>
      </div>
    </div>
  )
}

// Modal corto para preguntar "¿seguro que desea eliminar?"
export function ModalConfirmar({ titulo, texto, textoBoton, onCancelar, onConfirmar }) {
  return (
    <Modal
      titulo={titulo}
      onCerrar={onCancelar}
      peligro
      ancho={480}
      pie={
        <>
          <button type="button" className="cfg-btn cfg-btn-borde" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="cfg-btn cfg-btn-peligro" onClick={onConfirmar}>
            {textoBoton}
          </button>
        </>
      }
    >
      <p className="cfg-texto-modal">{texto}</p>
    </Modal>
  )
}
