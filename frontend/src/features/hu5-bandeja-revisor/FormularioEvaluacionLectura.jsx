import './FormularioEvaluacion.css';

export function FormularioEvaluacionLectura({ trabajo, onVolver }) {
  // 1. RECUPERAR LA DATA DINÁMICA: Si tú la llenaste, la usa. Si es un trabajo de prueba viejo, usa el default.
  const data = trabajo.evaluacionGuardada || {
    puntajes: { originalidad: 16, rigor: 15, claridad: 18, relevancia: 17 },
    recomendacion: 'Aceptar con observaciones',
    comentarioAutor: 'El trabajo es sólido en su exposición. Recomiendo justificar la selección de repositorios y añadir una comparación con una línea base sin refactorización.'
  };

  // 2. CALCULAR PROMEDIO REAL
  const pesos = { originalidad: 0.25, rigor: 0.30, claridad: 0.20, relevancia: 0.25 };
  let sumaPonderada = 0;
  Object.keys(pesos).forEach(key => {
    sumaPonderada += Number(data.puntajes[key]) * pesos[key];
  });
  const promedioFinal = sumaPonderada.toFixed(1);

  return (
    <div className="eval-wrapper">
      
      <div style={{ backgroundColor: '#EAF5F0', border: '1px solid #1E7F4D', color: '#1E7F4D', padding: '16px', borderRadius: '4px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '500' }}>
        <div style={{ backgroundColor: '#1E7F4D', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>✓</div>
        <span>Evaluación enviada y sellada en esta sesión. Ya no admite cambios; si necesita corregirla, solicítelo al comité.</span>
      </div>

      <div className="eval-breadcrumb">
        Mi bandeja &gt; {trabajo.id} &gt; Evaluación
      </div>

      <div className="eval-header-grid">
        <div>
          <div className="eval-tags">
            <span className="eval-tag-id">{trabajo.id}</span>
            <span style={{ backgroundColor: '#F6E9EC', color: '#5C1925', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{trabajo.tema}</span>
            <span className="eval-tag-normal">{trabajo.tipo}</span>
            <span style={{ border: '1px solid #E4DFDA', color: '#6F6663', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', backgroundColor: '#FBFAF8' }}>Solo lectura</span>
          </div>
          <h1 className="eval-title">{trabajo.titulo}</h1>
        </div>
        <div className="eval-actions-top">
          <button className="btn-outline">Abrir documento</button>
          <div style={{ marginTop: '16px', border: '1px solid #B7791F', color: '#B7791F', padding: '8px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FDFBF7' }}>
            Recomendación: {data.recomendacion}
          </div>
        </div>
      </div>

      <div className="eval-main-grid">
        <div className="eval-table-container">
          <div className="eval-row header">
            <div>Criterio</div>
            <div style={{ textAlign: 'center' }}>Peso</div>
            <div style={{ textAlign: 'center' }}>Puntaje</div>
            <div>Comentario del criterio</div>
          </div>

          {[
            { id: 'originalidad', nombre: 'Originalidad', peso: '25 %', desc: 'La propuesta adapta métricas conocidas a un contexto.' },
            { id: 'rigor', nombre: 'Rigor metodológico', peso: '30 %', desc: 'El tamaño de la muestra debería justificarse mejor.' },
            { id: 'claridad', nombre: 'Claridad de la exposición', peso: '20 %', desc: 'Buena estructura general.' },
            { id: 'relevancia', nombre: 'Relevancia y aporte', peso: '25 %', desc: 'Aplicable a cursos de proyectos.' }
          ].map((crit) => (
            <div key={crit.id} className="eval-row">
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{crit.nombre}</div>
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#6F6663' }}>{crit.peso}</div>
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '15px' }}>{data.puntajes[crit.id]}</div>
              <div style={{ fontSize: '14px', color: '#6F6663' }}>{crit.desc}</div>
            </div>
          ))}

          <div className="eval-row footer">
            <div style={{ gridColumn: '1 / 4', fontWeight: '600', color: '#6F6663', fontSize: '14px' }}>
              Promedio ponderado final
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', color: '#7A2231' }}>
              {promedioFinal}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ border: '1px solid #E4DFDA', borderRadius: '4px', padding: '24px', backgroundColor: 'white' }}>
            <h3 style={{ fontSize: '12px', color: '#6F6663', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', margin: '0 0 16px 0' }}>Datos de la entrega</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: '#6F6663' }}>Enviada</span>
              <span style={{ fontWeight: '600', color: '#1F1A1B' }}>Sesión actual</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#6F6663' }}>Estado</span>
              <span style={{ fontWeight: '600', color: '#1F1A1B' }}>Cerrada</span>
            </div>
          </div>
          <div style={{ backgroundColor: '#FBFAF8', border: '1px solid #E4DFDA', borderRadius: '4px', padding: '16px', fontSize: '13px', color: '#6F6663', lineHeight: '1.5' }}>
            Los campos se muestran como texto: en modo lectura no hay controles de edición ni botón de envío.
          </div>
        </div>
      </div>

      <div className="eval-bottom-grid">
        <div style={{ border: '1px solid #E4DFDA', padding: '24px', borderRadius: '4px', backgroundColor: 'white' }}>
          <h3 style={{ fontSize: '12px', color: '#6F6663', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', margin: '0 0 16px 0' }}>Comentarios al autor</h3>
          <p style={{ fontSize: '14px', color: '#1F1A1B', lineHeight: '1.6', margin: '0' }}>{data.comentarioAutor}</p>
        </div>
      </div>

      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E4DFDA', display: 'flex', justifyContent: 'flex-start' }}>
         <button onClick={onVolver} className="btn-outline">Volver a la bandeja</button>
      </div>

    </div>
  );
}