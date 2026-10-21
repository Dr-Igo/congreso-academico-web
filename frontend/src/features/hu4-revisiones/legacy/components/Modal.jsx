import { useEffect, useId, useRef } from 'react'
import { Close } from './Icons.jsx'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Diálogo accesible: overlay atenuado, Esc para cerrar, foco atrapado. */
export default function Modal({ title, subtitle, onClose, footer, maxWidth = 'max-w-[820px]', children }) {
  const titleId = useId()
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
   closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previous = document.activeElement
    const panel = panelRef.current
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const first = panel.querySelector('[data-autofocus]') ?? panel
    first.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
      } else if (e.key === 'Tab') {
        const items = [...panel.querySelectorAll(FOCUSABLE)]
        if (items.length === 0) return
        const firstEl = items[0]
        const lastEl = items[items.length - 1]
        if (e.shiftKey && (document.activeElement === firstEl || document.activeElement === panel)) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previous?.focus?.()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,26,27,0.55)] p-3 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`flex max-h-[92vh] w-full ${maxWidth} flex-col rounded-sm border-t-2 border-primary bg-surface shadow-modal outline-none`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 pb-3 pt-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-serif text-[18px] font-semibold leading-tight text-ink">
              {title}
            </h2>
            {subtitle && <div className="mt-1 text-[12px] text-muted">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-1 rounded-sm p-1 text-ink hover:bg-primary-soft"
          >
            <Close />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="border-t border-line px-5 py-3">{footer}</footer>}
      </div>
    </div>
  )
}
