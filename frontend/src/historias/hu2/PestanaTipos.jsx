import { useState } from "react"

const etiqueta = "block text-xs uppercase tracking-wide text-suave mb-1"
const campo = "w-full border border-borde bg-white px-3 py-2 text-sm"

export default function PestanaTipos() {
  const [tipos, setTipos] = useState([
    { id: 1, nombre: "Artículo completo", paginas: 12, trabajos: 2 },
    { id: 2, nombre: "Póster", paginas: 1, trabajos: 0 },
  ])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nombre, setNombre] = useState("")
  const [paginas, setPaginas] = useState("")

  // Valores calculados (no son useState)
  const nombreLimpio = nombre.trim()
  const repetido = tipos.some(
    (t) => t.nombre.toLowerCase() === nombreLimpio.toLowerCase()
  )
  const errorNombre = repetido ? "Ya existe un tipo con ese nombre." : ""
  const errorPaginas =
    paginas !== "" && Number(paginas) < 1 ? "Debe ser al menos 1 página." : ""
  const puedeGuardar =
    nombreLimpio !== "" && paginas !== "" && !repetido && errorPaginas === ""

  function abrirModal() {
    setNombre("")
    setPaginas("")
    setModalAbierto(true)
  }

  function agregar(e) {
    e.preventDefault()
    setTipos([
      ...tipos,
      { id: Date.now(), nombre: nombreLimpio, paginas: Number(paginas), trabajos: 0 },
    ])
    setModalAbierto(false)
  }

  function eliminar(id) {
    setTipos(tipos.filter((t) => t.id !== id))
  }

  return (
    <div className="bg-white border border-borde border-t-4 border-t-primary p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tipos de trabajo</h2>
        <button
          onClick={abrirModal}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 text-sm"
        >
          Agregar tipo
        </button>
      </div>

      {tipos.length === 0 ? (
        <p className="border border-borde bg-fondo text-suave text-sm px-3 py-6 text-center">
          Aún no hay tipos de trabajo. Agrega el primero.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-suave border-b border-borde">
              <th className="py-2">Tipo</th>
              <th className="py-2">Máx. páginas</th>
              <th className="py-2">Trabajos recibidos</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo) => (
              <tr key={tipo.id} className="border-b border-borde">
                <td className="py-3">{tipo.nombre}</td>
                <td className="py-3">{tipo.paginas}</td>
                <td className="py-3">{tipo.trabajos}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => eliminar(tipo.id)}
                    disabled={tipo.trabajos > 0}
                    title={
                      tipo.trabajos > 0
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

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={agregar}
            className="bg-white border border-borde w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Nuevo tipo de trabajo</h3>

            <label className={etiqueta}>Nombre del tipo</label>
            <input
              className={campo + (errorNombre ? " border-red-600" : "")}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
            {errorNombre && (
              <p className="text-red-700 text-xs mt-1">{errorNombre}</p>
            )}

            <label className={etiqueta + " mt-4"}>Máximo de páginas</label>
            <input
              type="number"
              className={campo + (errorPaginas ? " border-red-600" : "")}
              value={paginas}
              onChange={(e) => setPaginas(e.target.value)}
            />
            {errorPaginas && (
              <p className="text-red-700 text-xs mt-1">{errorPaginas}</p>
            )}

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
                Guardar tipo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}