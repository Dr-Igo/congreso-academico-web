import { useState } from "react"
import "./ConfiguracionPage.css"
import {
  EDICION_INICIAL,
  EJES_INICIALES,
  TIPOS_INICIALES,
  FECHAS_INICIALES,
  CRITERIOS_INICIALES,
} from "./datos"
import PestanaEdicion from "./pestanas/PestanaEdicion"
import PestanaEjes from "./pestanas/PestanaEjes"
import PestanaTipos from "./pestanas/PestanaTipos"
import PestanaFechas from "./pestanas/PestanaFechas"
import PestanaCriterios from "./pestanas/PestanaCriterios"

export default function ConfiguracionPage() {
  // Los datos viven aquí, para que el resumen de "Edición" vea lo que cambian las otras pestañas
  const [activa, setActiva] = useState("edicion")
  const [edicion, setEdicion] = useState(EDICION_INICIAL)
  const [ejes, setEjes] = useState(EJES_INICIALES)
  const [tipos, setTipos] = useState(TIPOS_INICIALES)
  const [fechas, setFechas] = useState(FECHAS_INICIALES)
  const [criterios, setCriterios] = useState(CRITERIOS_INICIALES)
  const [estado, setEstado] = useState("abierta") // "abierta" o "revision"
  const [mensaje, setMensaje] = useState("")

  // Muestra un aviso verde abajo durante 3 segundos
  function avisar(texto) {
    setMensaje(texto)
    setTimeout(() => setMensaje(""), 3000)
  }

  const comunes = { activa, onCambiar: setActiva, avisar }

  return (
    <div className="cfg">
      {activa === "edicion" && (
        <PestanaEdicion
          {...comunes}
          edicion={edicion}
          setEdicion={setEdicion}
          ejes={ejes}
          tipos={tipos}
          fechas={fechas}
          criterios={criterios}
          estado={estado}
          onCerrarRecepcion={() => setEstado("revision")}
        />
      )}
      {activa === "ejes" && <PestanaEjes {...comunes} ejes={ejes} setEjes={setEjes} />}
      {activa === "tipos" && <PestanaTipos {...comunes} tipos={tipos} setTipos={setTipos} />}
      {activa === "fechas" && <PestanaFechas {...comunes} fechas={fechas} setFechas={setFechas} />}
      {activa === "criterios" && (
        <PestanaCriterios {...comunes} criterios={criterios} setCriterios={setCriterios} />
      )}

      {mensaje && <div className="cfg-toast">{mensaje}</div>}
    </div>
  )
}
