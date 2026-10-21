const COLS = [
  { title: 'El congreso', links: ['Bases y requisitos', 'Ejes temáticos', 'Programa'] },
  { title: 'Participantes', links: ['Guía para autores', 'Guía para revisores', 'Preguntas frecuentes'] },
]

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 py-7 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-serif text-[15px] font-semibold">Congreso Académico Estudiantil</p>
          <p className="mt-2 max-w-[260px] text-[11px] leading-relaxed text-white/70">
            Facultad de Ingeniería · Universidad de Lima. Av. Javier Prado Este 4600, Santiago de Surco, Lima.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">{c.title}</p>
            <ul className="mt-2 space-y-1">
              {c.links.map((l) => (
                <li key={l} className="text-[11px] text-white/80">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">Contacto</p>
          <ul className="mt-2 space-y-1 text-[11px] text-white/80">
            <li>congreso@ulima.edu.pe</li>
            <li>(01) 437 6767 anexo 30450</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-3 text-[10px] text-white/55 sm:px-6">
          <span>© 2026 Universidad de Lima. Todos los derechos reservados.</span>
          <span className="flex gap-4">
            <span>Términos de uso</span>
            <span>Política de privacidad</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
