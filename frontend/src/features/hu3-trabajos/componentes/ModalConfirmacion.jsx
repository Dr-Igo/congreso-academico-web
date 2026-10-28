import { AlertTriangle, Trash2, X } from 'lucide-react'

function ModalConfirmacion({ work, onCancel, onConfirm }) {
  if (!work) {
    return null
  }

  const isDraft = work.status === 'Borrador'

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel()
    }
  }

  return (
    <div className="hu3-modal-fondo" onMouseDown={handleBackdropClick}>
      <div className="hu3-modal" role="dialog" aria-modal="true" aria-labelledby="hu3-modal-title">
        <div className="hu3-modal__icono">
          <AlertTriangle size={22} />
        </div>

        <button
          className="hu3-modal__cerrar"
          onClick={onCancel}
          type="button"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <h2 id="hu3-modal-title">{isDraft ? 'Eliminar borrador' : 'Retirar trabajo'}</h2>

        {isDraft ? (
          <p>
            ¿Seguro que deseas eliminar <strong>{work.id}</strong> — “{work.title}”? Esta acción no
            se puede deshacer.
          </p>
        ) : (
          <p>
            ¿Seguro que deseas retirar <strong>{work.id}</strong> — “{work.title}”? El trabajo será
            retirado de esta edición y dejará de participar en el proceso del congreso.
          </p>
        )}

        <div className="hu3-modal__acciones">
          <button className="hu3-btn hu3-btn--secundario" onClick={onCancel} type="button">
            Cancelar
          </button>
          <button className="hu3-btn hu3-btn--peligro" onClick={() => onConfirm(work)} type="button">
            <Trash2 size={16} />
            {isDraft ? 'Eliminar borrador' : 'Sí, retirar trabajo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion
