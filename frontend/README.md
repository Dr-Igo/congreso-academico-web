# HU-3 · Envío de trabajos — Congreso Académico Estudiantil

Prototipo de front-end para la primera entrega de Programación Web. Está construido con React, Vite y CSS propio; no incluye backend ni base de datos. Los cambios se guardan en `localStorage` para poder demostrar el flujo en el navegador.

## Ejecutar en local

1. Instala Node.js (versión LTS).
2. Abre una terminal en esta carpeta.
3. Ejecuta:

   ```bash
   npm install
   npm run dev
   ```

4. Abre la URL que muestra Vite (normalmente `http://localhost:5173`).



## Funciones incluidas

- Vista Mis trabajos con búsqueda, filtros por estado, tarjetas y estado vacío si no hay resultados.
- Alta de trabajo por pasos: datos generales, coautores y revisión final.
- Validación de título, eje, resumen (máximo 1 500 caracteres), entre 3 y 8 palabras clave y URL HTTPS.
- Gestión de coautores, validación de correo duplicado y selección de un único autor de correspondencia.
- Guardar borrador, enviar al comité, editar mientras el trabajo se encuentra en borrador/enviado, ver detalle y retirar con confirmación.
- Estados visuales para borrador, enviado, en revisión, aceptado y rechazado; detalle de dictamen y retroalimentación de demostración.
- Persistencia de demostración en `localStorage`.
- Diseño adaptable a escritorio y móvil, notificaciones de operación y estilos consistentes con el PDF de referencia.

## Datos de demostración y coordinación del grupo

Los datos iniciales están declarados en `SEED` al inicio de `src/main.jsx`. El nombre de la edición, los ejes, tipos de trabajo, fechas, estructura de autores y códigos son datos de demostración inspirados en los mockups de las páginas 26–35 del PDF; deben alinearse con el contrato de datos acordado por el equipo antes de integrar las historias.

El front usa entidades locales con estos campos principales:

- Trabajo: `id`, `title`, `type`, `axis`, `abstract`, `keywords`, `url`, `status`, `created`, `authors`, `score`, `feedback`.
- Autor/coautor: `name`, `email`, `institution`, `corresponding`.
- Estados admitidos en las tarjetas: `Borrador`, `Enviado`, `En revisión`, `Aceptado`, `Rechazado`.


## Estructura

```text
hu3-congreso/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx
    └── styles.css
```
