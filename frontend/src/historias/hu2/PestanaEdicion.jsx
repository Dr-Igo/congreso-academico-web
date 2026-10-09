import { useState } from "react"

const etiqueta = "block mt-3 mb-1 text-sm text-suave"
const campo = "w-full p-2.5 border border-borde rounded-sm bg-white"

export default function PestanaEdicion() {
  const [nombre, setNombre] = useState("VIII Congreso Académico Estudiantil")
  const [anio, setAnio] = useState(2026)
  const [sede, setSede] = useState("Auditorio Central, Universidad de Lima")
  const [descripcion, setDescripcion] = useState("")

  const guardar = (e) => {
    e.preventDefault()
    console.log({ nombre, anio, sede, descripcion })
  }

  return (
    <form onSubmit={guardar} className="bg-white border border-borde border-t-4 border-t-primary rounded-sm p-5 max-w-xl">
      <h2 className="text-xl font-semibold">Datos generales</h2>

      <label className={etiqueta}>Nombre de la edición</label>
      <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <label className={etiqueta}>Año</label>
      <input className={campo} type="number" value={anio} onChange={(e) => setAnio(e.target.value)} />

      <label className={etiqueta}>Sede</label>
      <input className={campo} value={sede} onChange={(e) => setSede(e.target.value)} />

      <label className={etiqueta}>Descripción pública</label>
      <textarea className={campo} rows="4" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <button type="submit" className="mt-4 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-sm cursor-pointer">
        Guardar cambios
      </button>
    </form>
  )
}