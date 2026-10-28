import { TRABAJOS_INICIALES } from './datos'

const CLAVE_STORAGE = 'hu3-works-v2'

export function cargarTrabajos() {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE)

    if (!textoGuardado) {
      return TRABAJOS_INICIALES
    }

    const trabajosGuardados = JSON.parse(textoGuardado)

    return trabajosGuardados.map((trabajo) => {
      const trabajoDemo = TRABAJOS_INICIALES.find((item) => item.id === trabajo.id)

      if (!trabajoDemo) {
        return trabajo
      }

      return {
        ...trabajoDemo,
        ...trabajo,
        scores: trabajoDemo.scores || trabajo.scores,
        feedback:
          trabajoDemo.feedback && trabajoDemo.feedback.length > 0
            ? trabajoDemo.feedback
            : trabajo.feedback,
        session: trabajoDemo.session || trabajo.session,
      }
    })
  } catch {
    return TRABAJOS_INICIALES
  }
}

export function guardarTrabajos(trabajos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(trabajos))
}

export function obtenerClaseEstado(estado) {
  const clases = {
    Borrador: 'borrador',
    Enviado: 'enviado',
    'En revisión': 'revision',
    Aceptado: 'aceptado',
    Rechazado: 'rechazado',
  }

  return `hu3-estado hu3-estado--${clases[estado]}`
}

export function generarCodigoTrabajo(trabajos) {
  let mayorNumero = 58

  trabajos.forEach((trabajo) => {
    const partes = trabajo.id.split('-')
    const numero = Number(partes[2])

    if (numero > mayorNumero) {
      mayorNumero = numero
    }
  })

  const siguienteNumero = mayorNumero + 1
  const numeroConCeros = String(siguienteNumero).padStart(3, '0')

  return `TRB-2026-${numeroConCeros}`
}

export function obtenerFechaActual() {
  const fecha = new Date()

  return fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function obtenerHoraActual() {
  const fecha = new Date()

  return fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
