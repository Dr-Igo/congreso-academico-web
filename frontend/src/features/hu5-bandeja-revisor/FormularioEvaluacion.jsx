import { useState, useMemo } from 'react';
import './FormularioEvaluacion.css';

const pesos = { originalidad: 0.25, rigor: 0.30, claridad: 0.20, relevancia: 0.25 };

export function FormularioEvaluacion({ trabajo, onCancelar, onGuardar }) {
  const [puntajes, setPuntajes] = useState({ originalidad: '', rigor: '', claridad: '', relevancia: '' });
  const [comentarios, setComentarios] = useState({ originalidad: '', rigor: '', claridad: '', relevancia: '' });
  const [recomendacion, setRecomendacion] = useState('');
  const [comentarioAutor, setComentarioAutor] = useState('');
  const [observacionComite, setObservacionComite] = useState('');
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const calcularPromedio = useMemo(() => {
    let sumaPonderada = 0;
    let sumaPesos = 0;
    let criteriosLlenos = 0;

    Object.keys(pesos).forEach(key => {
      if (puntajes[key] !== '') {
        sumaPonderada += Number(puntajes[key]) * pesos[key];
        sumaPesos += pesos[key];
        criteriosLlenos++;
      }
    });

    const valor = sumaPesos > 0 ? (sumaPonderada / sumaPesos).toFixed(1) : '--';
    return { valor, criteriosLlenos };
  }, [puntajes]);

  const manejarPuntaje = (criterio, valor) => {
    if (valor === '' || (Number(valor) >= 0 && Number(valor) <= 20)) {
      setPuntajes({ ...puntajes, [criterio]: valor });
    }
  };

  const manejarEnvio = () => {
    setIntentoEnvio(true);
    if (calcularPromedio.criteriosLlenos < 4 || !recomendacion || !comentarioAutor.trim()) {
      return; 
    }
    onGuardar({ trabajoId: trabajo.id, puntajes, recomendacion, comentarioAutor });
  };

  // Función para determinar el color de la opción seleccionada
  const obtenerEstiloRadio = (opcion) => {
    if (recomendacion !== opcion) return {};
    if (opcion === 'Aceptar') return { borderColor: '#1E7F4D', backgroundColor: '#F0F8F4', color: '#17653D', fontWeight: '600' };
    if (opcion === 'Aceptar con observaciones') return { borderColor: '#B7791F', backgroundColor: '#FFFDF7', color: '#975A16', fontWeight: '600' };
    if (opcion === 'Rechazar') return { borderColor: '#B4322B', backgroundColor: '#FEF2F2', color: '#9B2C26', fontWeight: '600' };
    return {};
  };

  return (
    <div className="eval-wrapper">
      <div className="eval-breadcrumb">
        Mi bandeja &gt; {trabajo.id} &gt; Evaluación
      </div>

      <div className="eval-header-grid">
        <div>
          <div className="eval-tags">
            <span className="eval-tag-id">{trabajo.id}</span>
            {/* CHIP DEL TEMA EN GRANATE CLARO */}
            <span style={{ backgroundColor: '#F6E9EC', color: '#5C1925', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
              {trabajo.tema}
            </span>
            <span className="eval-tag-normal">{trabajo.tipo}</span>
          </div>
          <h1 className="eval-title">{trabajo.titulo}</h1>
          <p className="eval-abstract">
            {trabajo.resumen || "Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros académicos de cinco cohortes."}
          </p>
        </div>
        <div className="eval-actions-top">
          <button className="btn-outline">Abrir documento</button>
          <span className="eval-deadline">Vence el 15/10/2026 · faltan 3 días</span>
          <span className="eval-blind-notice">Revisión ciega: no verá los nombres de los autores.</span>
        </div>
      </div>

      <div className="eval-main-grid">
        <div className="eval-table-container">
          <div className="eval-row header">
            <div>Criterio</div>
            <div style={{ textAlign: 'center' }}>Peso</div>
            <div style={{ textAlign: 'center' }}>Puntaje (0-20)</div>
            <div>Comentario del criterio</div>
          </div>

          {[
            { id: 'originalidad', nombre: 'Originalidad', peso: '25 %' },
            { id: 'rigor', nombre: 'Rigor metodológico', peso: '30 %' },
            { id: 'claridad', nombre: 'Claridad de la exposición', peso: '20 %' },
            { id: 'relevancia', nombre: 'Relevancia y aporte', peso: '25 %' }
          ].map((crit) => (
            <div key={crit.id} className="eval-row">
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{crit.nombre}</div>
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#6F6663' }}>{crit.peso}</div>
              <div style={{ textAlign: 'center' }}>
                {/* SOLUCIÓN AL BLOQUEO DE INPUT: Usar placeholder="—" manteniendo el input editable */}
                <input 
                  type="number" 
                  className="eval-score-input"
                  placeholder={intentoEnvio && puntajes[crit.id] === '' ? '—' : ''}
                  style={intentoEnvio && puntajes[crit.id] === '' ? { borderColor: '#B4322B', backgroundColor: '#FEF2F2' } : {}}
                  value={puntajes[crit.id]}
                  onChange={(e) => manejarPuntaje(crit.id, e.target.value)}
                />
              </div>
              <div>
                <textarea 
                  className="eval-textarea"
                  placeholder="Escriba su comentario..."
                  value={comentarios[crit.id]}
                  onChange={(e) => setComentarios({ ...comentarios, [crit.id]: e.target.value })}
                />
                {intentoEnvio && puntajes[crit.id] === '' && (
                  <p style={{ color: '#B4322B', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>
                    Ingrese un puntaje entre 0 y 20.
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="eval-row footer">
            <div style={{ gridColumn: '1 / 4', fontWeight: '600', color: '#6F6663', fontSize: '14px' }}>
              Promedio ponderado provisional ({calcularPromedio.criteriosLlenos} de 4 criterios)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right' }}>
              {calcularPromedio.valor}
            </div>
          </div>
        </div>

        <div className="eval-sidebar">
          <div className="eval-sidebar-title" style={intentoEnvio && !recomendacion ? {color: '#B4322B'} : {}}>
            Recomendación *
          </div>
          <div className="eval-radio-group">
            {['Aceptar', 'Aceptar con observaciones', 'Rechazar'].map((opcion) => (
              <label 
                key={opcion} 
                className={`eval-radio-label ${recomendacion === opcion ? 'active' : ''}`}
                style={obtenerEstiloRadio(opcion)}
              >
                <input 
                  type="radio" 
                  name="recomendacion" 
                  value={opcion}
                  checked={recomendacion === opcion}
                  onChange={(e) => setRecomendacion(e.target.value)}
                  className="eval-radio-input"
                />
                {opcion}
              </label>
            ))}
          </div>
          {intentoEnvio && !recomendacion && (
             <p style={{ color: '#B4322B', fontSize: '12px', marginBottom: '12px', fontWeight: '600' }}>
               Debe seleccionar una recomendación.
             </p>
          )}
          <div className="eval-notice-box">
            Los comentarios al autor se publican con el dictamen. Las observaciones al comité son confidenciales.
          </div>
        </div>
      </div>

      <div className="eval-bottom-grid">
        <div>
          <div className="eval-sidebar-title" style={intentoEnvio && !comentarioAutor.trim() ? {color: '#B4322B'} : {}}>
            Comentarios al autor *
          </div>
          <textarea 
            className="eval-textarea"
            style={{ minHeight: '120px', ...(intentoEnvio && !comentarioAutor.trim() ? { borderColor: '#B4322B', backgroundColor: '#FEF2F2' } : {}) }}
            value={comentarioAutor}
            onChange={(e) => setComentarioAutor(e.target.value)}
          />
        </div>
        <div>
          <div className="eval-sidebar-title">Observaciones al comité (Confidencial)</div>
          <textarea 
            className="eval-textarea"
            style={{ minHeight: '120px' }}
            value={observacionComite}
            onChange={(e) => setObservacionComite(e.target.value)}
          />
        </div>
      </div>

      <div className="eval-footer">
        <span style={{ fontSize: '13px', color: '#6F6663' }}>Borrador guardado automáticamente a las 16:20</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={onCancelar} className="btn-outline">Guardar borrador</button>
          <button onClick={manejarEnvio} className="btn-primary">Enviar recomendación</button>
        </div>
      </div>
    </div>
  );
}
