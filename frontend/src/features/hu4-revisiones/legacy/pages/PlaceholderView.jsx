import PageHeader from '../components/PageHeader.jsx'
import { InboxEmpty } from '../components/Icons.jsx'

const OWNERS = {
  config: 'HU-2 · Configuración de la edición',
  program: 'HU-6 · Programa del congreso',
  dashboard: 'HU-7 · Métricas y usuarios',
  users: 'HU-7 · Métricas y usuarios',
}

export default function PlaceholderView({ tabKey, label }) {
  return (
    <>
      <PageHeader title={label} />
      <div className="flex flex-col items-center rounded-sm border border-dashed border-line bg-surface px-6 py-14 text-center">
        <span className="grid size-14 place-items-center rounded-sm border border-line bg-bg text-muted">
          <InboxEmpty />
        </span>
        <h2 className="mt-4 font-serif text-[18px] font-semibold text-ink">Sección fuera del alcance de la HU-4</h2>
        <p className="mt-1.5 max-w-[420px] text-[12px] leading-relaxed text-muted">
          Esta pantalla pertenece a otra historia del proyecto ({OWNERS[tabKey]}). Aquí solo se muestra la navegación del comité.
        </p>
      </div>
    </>
  )
}
