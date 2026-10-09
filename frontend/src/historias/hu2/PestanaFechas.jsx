import { useState } from "react"

const etiqueta = "block mt-3 mb-1 text-sm text-suave"
const campo = "w-full p-2.5 border rounded-sm bg-white"

// Un componente pequeño que se repite 3 veces. Recibe datos por props.
function CampoFecha({ titulo, fecha, hora, onFecha, onHora, error }) {
  return (
    <div className="mb-4">
      <label className={etiqueta}>{titulo}</label>
      <div className="flex gap-3">
        <input
          type="date"
          className={campo + (error ? " border-red-700" : " border-borde")}
          value={fecha}
          onChange={(e) => onFecha(e.target.value)}
        />
        <input
          type="time"
          className="w-32 p-2.5 border border-borde rounded-sm bg-white"
          value={hora}
          onChange={(e) => onHora(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
    </div>
  )
}

export default function PestanaFechas() {
  const [recepcion, setRecepcion] = useState("2026-09-30")
  const [horaRecepcion, setHoraRecepcion] = useState("23:59")
  const [revision, setRevision] = useState("2026-10-20")
  const [horaRevision, setHoraRevision] = useState("18:00")
  const [publicacion, setPublicacion] = useState("2026-10-28")
  const [horaPublicacion, setHoraPublicacion] = useState("12:00")

  // Unimos fecha + hora en un solo texto para poder compararlas
  const finRecepcion = recepcion + "T" + horaRecepcion
  const finRevision = revision + "T" + horaRevision
  const finPublicacion = publicacion + "T" + horaPublicacion

  // Los errores se calculan solos cada vez que cambia algo
  const errorRevision =
    recepcion && revision && finRevision <= finRecepcion
      ? "Debe ser posterior al cierre de la recepción."
      : ""
  const errorPublicacion =
    revision && publicacion && finPublicacion <= finRevision
      ? "Debe ser posterior al cierre de la revisión."
      : ""
  const hayErrores = errorRevision !== "" || errorPublicacion !== ""

  const guardar = () => {
    console.log({ finRecepcion, finRevision, finPublicacion })
  }

  return (
    <div className="bg-white border border-borde border-t-4 border-t-primary rounded-sm p-5 max-w-xl">
      <h2 className="text-xl font-semibold">Fechas límite</h2>
      <p className="text-sm text-suave">
        Las fechas deben ser consecutivas: recepción, revisión y publicación.
      </p>

      {hayErrores ? (
        <div className="mt-3 p-3 bg-red-50 border border-red-700 text-red-700 text-sm">
          El cronograma no es consecutivo. Corrija las fechas marcadas para poder guardar.
        </div>
      ) : (
        <div className="mt-3 p-3 bg-green-50 border border-green-700 text-green-800 text-sm">
          Cronograma válido: las tres fechas son consecutivas.
        </div>
      )}

      <CampoFecha
        titulo="Cierre de recepción de trabajos"
        fecha={recepcion}
        hora={horaRecepcion}
        onFecha={setRecepcion}
        onHora={setHoraRecepcion}
      />
      <CampoFecha
        titulo="Cierre de la etapa de revisión"
        fecha={revision}
        hora={horaRevision}
        onFecha={setRevision}
        onHora={setHoraRevision}
        error={errorRevision}
      />
      <CampoFecha
        titulo="Publicación de resultados"
        fecha={publicacion}
        hora={horaPublicacion}
        onFecha={setPublicacion}
        onHora={setHoraPublicacion}
        error={errorPublicacion}
      />

      <button
        onClick={guardar}
        disabled={hayErrores}
        className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Guardar cronograma
      </button>
    </div>
  )
}