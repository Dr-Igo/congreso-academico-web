const pageBtn =
  'h-7 min-w-7 rounded-sm border px-2 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

export default function Pagination({ page, pageCount, onChange, summary }) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-bg px-4 py-3">
      <p className="text-[12px] text-muted" aria-live="polite">
        {summary}
      </p>
      <nav aria-label="Paginación" className="flex items-center gap-1.5">
        <button
          type="button"
          className={`${pageBtn} border-line bg-surface text-ink hover:border-muted`}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Anterior
        </button>
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            aria-current={n === page ? 'page' : undefined}
            className={`${pageBtn} ${n === page ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-ink hover:border-muted'}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          className={`${pageBtn} border-line bg-surface text-ink hover:border-muted`}
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
        >
          Siguiente
        </button>
      </nav>
    </div>
  )
}
