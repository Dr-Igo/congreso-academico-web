import { AlertTriangle, CheckCircle2, CircleHelp, X } from 'lucide-react'

function Notificacion({ notification, onClose }) {
  if (!notification) {
    return null
  }

  let icon = <CircleHelp size={19} />

  if (notification.type === 'success') {
    icon = <CheckCircle2 size={19} />
  }

  if (notification.type === 'warning') {
    icon = <AlertTriangle size={19} />
  }

  return (
    <div className={`hu3-toast hu3-toast--${notification.type}`} role="status">
      <span className="hu3-toast__icon">{icon}</span>
      <span>{notification.text}</span>
      <button onClick={onClose} type="button" aria-label="Cerrar notificación">
        <X size={16} />
      </button>
    </div>
  )
}

export default Notificacion
