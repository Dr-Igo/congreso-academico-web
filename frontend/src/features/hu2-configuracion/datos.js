// Datos de ejemplo tomados de los mockups (pantallas 2.1 a 2.6)

export const EDICION_INICIAL = {
  nombre: "VIII Congreso Académico Estudiantil",
  anio: "2026",
  sede: "Auditorio Central, Universidad de Lima — Santiago de Surco",
  descripcion:
    "Encuentro anual de investigación estudiantil. Se reciben artículos completos, resúmenes extendidos, pósteres y casos de estudio en seis ejes temáticos.",
}

export const EJES_INICIALES = [
  {
    id: 1,
    nombre: "Inteligencia artificial y datos",
    descripcion: "Aprendizaje automático y ciencia de datos aplicada.",
    responsable: "Dra. Ana Salazar",
    trabajos: 4,
  },
  {
    id: 2,
    nombre: "Ingeniería de software",
    descripcion: "Arquitectura, calidad y procesos de desarrollo.",
    responsable: "Mg. Luis Ramírez",
    trabajos: 3,
  },
  {
    id: 3,
    nombre: "Sostenibilidad y ciudad",
    descripcion: "Movilidad, gestión del agua y ciudades resilientes.",
    responsable: "Mg. Carmen Effio",
    trabajos: 3,
  },
  {
    id: 4,
    nombre: "Innovación y emprendimiento",
    descripcion: "Modelos de negocio y transferencia tecnológica.",
    responsable: "Ing. Jorge Palomino",
    trabajos: 2,
  },
  {
    id: 5,
    nombre: "Salud y sociedad",
    descripcion: "Salud pública y bienestar estudiantil.",
    responsable: "Dra. Milagros Yupanqui",
    trabajos: 1,
  },
  {
    id: 6,
    nombre: "Economía y mercados",
    descripcion: "Mercados financieros, comercio y desarrollo.",
    responsable: "Mg. Renzo Bustamante",
    trabajos: 1,
  },
]

export const FORMATOS = [
  "PDF",
  "PDF · plantilla IEEE",
  "PDF · orientación vertical",
]

export const TIPOS_INICIALES = [
  {
    id: 1,
    nombre: "Artículo completo",
    extension: "8 000 palabras",
    formato: "PDF · plantilla IEEE",
    coautores: true,
    maxCoautores: 4,
  },
  {
    id: 2,
    nombre: "Resumen extendido",
    extension: "2 500 palabras",
    formato: "PDF",
    coautores: true,
    maxCoautores: 3,
  },
  {
    id: 3,
    nombre: "Póster",
    extension: "1 lámina A1",
    formato: "PDF · orientación vertical",
    coautores: true,
    maxCoautores: 5,
  },
  {
    id: 4,
    nombre: "Caso de estudio",
    extension: "5 000 palabras",
    formato: "PDF",
    coautores: false,
    maxCoautores: 0,
  },
]

export const FECHAS_INICIALES = {
  recepcion: { fecha: "2026-09-30", hora: "23:59" },
  revision: { fecha: "2026-10-20", hora: "18:00" },
  publicacion: { fecha: "2026-10-28", hora: "12:00" },
}

export const CRITERIOS_INICIALES = [
  {
    id: 1,
    nombre: "Originalidad",
    descripcion: "Aporte novedoso frente a la literatura consultada.",
    peso: 25,
  },
  {
    id: 2,
    nombre: "Rigor metodológico",
    descripcion: "Coherencia del diseño, los datos y el análisis.",
    peso: 30,
  },
  {
    id: 3,
    nombre: "Claridad de la exposición",
    descripcion: "Redacción, estructura y calidad de las figuras.",
    peso: 20,
  },
  {
    id: 4,
    nombre: "Relevancia y aporte",
    descripcion: "Pertinencia para el eje temático y utilidad práctica.",
    peso: 20,
  },
]
