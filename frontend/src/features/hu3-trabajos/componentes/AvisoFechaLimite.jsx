import { AlertTriangle, Clock3 } from 'lucide-react'
import { DIAS_RESTANTES, FECHA_LIMITE, RECEPCION_ABIERTA } from '../datos'

function AvisoFechaLimite() {
  if (RECEPCION_ABIERTA) {
    return (
      <div className="hu3-fecha-limite">
        <div>
          <Clock3 size={17} />
          <span>
            <strong>Recepción abierta.</strong> Cierra el {FECHA_LIMITE}.
          </span>
        </div>
        <strong className="hu3-fecha-limite__contador">Faltan {DIAS_RESTANTES} días</strong>
      </div>
    )
  }

  return (
    <div className="hu3-fecha-limite hu3-fecha-limite--cerrada">
      <div>
        <AlertTriangle size={17} />
        <span>
          <strong>Recepción cerrada.</strong> El plazo terminó el {FECHA_LIMITE}.
        </span>
      </div>
      <strong className="hu3-fecha-limite__contador">Modo lectura</strong>
    </div>
  )
}

export default AvisoFechaLimite
