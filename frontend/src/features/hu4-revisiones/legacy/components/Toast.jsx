import { useEffect } from 'react'
import { AlertCircle, Check, Close } from './Icons.jsx'

const STYLES = {
  success: 'border-success bg-success-soft text-success',
  info: 'border-line bg-surface text-ink',
  error: 'border-danger bg-danger-soft text-danger',
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4500)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2.5 rounded-sm border border-l-4 px-3.5 py-3 text-[13px] shadow-modal ${STYLES[toast.type]}`}
    >
      <span className="mt-0.5 shrink-0">{toast.type === 'error' ? <AlertCircle /> : <Check />}</span>
      <p className="flex-1 font-medium">{toast.message}</p>
      <button type="button" aria-label="Cerrar aviso" onClick={() => onDismiss(toast.id)} className="shrink-0 opacity-70 hover:opacity-100">
        <Close width={14} height={14} />
      </button>
    </div>
  )
}

export default function ToastHost({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-4 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-5 sm:w-[380px]">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto w-full">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}
