import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BandejaRevisor.css'
import { FormularioEvaluacion } from './FormularioEvaluacion'
import { FormularioEvaluacionLectura } from './FormularioEvaluacionLectura'

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
    id: 'TRB-2026-053',
    estado: 'Vencida',
    categoria: 'vencidas',
    titulo: 'Bienestar emocional y rendimiento académico en primeros ciclos',
    tema: 'Salud y sociedad',
    tipo: 'Póster',
    fecha: 'Venció el 09/10/2026 · hace 3 días',
  },
  {
    id: 'TRB-2026-031',
    estado: 'Entregada',
    categoria: 'entregadas',
    titulo: 'Refactorización guiada por métricas de deuda técnica',
    tema: 'Ingeniería de software',
    tipo: 'Artículo completo',
    fecha: 'Enviada el 06/10/2026 · aceptar con observaciones',
  },
  {
    id: 'TRB-2026-051',
    estado: 'Entregada',
    categoria: 'entregadas',
    titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    tema: 'Sostenibilidad y ciudad',
    tipo: 'Resumen extendido',
    fecha: 'Enviada el 04/10/2026 · aceptar',
  },
  {
    id: 'TRB-2026-035',
    estado: 'Entregada',
    categoria: 'entregadas',
    titulo: 'Pruebas automatizadas en proyectos universitarios de software',
    tema: 'Ingeniería de software',
    tipo: 'Resumen extendido',
    fecha: 'Enviada el 02/10/2026 · aceptar',
  },
  {
    id: 'TRB-2026-045',
    estado: 'Entregada',
    categoria: 'entregadas',
    titulo: 'Detección de fraude en pagos móviles con modelos de árboles',
    tema: 'Economía y mercados',
    tipo: 'Artículo completo',
    fecha: 'Enviada el 30/09/2026 · rechazar',
  },
]

function TarjetaTrabajo({ trabajo, onEvaluar }) {
  // Lógica dinámica para asignar clases según el estado
  let badgeClass = '';
  let fechaClass = '';
  let botonClass = '';
  let textoBoton = '';

  if (trabajo.categoria === 'pendientes') {
    badgeClass = 'estado-pendiente';
    fechaClass = 'fecha-pendiente';
    botonClass = 'btn-evaluar-primary';
    textoBoton = 'Evaluar';
  } else if (trabajo.categoria === 'vencidas') {
    badgeClass = 'estado-vencida';
    fechaClass = 'fecha-vencida';
    botonClass = 'btn-evaluar-danger';
    textoBoton = 'Evaluar ahora';
  } else if (trabajo.categoria === 'entregadas') {
    badgeClass = 'estado-entregada';
    fechaClass = 'fecha-entregada';
    botonClass = 'btn-evaluar-text';
    textoBoton = 'Ver evaluación';
  }

  return (
    <div className="tarjeta">
      {/* 1. Header con código a la izquierda y badge a la derecha */}
      <div className="tarjeta-header">
        <span className="tarjeta-codigo">{trabajo.id}</span>
        <span className={`badge-estado ${badgeClass}`}>
          {trabajo.estado}
        </span>
      </div>

      {/* 2. Título */}
      <h2 className="tarjeta-titulo">{trabajo.titulo}</h2>

      {/* 3. Etiquetas (Chips rojitos y bordes grises) */}
      <div className="tarjeta-etiquetas">
        <span className="etiqueta-tema">{trabajo.tema}</span>
        <span className="etiqueta-tipo">{trabajo.tipo}</span>
      </div>

      {/* 4. Footer Inline: Línea arriba, fecha a la izquierda, botón a la derecha */}
      <div className="tarjeta-footer">
        <span className={fechaClass}>{trabajo.fecha}</span>
        <button
          type="button"
          className={botonClass}
          onClick={() => onEvaluar(trabajo)}
        >
          {textoBoton}
        </button>
      </div>
    </div>
  )
}

export function BandejaRevisor() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todas')
  const [trabajos, setTrabajos] = useState(trabajosIniciales)
  const [trabajoAEvaluar, setTrabajoAEvaluar] = useState(null)

  const conteos = useMemo(
    () => ({
      todas: trabajos.length,
      pendientes: trabajos.filter((t) => t.categoria === 'pendientes').length,
      entregadas: trabajos.filter((t) => t.categoria === 'entregadas').length,
      vencidas: trabajos.filter((t) => t.categoria === 'vencidas').length,
    }),
    [trabajos]
  )

  const trabajosVisibles = useMemo(
    () =>
      filtro === 'todas'
        ? trabajos
        : trabajos.filter((t) => t.categoria === filtro),
    [filtro, trabajos]
  )

  const evaluarTrabajo = (trabajo) => {
    setTrabajoAEvaluar(trabajo)
  }

const manejarGuardadoDeEvaluacion = (payload) => {
    setTrabajos((actuales) =>
      actuales.map((item) =>
        item.id === payload.trabajoId
          ? {
              ...item,
              estado: 'Entregada',
              categoria: 'entregadas',
              fecha: `Evaluada en esta sesión · ${payload.recomendacion.toLowerCase()}`,
              // AQUI ESTÁ LA MAGIA: Guardamos toda tu nota en la memoria de este trabajo
              evaluacionGuardada: payload 
            }
          : item
      )
    )
    setTrabajoAEvaluar(null)
  }

  if (trabajos.length === 0) {
    return (
      <div className="bandeja-contenedor">
        <div className="cabecera-bandeja">
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', fontFamily: '"Source Serif 4", serif' }}>
              Mi bandeja de revisión
            </h1>
            <p style={{ color: '#6F6663', fontSize: '15px' }}>
              Sin trabajos asignados por ahora
            </p>
          </div>
        </div>

        <div className="tarjeta-vacia-contenedor">
          <div className="check-box" aria-hidden="true">✓</div>
          <h2>No tiene revisiones asignadas</h2>
          <p>
            El comité asigna los trabajos cuando cierra la recepción, el 30/09/2026.<br />
            Mantenga sus líneas de interés actualizadas para recibir trabajos afines.
          </p>
          <button
            type="button"
            className="btn-actualizar-lineas"
            onClick={() => navigate('/mi-cuenta')}
          >
            Actualizar mis líneas de interés
          </button>
        </div>
      </div>
    )
  }

  if (trabajoAEvaluar) {
    if (trabajoAEvaluar.categoria === 'entregadas') {
      return (
        <FormularioEvaluacionLectura 
          trabajo={trabajoAEvaluar} 
          onVolver={() => setTrabajoAEvaluar(null)} 
        />
      )
    }
    return (
      <FormularioEvaluacion 
        trabajo={trabajoAEvaluar}
        onCancelar={() => setTrabajoAEvaluar(null)}
        onGuardar={manejarGuardadoDeEvaluacion}
      />
    )
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
          <h1 style={{ fontSize: '28px', marginBottom: '8px', fontFamily: '"Source Serif 4", serif' }}>Mi bandeja de revisión</h1>
          <p style={{ color: '#6F6663', fontSize: '15px' }}>
            {trabajos.length} trabajos asignados · la etapa de revisión cierra el 20/10/2026 a las 18:00
          </p>
        </div>
        <div className="cajas-resumen">
          <div className="caja-estadistica-pendientes">
            <span className="caja-texto-pendientes">Pendientes</span>
            <span className="caja-numero-pendientes">{conteos.pendientes + conteos.vencidas}</span>
          </div>
          <div className="caja-estadistica-entregadas">
            <span className="caja-texto-entregadas">Entregadas</span>
            <span className="caja-numero-entregadas">{conteos.entregadas}</span>
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
            {item.texto} · {conteos[item.id]}
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
              color: '#6F6663'
            }}
          >
            No hay trabajos en esta categoría.
          </p>
        )}
      </div>
    </div>
  )
}
