
import './BandejaRevisor.css'; 

const trabajosFalsos = [
  {
    id: "TRB-2026-042",
    estado: "Revisión pendiente",
    titulo: "Predicción de deserción universitaria mediante aprendizaje supervisado",
    tema: "Inteligencia artificial y datos",
    tipo: "Artículo completo",
    vencimiento: "15/10/2026 - faltan 3 días"
  },
  {
    id: "TRB-2026-043",
    estado: "Evaluado",
    titulo: "Impacto del uso de LLMs en la educación superior",
    tema: "Innovación educativa",
    tipo: "Póster",
    vencimiento: "Entregado el 10/10/2026"
  }
];

function TarjetaTrabajo({ trabajo }) {
  return (
   
    <div className="tarjeta">
      <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
        <span style={{ color: '#666' }}>{trabajo.id}</span>
        <span style={{ color: '#B7791F', fontWeight: 'bold', marginLeft: '12px' }}>{trabajo.estado}</span>
      </p>
      
      <h2 style={{ fontSize: '20px', margin: '0 0 12px 0', fontFamily: '"Source Serif 4", serif' }}>
        {trabajo.titulo}
      </h2>
      
      <div className="tarjeta-etiquetas">
        <span className="etiqueta">{trabajo.tema}</span>
        <span className="etiqueta">{trabajo.tipo}</span>
      </div>
      
      <p style={{ fontSize: '14px', margin: '0 0 16px 0', color: '#444' }}>Vence el {trabajo.vencimiento}</p>
      
      <button className="btn-evaluar">Evaluar</button>
    </div>
  );
}

export function BandejaRevisor() {
  return (
    <div className="bandeja-contenedor"> 
      
      <div className="cabecera-bandeja">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Mi bandeja de revisión</h1>
          <p style={{ color: '#666' }}>6 trabajos asignados · la etapa de revisión cierra el 20/10/2026</p>
        </div>
        
        <div className="cajas-resumen">
          <div className="caja-estadistica-pendientes">
            <span className="caja-texto-pendientes">Pendientes</span>
            <span className="caja-numero-pendientes">2</span>
            
          </div>
          <div className="caja-estadistica-entregadas">
            <span className="caja-texto-entregadas">Entregadas</span>
            <span className="caja-numero-entregadas">4</span>
            
          </div>
        </div>
      </div>     
      
      <div className="filtros-barra">
        <button className="filtro-btn activo">Todas (6)</button>
        <button className="filtro-btn">Pendientes (2)</button>
        <button className="filtro-btn">Entregadas (3)</button>
        <button className="filtro-btn">Vencidas (1)</button>
      </div>
      
      <div className="grid-tarjetas">
        {trabajosFalsos.map((trabajo) => (
          <TarjetaTrabajo key={trabajo.id} trabajo={trabajo} />
        ))}
      </div>
      
    </div>
  );
}