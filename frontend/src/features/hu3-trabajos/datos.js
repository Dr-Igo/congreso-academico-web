export const AUTOR_PRINCIPAL = {
  name: 'Rosa María Quispe Ttito',
  email: 'rosa.quispe@aloe.ulima.edu.pe',
  institution: 'Universidad de Lima',
  corresponding: true,
}

export const FECHA_LIMITE = '30/10/2026 a las 23:59'
export const DIAS_RESTANTES = 22

// En esta primera entrega la información se maneja en el frontend.
// Cambiar este valor permite mostrar el comportamiento de recepción abierta o cerrada.
export const RECEPCION_ABIERTA = true

export const EJES_TEMATICOS = [
  'Inteligencia artificial y datos',
  'Ingeniería de software',
  'Sostenibilidad y ciudad',
  'Innovación y emprendimiento',
  'Salud y sociedad',
  'Economía y mercados',
]

export const TIPOS_TRABAJO = {
  'Artículo completo': {
    maximo: 8000,
    unidad: 'palabras',
    formato: 'PDF con plantilla IEEE',
    coautores: 4,
  },
  'Resumen extendido': {
    maximo: 2500,
    unidad: 'palabras',
    formato: 'PDF',
    coautores: 3,
  },
  Póster: {
    maximo: 1,
    unidad: 'lámina A1',
    formato: 'PDF · orientación vertical',
    coautores: 5,
  },
  'Caso de estudio': {
    maximo: 5000,
    unidad: 'palabras',
    formato: 'PDF',
    coautores: 4,
  },
}

export const ESTADOS_TRABAJO = [
  'Todos',
  'Borrador',
  'Enviado',
  'En revisión',
  'Aceptado',
  'Rechazado',
]

export const TRABAJOS_INICIALES = [
  {
    id: 'TRB-2026-042',
    title: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    type: 'Artículo completo',
    axis: 'Inteligencia artificial y datos',
    abstract:
      'Se evalúan tres modelos supervisados para anticipar el abandono de estudios ' +
      'en una universidad privada de Lima, usando registros académicos de cinco cohortes y ' +
      'variables socioeconómicas declaradas en la matrícula.',
    keywords: [
      'deserción universitaria',
      'aprendizaje supervisado',
      'analítica educativa',
    ],
    url: 'https://drive.ulima.edu.pe/trb-2026-042/articulo.pdf',
    status: 'En revisión',
    created: '22/09/2026',
    authors: [
      {
        name: 'Rosa María Quispe Ttito',
        email: 'rosa.quispe@aloe.ulima.edu.pe',
        institution: 'Universidad de Lima',
        corresponding: true,
        role: 'Autora de correspondencia',
      },
      {
        name: 'Diego Alonso Chávez Manrique',
        email: 'diego.chavez@aloe.ulima.edu.pe',
        institution: 'Universidad de Lima',
        corresponding: false,
        role: 'Coautor',
      },
      {
        name: 'Milagros Yupanqui Ríos',
        email: 'milagros.yupanqui@aloe.ulima.edu.pe',
        institution: 'Universidad de Lima',
        corresponding: false,
        role: 'Coautora',
      },
    ],
    score: null,
    feedback: [],
  },
  {
    id: 'TRB-2026-051',
    title: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    type: 'Resumen extendido',
    axis: 'Sostenibilidad y ciudad',
    abstract:
      'Se analiza el uso de agua tratada para el riego de las áreas verdes del campus, ' +
      'comparando consumo, costo y calidad del suelo.',
    keywords: ['agua reciclada', 'riego', 'sostenibilidad'],
    url: 'https://drive.ulima.edu.pe/trb-2026-051/resumen.pdf',
    status: 'Aceptado',
    created: '20/09/2026',
    authors: [
      {
        name: 'Rosa María Quispe Ttito',
        email: 'rosa.quispe@aloe.ulima.edu.pe',
        institution: 'Universidad de Lima',
        corresponding: true,
      },
      {
        name: 'Sofía Bustamante León',
        email: 'sofia.bustamante@aloe.ulima.edu.pe',
        institution: 'Universidad de Lima',
        corresponding: false,
      },
    ],
    score: 17.4,
    scores: [
      ['Originalidad (25 %)', 17.0],
      ['Rigor metodológico (30 %)', 18.0],
      ['Claridad (20 %)', 17.5],
      ['Relevancia (25 %)', 17.0],
    ],
    session: {
      name: 'Sostenibilidad y ciudad',
      date: '12/11/2026',
      time: '10:30',
      room: 'Sala B-201',
    },
    feedback: [
      {
        reviewer: 'Revisor 1 · Aceptar',
        text:
          'El diseño experimental es sólido y la comparación de costos por metro cúbico ' +
          'está bien sustentada. Recomiendo detallar el protocolo de muestreo del suelo.',
      },
      {
        reviewer: 'Revisor 2 · Aceptar con observaciones',
        text:
          'Conviene precisar el periodo de medición y añadir la referencia normativa ' +
          'sobre reúso de agua tratada en el país.',
      },
      {
        reviewer: 'Revisor 3 · Aceptar',
        text:
          'Aporte pertinente para la gestión del campus. Sugiero mejorar la resolución ' +
          'de las figuras 2 y 3 para la versión final.',
      },
    ],
  },
  {
    id: 'TRB-2026-057',
    title: 'Tablero de indicadores para la gestión de residuos sólidos en Surco',
    type: 'Caso de estudio',
    axis: 'Sostenibilidad y ciudad',
    abstract:
      'Propuesta de indicadores para mejorar el seguimiento de residuos sólidos municipales ' +
      'y facilitar decisiones operativas.',
    keywords: ['residuos sólidos', 'indicadores', 'Surco'],
    url: 'https://drive.ulima.edu.pe/trb-2026-057/caso.pdf',
    status: 'Rechazado',
    created: '18/09/2026',
    authors: [
      {
        name: 'Diego Alonso Chávez Manrique',
        email: 'diego.chavez@aloe.ulima.edu.pe',
        institution: 'Universidad de Lima',
        corresponding: true,
      },
      {
        name: 'Rosa María Quispe Ttito',
        email: 'rosa.quispe@aloe.ulima.edu.pe',
        institution: 'Universidad de Lima',
        corresponding: false,
      },
    ],
    score: 11.8,
    scores: [
      ['Originalidad (25 %)', 13.0],
      ['Rigor metodológico (30 %)', 10.0],
      ['Claridad (20 %)', 13.5],
      ['Relevancia (25 %)', 11.5],
    ],
    feedback: [
      {
        reviewer: 'Revisor 1 · Rechazar',
        text:
          'El tablero es útil, pero el trabajo no documenta la fuente ni el periodo ' +
          'de los datos municipales empleados.',
      },
      {
        reviewer: 'Revisor 2 · Rechazar',
        text:
          'Falta una discusión de resultados: se describen los indicadores sin comparar ' +
          'contra una línea base.',
      },
      {
        reviewer: 'Revisor 3 · Aceptar con observaciones',
        text:
          'La propuesta tiene potencial; con datos verificables y una sección metodológica ' +
          'ampliada podría ser aceptada.',
      },
    ],
  },
  {
    id: 'TRB-2026-058',
    title: 'Clasificación automática de reclamos vecinales con procesamiento de texto',
    type: 'Póster',
    axis: 'Inteligencia artificial y datos',
    abstract:
      'Clasificación de mensajes vecinales en categorías temáticas mediante técnicas ' +
      'de procesamiento de lenguaje natural.',
    keywords: ['procesamiento de texto', 'clasificación', 'servicios públicos'],
    url: 'https://drive.ulima.edu.pe/trb-2026-058/poster.pdf',
    status: 'Borrador',
    created: '18/09/2026',
    savedAt: '18/09/2026 · 19:42',
    authors: [
      {
        name: 'Rosa María Quispe Ttito',
        email: 'rosa.quispe@aloe.ulima.edu.pe',
        institution: 'Universidad de Lima',
        corresponding: true,
      },
    ],
    score: null,
    feedback: [],
  },
]

export function crearFormularioVacio() {
  return {
    title: '',
    type: 'Artículo completo',
    axis: '',
    abstract: '',
    keywords: [],
    keywordInput: '',
    url: '',
  }
}

export function crearAutoresIniciales() {
  return [{ ...AUTOR_PRINCIPAL }]
}

export function crearCoautorVacio() {
  return {
    name: '',
    email: '',
    institution: '',
  }
}
