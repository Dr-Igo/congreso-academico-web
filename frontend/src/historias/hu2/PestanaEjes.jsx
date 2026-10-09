import { useState } from "react"

const etiqueta = "block text-xs uppercase tracking-wide text-suave mb-1"
const campo = "w-full border border-borde bg-white px-3 py-2 text-sm"

export default function PestanaEjes() {
  const [ejes, setEjes] = useState([
    { id: 1, nombre: "Inteligencia artificial", trabajos: 3 },
    { id: 2, nombre: "Ingeniería de software", trabajos: 0 },
    { id: 3, nombre: "Ciencia de datos", trabajos: 0 },
  ])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nombre, setNombre] = useState("")

  // Valores calculados (no son useState)
  const nombreLimpio = nombre.trim()
  const repetido = ejes.some(
    (e) => e.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  )
  const error = repetido ? "Ya existe un eje con ese nombre." : ""
  const puedeGuardar = nombreLimpio !== "" && !repetido

  function abrirModal() {
    setNombre("")
    setModalAbierto(true)
  }

  function agregar(e) {
    e.preventDefault()
    setEjes([...ejes, { id: Date.now(), nombre: nombreLimpio, trabajos: 0 }])
    setModalAbierto(false)
  }

  function eliminar(id) {
    setEjes(ejes.filter((e) => e.id !== id))
  }

  return (
    <div className="bg-white border border-borde border-t-4 border-t-primary p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Ejes temáticos</h2>
        <button
          onClick={abrirModal}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 text-sm"
        >
          Agregar eje
        </button>
      </div>

      {ejes.length === 0 ? (
        <p className="border border-borde bg-fondo text-suave text-sm px-3 py-6 text-center">
          Aún no hay ejes temáticos. Agrega el primero.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-suave border-b border-borde">
              <th className="py-2">Eje</th>
              <th className="py-2">Trabajos recibidos</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {ejes.map((eje) => (
              <tr key={eje.id} className="border-b border-borde">
                <td className="py-3">{eje.nombre}</td>
                <td className="py-3">{eje.trabajos}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => eliminar(eje.id)}
                    disabled={eje.trabajos > 0}
                    title={
                      eje.trabajos > 0
                        ? "No se puede eliminar: tiene trabajos recibidos."
                        : ""
                    }
                    className="text-primary text-sm underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Ventana modal: solo se dibuja si modalAbierto es true */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={agregar}
            className="bg-white border border-borde w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Nuevo eje temático</h3>

            <label className={etiqueta}>Nombre del eje</label>
            <input
              className={campo + (error ? " border-red-600" : "")}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-700 text-xs mt-1">{error}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="border border-borde px-4 py-2 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!puedeGuardar}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Guardar eje
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}