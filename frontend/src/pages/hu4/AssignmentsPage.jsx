// HU-4 Asignación de revisiones (Comité organizador)

import { useState } from "react";
import { ConsolidadoTrabajo } from "../ConsolidadoTrabajo";
import "./AssignmentsPage.css";

/*
   1. DATOS DE EJEMPLO (todo el estado vive en el front)
  */

const HOY = "2026-10-12"; // fecha de referencia fija para calcular los días de retraso
const CIERRE_ETAPA = "2026-10-20";
const FECHA_CIERRE_RECEPCION = "2026-09-30";
const BORRADORES_FUERA_DE_PROCESO = 2;
const MINIMO_REVISORES = 2;
const MAXIMO_REVISORES = 3;
const POR_PAGINA = 8;
const MAX_VISIBLES = 4; // revisores que muestra el modal de asignación

const EJES = [
  "Ingeniería de software",
  "IA y datos",
  "Sostenibilidad y ciudad",
  "Salud y sociedad",
  "Economía y mercados",
  "Innovación y emprendimiento",
];
const TIPOS = ["Artículo completo", "Resumen extendido", "Caso de estudio", "Póster"];
const ESTADOS = ["Enviado", "En revisión", "Aceptado", "Rechazado"];

const REVISORES = [
  { id: "R1", nombre: "Mg. Luis Ramírez Cárdenas", genero: "M", institucion: "Universidad de Lima", lineas: ["Ingeniería de software", "IA y datos"] },
  { id: "R2", nombre: "Mg. Carmen Effio Vargas", genero: "F", institucion: "Universidad de Lima", lineas: ["Ingeniería de software", "Sostenibilidad y ciudad"] },
  { id: "R3", nombre: "Ing. Jorge Palomino Ávila", genero: "M", institucion: "Universidad de Lima", lineas: ["Innovación y emprendimiento", "Ingeniería de software"] },
  { id: "R4", nombre: "Dra. Milagros Yupanqui Ríos", genero: "F", institucion: "Universidad de Lima", lineas: ["Salud y sociedad"] },
  { id: "R5", nombre: "Dr. Óscar Nakamura Trigoso", genero: "M", institucion: "Pontificia Universidad Católica", lineas: ["IA y datos", "Economía y mercados"] },
  { id: "R6", nombre: "Mg. Renzo Bustamante Loayza", genero: "M", institucion: "Universidad del Pacífico", lineas: ["Economía y mercados"] },
  { id: "R7", nombre: "Mg. Patricia Zegarra Coronado", genero: "F", institucion: "Universidad de Lima", lineas: ["Innovación y emprendimiento", "Salud y sociedad"] },
  { id: "R8", nombre: "Dr. Álvaro Ccahuana Pinto", genero: "M", institucion: "Universidad Nacional de Ingeniería", lineas: ["Sostenibilidad y ciudad"] },
  { id: "R9", nombre: "Dra. Lucía Paredes Vidal", genero: "F", institucion: "Universidad Peruana de Ciencias Aplicadas", lineas: ["Ingeniería de software", "Innovación y emprendimiento"] },
];

// coautoresIds: coautores que además son revisores → conflicto bloqueante.
// institucionAutor: institución del autor de correspondencia → conflicto con advertencia.
const TRABAJOS_INICIALES = [
  { id: "T031", codigo: "TRB-2026-031", titulo: "Refactorización guiada por métricas de deuda técnica", eje: "Ingeniería de software", tipo: "Artículo completo", estado: "Enviado", autor: "Diego Quispe Mendoza", institucionAutor: "Universidad Nacional Mayor de San Marcos", coautoresIds: [] },
  { id: "T035", codigo: "TRB-2026-035", titulo: "Pruebas automatizadas en proyectos universitarios de software", eje: "Ingeniería de software", tipo: "Resumen extendido", estado: "Enviado", autor: "Camila Huamán Rojas", institucionAutor: "Universidad Peruana de Ciencias Aplicadas", coautoresIds: ["R2"] },
  { id: "T040", codigo: "TRB-2026-040", titulo: "Arquitectura de microservicios para un sistema de matrícula", eje: "Ingeniería de software", tipo: "Caso de estudio", estado: "Enviado", autor: "Renato Salas Vega", institucionAutor: "Universidad Nacional de Ingeniería", coautoresIds: ["R3"] },
  { id: "T042", codigo: "TRB-2026-042", titulo: "Predicción de deserción universitaria mediante aprendizaje supervisado", eje: "IA y datos", tipo: "Artículo completo", estado: "En revisión", autor: "Valeria Cárdenas León", institucionAutor: "Universidad Nacional de Ingeniería", coautoresIds: ["R4"] },
  { id: "T045", codigo: "TRB-2026-045", titulo: "Detección de fraude en pagos móviles con modelos de árboles", eje: "Economía y mercados", tipo: "Artículo completo", estado: "En revisión", autor: "Andrés Roca Linares", institucionAutor: "Pontificia Universidad Católica", coautoresIds: [] },
  { id: "T047", codigo: "TRB-2026-047", titulo: "Optimización de rutas de transporte público con datos abiertos", eje: "Sostenibilidad y ciudad", tipo: "Artículo completo", estado: "En revisión", autor: "Fiorella Medina Arce", institucionAutor: "Universidad de Lima", coautoresIds: [] },
  { id: "T049", codigo: "TRB-2026-049", titulo: "Chatbots de tutoría para cursos introductorios de programación", eje: "IA y datos", tipo: "Resumen extendido", estado: "En revisión", autor: "Sebastián Tello Huerta", institucionAutor: "Universidad del Pacífico", coautoresIds: [] },
  { id: "T051", codigo: "TRB-2026-051", titulo: "Evaluación del uso de agua reciclada en riego de áreas verdes del campus", eje: "Sostenibilidad y ciudad", tipo: "Resumen extendido", estado: "Aceptado", autor: "Daniela Ochoa Prado", institucionAutor: "Universidad Nacional de Ingeniería", coautoresIds: [] },
  { id: "T053", codigo: "TRB-2026-053", titulo: "Bienestar emocional y rendimiento académico en primeros ciclos", eje: "Salud y sociedad", tipo: "Póster", estado: "En revisión", autor: "Mariana Lazo Cueva", institucionAutor: "Universidad Peruana de Ciencias Aplicadas", coautoresIds: [] },
  { id: "T055", codigo: "TRB-2026-055", titulo: "Modelo de negocio para emprendimientos de base tecnológica universitarios", eje: "Innovación y emprendimiento", tipo: "Caso de estudio", estado: "En revisión", autor: "Joaquín Bazán Ruiz", institucionAutor: "Pontificia Universidad Católica", coautoresIds: [] },
  { id: "T057", codigo: "TRB-2026-057", titulo: "Tablero de indicadores para la gestión de residuos sólidos en Surco", eje: "Sostenibilidad y ciudad", tipo: "Caso de estudio", estado: "Rechazado", autor: "Gianella Paz Salinas", institucionAutor: "Universidad de Lima", coautoresIds: [] },
  { id: "T059", codigo: "TRB-2026-059", titulo: "Adopción de billeteras digitales entre estudiantes universitarios", eje: "Economía y mercados", tipo: "Artículo completo", estado: "En revisión", autor: "Lucero Vilca Ortega", institucionAutor: "Universidad San Ignacio de Loyola", coautoresIds: [] },
];

// 26 revisiones: 19 entregadas, 4 pendientes en plazo y 3 vencidas (respecto a HOY).
const REVISIONES_INICIALES = [
  { id: "RV-1", trabajoId: "T042", revisorId: "R1", estado: "entregada", fechaLimite: "2026-10-09" },
  { id: "RV-2", trabajoId: "T042", revisorId: "R2", estado: "entregada", fechaLimite: "2026-10-10" },
  { id: "RV-3", trabajoId: "T042", revisorId: "R5", estado: "pendiente", fechaLimite: "2026-10-15" },
  { id: "RV-4", trabajoId: "T045", revisorId: "R3", estado: "pendiente", fechaLimite: "2026-10-08" },
  { id: "RV-5", trabajoId: "T045", revisorId: "R4", estado: "entregada", fechaLimite: "2026-10-09" },
  { id: "RV-6", trabajoId: "T045", revisorId: "R6", estado: "entregada", fechaLimite: "2026-10-09" },
  { id: "RV-7", trabajoId: "T047", revisorId: "R2", estado: "entregada", fechaLimite: "2026-10-08" },
  { id: "RV-8", trabajoId: "T047", revisorId: "R6", estado: "entregada", fechaLimite: "2026-10-09" },
  { id: "RV-9", trabajoId: "T047", revisorId: "R7", estado: "entregada", fechaLimite: "2026-10-10" },
  { id: "RV-10", trabajoId: "T049", revisorId: "R2", estado: "pendiente", fechaLimite: "2026-10-18" },
  { id: "RV-11", trabajoId: "T049", revisorId: "R1", estado: "entregada", fechaLimite: "2026-10-10" },
  { id: "RV-12", trabajoId: "T049", revisorId: "R7", estado: "entregada", fechaLimite: "2026-10-11" },
  { id: "RV-13", trabajoId: "T051", revisorId: "R1", estado: "entregada", fechaLimite: "2026-10-05" },
  { id: "RV-14", trabajoId: "T051", revisorId: "R2", estado: "entregada", fechaLimite: "2026-10-06" },
  { id: "RV-15", trabajoId: "T051", revisorId: "R4", estado: "entregada", fechaLimite: "2026-10-06" },
  { id: "RV-16", trabajoId: "T053", revisorId: "R7", estado: "pendiente", fechaLimite: "2026-10-09" },
  { id: "RV-17", trabajoId: "T053", revisorId: "R1", estado: "pendiente", fechaLimite: "2026-10-09" },
  { id: "RV-18", trabajoId: "T055", revisorId: "R6", estado: "pendiente", fechaLimite: "2026-10-20" },
  { id: "RV-19", trabajoId: "T055", revisorId: "R3", estado: "entregada", fechaLimite: "2026-10-11" },
  { id: "RV-20", trabajoId: "T055", revisorId: "R8", estado: "entregada", fechaLimite: "2026-10-11" },
  { id: "RV-21", trabajoId: "T057", revisorId: "R3", estado: "entregada", fechaLimite: "2026-10-04" },
  { id: "RV-22", trabajoId: "T057", revisorId: "R6", estado: "entregada", fechaLimite: "2026-10-05" },
  { id: "RV-23", trabajoId: "T057", revisorId: "R5", estado: "entregada", fechaLimite: "2026-10-05" },
  { id: "RV-24", trabajoId: "T059", revisorId: "R8", estado: "pendiente", fechaLimite: "2026-10-20" },
  { id: "RV-25", trabajoId: "T059", revisorId: "R4", estado: "entregada", fechaLimite: "2026-10-10" },
  { id: "RV-26", trabajoId: "T059", revisorId: "R5", estado: "entregada", fechaLimite: "2026-10-11" },
];

/* ====================================================================
   2. FUNCIONES AUXILIARES
   ==================================================================== */

const DIAS_ACUMULADOS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

// "2026-10-20" → número de día (suficiente para comparar fechas del mismo periodo)
function numeroDeDia(fecha) {
  const partes = fecha.split("-");
  const anio = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);
  return anio * 365 + DIAS_ACUMULADOS[mes - 1] + dia;
}

// Negativo = ya venció; positivo = días que faltan
function diasHasta(fecha) {
  return numeroDeDia(fecha) - numeroDeDia(HOY);
}

// "2026-10-20" → "20/10/2026"
function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function plural(cantidad, uno, varios) {
  return cantidad === 1 ? `${cantidad} ${uno}` : `${cantidad} ${varios}`;
}

function textoDias(cantidad) {
  return cantidad === 1 ? "1 día" : `${cantidad} días`;
}

function buscarPorId(lista, id) {
  return lista.filter((elemento) => elemento.id === id)[0];
}

function revisionesDe(revisiones, trabajoId) {
  return revisiones.filter((revision) => revision.trabajoId === trabajoId);
}

function estaVencida(revision) {
  return revision.estado === "pendiente" && diasHasta(revision.fechaLimite) < 0;
}

// Ordena de menor a mayor fecha límite (ordenamiento por inserción)
function ordenarPorFecha(lista) {
  const resultado = [];
  for (let i = 0; i < lista.length; i++) {
    let posicion = resultado.length;
    while (posicion > 0 && resultado[posicion - 1].fechaLimite > lista[i].fechaLimite) {
      posicion--;
    }
    resultado.splice(posicion, 0, lista[i]);
  }
  return resultado;
}

function siguienteNumeroDeRevision(revisiones) {
  let maximo = 0;
  revisiones.forEach((revision) => {
    const numero = Number(revision.id.split("-")[1]);
    if (numero > maximo) {
      maximo = numero;
    }
  });
  return maximo + 1;
}

function claseInsignia(estado) {
  if (estado === "Enviado") return "insignia insignia-enviado";
  if (estado === "En revisión") return "insignia insignia-revision";
  if (estado === "Aceptado") return "insignia insignia-aceptado";
  return "insignia insignia-rechazado";
}

// Tipo de conflicto de un revisor con un trabajo: "coautor", "institucion" o "ninguno"
function tipoDeConflicto(revisor, trabajo) {
  if (trabajo.coautoresIds.includes(revisor.id)) {
    return "coautor";
  }
  if (revisor.institucion === trabajo.institucionAutor) {
    return "institucion";
  }
  return "ninguno";
}

function etiquetaCoautor(revisor) {
  return revisor.genero === "F" ? "Coautora del trabajo" : "Coautor del trabajo";
}

// Un trabajo ya decidido o con el máximo de revisores no admite más asignaciones
function motivoNoAsignable(trabajo, revisiones) {
  if (trabajo.estado === "Aceptado" || trabajo.estado === "Rechazado") {
    return "Trabajo con decisión: no admite nuevas asignaciones";
  }
  if (revisionesDe(revisiones, trabajo.id).length >= MAXIMO_REVISORES) {
    return `Ya tiene el máximo de ${MAXIMO_REVISORES} revisores`;
  }
  return "";
}

// Estadísticas de un revisor calculadas a partir de las revisiones
function estadisticasDe(revisor, revisiones) {
  const suyas = revisiones.filter((revision) => revision.revisorId === revisor.id);
  return {
    asignadas: suyas.length,
    entregadas: suyas.filter((revision) => revision.estado === "entregada").length,
    vencidas: suyas.filter(estaVencida).length,
  };
}

/* ====================================================================
   3. COMPONENTE PRINCIPAL
   El estado compartido vive aquí (se levanta al padre) y baja por props.
   ==================================================================== */

export default function AssignmentsPage() {
  const [vista, setVista] = useState("trabajos"); // "trabajos" | "revisores" | "seguimiento"
  const [trabajos, setTrabajos] = useState(TRABAJOS_INICIALES);
  const [revisiones, setRevisiones] = useState(REVISIONES_INICIALES);
  const [simularVacio, setSimularVacio] = useState(false);
  const [aviso, setAviso] = useState("");

  function mostrarAviso(mensaje) {
    setAviso(mensaje);
  }

  // Asigna los revisores elegidos a cada trabajo seleccionado
  function guardarAsignacion(trabajoIds, revisorIds, fechaLimite) {
    const nuevas = [];
    let numero = siguienteNumeroDeRevision(revisiones);
    trabajoIds.forEach((trabajoId) => {
      revisorIds.forEach((revisorId) => {
        nuevas.push({ id: `RV-${numero}`, trabajoId, revisorId, estado: "pendiente", fechaLimite });
        numero++;
      });
    });
    setRevisiones([...revisiones, ...nuevas]);
    setTrabajos(
      trabajos.map((trabajo) =>
        trabajoIds.includes(trabajo.id) && trabajo.estado === "Enviado"
          ? { ...trabajo, estado: "En revisión" }
          : trabajo
      )
    );
    mostrarAviso(
      `Revisores asignados y notificados: ${plural(revisorIds.length, "revisor", "revisores")} en ${plural(trabajoIds.length, "trabajo", "trabajos")}. Fecha límite: ${formatearFecha(fechaLimite)}.`
    );
  }

  // Reasigna una revisión a otro revisor o retira al revisor actual
  function guardarReasignacion(revisionId, accion, nuevoRevisorId, fechaLimite) {
    const revision = buscarPorId(revisiones, revisionId);
    const trabajo = buscarPorId(trabajos, revision.trabajoId);
    const anterior = buscarPorId(REVISORES, revision.revisorId);

    if (accion === "reasignar") {
      const nuevo = buscarPorId(REVISORES, nuevoRevisorId);
      setRevisiones(
        revisiones.map((r) =>
          r.id === revisionId ? { ...r, revisorId: nuevoRevisorId, fechaLimite, estado: "pendiente" } : r
        )
      );
      mostrarAviso(`${trabajo.codigo}: revisión reasignada de ${anterior.nombre} a ${nuevo.nombre}.`);
    } else {
      const restantes = revisiones.filter((r) => r.id !== revisionId);
      setRevisiones(restantes);
      if (trabajo.estado === "En revisión" && revisionesDe(restantes, trabajo.id).length === 0) {
        setTrabajos(trabajos.map((t) => (t.id === trabajo.id ? { ...t, estado: "Enviado" } : t)));
      }
      mostrarAviso(`${trabajo.codigo}: se retiró a ${anterior.nombre}. El motivo quedó registrado.`);
    }
  }

  return (
    <div className="pagina">
      <main className="principal">
        <div className="contenedor">
          <Encabezado vista={vista} onCambiarVista={setVista} />

          {vista === "trabajos" && (
            <VistaTrabajos
              trabajos={simularVacio ? [] : trabajos}
              revisiones={revisiones}
              onGuardarAsignacion={guardarAsignacion}
            />
          )}
          {vista === "revisores" && <VistaRevisores revisiones={revisiones} />}
          {vista === "seguimiento" && (
            <VistaSeguimiento
              trabajos={trabajos}
              revisiones={revisiones}
              onGuardarReasignacion={guardarReasignacion}
              onAviso={mostrarAviso}
            />
          )}

          {vista === "trabajos" && (
            <p className="demo">
              <label htmlFor="simular-vacio">
                <input
                  id="simular-vacio"
                  type="checkbox"
                  checked={simularVacio}
                  onChange={(e) => setSimularVacio(e.target.checked)}
                />{" "}
                Demo: simular estado vacío (sin trabajos enviados)
              </label>
            </p>
          )}
        </div>
      </main>

      {aviso !== "" && (
        <div className="aviso" role="status">
          <p>{aviso}</p>
          <button type="button" className="aviso-cerrar" aria-label="Cerrar aviso" onClick={() => setAviso("")}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}

/* ====================================================================
   4. NAVEGACIÓN INTERNA DE REVISIONES
   ==================================================================== */

function Encabezado({ vista, onCambiarVista }) {
  function pestana(clave, texto) {
    return (
      <button
        type="button"
        className={vista === clave ? "pestana pestana-activa" : "pestana"}
        onClick={() => onCambiarVista(clave)}
      >
        {texto}
      </button>
    );
  }

  return (
    <nav className="barra-nav barra-nav-interna" aria-label="Secciones de revisiones">
      {pestana("trabajos", "Trabajos recibidos")}
      {pestana("revisores", "Revisores")}
      {pestana("seguimiento", "Seguimiento")}
    </nav>
  );
}

/* ====================================================================
   5. COMPONENTES COMPARTIDOS
   ==================================================================== */

function EncabezadoPagina({ titulo, subtitulo, children }) {
  return (
    <div className="encabezado-pagina">
      <h1 className="titulo-pagina">{titulo}</h1>
      <p className="subtitulo-pagina">{subtitulo}</p>
      {children && <div className="encabezado-acciones">{children}</div>}
    </div>
  );
}

function Paginacion({ pagina, totalPaginas, resumen, onCambiar }) {
  const numeros = [];
  for (let n = 1; n <= totalPaginas; n++) {
    numeros.push(n);
  }
  return (
    <div className="paginacion">
      <p className="paginacion-resumen">{resumen}</p>
      <div className="paginacion-botones">
        <button type="button" className="pagina-boton" disabled={pagina <= 1} onClick={() => onCambiar(pagina - 1)}>
          Anterior
        </button>
        {numeros.map((n) => (
          <button
            key={n}
            type="button"
            className={n === pagina ? "pagina-boton pagina-boton-activa" : "pagina-boton"}
            onClick={() => onCambiar(n)}
          >
            {n}
          </button>
        ))}
        <button type="button" className="pagina-boton" disabled={pagina >= totalPaginas} onClick={() => onCambiar(pagina + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}

function Modal({ titulo, subtitulo, pequeno, onCerrar, pie, children }) {
  return (
    <div className="fondo-modal">
      <div className={pequeno ? "modal modal-chico" : "modal"} role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="modal-cabecera">
          <h2 className="modal-titulo">{titulo}</h2>
          <div className="modal-subtitulo">{subtitulo}</div>
          <button type="button" className="modal-cerrar" aria-label="Cerrar" onClick={onCerrar}>
            ×
          </button>
        </div>
        <div className="modal-cuerpo">{children}</div>
        <div className="modal-pie">{pie}</div>
      </div>
    </div>
  );
}

/* ====================================================================
   6. VISTA 4.1 · TRABAJOS RECIBIDOS
   ==================================================================== */

function VistaTrabajos({ trabajos, revisiones, onGuardarAsignacion }) {
  const [eje, setEje] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [seleccionados, setSeleccionados] = useState([]);
  const [trabajosAAsignar, setTrabajosAAsignar] = useState([]); // vacío = modal cerrado
  const [trabajoConsolidado, setTrabajoConsolidado] = useState(null);

  const texto = busqueda.trim().toLowerCase();
  const filtrados = trabajos.filter((trabajo) => {
    const coincideEje = eje === "" || trabajo.eje === eje;
    const coincideEstado = estado === "" || trabajo.estado === estado;
    const coincideTipo = tipo === "" || trabajo.tipo === tipo;
    const textoTrabajo = `${trabajo.codigo} ${trabajo.titulo} ${trabajo.autor}`.toLowerCase();
    const coincideTexto = texto === "" || textoTrabajo.includes(texto);
    return coincideEje && coincideEstado && coincideTipo && coincideTexto;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const filas = filtrados.slice(inicio, inicio + POR_PAGINA);

  // Métricas del resumen superior
  const enRevision = trabajos.filter((t) => t.estado === "En revisión").length;
  const sinRevisores = trabajos.filter((t) => revisionesDe(revisiones, t.id).length === 0).length;
  const conDecision = trabajos.filter((t) => t.estado === "Aceptado" || t.estado === "Rechazado").length;

  // Selección múltiple (solo trabajos que todavía admiten asignación)
  const asignablesDePagina = filas.filter((t) => motivoNoAsignable(t, revisiones) === "");
  const marcadosEnPagina = asignablesDePagina.filter((t) => seleccionados.includes(t.id)).length;
  const todosMarcados = asignablesDePagina.length > 0 && marcadosEnPagina === asignablesDePagina.length;

  function alternarUno(id) {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((x) => x !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  }

  function alternarTodos() {
    if (todosMarcados) {
      const idsDePagina = asignablesDePagina.map((t) => t.id);
      setSeleccionados(seleccionados.filter((id) => !idsDePagina.includes(id)));
    } else {
      const faltantes = asignablesDePagina.filter((t) => !seleccionados.includes(t.id)).map((t) => t.id);
      setSeleccionados([...seleccionados, ...faltantes]);
    }
  }

  function cambiarFiltro(actualizar, valor) {
    actualizar(valor);
    setPagina(1);
  }

  function limpiarTodo() {
    setEje("");
    setEstado("");
    setTipo("");
    setBusqueda("");
    setPagina(1);
  }

  function abrirAsignacion() {
    setTrabajosAAsignar(trabajos.filter((t) => seleccionados.includes(t.id)));
  }

  function confirmarAsignacion(trabajoIds, revisorIds, fechaLimite) {
    onGuardarAsignacion(trabajoIds, revisorIds, fechaLimite);
    setSeleccionados([]);
    setTrabajosAAsignar([]);
  }

  const hayFiltros = eje !== "" || estado !== "" || tipo !== "" || texto !== "";
  const hayTrabajos = trabajos.length > 0;

  const subtitulo = hayTrabajos
    ? `${trabajos.length + BORRADORES_FUERA_DE_PROCESO} trabajos · ${trabajos.length} enviados · ${plural(BORRADORES_FUERA_DE_PROCESO, "borrador", "borradores")} fuera de proceso`
    : "Sin trabajos enviados por el momento";

  if (trabajoConsolidado !== null) {
    return (
      <ConsolidadoTrabajo
        trabajo={{
          code: trabajoConsolidado.codigo,
          title: trabajoConsolidado.titulo,
          axis: trabajoConsolidado.eje,
          type: trabajoConsolidado.tipo,
        }}
        onVolver={() => setTrabajoConsolidado(null)}
      />
    );
  }

  return (
    <>
      <EncabezadoPagina titulo="Trabajos recibidos" subtitulo={subtitulo}>
        {hayTrabajos && (
          <>
            <button type="button" className="boton boton-secundario" onClick={() => alert("No implementado")}>
              Exportar listado
            </button>
            <button
              type="button"
              className="boton boton-primario"
              disabled={seleccionados.length === 0}
              onClick={abrirAsignacion}
            >
              {seleccionados.length === 0
                ? "Asignar revisores"
                : `Asignar revisores (${plural(seleccionados.length, "seleccionado", "seleccionados")})`}
            </button>
          </>
        )}
      </EncabezadoPagina>

      {hayTrabajos && (
        <div className="metricas">
          <div className="metrica metrica-enviados">
            <p className="metrica-etiqueta">ENVIADOS</p>
            <p className="metrica-valor">{trabajos.length}</p>
          </div>
          <div className="metrica metrica-revision">
            <p className="metrica-etiqueta">EN REVISIÓN</p>
            <p className="metrica-valor">{enRevision}</p>
          </div>
          <div className="metrica metrica-sin-revisores">
            <p className="metrica-etiqueta">SIN REVISORES</p>
            <p className="metrica-valor">{sinRevisores}</p>
          </div>
          <div className="metrica metrica-decision">
            <p className="metrica-etiqueta">CON DECISIÓN</p>
            <p className="metrica-valor">{conDecision}</p>
          </div>
        </div>
      )}

      <div className="filtros">
        <select className="control" aria-label="Eje temático" value={eje} onChange={(e) => cambiarFiltro(setEje, e.target.value)}>
          <option value="">Eje: todos</option>
          {EJES.map((nombre) => (
            <option key={nombre} value={nombre}>
              Eje: {nombre}
            </option>
          ))}
        </select>
        <select className="control" aria-label="Estado" value={estado} onChange={(e) => cambiarFiltro(setEstado, e.target.value)}>
          <option value="">Estado: todos</option>
          {ESTADOS.map((nombre) => (
            <option key={nombre} value={nombre}>
              Estado: {nombre}
            </option>
          ))}
        </select>
        {hayTrabajos && (
          <select className="control" aria-label="Tipo de trabajo" value={tipo} onChange={(e) => cambiarFiltro(setTipo, e.target.value)}>
            <option value="">Tipo: todos</option>
            {TIPOS.map((nombre) => (
              <option key={nombre} value={nombre}>
                Tipo: {nombre}
              </option>
            ))}
          </select>
        )}
        <input
          type="search"
          className="control buscador"
          aria-label="Buscar trabajos"
          placeholder="Buscar por código, título o autor…"
          value={busqueda}
          onChange={(e) => cambiarFiltro(setBusqueda, e.target.value)}
        />
      </div>

      {hayFiltros && (
        <div className="chips">
          <span className="chips-titulo">Filtros activos:</span>
          {eje !== "" && (
            <span className="chip">
              Eje: {eje}
              <button type="button" className="chip-quitar" aria-label="Quitar filtro de eje" onClick={() => cambiarFiltro(setEje, "")}>
                ×
              </button>
            </span>
          )}
          {estado !== "" && (
            <span className="chip">
              Estado: {estado}
              <button type="button" className="chip-quitar" aria-label="Quitar filtro de estado" onClick={() => cambiarFiltro(setEstado, "")}>
                ×
              </button>
            </span>
          )}
          {tipo !== "" && (
            <span className="chip">
              Tipo: {tipo}
              <button type="button" className="chip-quitar" aria-label="Quitar filtro de tipo" onClick={() => cambiarFiltro(setTipo, "")}>
                ×
              </button>
            </span>
          )}
          {texto !== "" && (
            <span className="chip">
              Búsqueda: “{busqueda.trim()}”
              <button type="button" className="chip-quitar" aria-label="Quitar búsqueda" onClick={() => cambiarFiltro(setBusqueda, "")}>
                ×
              </button>
            </span>
          )}
          <button type="button" className="enlace-limpiar" onClick={limpiarTodo}>
            Limpiar todo
          </button>
        </div>
      )}

      {!hayTrabajos ? (
        <div className="vacio">
          <div className="vacio-icono">▤</div>
          <h2 className="vacio-titulo">Todavía no hay trabajos enviados</h2>
          <p className="vacio-texto">
            La recepción está abierta hasta el {formatearFecha(FECHA_CIERRE_RECEPCION)}. Cuando los autores envíen sus
            trabajos aparecerán aquí para asignar revisores.
          </p>
          <button type="button" className="boton boton-secundario" onClick={() => alert("No implementado")}>
            Revisar la configuración de la edición
          </button>
        </div>
      ) : (
        <div className="tarjeta-tabla">
          <table className="tabla">
            <thead>
              <tr>
                <th className="col-casilla">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos los trabajos de esta página"
                    checked={todosMarcados}
                    disabled={asignablesDePagina.length === 0}
                    onChange={alternarTodos}
                  />
                </th>
                <th>CÓDIGO</th>
                <th>TÍTULO</th>
                <th className="columna-secundaria">EJE TEMÁTICO</th>
                <th className="columna-secundaria">TIPO DE TRABAJO</th>
                <th>REVISORES</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((trabajo) => {
                const asignadas = revisionesDe(revisiones, trabajo.id);
                const entregadas = asignadas.filter((r) => r.estado === "entregada").length;
                const motivo = motivoNoAsignable(trabajo, revisiones);
                const marcado = seleccionados.includes(trabajo.id);
                return (
                  <tr key={trabajo.id} className={marcado ? "fila-seleccionada" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Seleccionar ${trabajo.codigo}`}
                        title={motivo}
                        checked={marcado}
                        disabled={motivo !== ""}
                        onChange={() => alternarUno(trabajo.id)}
                      />
                    </td>
                    <td>
                      {asignadas.length > 0 && entregadas === asignadas.length ? (
                        <button
                          type="button"
                          className="enlace-consolidado"
                          onClick={() => setTrabajoConsolidado(trabajo)}
                        >
                          {trabajo.codigo}
                        </button>
                      ) : (
                        <strong>{trabajo.codigo}</strong>
                      )}
                    </td>
                    <td>
                      <p className="texto-fuerte">{trabajo.titulo}</p>
                      <p className="texto-apagado">{trabajo.autor}</p>
                    </td>
                    <td className="columna-secundaria">{trabajo.eje}</td>
                    <td className="columna-secundaria">{trabajo.tipo}</td>
                    <td>
                      {asignadas.length === 0 ? (
                        <span className="texto-peligro">Sin asignar</span>
                      ) : (
                        <span>
                          {asignadas.length} {asignadas.length === 1 ? "asignado" : "asignados"} · {entregadas}{" "}
                          {entregadas === 1 ? "entregada" : "entregadas"}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={claseInsignia(trabajo.estado)}>{trabajo.estado}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filas.length === 0 && (
            <div className="sin-resultados">
              <p>Ningún trabajo coincide con los filtros.</p>
              <button type="button" className="boton boton-secundario" onClick={limpiarTodo}>
                Limpiar filtros
              </button>
            </div>
          )}

          <Paginacion
            pagina={paginaActual}
            totalPaginas={totalPaginas}
            onCambiar={setPagina}
            resumen={
              filtrados.length === 0
                ? "Sin resultados"
                : `Mostrando ${inicio + 1}–${inicio + filas.length} de ${plural(filtrados.length, "trabajo", "trabajos")}${
                    seleccionados.length > 0 ? ` · ${plural(seleccionados.length, "seleccionado", "seleccionados")}` : ""
                  }`
            }
          />
        </div>
      )}

      {trabajosAAsignar.length > 0 && (
        <ModalAsignar
          trabajos={trabajosAAsignar}
          revisiones={revisiones}
          onCancelar={() => setTrabajosAAsignar([])}
          onConfirmar={confirmarAsignacion}
        />
      )}
    </>
  );
}

/* ====================================================================
   7. MODAL 4.2 · ASIGNAR REVISORES (con validación de conflictos)
   Reglas:
    - Coautoría → conflicto bloqueante: el checkbox queda deshabilitado.
    - Misma institución → advertencia: solo se puede elegir si el comité
      activa la casilla "Asignar de todos modos…".
    - Mínimo 2 y máximo 3 revisores por trabajo.
   ==================================================================== */

function ModalAsignar({ trabajos, revisiones, onCancelar, onConfirmar }) {
  const [busqueda, setBusqueda] = useState("");
  const [elegidos, setElegidos] = useState([]);
  const [permitirInstitucion, setPermitirInstitucion] = useState(false);
  const [fechaLimite, setFechaLimite] = useState(CIERRE_ETAPA);

  const enLote = trabajos.length > 1;

  // Analiza a cada revisor contra todos los trabajos seleccionados
  const candidatos = REVISORES.map((revisor) => {
    const comoCoautor = [];
    const comoInstitucion = [];
    const yaAsignado = [];
    trabajos.forEach((trabajo) => {
      if (revisionesDe(revisiones, trabajo.id).filter((r) => r.revisorId === revisor.id).length > 0) {
        yaAsignado.push(trabajo.codigo);
      }
      const conflicto = tipoDeConflicto(revisor, trabajo);
      if (conflicto === "coautor") {
        comoCoautor.push(trabajo.codigo);
      }
      if (conflicto === "institucion") {
        comoInstitucion.push(trabajo.codigo);
      }
    });
    const coincideLinea = trabajos.filter((t) => revisor.lineas.includes(t.eje)).length > 0;
    return {
      ...revisor,
      comoCoautor,
      comoInstitucion,
      yaAsignado,
      coincideLinea,
      carga: revisiones.filter((r) => r.revisorId === revisor.id).length,
      bloqueado: comoCoautor.length > 0 || yaAsignado.length > 0,
    };
  });

  // Primero los de líneas afines al eje; luego el resto
  const ordenados = [...candidatos.filter((c) => c.coincideLinea), ...candidatos.filter((c) => !c.coincideLinea)];

  const texto = busqueda.trim().toLowerCase();
  const coincidentes = ordenados.filter((c) => {
    const textoCandidato = `${c.nombre} ${c.institucion} ${c.lineas.join(" ")}`.toLowerCase();
    return texto === "" || textoCandidato.includes(texto);
  });

  // Como en el mockup, el modal muestra solo 4 revisores: primero un coautor y uno de la
  // misma institución (para que el conflicto se vea) y luego los más afines. El buscador
  // permite llegar a los demás.
  const conCoautor = coincidentes.filter((c) => c.comoCoautor.length > 0).slice(0, 1);
  const conInstitucion = coincidentes.filter((c) => !c.bloqueado && c.comoInstitucion.length > 0).slice(0, 1);
  const sinConflicto = coincidentes.filter((c) => c.comoCoautor.length === 0 && c.comoInstitucion.length === 0);
  const elegidosVisibles = coincidentes.filter((c) => elegidos.includes(c.id));
  const bloqueVisible = [...conCoautor, ...conInstitucion, ...elegidosVisibles, ...sinConflicto].filter(
    (c, i, lista) => lista.indexOf(c) === i
  );
  const visibles = coincidentes.filter((c) => bloqueVisible.slice(0, MAX_VISIBLES).includes(c));

  const cantidadCoautores = candidatos.filter((c) => c.comoCoautor.length > 0).length;
  const cantidadInstitucion = candidatos.filter((c) => !c.bloqueado && c.comoInstitucion.length > 0).length;
  const hayConflictos = cantidadCoautores > 0 || cantidadInstitucion > 0;

  // ¿Se puede marcar este revisor?
  function estaDeshabilitado(candidato) {
    if (candidato.bloqueado) return true; // coautoría (o ya asignado): bloqueante
    if (candidato.comoInstitucion.length > 0 && !permitirInstitucion) return true; // falta la casilla del comité
    if (!elegidos.includes(candidato.id) && elegidos.length >= MAXIMO_REVISORES) return true;
    return false;
  }

  function alternarRevisor(candidato) {
    if (elegidos.includes(candidato.id)) {
      setElegidos(elegidos.filter((id) => id !== candidato.id));
    } else if (elegidos.length < MAXIMO_REVISORES) {
      setElegidos([...elegidos, candidato.id]);
    }
  }

  function alternarPermisoInstitucion(activo) {
    setPermitirInstitucion(activo);
    if (!activo) {
      // Al desactivar la casilla se quitan los revisores de la misma institución
      const mismaInstitucion = candidatos.filter((c) => c.comoInstitucion.length > 0).map((c) => c.id);
      setElegidos(elegidos.filter((id) => !mismaInstitucion.includes(id)));
    }
  }

  // Validación (en este orden)
  let error = "";
  const excedido = trabajos.filter((t) => revisionesDe(revisiones, t.id).length + elegidos.length > MAXIMO_REVISORES);
  if (elegidos.length < MINIMO_REVISORES) {
    error = `Seleccione al menos ${MINIMO_REVISORES} revisores sin conflicto`;
  } else if (excedido.length > 0) {
    error = `${excedido[0].codigo} superaría el máximo de ${MAXIMO_REVISORES} revisores`;
  } else if (!hayConflictos && fechaLimite === "") {
    error = "Indique la fecha límite de la revisión";
  } else if (!hayConflictos && fechaLimite < HOY) {
    error = "La fecha límite no puede ser anterior a hoy";
  }
  const puedeAsignar = error === "";
  const mostrarError = !puedeAsignar && (elegidos.length > 0 || hayConflictos);

  // Texto del aviso de conflicto
  const partesAviso = [];
  if (cantidadCoautores > 0) {
    const sujeto = cantidadCoautores === 1 ? "1 revisor es coautor" : `${cantidadCoautores} revisores son coautores`;
    partesAviso.push(`${sujeto} ${enLote ? "de alguno de los trabajos" : "del trabajo"}`);
  }
  if (cantidadInstitucion > 0) {
    const sujeto = cantidadCoautores > 0
      ? cantidadInstitucion === 1
        ? "otro pertenece"
        : `otros ${cantidadInstitucion} pertenecen`
      : cantidadInstitucion === 1
        ? "1 revisor pertenece"
        : `${cantidadInstitucion} revisores pertenecen`;
    partesAviso.push(`${sujeto} a la misma institución del autor de correspondencia`);
  }

  const subtitulo = enLote ? (
    <>
      <strong>{plural(trabajos.length, "trabajo seleccionado", "trabajos seleccionados")}</strong> ·{" "}
      {trabajos.map((t) => t.codigo.slice(9)).join(", ")}
    </>
  ) : (
    <>
      <strong>{trabajos[0].codigo}</strong> · {trabajos[0].titulo} · {trabajos[0].eje}
    </>
  );

  const pie = (
    <>
      <p className={mostrarError ? "modal-mensaje modal-mensaje-error" : "modal-mensaje"}>
        {puedeAsignar
          ? plural(elegidos.length, "revisor seleccionado", "revisores seleccionados")
          : mostrarError
            ? error
            : `Seleccione de ${MINIMO_REVISORES} a ${MAXIMO_REVISORES} revisores`}
      </p>
      <div className="modal-botones">
        <button type="button" className="boton boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button
          type="button"
          className="boton boton-primario"
          disabled={!puedeAsignar}
          onClick={() => onConfirmar(trabajos.map((t) => t.id), elegidos, fechaLimite)}
        >
          Asignar y notificar
        </button>
      </div>
    </>
  );

  return (
    <Modal titulo="Asignar revisores" subtitulo={subtitulo} onCerrar={onCancelar} pie={pie}>
      {hayConflictos && (
        <div className="alerta-conflicto" role="alert">
          <strong>Conflicto detectado:</strong> {partesAviso.join(" y ")}.
          {cantidadCoautores > 0 && " No es posible asignar a un coautor."}
        </div>
      )}

      <div className="fila-busqueda">
        <input
          type="search"
          className="control"
          aria-label="Buscar revisor"
          placeholder="Buscar revisor por nombre, institución o línea de interés…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="regla">
          Mínimo {MINIMO_REVISORES} · máximo {MAXIMO_REVISORES} revisores
        </span>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th className="col-casilla"></th>
            <th>REVISOR</th>
            <th>LÍNEAS DE INTERÉS</th>
            <th>CARGA ACTUAL</th>
            <th>CONFLICTO DETECTADO</th>
          </tr>
        </thead>
        <tbody>
          {visibles.map((candidato) => {
            const marcado = elegidos.includes(candidato.id);
            let claseFila = "";
            if (marcado) {
              claseFila = "fila-seleccionada";
            } else if (candidato.comoCoautor.length > 0) {
              claseFila = "fila-coautor";
            } else if (candidato.comoInstitucion.length > 0 && !candidato.bloqueado) {
              claseFila = "fila-institucion";
            }
            return (
              <tr key={candidato.id} className={claseFila}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Seleccionar a ${candidato.nombre}`}
                    checked={marcado}
                    disabled={estaDeshabilitado(candidato)}
                    onChange={() => alternarRevisor(candidato)}
                  />
                </td>
                <td>
                  <p className="texto-fuerte">{candidato.nombre}</p>
                  <p className="texto-apagado">{candidato.institucion}</p>
                </td>
                <td>{candidato.lineas.join(" · ")}</td>
                <td>{plural(candidato.carga, "revisión", "revisiones")}</td>
                <td>
                  <CeldaConflicto candidato={candidato} enLote={enLote} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {visibles.length === 0 && <p className="sin-resultados">Ningún revisor coincide con la búsqueda.</p>}
      {coincidentes.length > visibles.length && (
        <p className="texto-apagado">
          Mostrando {visibles.length} de {coincidentes.length} revisores · use el buscador para ver los demás
        </p>
      )}

      {cantidadInstitucion > 0 && (
        <p className="casilla-institucion">
          <label htmlFor="permitir-institucion">
            <input
              id="permitir-institucion"
              type="checkbox"
              checked={permitirInstitucion}
              onChange={(e) => alternarPermisoInstitucion(e.target.checked)}
            />{" "}
            Asignar de todos modos al revisor de la misma institución (requiere justificación del comité).
          </label>
        </p>
      )}

      {!hayConflictos && (
        <div className="campo">
          <label className="campo-etiqueta" htmlFor="fecha-limite">
            FECHA LÍMITE DE LA REVISIÓN
          </label>
          <input
            id="fecha-limite"
            type="date"
            className="control"
            value={fechaLimite}
            min={HOY}
            onChange={(e) => setFechaLimite(e.target.value)}
          />
        </div>
      )}
    </Modal>
  );
}

function CeldaConflicto({ candidato, enLote }) {
  // En lote se indica a qué trabajos aplica el conflicto
  function detalle(codigos) {
    if (!enLote) return null;
    return <span className="conflicto-detalle">{codigos.map((c) => c.slice(9)).join(", ")}</span>;
  }

  if (candidato.comoCoautor.length > 0) {
    return (
      <span className="conflicto-coautor">
        {etiquetaCoautor(candidato)}
        {detalle(candidato.comoCoautor)}
      </span>
    );
  }
  if (candidato.yaAsignado.length > 0) {
    return (
      <span className="conflicto-asignado">
        Ya asignado
        {detalle(candidato.yaAsignado)}
      </span>
    );
  }
  if (candidato.comoInstitucion.length > 0) {
    return (
      <span className="conflicto-institucion">
        Misma institución
        {detalle(candidato.comoInstitucion)}
      </span>
    );
  }
  return <span className="conflicto-ninguno">Sin conflicto</span>;
}

/* ====================================================================
   8. VISTA 4.3 · LISTADO DE REVISORES
   ==================================================================== */

function VistaRevisores({ revisiones }) {
  const [linea, setLinea] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [soloVencidas, setSoloVencidas] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  // Estadísticas de cada revisor
  const conEstadisticas = REVISORES.map((revisor) => ({ ...revisor, ...estadisticasDe(revisor, revisiones) }));

  // Lista de instituciones sin repetir
  const instituciones = [];
  REVISORES.forEach((revisor) => {
    if (!instituciones.includes(revisor.institucion)) {
      instituciones.push(revisor.institucion);
    }
  });

  const totalVencidas = conEstadisticas.reduce((suma, r) => suma + r.vencidas, 0);
  const revisoresConVencidas = conEstadisticas.filter((r) => r.vencidas > 0).length;

  const texto = busqueda.trim().toLowerCase();
  const filtrados = conEstadisticas.filter((revisor) => {
    const coincideLinea = linea === "" || revisor.lineas.includes(linea);
    const coincideInstitucion = institucion === "" || revisor.institucion === institucion;
    const coincideVencidas = !soloVencidas || revisor.vencidas > 0;
    const coincideTexto = texto === "" || revisor.nombre.toLowerCase().includes(texto);
    return coincideLinea && coincideInstitucion && coincideVencidas && coincideTexto;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const filas = filtrados.slice(inicio, inicio + POR_PAGINA);

  function cambiarFiltro(actualizar, valor) {
    actualizar(valor);
    setPagina(1);
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Revisores"
        subtitulo={`${plural(REVISORES.length, "revisor registrado", "revisores registrados")} · ${plural(revisiones.length, "revisión asignada", "revisiones asignadas")} · ${plural(totalVencidas, "vencida", "vencidas")}`}
      >
        <button type="button" className="boton boton-secundario" onClick={() => alert("No implementado")}>
          Invitar revisor
        </button>
      </EncabezadoPagina>

      <div className="filtros">
        <select className="control" aria-label="Línea de interés" value={linea} onChange={(e) => cambiarFiltro(setLinea, e.target.value)}>
          <option value="">Línea: todas</option>
          {EJES.map((nombre) => (
            <option key={nombre} value={nombre}>
              Línea: {nombre}
            </option>
          ))}
        </select>
        <select className="control" aria-label="Institución" value={institucion} onChange={(e) => cambiarFiltro(setInstitucion, e.target.value)}>
          <option value="">Institución: todas</option>
          {instituciones.map((nombre) => (
            <option key={nombre} value={nombre}>
              Institución: {nombre}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={soloVencidas ? "filtro-vencidas filtro-vencidas-activo" : "filtro-vencidas"}
          aria-pressed={soloVencidas}
          onClick={() => cambiarFiltro(setSoloVencidas, !soloVencidas)}
        >
          Con revisiones vencidas · {revisoresConVencidas}
        </button>
        <input
          type="search"
          className="control buscador"
          aria-label="Buscar revisor"
          placeholder="Buscar revisor…"
          value={busqueda}
          onChange={(e) => cambiarFiltro(setBusqueda, e.target.value)}
        />
      </div>

      <div className="tarjeta-tabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>REVISOR</th>
              <th className="columna-secundaria">INSTITUCIÓN</th>
              <th className="columna-secundaria">LÍNEAS DE INTERÉS</th>
              <th className="derecha">ASIGNADAS</th>
              <th className="derecha">ENTREGADAS</th>
              <th className="derecha">VENCIDAS</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((revisor) => (
              <tr key={revisor.id}>
                <td>
                  <strong>{revisor.nombre}</strong>
                </td>
                <td className="columna-secundaria">{revisor.institucion}</td>
                <td className="columna-secundaria">{revisor.lineas.join(" · ")}</td>
                <td className="derecha">{revisor.asignadas}</td>
                <td className="derecha texto-exito">{revisor.entregadas}</td>
                <td className={revisor.vencidas > 0 ? "derecha texto-peligro" : "derecha"}>{revisor.vencidas}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filas.length === 0 && <p className="sin-resultados">Ningún revisor coincide con los filtros.</p>}

        <Paginacion
          pagina={paginaActual}
          totalPaginas={totalPaginas}
          onCambiar={setPagina}
          resumen={
            filtrados.length === 0
              ? "Sin resultados"
              : `Mostrando ${inicio + 1}–${inicio + filas.length} de ${plural(filtrados.length, "revisor", "revisores")}`
          }
        />
      </div>
    </>
  );
}

/* ====================================================================
   9. VISTA 4.4 · SEGUIMIENTO DE REVISIONES
   ==================================================================== */

function VistaSeguimiento({ trabajos, revisiones, onGuardarReasignacion, onAviso }) {
  const [soloVencidas, setSoloVencidas] = useState(false);
  const [recordadas, setRecordadas] = useState([]); // ids de revisiones con recordatorio enviado
  const [revisionAReasignar, setRevisionAReasignar] = useState(null);

  // Pendientes ordenadas por fecha límite: primero las vencidas (tienen fecha menor)
  const pendientes = ordenarPorFecha(revisiones.filter((r) => r.estado === "pendiente"));
  const vencidas = pendientes.filter(estaVencida);
  const entregadas = revisiones.filter((r) => r.estado === "entregada").length;
  const enPlazo = pendientes.length - vencidas.length;
  const visibles = soloVencidas ? vencidas : pendientes;

  function recordar(revision) {
    const revisor = buscarPorId(REVISORES, revision.revisorId);
    const trabajo = buscarPorId(trabajos, revision.trabajoId);
    setRecordadas([...recordadas, revision.id]);
    onAviso(`Recordatorio enviado a ${revisor.nombre} (${trabajo.codigo}).`);
  }

  function recordarATodos() {
    if (pendientes.length === 0) {
      return;
    }
    setRecordadas(pendientes.map((r) => r.id));
    const revisoresAvisados = [];
    pendientes.forEach((r) => {
      if (!revisoresAvisados.includes(r.revisorId)) {
        revisoresAvisados.push(r.revisorId);
      }
    });
    onAviso(
      `Recordatorio enviado a ${plural(revisoresAvisados.length, "revisor", "revisores")} con ${plural(pendientes.length, "revisión pendiente", "revisiones pendientes")}.`
    );
  }

  function confirmarReasignacion(revisionId, accion, nuevoRevisorId, fechaLimite) {
    onGuardarReasignacion(revisionId, accion, nuevoRevisorId, fechaLimite);
    setRevisionAReasignar(null);
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Seguimiento de revisiones"
        subtitulo={`Pendientes ordenadas por fecha límite · cierre de la etapa: ${formatearFecha(CIERRE_ETAPA)}`}
      >
        <button type="button" className="boton boton-secundario" disabled={pendientes.length === 0} onClick={recordarATodos}>
          Recordatorio a todos los pendientes
        </button>
      </EncabezadoPagina>

      {vencidas.length > 0 ? (
        <div className="banner-alerta" role="alert">
          <p>
            <strong>{plural(vencidas.length, "revisión vencida", "revisiones vencidas")}.</strong> Considere reasignar
            para no retrasar la publicación de resultados.
          </p>
          <button
            type="button"
            className="boton boton-peligro"
            aria-pressed={soloVencidas}
            onClick={() => setSoloVencidas(!soloVencidas)}
          >
            {soloVencidas ? "Ver todas las pendientes" : "Ver solo vencidas"}
          </button>
        </div>
      ) : (
        <div className="banner-alerta banner-ok">
          <p>No hay revisiones vencidas. Todas las pendientes están dentro del plazo.</p>
        </div>
      )}

      <div className="tarjeta-tabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th className="columna-secundaria">TRABAJO</th>
              <th>REVISOR</th>
              <th>FECHA LÍMITE</th>
              <th>ESTADO</th>
              <th className="derecha">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((revision) => {
              const trabajo = buscarPorId(trabajos, revision.trabajoId);
              const revisor = buscarPorId(REVISORES, revision.revisorId);
              const dias = diasHasta(revision.fechaLimite);
              const vencida = dias < 0;
              const yaRecordada = recordadas.includes(revision.id);
              return (
                <tr key={revision.id} className={vencida ? "fila-vencida" : ""}>
                  <td>
                    <strong>{trabajo.codigo}</strong>
                  </td>
                  <td className="columna-secundaria">
                    <p className="texto-fuerte">{trabajo.titulo}</p>
                  </td>
                  <td>{revisor.nombre}</td>
                  <td className={vencida ? "texto-peligro" : "texto-fuerte"}>{formatearFecha(revision.fechaLimite)}</td>
                  <td>
                    {vencida ? (
                      <span className="insignia insignia-vencida">Vencida · {textoDias(-dias)}</span>
                    ) : dias === 0 ? (
                      <span className="insignia insignia-pendiente">Vence hoy</span>
                    ) : (
                      <span className="insignia insignia-pendiente">Pendiente · {textoDias(dias)}</span>
                    )}
                  </td>
                  <td className="derecha">
                    {vencida ? (
                      <button type="button" className="accion accion-peligro" onClick={() => setRevisionAReasignar(revision)}>
                        Reasignar
                      </button>
                    ) : (
                      <button type="button" className="accion" disabled={yaRecordada} onClick={() => recordar(revision)}>
                        {yaRecordada ? "Recordado ✓" : "Recordar"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visibles.length === 0 && (
          <p className="sin-resultados">{soloVencidas ? "No hay revisiones vencidas." : "No hay revisiones pendientes."}</p>
        )}
      </div>

      <div className="resumen">
        <div className="resumen-item resumen-entregadas">
          Revisiones entregadas
          <span className="resumen-valor texto-exito">
            {entregadas} de {revisiones.length}
          </span>
        </div>
        <div className="resumen-item resumen-plazo">
          Pendientes en plazo
          <span className="resumen-valor texto-advertencia">
            {enPlazo}
          </span>
        </div>
        <div className="resumen-item resumen-vencidas">
          Vencidas
          <span className="resumen-valor texto-peligro">{vencidas.length}</span>
        </div>
      </div>

      {revisionAReasignar !== null && (
        <ModalReasignar
          revision={revisionAReasignar}
          trabajo={buscarPorId(trabajos, revisionAReasignar.trabajoId)}
          revisiones={revisiones}
          onCancelar={() => setRevisionAReasignar(null)}
          onConfirmar={confirmarReasignacion}
        />
      )}
    </>
  );
}

/* ====================================================================
   10. MODAL · REASIGNAR O RETIRAR REVISOR (motivo obligatorio)
   ==================================================================== */

function ModalReasignar({ revision, trabajo, revisiones, onCancelar, onConfirmar }) {
  const [accion, setAccion] = useState("reasignar"); // "reasignar" | "retirar"
  const [nuevoRevisorId, setNuevoRevisorId] = useState("");
  const [fechaLimite, setFechaLimite] = useState(CIERRE_ETAPA);
  const [motivo, setMotivo] = useState("");

  const actual = buscarPorId(REVISORES, revision.revisorId);

  // Candidatos: los que aún no están en este trabajo
  const asignadosAlTrabajo = revisionesDe(revisiones, trabajo.id).map((r) => r.revisorId);
  const candidatos = REVISORES.filter((r) => !asignadosAlTrabajo.includes(r.id));

  const quedarian = revisionesDe(revisiones, trabajo.id).length - 1;

  let error = "";
  if (accion === "reasignar" && nuevoRevisorId === "") {
    error = "Elija al nuevo revisor";
  } else if (accion === "reasignar" && (fechaLimite === "" || fechaLimite < HOY)) {
    error = "Indique una fecha límite válida";
  } else if (motivo.trim().length < 10) {
    error = "Registre el motivo (mínimo 10 caracteres)";
  }
  const valido = error === "";

  const pie = (
    <>
      <p className={error !== "" && motivo.length > 0 ? "modal-mensaje modal-mensaje-error" : "modal-mensaje"}>
        {valido ? "El motivo quedará registrado en el historial." : error}
      </p>
      <div className="modal-botones">
        <button type="button" className="boton boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button
          type="button"
          className={accion === "retirar" ? "boton boton-peligro" : "boton boton-primario"}
          disabled={!valido}
          onClick={() => onConfirmar(revision.id, accion, nuevoRevisorId, fechaLimite)}
        >
          {accion === "reasignar" ? "Reasignar y notificar" : "Retirar revisor"}
        </button>
      </div>
    </>
  );

  return (
    <Modal
      titulo={accion === "reasignar" ? "Reasignar revisión" : "Retirar revisor"}
      subtitulo={
        <>
          <strong>{trabajo.codigo}</strong> · {trabajo.titulo}
        </>
      }
      pequeno
      onCerrar={onCancelar}
      pie={pie}
    >
      <div className="datos-revision">
        <p>
          <strong>Revisor actual:</strong> {actual.nombre}
        </p>
        <p>
          <strong>Fecha límite vigente:</strong> {formatearFecha(revision.fechaLimite)}
        </p>
      </div>

      <div className="campo opciones-radio">
        <span className="campo-etiqueta">ACCIÓN</span>
        <label htmlFor="accion-reasignar">
          <input
            id="accion-reasignar"
            type="radio"
            name="accion"
            value="reasignar"
            checked={accion === "reasignar"}
            onChange={() => setAccion("reasignar")}
          />{" "}
          Reasignar a otro revisor
        </label>
        <label htmlFor="accion-retirar">
          <input
            id="accion-retirar"
            type="radio"
            name="accion"
            value="retirar"
            checked={accion === "retirar"}
            onChange={() => setAccion("retirar")}
          />{" "}
          Solo retirar al revisor
        </label>
      </div>

      {accion === "reasignar" && (
        <>
          <div className="campo">
            <label className="campo-etiqueta" htmlFor="nuevo-revisor">
              NUEVO REVISOR
            </label>
            <select
              id="nuevo-revisor"
              className="control"
              value={nuevoRevisorId}
              onChange={(e) => setNuevoRevisorId(e.target.value)}
            >
              <option value="">Seleccione un revisor…</option>
              {candidatos.map((candidato) => {
                const conflicto = tipoDeConflicto(candidato, trabajo);
                let nota = "";
                if (conflicto === "coautor") nota = " — coautor del trabajo";
                if (conflicto === "institucion") nota = " — misma institución";
                return (
                  <option key={candidato.id} value={candidato.id} disabled={conflicto !== "ninguno"}>
                    {candidato.nombre}
                    {nota}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="campo">
            <label className="campo-etiqueta" htmlFor="nueva-fecha">
              NUEVA FECHA LÍMITE
            </label>
            <input
              id="nueva-fecha"
              type="date"
              className="control"
              value={fechaLimite}
              min={HOY}
              onChange={(e) => setFechaLimite(e.target.value)}
            />
          </div>
        </>
      )}

      {accion === "retirar" && quedarian < MINIMO_REVISORES && (
        <p className="aviso-modal">
          El trabajo quedaría con {plural(quedarian, "revisor", "revisores")} y el mínimo es {MINIMO_REVISORES}. Podrá
          asignar otro desde “Trabajos recibidos”.
        </p>
      )}

      <div className="campo">
        <label className="campo-etiqueta" htmlFor="motivo">
          MOTIVO (OBLIGATORIO)
        </label>
        <textarea
          id="motivo"
          className="campo-texto"
          rows="3"
          maxLength="300"
          placeholder="Ej.: el revisor no respondió a los recordatorios y la fecha límite venció."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        ></textarea>
      </div>
    </Modal>
  );
}
