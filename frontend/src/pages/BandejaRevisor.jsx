import { useMemo, useState } from 'react'
import './BandejaRevisor.css'

const trabajosIniciales = [
  {
    id: 'TRB-2026-042',
    estado: 'Revisión pendiente',
    categoria: 'pendientes',
    titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    tema: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    fecha: 'Vence el 15/10/2026 · faltan 3 días',
  },
  {
    id: 'TRB-2026-043',
    estado: 'Evaluado',
    categoria: 'entregadas',
    titulo: 'Impacto del uso de LLMs en la educación superior',
    tema: 'Innovación educativa',
    tipo: 'Póster',
    fecha: 'Entregado el 10/10/2026',
  },
  {
    id: 'TRB-2026-044',
    estado: 'Revisión pendiente',
    categoria: 'pendientes',
    titulo: 'Clasificación automática de reclamos vecinales',
    tema: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    fecha: 'Vence el 18/10/2026 · faltan 6 días',
  },
  {
    id: 'TRB-2026-045',
    estado: 'Evaluado',
    categoria: 'entregadas',
    titulo: 'Detección de fraude en pagos móviles',
    tema: 'Economía y mercados',
    tipo: 'Artículo completo',
    fecha: 'Entregado el 09/10/2026',
  },
  {
    id: 'TRB-2026-046',
    estado: 'Evaluado',
    categoria: 'entregadas',
    titulo: 'Optimización de rutas de transporte público',
    tema: 'Sostenibilidad y ciudad',
    tipo: 'Resumen extendido',
    fecha: 'Entregado el 08/10/2026',
  },
  {
    id: 'TRB-2026-047',
    estado: 'Revisión vencida',
    categoria: 'vencidas',
    titulo: 'Análisis de accesibilidad en plataformas educativas',
    tema: 'Innovación educativa',
    tipo: 'Póster',
    fecha: 'Venció el 08/10/2026',
  },
]

function TarjetaTrabajo({ trabajo, onEvaluar }) {
  const textoBoton =
    trabajo.categoria === 'entregadas' ? 'Ver evaluación' : 'Evaluar'

  return (
    <div className="tarjeta">
      <p style={{ margin: '0 0 8px', fontSize: '14px' }}>
        <span style={{ color: '#666' }}>{trabajo.id}</span>

        <span
          style={{
            color: '#B7791F',
            fontWeight: 'bold',
            marginLeft: '12px',
          }}
        >
          {trabajo.estado}
        </span>
      </p>

      <h2
        style={{
          fontSize: '20px',
          margin: '0 0 12px',
          fontFamily: '"Source Serif 4", serif',
        }}
      >
        {trabajo.titulo}
      </h2>

      <div className="tarjeta-etiquetas">
        <span className="etiqueta">{trabajo.tema}</span>
        <span className="etiqueta">{trabajo.tipo}</span>
      </div>

      <p style={{ fontSize: '14px', margin: '0 0 16px', color: '#444' }}>
        {trabajo.fecha}
      </p>

      <button
        type="button"
        className="btn-evaluar"
        onClick={() => onEvaluar(trabajo)}
      >
        {textoBoton}
      </button>
    </div>
  )
}

export function BandejaRevisor() {
  const [filtro, setFiltro] = useState('todas')
  const [trabajos, setTrabajos] = useState(trabajosIniciales)

  const conteos = useMemo(
    () => ({
      todas: trabajos.length,
      pendientes: trabajos.filter(
        (trabajo) => trabajo.categoria === 'pendientes',
      ).length,
      entregadas: trabajos.filter(
        (trabajo) => trabajo.categoria === 'entregadas',
      ).length,
      vencidas: trabajos.filter(
        (trabajo) => trabajo.categoria === 'vencidas',
      ).length,
    }),
    [trabajos],
  )

  const trabajosVisibles = useMemo(
    () =>
      filtro === 'todas'
        ? trabajos
        : trabajos.filter((trabajo) => trabajo.categoria === filtro),
    [filtro, trabajos],
  )

  const evaluarTrabajo = (trabajo) => {
    if (trabajo.categoria === 'entregadas') {
      window.alert(`${trabajo.id} ya cuenta con una evaluación registrada.`)
      return
    }

    const comentario = window.prompt(
      `Escribe un comentario de evaluación para ${trabajo.id}:`,
    )

    if (comentario === null) return

    if (!comentario.trim()) {
      window.alert('Debes escribir un comentario antes de guardar.')
      return
    }

    setTrabajos((actuales) =>
      actuales.map((item) =>
        item.id === trabajo.id
          ? {
              ...item,
              estado: 'Evaluado',
              categoria: 'entregadas',
              fecha: 'Evaluación guardada en esta sesión',
            }
          : item,
      ),
    )

    window.alert(`Evaluación de ${trabajo.id} guardada correctamente.`)
  }

  const filtros = [
    { id: 'todas', texto: 'Todas' },
    { id: 'pendientes', texto: 'Pendientes' },
    { id: 'entregadas', texto: 'Entregadas' },
    { id: 'vencidas', texto: 'Vencidas' },
  ]

  return (
    <div className="bandeja-contenedor">
      <div className="cabecera-bandeja">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
            Mi bandeja de revisión
          </h1>

          <p style={{ color: '#666' }}>
            {trabajos.length} trabajos asignados · la etapa de revisión cierra
            el 20/10/2026
          </p>
        </div>

        <div className="cajas-resumen">
          <div className="caja-estadistica-pendientes">
            <span className="caja-texto-pendientes">Pendientes</span>
            <span className="caja-numero-pendientes">
              {conteos.pendientes + conteos.vencidas}
            </span>
          </div>

          <div className="caja-estadistica-entregadas">
            <span className="caja-texto-entregadas">Entregadas</span>
            <span className="caja-numero-entregadas">
              {conteos.entregadas}
            </span>
          </div>
        </div>
      </div>

      <div className="filtros-barra">
        {filtros.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`filtro-btn ${filtro === item.id ? 'activo' : ''}`}
            onClick={() => setFiltro(item.id)}
          >
            {item.texto} ({conteos[item.id]})
          </button>
        ))}
      </div>

      <div className="grid-tarjetas">
        {trabajosVisibles.map((trabajo) => (
          <TarjetaTrabajo
            key={trabajo.id}
            trabajo={trabajo}
            onEvaluar={evaluarTrabajo}
          />
        ))}

        {trabajosVisibles.length === 0 && (
          <p
            style={{
              gridColumn: '1 / -1',
              padding: '24px',
              textAlign: 'center',
              border: '1px solid #E4DFDA',
            }}
          >
            No hay trabajos en esta categoría.
          </p>
        )}
      </div>
    </div>
  )
}