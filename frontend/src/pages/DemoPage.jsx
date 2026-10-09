import { Link } from 'react-router-dom'

const modulos = [
  {
    hu: 'HU1',
    titulo: 'Cuenta y acceso',
    descripcion: 'Página pública, registro, inicio de sesión y recuperación.',
    ruta: '/',
  },
  {
    hu: 'HU2',
    titulo: 'Configuración de la edición',
    descripcion: 'Edición, ejes, tipos, fechas y criterios de evaluación.',
    ruta: '/configuracion-edicion',
  },
  {
    hu: 'HU3',
    titulo: 'Envío de trabajos',
    descripcion: 'Registro, listado y seguimiento de trabajos del autor.',
    ruta: '/mis-trabajos',
  },
  {
    hu: 'HU4',
    titulo: 'Gestión de revisiones',
    descripcion: 'Trabajos, revisores, asignaciones y seguimiento.',
    ruta: '/gestion-revisiones',
  },
  {
    hu: 'HU5',
    titulo: 'Bandeja del revisor',
    descripcion: 'Filtros de trabajos y evaluación simulada.',
    ruta: '/bandeja-revisor',
  },
]

export default function DemoPage() {
  return (
    <main
      style={{
        width: 'min(1100px, calc(100% - 32px))',
        margin: '0 auto',
        padding: '48px 0 72px',
        minHeight: '60vh',
      }}
    >
      <p style={{ color: '#8a1f35', fontWeight: '700', marginBottom: '8px' }}>
        DEMOSTRACIÓN DEL PROYECTO
      </p>

      <h1 style={{ fontSize: '36px', margin: '0 0 12px' }}>
        Historias de usuario integradas
      </h1>

      <p style={{ color: '#6f6265', margin: '0 0 32px' }}>
        Selecciona un módulo para abrirlo en una pestaña nueva.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {modulos.map((modulo) => (
          <article
            key={modulo.hu}
            style={{
              border: '1px solid #ded5d2',
              background: '#fff',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <span style={{ color: '#8a1f35', fontWeight: '700' }}>
              {modulo.hu}
            </span>

            <h2 style={{ margin: 0, fontSize: '22px' }}>{modulo.titulo}</h2>

            <p style={{ color: '#6f6265', margin: 0, flexGrow: 1 }}>
              {modulo.descripcion}
            </p>

            <Link
              to={modulo.ruta}
              target="_blank"
              rel="noreferrer"
              style={{
                alignSelf: 'flex-start',
                marginTop: '8px',
                padding: '10px 16px',
                background: '#8a1f35',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '700',
              }}
            >
              Abrir módulo
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}