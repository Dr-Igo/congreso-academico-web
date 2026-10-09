
import { Link } from 'react-router-dom'
import { TABS, USER } from './headerConstants.js'
export default function Header({ active, onNavigate, editionState, onLogout }) {
  return (
    <header>
      <div className="bg-primary text-white">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-accent font-serif text-[16px] font-bold" aria-hidden="true">
              C
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-[16px] font-semibold leading-tight">Congreso Académico Estudiantil</p>
              <p className="truncate text-[9.5px] uppercase tracking-[0.1em] text-white/75">Universidad de Lima · Edición 2026</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden text-[9.5px] uppercase tracking-[0.1em] text-white/75 sm:inline">Estado de la edición</span>
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-white px-2 py-1 text-[11px] font-semibold text-ink">
              <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
              {editionState}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-[1200px] items-stretch justify-between gap-4 px-4 sm:px-6">
          <nav aria-label="Secciones del comité" className="-mb-px flex min-w-0 overflow-x-auto">
            {TABS.map((t) => {
              const isActive = t.key === active
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => onNavigate(t.key)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap border-b-2 px-3.5 py-3 text-[13px] transition-colors first:pl-0 ${
                    isActive
                      ? 'border-primary font-semibold text-primary'
                      : 'border-transparent font-medium text-ink hover:text-primary'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </nav>
          <div className="flex shrink-0 items-center gap-2.5 py-2">
            <Link className="hidden text-right leading-tight no-underline md:block" to="/mi-cuenta">
              <p className="text-[12px] font-semibold text-ink">{USER.name}</p>
              <p className="text-[10px] text-muted">Rol: {USER.role}</p>
            </Link>
            <Link
              to="/mi-cuenta"
              className="grid size-7 place-items-center rounded-sm bg-primary-soft text-[11px] font-bold text-primary"
              title={`${USER.name} · ${USER.role}`}
            >
              {USER.initials}
            </Link>
            <button
              className="ml-1 whitespace-nowrap text-[11px] font-semibold text-primary hover:underline"
              onClick={onLogout}
              type="button"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
