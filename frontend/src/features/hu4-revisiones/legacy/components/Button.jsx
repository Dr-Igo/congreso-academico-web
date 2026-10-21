const VARIANTS = {
  primary:
    'bg-primary border-primary text-white hover:bg-primary-dark hover:border-primary-dark disabled:bg-[#cdb0b6] disabled:border-[#cdb0b6] disabled:hover:bg-[#cdb0b6]',
  secondary:
    'bg-surface border-primary text-primary hover:bg-primary-soft disabled:border-[#e0d2d5] disabled:text-[#b9a0a5] disabled:hover:bg-surface',
  warning: 'bg-warning border-warning text-white hover:brightness-90',
  danger: 'bg-danger border-danger text-white hover:brightness-90',
}

export default function Button({ variant = 'primary', className = '', type = 'button', children, ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-sm border px-4 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/** Acción de texto dentro de tablas (Recordar / Reasignar). */
export function LinkButton({ tone = 'primary', className = '', type = 'button', children, ...props }) {
  const tones = {
    primary: 'text-primary hover:text-primary-dark',
    danger: 'text-danger hover:brightness-75',
    muted: 'text-muted hover:text-ink',
  }
  return (
    <button
      type={type}
      className={`text-[12px] font-semibold underline-offset-2 hover:underline disabled:cursor-default disabled:no-underline ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
