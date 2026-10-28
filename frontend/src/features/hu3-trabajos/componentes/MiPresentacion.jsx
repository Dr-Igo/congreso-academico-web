import { CalendarDays, Clock3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { obtenerClaseEstado } from '../utilidades'

function MiPresentacion({ works }) {
  const acceptedWork = works.find((work) => work.status === 'Aceptado' && work.session)

  return (
    <section className="hu3-contenido">
      <div className="hu3-encabezado-pagina">
        <div>
          <p className="hu3-sobretitulo">ÁREA DE AUTOR</p>
          <h1>Mi presentación</h1>
          <p className="hu3-subtitulo">Consulta la sesión asignada a tus trabajos aceptados.</p>
        </div>
      </div>

      {acceptedWork ? (
        <div className="hu3-presentacion-layout">
          <div className="hu3-panel hu3-presentacion-card">
            <div className="hu3-codigo-estado">
              <span className="hu3-codigo">{acceptedWork.id}</span>
              <span className={obtenerClaseEstado(acceptedWork.status)}>{acceptedWork.status}</span>
            </div>

            <h2>{acceptedWork.title}</h2>
            <p className="hu3-presentacion-card__sesion">{acceptedWork.session.name}</p>

            <div className="hu3-presentacion-datos">
              <div>
                <CalendarDays size={19} />
                <span>
                  <small>FECHA</small>
                  <strong>{acceptedWork.session.date}</strong>
                </span>
              </div>
              <div>
                <Clock3 size={19} />
                <span>
                  <small>HORA</small>
                  <strong>{acceptedWork.session.time}</strong>
                </span>
              </div>
              <div>
                <MapPin size={19} />
                <span>
                  <small>SALA</small>
                  <strong>{acceptedWork.session.room}</strong>
                </span>
              </div>
            </div>
          </div>

          <aside className="hu3-panel hu3-presentacion-indicaciones">
            <h3>Indicaciones para el expositor</h3>
            <ul>
              <li>Preséntate en la sala 15 minutos antes del inicio de la sesión.</li>
              <li>Lleva tu presentación lista y una copia de respaldo.</li>
              <li>Respeta el tiempo asignado por el moderador de la sesión.</li>
            </ul>
          </aside>
        </div>
      ) : (
        <div className="hu3-vacio">
          <div className="hu3-vacio__icono">
            <CalendarDays size={27} />
          </div>
          <h2>Aún no tienes una presentación asignada</h2>
          <p>
            El comité publicará la fecha, hora y sala cuando finalice la programación del congreso.
          </p>
          <Link className="hu3-btn hu3-btn--secundario" to="/mis-trabajos">
            Volver a mis trabajos
          </Link>
        </div>
      )}
    </section>
  )
}

export default MiPresentacion
