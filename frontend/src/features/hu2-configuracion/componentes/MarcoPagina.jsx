// El marco que se repite en las 5 pestañas:
// título + subtítulo + botones a la derecha + barra de pestañas.

const PESTANAS = [
  { id: "edicion", nombre: "Edición" },
  { id: "ejes", nombre: "Ejes temáticos" },
  { id: "tipos", nombre: "Tipos de trabajo" },
  { id: "fechas", nombre: "Fechas límite" },
  { id: "criterios", nombre: "Criterios de evaluación" },
]

export default function MarcoPagina({ titulo, subtitulo, acciones, activa, onCambiar, children }) {
  return (
    <section>
      <div className="cfg-encabezado">
        <div>
          <h1 className="cfg-titulo">{titulo}</h1>
          {subtitulo && <p className="cfg-subtitulo">{subtitulo}</p>}
        </div>
        <div className="cfg-acciones">{acciones}</div>
      </div>

      <nav className="cfg-pestanas">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onCambiar(p.id)}
            className={"cfg-pestana" + (activa === p.id ? " cfg-pestana-activa" : "")}
          >
            {p.nombre}
          </button>
        ))}
      </nav>

      <div className="cfg-contenido">{children}</div>
    </section>
  )
}
