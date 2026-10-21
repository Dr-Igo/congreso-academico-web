# Organización por historias de usuario

Cada carpeta reúne las páginas, componentes, estilos y datos que pertenecen a
una misma historia de usuario:

- `hu1-cuenta-acceso`: página pública, autenticación, registro y cuenta.
- `hu2-configuracion`: configuración de la edición del congreso.
- `hu3-trabajos`: registro y seguimiento de trabajos del autor.
- `hu4-revisiones`: gestión y asignación de revisiones del comité.
- `hu5-bandeja-revisor`: bandeja y formularios de evaluación del revisor.

La carpeta `hu4-revisiones/legacy` conserva una implementación alternativa
anterior que ya no está conectada a las rutas principales.

Los elementos utilizados por varias historias permanecen fuera de estas
carpetas:

- `components/layout`: encabezado, pie y estructura visual compartida.
- `components/ProtectedRoute.jsx`: protección de rutas por sesión y rol.
- `lib/auth.js`: sesión, cuentas y reglas de acceso.
- `pages/NotFoundPage.jsx`: página general para rutas inexistentes.
