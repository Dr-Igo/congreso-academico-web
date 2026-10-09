export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-[24px] font-semibold leading-tight text-primary">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[12px] text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Columna con el ancho máximo de 1200px centrada. */
export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 ${className}`}>{children}</div>
}

/** Cabecera de tabla con el estilo de mayúsculas pequeñas del mockup. */
export const th = 'px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-muted'
