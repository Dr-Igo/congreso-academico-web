// Pantalla "todavía no hay nada": ícono, título, texto y botón
export default function EstadoVacio({ titulo, texto, textoBoton, onClick }) {
  return (
    <div className="cfg-vacio">
      <div className="cfg-vacio-icono">▤</div>
      <h2 className="cfg-vacio-titulo">{titulo}</h2>
      <p className="cfg-vacio-texto">{texto}</p>
      <button type="button" className="cfg-btn cfg-btn-primario" onClick={onClick}>
        {textoBoton}
      </button>
    </div>
  )
}
