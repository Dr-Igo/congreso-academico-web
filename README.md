# Congreso Académico Estudiantil

Sistema web para gestionar un congreso académico estudiantil. El proyecto se está
desarrollando con React y Vite.

## Avance actual

La rama `hu1-rodrigo` contiene el avance frontend de la HU-1 (Cuenta y acceso):

- página pública del congreso;
- registro de participantes con validaciones;
- inicio y cierre de sesión simulados;
- recuperación de contraseña en tres pasos;
- página para rutas no encontradas;
- diseño responsive basado en los mockups del proyecto.

Los datos se guardan temporalmente en `localStorage`, porque esta primera entrega
corresponde únicamente al frontend.

## Ejecutar el proyecto

Requisitos: Node.js 20 o una versión posterior.

```bash
cd frontend
npm install
npm run dev
```

Luego abra `http://localhost:5173` en el navegador.

## Datos para la demostración

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Autor | `rosa.quispe@aloe.ulima.edu.pe` | `React2026` |
| Revisor | `luis.ramirez@ulima.edu.pe` | `Revisar2026` |
| Comité organizador | `comite@ulima.edu.pe` | `Comite2026` |

Cada cuenta redirige automáticamente a las pantallas correspondientes a su rol.

- Código de recuperación: `123456`

También se puede crear una cuenta nueva desde el formulario de registro y usarla
para iniciar sesión.

## Verificaciones

```bash
cd frontend
npm run lint
npm run build
```

## Trabajo en equipo

Cada integrante debe trabajar en su propia rama. Antes de comenzar una tarea:

```bash
git switch main
git pull origin main
git switch -c nombre-de-la-rama
```

Al terminar, se sube la rama y se crea un Pull Request hacia `main`.
