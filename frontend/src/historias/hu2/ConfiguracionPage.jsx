import { useState } from "react"
import "./hu2.css"
import PestanaEdicion from "./PestanaEdicion"
import PestanaFechas from "./PestanaFechas"
import PestanaCriterios from "./PestanaCriterios"
import PestanaEjes from "./PestanaEjes"
import PestanaTipos from "./PestanaTipos"

const pestanas = [
  { id: "edicion", nombre: "Edición" },
  { id: "ejes", nombre: "Ejes temáticos" },
  { id: "tipos", nombre: "Tipos de trabajo" },
  { id: "fechas", nombre: "Fechas límite" },
  { id: "criterios", nombre: "Criterios de evaluación" },
]

export default function ConfiguracionPage() {
  const [activa, setActiva] = useState("edicion")

  return (
    <div className="hu2-scope">
      <h1 className="text-3xl font-bold">Configuración de la edición</h1>
      <p className="text-suave mb-4">Defina la edición vigente antes de abrir la recepción de trabajos.</p>

      <div className="flex gap-6 border-b border-borde mb-6">
        {pestanas.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiva(p.id)}
            className={
              "pb-2 cursor-pointer " +
              (activa === p.id
                ? "border-b-2 border-primary text-primary font-semibold"
                : "text-suave hover:text-texto")
            }
          >
            {p.nombre}
          </button>
        ))}
      </div>

      {activa === "edicion" && <PestanaEdicion />}
      {activa === "ejes" && <PestanaEjes />}
      {activa === "tipos" && <PestanaTipos />}
      {activa === "fechas" && <PestanaFechas />}
      {activa === "criterios" && <PestanaCriterios />}
    </div>
  )
}