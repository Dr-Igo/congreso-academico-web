import { useState } from 'react';
import './ConsolidadoTrabajo.css';

export function ConsolidadoTrabajo({ trabajo, onVolver }) {
  const [modalDecisionAbierto, setModalDecisionAbierto] = useState(false);
  const [decisionFinal, setDecisionFinal] = useState('');
  const [retroalimentacion, setRetroalimentacion] = useState(
    "El comité acepta el trabajo para presentación oral. Los revisores destacan la relevancia del problema y la claridad de la exposición. Antes de la versión final, atienda las siguientes observaciones: reforzar la validación del modelo y el tratamiento de datos faltantes; ampliar la discusión de resultados por cohorte; precisar el periodo de los registros académicos y la política de privacidad aplicada."
  );
  return (
    <div className="cons-wrapper">
      <div className="cons-breadcrumb">
        Trabajos recibidos &gt; {trabajo?.code || 'TRB-2026-042'} &gt; Consolidado
      </div>

      <div className="cons-header">
        <div>
          <div className="flex gap-3 text-sm mb-2">
            <span className="font-semibold text-[#B7791F]">{trabajo?.code || 'TRB-2026-042'}</span>
            <span className="border border-[#B7791F] text-[#B7791F] px-2 rounded font-semibold text-xs flex items-center">
              En revisión · 3 de 3 entregadas
            </span>
          </div>
          <h1 className="cons-title">{trabajo?.title || 'Predicción de deserción universitaria mediante aprendizaje supervisado'}</h1>
          <p className="cons-subtitle">
            {trabajo?.axis || 'Inteligencia artificial y datos'} · {trabajo?.type || 'Artículo completo'} · Rosa Quispe Ttito y 2 coautores
          </p>
        </div>
        <div className="cons-actions">
          <button className="btn-outline">Ver documento</button>
          <button 
            className="btn-primary"
            onClick={() => setModalDecisionAbierto(true)}
          >
            Registrar decisión final
          </button>
        </div>
      </div>

      {/* METRICAS SUPERIORES */}
      <div className="cons-metrics-grid">
        <div className="cons-metric-card">
          <div className="cons-metric-label">Puntaje Promedio</div>
          <div className="cons-metric-value">16.1 <span className="cons-metric-sub">de 20</span></div>
        </div>
        <div className="cons-metric-card">
          <div className="cons-metric-label">Dispersión</div>
          <div className="cons-metric-value">2.4 <span className="cons-metric-sub">diferencia máx.</span></div>
        </div>
        <div className="cons-metric-card success-top">
          <div className="cons-metric-label">Recomiendan Aceptar</div>
          <div className="cons-metric-value">2 de 3 <span className="cons-metric-sub">1 con observaciones</span></div>
        </div>
        <div className="cons-metric-card">
          <div className="cons-metric-label">Última Entrega</div>
          <div className="cons-metric-value">14/10 <span className="cons-metric-sub">2026</span></div>
        </div>
      </div>

      {/* TABLA DE CALIFICACIONES DE REVISORES */}
      <table className="cons-table">
        <thead>
          <tr>
            <th>Revisor</th>
            <th>Originalidad 25 %</th>
            <th>Rigor 30 %</th>
            <th>Claridad 20 %</th>
            <th>Relevancia 25 %</th>
            <th>Ponderado</th>
            <th>Recomendación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Revisor 1 · Mg. Luis Ramírez</td>
            <td>17</td>
            <td>15</td>
            <td>18</td>
            <td>17</td>
            <td className="font-bold">16.6</td>
            <td><span className="badge-warning">Aceptar con observaciones</span></td>
          </tr>
          <tr>
            <td>Revisor 2 · Dr. Óscar Nakamura</td>
            <td>18</td>
            <td>17</td>
            <td>17</td>
            <td>18</td>
            <td className="font-bold">17.5</td>
            <td><span className="badge-success">Aceptar</span></td>
          </tr>
          <tr>
            <td>Revisor 3 · Mg. Carmen Effio</td>
            <td>15</td>
            <td>14</td>
            <td>15</td>
            <td>14</td>
            <td className="font-bold">14.5</td>
            <td><span className="badge-success">Aceptar</span></td>
          </tr>
          <tr className="average-row">
            <td>Promedio por criterio</td>
            <td>16.7</td>
            <td>15.3</td>
            <td>16.7</td>
            <td>16.3</td>
            <td>16.1</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* SECCIÓN INFERIOR: COMENTARIOS REUNIDOS */}
      <div className="cons-comments-section">
        <h2 className="cons-comments-title">Comentarios al autor reunidos</h2>
        <div className="cons-comments-grid">
          <div className="cons-comment-box">
            <div className="cons-comment-author">Revisor 1</div>
            <p className="cons-comment-text">Reforzar la validación del modelo y detallar el tratamiento de datos faltantes.</p>
          </div>
          <div className="cons-comment-box">
            <div className="cons-comment-author">Revisor 2</div>
            <p className="cons-comment-text">Trabajo bien fundamentado; conviene ampliar la discusión de resultados por cohorte.</p>
          </div>
          <div className="cons-comment-box">
            <div className="cons-comment-author">Revisor 3</div>
            <p className="cons-comment-text">Precisar el periodo de los registros académicos y la política de privacidad aplicada.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E4DFDA', display: 'flex', justifyContent: 'flex-start' }}>
         <button onClick={onVolver} className="btn-outline">Volver a la lista de trabajos</button>
      </div>

      {/* GATILLO DEL MODAL 5.4 */}
{/* MODAL 5.4: DECISIÓN FINAL */}
      {modalDecisionAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModalDecisionAbierto(false)}>✕</button>
            
            <h2 className="modal-title">Decisión final del comité</h2>
            <p className="modal-subtitle">
              {trabajo?.code || 'TRB-2026-042'} · promedio 16.1 · 3 revisiones entregadas
            </p>

            <div className="decision-grid">
              <label className={`decision-card accept ${decisionFinal === 'Aceptar' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="decision" 
                  value="Aceptar"
                  checked={decisionFinal === 'Aceptar'}
                  onChange={(e) => setDecisionFinal(e.target.value)}
                />
                <div>
                  <h4>Aceptar</h4>
                  <p>Pasa al programa del congreso.</p>
                </div>
              </label>

              <label className={`decision-card reject ${decisionFinal === 'Rechazar' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="decision" 
                  value="Rechazar"
                  checked={decisionFinal === 'Rechazar'}
                  onChange={(e) => setDecisionFinal(e.target.value)}
                />
                <div>
                  <h4>Rechazar</h4>
                  <p>No participa en esta edición.</p>
                </div>
              </label>
            </div>

            <div className="modal-textarea-header">
              <label>Retroalimentación al autor *</label>
              <button className="modal-link" onClick={() => alert("Función para restaurar texto precargado")}>
                Restaurar texto de los revisores
              </button>
            </div>
            
            <textarea 
              className="textarea-full"
              value={retroalimentacion}
              onChange={(e) => setRetroalimentacion(e.target.value)}
            />
            <p style={{ fontSize: '12px', color: '#6F6663', marginTop: '8px' }}>
              Precargado con los comentarios al autor de los 3 revisores. Puede editarlo antes de publicar.
            </p>

            <div className="modal-warning">
              Al publicar, el autor de correspondencia recibirá un correo y el resultado será visible en su detalle del trabajo.<br/>
              <strong>La decisión no se puede modificar después.</strong>
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setModalDecisionAbierto(false)}>
                Cancelar
              </button>
              <button className="btn-outline" onClick={() => {
                alert("Borrador de decisión guardado.");
                setModalDecisionAbierto(false);
              }}>
                Guardar sin publicar
              </button>
              <button className="btn-danger" onClick={() => {
                if (!decisionFinal || !retroalimentacion.trim()) {
                  alert("Debe seleccionar una decisión y redactar la retroalimentación.");
                  return;
                }
                alert("Decisión publicada. Flujo cerrado.");
                setModalDecisionAbierto(false);
                onVolver();
              }}>
                Publicar decisión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}