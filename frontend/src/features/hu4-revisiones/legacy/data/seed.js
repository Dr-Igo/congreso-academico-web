// Datos semilla del módulo HU-4 (Asignación de revisiones).
// Todo vive en el front: App.jsx los carga en useState y las vistas los modifican.

/** "Hoy" fijo para que los días de retraso del mockup sean reproducibles. */
export const TODAY = '2026-10-12'
/** Cierre de la etapa de revisión (fecha límite por defecto). */
export const STAGE_CLOSE = '2026-10-20'
export const RECEPTION_DEADLINE = '2026-09-30'
/** Borradores que no entran al proceso (se muestran en el subtítulo). */
export const DRAFTS_OUT = 2

export const MIN_REVIEWERS = 2
export const MAX_REVIEWERS = 3

export const AXES = [
  'Ingeniería de software',
  'IA y datos',
  'Sostenibilidad y ciudad',
  'Salud y sociedad',
  'Economía y mercados',
  'Innovación y emprendimiento',
]
export const INTEREST_LINES = AXES
export const WORK_TYPES =['Artículo completo', 'Resumen extendido', 'Caso de estudio', 'Póster']
export const WORK_STATES = ['Enviado', 'En revisión', 'Aceptado', 'Rechazado']

// ── Revisores ────────────────────────────────────────────────────
export const REVIEWERS = [
  { id: 'R1', name: 'Mg. Luis Ramírez Cárdenas', gender: 'M', email: 'lramirez@ulima.edu.pe', institution: 'Universidad de Lima', lines: ['Ingeniería de software', 'IA y datos'] },
  { id: 'R2', name: 'Mg. Carmen Effio Vargas', gender: 'F', email: 'ceffio@ulima.edu.pe', institution: 'Universidad de Lima', lines: ['Ingeniería de software', 'Sostenibilidad y ciudad'] },
  { id: 'R3', name: 'Ing. Jorge Palomino Ávila', gender: 'M', email: 'jpalomino@ulima.edu.pe', institution: 'Universidad de Lima', lines: ['Innovación y emprendimiento', 'Ingeniería de software'] },
  { id: 'R4', name: 'Dra. Milagros Yupanqui Ríos', gender: 'F', email: 'myupanqui@ulima.edu.pe', institution: 'Universidad de Lima', lines: ['Salud y sociedad'] },
  { id: 'R5', name: 'Dr. Óscar Nakamura Trigoso', gender: 'M', email: 'onakamura@pucp.edu.pe', institution: 'Pontificia Universidad Católica', lines: ['IA y datos', 'Economía y mercados'] },
  { id: 'R6', name: 'Mg. Renzo Bustamante Loayza', gender: 'M', email: 'rbustamante@up.edu.pe', institution: 'Universidad del Pacífico', lines: ['Economía y mercados'] },
  { id: 'R7', name: 'Mg. Patricia Zegarra Coronado', gender: 'F', email: 'pzegarra@ulima.edu.pe', institution: 'Universidad de Lima', lines: ['Innovación y emprendimiento', 'Salud y sociedad'] },
  { id: 'R8', name: 'Dr. Álvaro Ccahuana Pinto', gender: 'M', email: 'accahuana@uni.edu.pe', institution: 'Universidad Nacional de Ingeniería', lines: ['Sostenibilidad y ciudad'] },
  { id: 'R9', name: 'Dra. Lucía Paredes Vidal', gender: 'F', email: 'lparedes@upc.edu.pe', institution: 'Universidad Peruana de Ciencias Aplicadas', lines: ['Ingeniería de software', 'Innovación y emprendimiento'] },
]

// ── Trabajos recibidos ───────────────────────────────────────────
// coauthorIds: coautores que además están registrados como revisores (conflicto bloqueante).
// authorInstitution: institución del autor de correspondencia (conflicto con advertencia).
const w = (n, title, axis, type, estado, author, authorInstitution, coauthors = [], coauthorIds = []) => ({
  id: `W${n}`,
  code: `TRB-2026-${n}`,
  title,
  axis,
  type,
  estado,
  author,
  authorInstitution,
  coauthors,
  coauthorIds,
})

export const WORKS = [
  w('031', 'Refactorización guiada por métricas de deuda técnica', 'Ingeniería de software', 'Artículo completo', 'Enviado', 'Diego Quispe Mendoza', 'Universidad Nacional Mayor de San Marcos'),
  w('035', 'Pruebas automatizadas en proyectos universitarios de software', 'Ingeniería de software', 'Resumen extendido', 'Enviado', 'Camila Huamán Rojas', 'Universidad Peruana de Ciencias Aplicadas', ['Mg. Carmen Effio Vargas'], ['R2']),
  w('040', 'Arquitectura de microservicios para un sistema de matrícula', 'Ingeniería de software', 'Caso de estudio', 'Enviado', 'Renato Salas Vega', 'Universidad Nacional de Ingeniería', ['Ing. Jorge Palomino Ávila'], ['R3']),
  w('042', 'Predicción de deserción universitaria mediante aprendizaje supervisado', 'IA y datos', 'Artículo completo', 'En revisión', 'Valeria Cárdenas León', 'Universidad Nacional de Ingeniería', ['Dra. Milagros Yupanqui Ríos'], ['R4']),
  w('045', 'Detección de fraude en pagos móviles con modelos de árboles', 'Economía y mercados', 'Artículo completo', 'En revisión', 'Andrés Roca Linares', 'Pontificia Universidad Católica'),
  w('047', 'Optimización de rutas de transporte público con datos abiertos', 'Sostenibilidad y ciudad', 'Artículo completo', 'En revisión', 'Fiorella Medina Arce', 'Universidad de Lima'),
  w('049', 'Chatbots de tutoría para cursos introductorios de programación', 'IA y datos', 'Resumen extendido', 'En revisión', 'Sebastián Tello Huerta', 'Universidad del Pacífico'),
  w('051', 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus', 'Sostenibilidad y ciudad', 'Resumen extendido', 'Aceptado', 'Daniela Ochoa Prado', 'Universidad Nacional de Ingeniería'),
  w('053', 'Bienestar emocional y rendimiento académico en primeros ciclos', 'Salud y sociedad', 'Póster', 'En revisión', 'Mariana Lazo Cueva', 'Universidad Peruana de Ciencias Aplicadas'),
  w('055', 'Modelo de negocio para emprendimientos de base tecnológica universitarios', 'Innovación y emprendimiento', 'Caso de estudio', 'En revisión', 'Joaquín Bazán Ruiz', 'Pontificia Universidad Católica'),
  w('057', 'Tablero de indicadores para la gestión de residuos sólidos en Surco', 'Sostenibilidad y ciudad', 'Caso de estudio', 'Rechazado', 'Gianella Paz Salinas', 'Universidad de Lima'),
  w('059', 'Adopción de billeteras digitales entre estudiantes universitarios', 'Economía y mercados', 'Artículo completo', 'En revisión', 'Lucero Vilca Ortega', 'Universidad San Ignacio de Loyola'),
]

// ── Revisiones asignadas (26 en total: 19 entregadas, 4 en plazo, 3 vencidas) ──
let seq = 0
const rv = (workN, reviewerId, status, deadline) => ({
  id: `RV-${String(++seq).padStart(3, '0')}`,
  workId: `W${workN}`,
  reviewerId,
  status, // 'entregada' | 'pendiente'
  deadline,
})
const E = 'entregada'
const P = 'pendiente'

export const REVIEWS = [
  rv('042', 'R1', E, '2026-10-09'), rv('042', 'R2', E, '2026-10-10'), rv('042', 'R5', P, '2026-10-15'),
  rv('045', 'R3', P, '2026-10-08'), rv('045', 'R4', E, '2026-10-09'), rv('045', 'R6', E, '2026-10-09'),
  rv('047', 'R2', E, '2026-10-08'), rv('047', 'R6', E, '2026-10-09'), rv('047', 'R7', E, '2026-10-10'),
  rv('049', 'R2', P, '2026-10-18'), rv('049', 'R1', E, '2026-10-10'), rv('049', 'R7', E, '2026-10-11'),
  rv('051', 'R1', E, '2026-10-05'), rv('051', 'R2', E, '2026-10-06'), rv('051', 'R4', E, '2026-10-06'),
  rv('053', 'R7', P, '2026-10-09'), rv('053', 'R1', P, '2026-10-09'),
  rv('055', 'R6', P, '2026-10-20'), rv('055', 'R3', E, '2026-10-11'), rv('055', 'R8', E, '2026-10-11'),
  rv('057', 'R3', E, '2026-10-04'), rv('057', 'R6', E, '2026-10-05'), rv('057', 'R5', E, '2026-10-05'),
  rv('059', 'R8', P, '2026-10-20'), rv('059', 'R4', E, '2026-10-10'), rv('059', 'R5', E, '2026-10-11'),
]
