import { useState } from "react"

const etiqueta = "block text-xs uppercase tracking-wide text-suave mb-1"
const campo = "w-full border border-borde bg-white px-3 py-2 text-sm"

export default function PestanaCriterios() {
  const [criterios, setCriterios] = useState([
    { id: 1, nombre: "Originalidad", peso: 25 },
    { id: 2, nombre: "Rigor metodológico", peso: 30 },
    { id: 3, nombre: "Claridad", peso: 20 },
    { id: 4, nombre: "Aporte al área", peso: 25 },
  ])

  // Cambia solo el peso del criterio que tocaste
  function cambiarPeso(id, valor) {
    setCriterios(
      criterios.map((c) => (c.id === id ? { ...c, peso: valor } : c))
    )
  }

  // Valores calculados (no son useState)
  const total = criterios.reduce((suma, c) => suma + Number(c.peso), 0)
  const diferencia = 100 - total
  const esValido = total === 100

  function guardar(e) {
    e.preventDefault()
    console.log(criterios)
  }

  return (
    <form
      onSubmit={guardar}
      className="bg-white border border-borde border-t-4 border-t-primary p-6"
    >
      <h2 className="text-lg font-semibold mb-4">Criterios de evaluación</h2>

      {esValido ? (
        <p className="mb-4 border border-green-600 bg-green-50 text-green-800 text-sm px-3 py-2">
          Los pesos suman 100. Todo bien.
        </p>
      ) : (
        <p className="mb-4 border border-red-600 bg-red-50 text-red-800 text-sm px-3 py-2">
          Los pesos suman {total}.{" "}
          {diferencia > 0
            ? `Faltan ${diferencia} puntos para llegar a 100.`
            : `Sobran ${-diferencia} puntos.`}
        </p>
      )}

      <div className="space-y-3">
        {criterios.map((c) => (
          <div key={c.id} className="grid grid-cols-[1fr_120px] gap-4 items-end">
            <div>
              <span className={etiqueta}>Criterio</span>
              <p className="py-2 text-sm">{c.nombre}</p>
            </div>
            <div>
              <label className={etiqueta}>Peso (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className={
                  campo + (esValido ? "" : " border-red-600")
                }
                value={c.peso}
                onChange={(e) => cambiarPeso(c.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-suave">
        Total: <strong className="text-texto">{total}</strong> / 100
      </p>

      <button
        type="submit"
        disabled={!esValido}
        className="mt-6 bg-primary hover:bg-primary-dark text-white px-5 py-2 text-sm disabled:opacity-40"
      >
        Guardar criterios
      </button>
    </form>
  )
}