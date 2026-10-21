import { ChevronDown } from './Icons.jsx'

/**
 * Desplegable con el estilo "Etiqueta: valor ▾" del mockup.
 * Usa un <select> nativo transparente encima, así conserva teclado y lectores de pantalla.
 */
export default function FilterSelect({ label, value, onChange, options, allLabel = 'todos', className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <option value="">
          {label}: {allLabel}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span className="pointer-events-none flex h-9 items-center justify-between gap-2 rounded-sm border border-line bg-surface px-3 text-[13px] text-ink peer-hover:border-muted peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
        <span className="truncate">
          {label}: {value || allLabel}
        </span>
        <ChevronDown className="shrink-0 text-muted" />
      </span>
    </label>
  )
}
