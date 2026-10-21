// Funciones pequeñas que usan varias pestañas

// "2026-09-30" -> "30/09/2026"
export function formatearFecha(iso) {
  if (!iso) return ""
  const [anio, mes, dia] = iso.split("-")
  return dia + "/" + mes + "/" + anio
}

// La hora debe verse como 23:59
export function horaValida(hora) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora)
}

// Revisa las 3 fechas y devuelve todos los errores calculados
export function validarFechas(f) {
  const vacios = {
    recepcion: f.recepcion.fecha === "" ? "Seleccione una fecha." : "",
    revision: f.revision.fecha === "" ? "Seleccione una fecha." : "",
    publicacion: f.publicacion.fecha === "" ? "Seleccione una fecha." : "",
  }
  const horas = {
    recepcion: horaValida(f.recepcion.hora) ? "" : "Use el formato HH:MM.",
    revision: horaValida(f.revision.hora) ? "" : "Use el formato HH:MM.",
    publicacion: horaValida(f.publicacion.hora) ? "" : "Use el formato HH:MM.",
  }

  const rec = f.recepcion.fecha + "T" + f.recepcion.hora
  const rev = f.revision.fecha + "T" + f.revision.hora
  const pub = f.publicacion.fecha + "T" + f.publicacion.hora

  const sePuedeComparar1 =
    vacios.recepcion === "" && vacios.revision === "" &&
    horas.recepcion === "" && horas.revision === ""
  const sePuedeComparar2 =
    vacios.revision === "" && vacios.publicacion === "" &&
    horas.revision === "" && horas.publicacion === ""

  const errorRevision =
    sePuedeComparar1 && rev <= rec
      ? "Debe ser posterior al cierre de la recepción (" + formatearFecha(f.recepcion.fecha) + ")."
      : ""
  // Si la revisión ya está mal, la publicación también se marca (como en el mockup)
  const errorPublicacion =
    sePuedeComparar2 && (pub <= rev || errorRevision !== "")
      ? "Debe ser posterior al cierre de la revisión."
      : ""

  const hayOtrosErrores =
    Object.values(vacios).some((e) => e !== "") ||
    Object.values(horas).some((e) => e !== "")
  const hayErrores = errorRevision !== "" || errorPublicacion !== "" || hayOtrosErrores

  let mensajeGeneral = ""
  if (errorRevision) {
    mensajeGeneral =
      "El cronograma no es consecutivo: el cierre de la revisión (" +
      formatearFecha(f.revision.fecha) +
      ") es anterior al cierre de la recepción (" +
      formatearFecha(f.recepcion.fecha) +
      "). Corrija las fechas marcadas para poder guardar."
  } else if (errorPublicacion) {
    mensajeGeneral =
      "El cronograma no es consecutivo: la publicación de resultados (" +
      formatearFecha(f.publicacion.fecha) +
      ") es anterior al cierre de la revisión (" +
      formatearFecha(f.revision.fecha) +
      "). Corrija las fechas marcadas para poder guardar."
  } else if (hayOtrosErrores) {
    mensajeGeneral = "Hay campos incompletos o con errores. Corríjalos para poder guardar."
  }

  return { vacios, horas, errorRevision, errorPublicacion, hayErrores, mensajeGeneral }
}

export function sumarPesos(criterios) {
  return criterios.reduce((suma, c) => suma + Number(c.peso), 0)
}
