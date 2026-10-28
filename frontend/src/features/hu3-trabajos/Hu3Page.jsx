import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AUTOR_PRINCIPAL,
  RECEPCION_ABIERTA,
  TIPOS_TRABAJO,
  crearAutoresIniciales,
  crearCoautorVacio,
  crearFormularioVacio,
} from './datos'
import {
  cargarTrabajos,
  generarCodigoTrabajo,
  guardarTrabajos,
  obtenerFechaActual,
  obtenerHoraActual,
} from './utilidades'
import AvisoFechaLimite from './componentes/AvisoFechaLimite'
import DetalleTrabajo from './componentes/DetalleTrabajo'
import ListaTrabajos from './componentes/ListaTrabajos'
import MiPresentacion from './componentes/MiPresentacion'
import ModalConfirmacion from './componentes/ModalConfirmacion'
import Notificacion from './componentes/Notificacion'
import PasoCoautores from './componentes/PasoCoautores'
import PasoDatosGenerales from './componentes/PasoDatosGenerales'
import PasoRevision from './componentes/PasoRevision'
import './hu3.css'


function obtenerNombrePaso(step) {
  if (step === 1) return 'Datos generales'
  if (step === 2) return 'Coautores'
  return 'Confirmación del envío'
}

function IndicadorPasos({ step }) {
  return (
    <div className="hu3-pasos">
      <div className={step >= 1 ? 'hu3-paso hu3-paso--activo' : 'hu3-paso'}>
        <span>1</span>
        <div>
          <strong>Datos generales</strong>
          <small>Título, eje y resumen</small>
        </div>
      </div>

      <div className="hu3-paso-linea" />

      <div className={step >= 2 ? 'hu3-paso hu3-paso--activo' : 'hu3-paso'}>
        <span>2</span>
        <div>
          <strong>Coautores</strong>
          <small>Autores y correspondencia</small>
        </div>
      </div>

      <div className="hu3-paso-linea" />

      <div className={step >= 3 ? 'hu3-paso hu3-paso--activo' : 'hu3-paso'}>
        <span>3</span>
        <div>
          <strong>Revisión final</strong>
          <small>Verifica y envía</small>
        </div>
      </div>
    </div>
  )
}

function Hu3Page({ initialView = 'list' }) {
  const navigate = useNavigate()

  // ---------------------------------------------------------------------------
  // 1. ESTADO PRINCIPAL DE LA HISTORIA
  // ---------------------------------------------------------------------------
  const [works, setWorks] = useState(cargarTrabajos)
  const [view, setView] = useState(initialView)
  const [step, setStep] = useState(1)

  const [editingId, setEditingId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const [filter, setFilter] = useState('Todos')
  const [query, setQuery] = useState('')

  const [form, setForm] = useState(crearFormularioVacio)
  const [errors, setErrors] = useState({})

  const [coauthors, setCoauthors] = useState(crearAutoresIniciales)
  const [newAuthor, setNewAuthor] = useState(crearCoautorVacio)
  const [correspondingEmail, setCorrespondingEmail] = useState(AUTOR_PRINCIPAL.email)

  const [notification, setNotification] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // ---------------------------------------------------------------------------
  // 2. PERSISTENCIA Y NOTIFICACIONES
  // ---------------------------------------------------------------------------
  useEffect(() => {
    guardarTrabajos(works)
  }, [works])

  useEffect(() => {
    if (!notification) {
      return
    }

    const timer = setTimeout(() => {
      setNotification(null)
    }, 3800)

    return () => clearTimeout(timer)
  }, [notification])

  // ---------------------------------------------------------------------------
  // 3. DATOS CALCULADOS PARA LA VISTA
  // ---------------------------------------------------------------------------
  const selectedWork = works.filter((work) => work.id === selectedId)[0]

  const filteredWorks = works.filter((work) => {
    const matchesStatus = filter === 'Todos' || work.status === filter
    const searchText = `${work.title} ${work.id} ${work.axis}`.toLowerCase()
    const matchesSearch = searchText.includes(query.toLowerCase())

    return matchesStatus && matchesSearch
  })

  // ---------------------------------------------------------------------------
  // 4. NAVEGACIÓN DENTRO DE HU-3
  // ---------------------------------------------------------------------------
  function goToList() {
    setView('list')
    setErrors({})
  }

  function returnToList() {
    if (initialView === 'form') {
      navigate('/mis-trabajos')
      return
    }

    goToList()
  }

  function startNewWork() {
    if (!RECEPCION_ABIERTA) {
      setNotification({
        type: 'warning',
        text: 'La recepción está cerrada y ya no se pueden registrar trabajos.',
      })
      return
    }

    navigate('/nuevo-trabajo')
  }

  function showWorkDetail(work) {
    setSelectedId(work.id)
    setView('detail')
  }

  // ---------------------------------------------------------------------------
  // 5. MANEJO DEL FORMULARIO GENERAL
  // ---------------------------------------------------------------------------
  function updateFormField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  function changeWorkType(type) {
    updateFormField('type', type)
  }

  function validateGeneralData() {
    const nextErrors = {}
    let hasErrors = false

    if (!form.title.trim()) {
      nextErrors.title = 'Ingrese el título del trabajo.'
      hasErrors = true
    }

    if (!form.axis) {
      nextErrors.axis = 'Seleccione un eje temático.'
      hasErrors = true
    }

    if (!form.abstract.trim()) {
      nextErrors.abstract = 'Ingrese el resumen del trabajo.'
      hasErrors = true
    } else if (form.abstract.length > 1500) {
      nextErrors.abstract = 'El resumen no puede superar los 1 500 caracteres.'
      hasErrors = true
    }

    if (form.keywords.length < 3) {
      nextErrors.keywords = 'Agregue al menos 3 palabras clave.'
      hasErrors = true
    }

    if (!form.url.trim().startsWith('https://')) {
      nextErrors.url = 'Ingrese una URL completa que empiece con https://'
      hasErrors = true
    }

    setErrors(nextErrors)

    return !hasErrors
  }

  function continueToCoauthors() {
    if (validateGeneralData()) {
      setErrors({})
      setStep(2)
    }
  }

  // ---------------------------------------------------------------------------
  // 6. PALABRAS CLAVE
  // ---------------------------------------------------------------------------
  function changeKeywordInput(value) {
    setForm((current) => ({
      ...current,
      keywordInput: value,
    }))
  }

  function addKeyword() {
    const keyword = form.keywordInput.trim()

    if (!keyword) {
      return
    }

    const repeatedKeywords = form.keywords.filter(
      (item) => item.toLowerCase() === keyword.toLowerCase(),
    )
    const repeated = repeatedKeywords.length > 0

    if (repeated) {
      setErrors((current) => ({
        ...current,
        keywords: 'Esa palabra clave ya existe.',
      }))
      return
    }

    if (form.keywords.length >= 8) {
      setErrors((current) => ({
        ...current,
        keywords: 'Puede registrar hasta 8 palabras clave.',
      }))
      return
    }

    setForm((current) => ({
      ...current,
      keywords: [...current.keywords, keyword],
      keywordInput: '',
    }))

    setErrors((current) => ({
      ...current,
      keywords: undefined,
    }))
  }

  function removeKeyword(keyword) {
    setForm((current) => ({
      ...current,
      keywords: current.keywords.filter((item) => item !== keyword),
    }))
  }

  // ---------------------------------------------------------------------------
  // 7. COAUTORES
  // ---------------------------------------------------------------------------
  function changeNewAuthor(field, value) {
    setNewAuthor((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  function addCoauthor() {
    const nextErrors = {}
    let hasErrors = false
    const email = newAuthor.email.trim()
    const maximumCoauthors = TIPOS_TRABAJO[form.type].coauthors

    if (!newAuthor.name.trim()) {
      nextErrors.name = 'Ingrese el nombre completo.'
      hasErrors = true
    }

    if (!email.includes('@') || !email.includes('.')) {
      nextErrors.email = 'Ingrese un correo válido.'
      hasErrors = true
    }

    if (!newAuthor.institution.trim()) {
      nextErrors.institution = 'Ingrese la institución.'
      hasErrors = true
    }

    const repeatedAuthors = coauthors.filter(
      (author) => author.email.toLowerCase() === email.toLowerCase(),
    )
    const repeatedEmail = repeatedAuthors.length > 0

    if (repeatedEmail) {
      nextErrors.email = 'Este correo ya figura entre los autores.'
      hasErrors = true
    }

    if (coauthors.length - 1 >= maximumCoauthors) {
      nextErrors.name = `Este tipo admite hasta ${maximumCoauthors} coautores.`
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(nextErrors)
      return
    }

    const author = {
      name: newAuthor.name.trim(),
      email,
      institution: newAuthor.institution.trim(),
      corresponding: false,
    }

    setCoauthors((current) => [...current, author])
    setNewAuthor(crearCoautorVacio())
    setErrors({})
  }

  function removeCoauthor(email) {
    setCoauthors((current) => current.filter((author) => author.email !== email))

    if (correspondingEmail === email) {
      setCorrespondingEmail(AUTOR_PRINCIPAL.email)
    }
  }

  // ---------------------------------------------------------------------------
  // 8. CREAR Y EDITAR TRABAJOS
  // ---------------------------------------------------------------------------
  function startEdit(work) {
    if (!RECEPCION_ABIERTA) {
      setNotification({
        type: 'warning',
        text: 'La recepción está cerrada. El trabajo se encuentra en modo lectura.',
      })
      return
    }

    if (work.status !== 'Borrador' && work.status !== 'Enviado') {
      setNotification({
        type: 'warning',
        text: 'Solo se pueden editar borradores o trabajos enviados mientras la recepción esté abierta.',
      })
      return
    }

    setEditingId(work.id)
    setForm({
      title: work.title,
      type: work.type,
      axis: work.axis,
      abstract: work.abstract,
      keywords: [...work.keywords],
      keywordInput: '',
      url: work.url,
    })

    setCoauthors(work.authors.map((author) => ({ ...author })))

    const correspondingAuthor = work.authors.filter((author) => author.corresponding)[0]
    setCorrespondingEmail(
      correspondingAuthor ? correspondingAuthor.email : AUTOR_PRINCIPAL.email,
    )

    setNewAuthor(crearCoautorVacio())
    setErrors({})
    setStep(1)
    setView('form')
  }

  function prepareDraftToSend(work) {
    startEdit(work)
    setStep(3)
  }

  function saveWork(sendToCommittee) {
    if (!RECEPCION_ABIERTA) {
      setNotification({
        type: 'warning',
        text: 'La recepción está cerrada. Ya no se pueden guardar cambios.',
      })
      return
    }

    if (sendToCommittee && !validateGeneralData()) {
      setStep(1)
      return
    }

    const correspondingAuthors = coauthors.filter(
      (author) => author.email === correspondingEmail,
    )
    const hasCorrespondingAuthor = correspondingAuthors.length > 0

    if (sendToCommittee && !hasCorrespondingAuthor) {
      setNotification({
        type: 'warning',
        text: 'Seleccione un autor de correspondencia antes de continuar.',
      })
      setStep(2)
      return
    }

    const existingWork = works.filter((work) => work.id === editingId)[0]
    const id = editingId || generarCodigoTrabajo(works)
    const date = obtenerFechaActual()
    const savedAt = `${date} · ${obtenerHoraActual()}`

    let status = 'Borrador'

    if (sendToCommittee) {
      status = 'Enviado'
    } else if (existingWork && existingWork.status === 'Enviado') {
      status = 'Enviado'
    }

    const savedWork = {
      id,
      title: form.title.trim() || 'Trabajo sin título',
      type: form.type,
      axis: form.axis || 'Sin eje temático',
      abstract: form.abstract.trim() || 'Resumen pendiente de completar.',
      keywords: [...form.keywords],
      url: form.url.trim(),
      status,
      created: existingWork ? existingWork.created : date,
      savedAt,
      authors: coauthors.map((author) => ({
        ...author,
        corresponding: author.email === correspondingEmail,
      })),
      score: existingWork ? existingWork.score : null,
      scores: existingWork ? existingWork.scores : undefined,
      session: existingWork ? existingWork.session : undefined,
      feedback: existingWork && existingWork.feedback ? existingWork.feedback : [],
    }

    if (editingId) {
      setWorks((current) =>
        current.map((work) => (work.id === editingId ? savedWork : work)),
      )
    } else {
      setWorks((current) => [savedWork, ...current])
    }

    setSelectedId(id)
    setView('detail')

    setNotification({
      type: 'success',
      text: sendToCommittee
        ? `Trabajo enviado correctamente. Código asignado: ${id}.`
        : `Borrador ${editingId ? 'actualizado' : 'guardado'} correctamente.`,
    })
  }

  // ---------------------------------------------------------------------------
  // 9. RETIRO Y ELIMINACIÓN
  // ---------------------------------------------------------------------------
  function removeWork(work) {
    if (!RECEPCION_ABIERTA) {
      setConfirmDelete(null)
      setNotification({
        type: 'warning',
        text: 'La recepción está cerrada. Ya no se pueden retirar trabajos.',
      })
      return
    }

    setWorks((current) => current.filter((item) => item.id !== work.id))
    setConfirmDelete(null)
    setView('list')
    navigate('/mis-trabajos')

    setNotification({
      type: 'success',
      text:
        work.status === 'Borrador'
          ? `Se eliminó el borrador ${work.id}.`
          : `Se retiró el trabajo ${work.id} de esta edición.`,
    })
  }

  // ---------------------------------------------------------------------------
  // 10. FILTROS Y BÚSQUEDA
  // ---------------------------------------------------------------------------
  function changeStatusFilter(status) {
    setFilter(status)
    setView('list')
  }

  function clearFilters() {
    setFilter('Todos')
    setQuery('')
  }

  // ---------------------------------------------------------------------------
  // 11. RENDER PRINCIPAL
  // ---------------------------------------------------------------------------
  return (
    <div className="hu3">
      <div className="hu3-pagina">
        {view !== 'detail' && <AvisoFechaLimite />}

        {view === 'list' && (
          <ListaTrabajos
            works={works}
            filteredWorks={filteredWorks}
            filter={filter}
            query={query}
            onFilterChange={changeStatusFilter}
            onQueryChange={setQuery}
            onClearFilters={clearFilters}
            onNewWork={startNewWork}
            onDetail={showWorkDetail}
            onEdit={startEdit}
            onWithdraw={setConfirmDelete}
          />
        )}

        {view === 'form' && (
          <section className="hu3-contenido">
            <div className="hu3-encabezado-pagina">
              <div>
                <p className="hu3-sobretitulo">ENVÍO DE TRABAJOS</p>
                <h1>{editingId ? 'Editar trabajo' : 'Nuevo trabajo'}</h1>
                <p className="hu3-subtitulo">
                  Paso {step} de 3 · {obtenerNombrePaso(step)}
                </p>
              </div>

              <button className="hu3-btn hu3-btn--texto" onClick={returnToList} type="button">
                <ArrowLeft size={16} />
                Volver a mis trabajos
              </button>
            </div>

            <IndicadorPasos step={step} />

            {step === 1 && (
              <PasoDatosGenerales
                form={form}
                errors={errors}
                onFieldChange={updateFormField}
                onTypeChange={changeWorkType}
                onKeywordInputChange={changeKeywordInput}
                onAddKeyword={addKeyword}
                onRemoveKeyword={removeKeyword}
                onSaveDraft={() => saveWork(false)}
                onContinue={continueToCoauthors}
              />
            )}

            {step === 2 && (
              <PasoCoautores
                form={form}
                coauthors={coauthors}
                correspondingEmail={correspondingEmail}
                newAuthor={newAuthor}
                errors={errors}
                onNewAuthorChange={changeNewAuthor}
                onCorrespondingChange={setCorrespondingEmail}
                onRemoveCoauthor={removeCoauthor}
                onAddCoauthor={addCoauthor}
                onBack={() => {
                  setErrors({})
                  setStep(1)
                }}
                onContinue={() => {
                  setErrors({})
                  setStep(3)
                }}
              />
            )}

            {step === 3 && (
              <PasoRevision
                form={form}
                coauthors={coauthors}
                correspondingEmail={correspondingEmail}
                onBack={() => setStep(2)}
                onSaveDraft={() => saveWork(false)}
                onSend={() => saveWork(true)}
              />
            )}
          </section>
        )}

        {view === 'presentation' && <MiPresentacion works={works} />}

        {view === 'detail' && selectedWork && (
          <DetalleTrabajo
            work={selectedWork}
            onBack={returnToList}
            onEdit={() => startEdit(selectedWork)}
            onSend={() => prepareDraftToSend(selectedWork)}
            onWithdraw={() => setConfirmDelete(selectedWork)}
            onPresentation={() => navigate('/mi-presentacion')}
            onToast={setNotification}
          />
        )}
      </div>

      <Notificacion
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <ModalConfirmacion
        work={confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={removeWork}
      />
    </div>
  )
}

export default Hu3Page
