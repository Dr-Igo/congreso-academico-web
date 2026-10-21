# Congreso Académico Estudiantil

Sistema web para gestionar un congreso académico estudiantil. El proyecto se está
desarrollando con React y Vite.

## Instalación en una computadora nueva

### Opción 1: Clonar el repositorio

Requisitos:

- Git.
- Node.js 20 o superior.
- npm, incluido con Node.js.

Ejecute los siguientes comandos:

```bash
git clone https://github.com/Dr-Igo/congreso-academico-web.git
cd congreso-academico-web/frontend
npm install
npm run dev
```

Luego abra en el navegador la dirección que aparece en la terminal, normalmente:

`http://localhost:5173`

### Opción 2: Instalar desde un archivo ZIP

1. Descargue el proyecto como ZIP desde GitHub.
2. Extraiga el archivo en una carpeta.
3. Abra una terminal dentro de la carpeta `frontend`.
4. Ejecute:

```bash
npm install
npm run dev
```

5. Abra `http://localhost:5173` en el navegador.

> `npm install` solo es necesario la primera vez o cuando cambian las dependencias.

## Datos para la demostración

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Autor | `rosa.quispe@aloe.ulima.edu.pe` | `React2026` |
| Revisor | `luis.ramirez@ulima.edu.pe` | `Revisar2026` |
| Comité administrador | `comite@ulima.edu.pe` | `Comite2026` |

Cada cuenta redirige automáticamente a las pantallas correspondientes a su rol.

También se puede crear una cuenta nueva desde el formulario de registro y utilizarla
para iniciar sesión.

## Verificaciones

Antes de entregar o subir cambios, ejecute desde la carpeta `frontend`:

```bash
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
