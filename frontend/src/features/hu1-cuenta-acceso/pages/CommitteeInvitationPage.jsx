import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { saveAccount, saveSession } from '../../../lib/auth'

const INVITATION_CODE = 'COMITE2026'

function CommitteeInvitationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const invitationFromUrl = new URLSearchParams(location.search).get('invitacion') || ''
  const [form, setForm] = useState({
    invitation: invitationFromUrl,
    firstName: '',
    lastName: '',
    email: '',
    institution: 'Universidad de Lima',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (form.invitation.trim().toUpperCase() !== INVITATION_CODE) {
      nextErrors.invitation = 'La invitación no es válida o ya venció.'
    }
    if (!form.firstName.trim()) nextErrors.firstName = 'Ingrese sus nombres.'
    if (!form.lastName.trim()) nextErrors.lastName = 'Ingrese sus apellidos.'
    if (!/^[^\s@]+@(aloe\.)?ulima\.edu\.pe$/i.test(form.email)) {
      nextErrors.email = 'Ingrese un correo institucional válido.'
    }
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
      nextErrors.password = 'Use al menos 8 caracteres, una mayúscula y un número.'
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const account = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      institution: form.institution,
      password: form.password,
      role: 'comite',
    }
    const session = {
      email: account.email,
      name: `${account.firstName} ${account.lastName}`,
      role: account.role,
    }

    saveAccount(account)
    saveSession(session)
    navigate('/registro-exitoso', {
      replace: true,
      state: { name: session.name },
    })
  }

  return (
    <section className="auth-section auth-section--wide">
      <div className="auth-card">
        <div className="registration-form">
          <div className="auth-heading">
            <p className="eyebrow eyebrow--dark">Invitación del comité</p>
            <h1>Registro de miembro del comité</h1>
            <p>Complete sus datos utilizando la invitación enviada por la organización.</p>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="notification notification--error" role="alert">
              Revise los campos marcados antes de continuar.
            </div>
          )}

          <form noValidate onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="invitation">Código de invitación *</label>
              <input
                aria-invalid={Boolean(errors.invitation)}
                id="invitation"
                name="invitation"
                onChange={handleChange}
                placeholder="Código recibido por correo"
                value={form.invitation}
              />
              {errors.invitation ? (
                <span className="field-error">{errors.invitation}</span>
              ) : (
                <span className="field-help">Para la demostración use COMITE2026.</span>
              )}
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="committeeFirstName">Nombres *</label>
                <input id="committeeFirstName" name="firstName" onChange={handleChange} value={form.firstName} />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="field">
                <label htmlFor="committeeLastName">Apellidos *</label>
                <input id="committeeLastName" name="lastName" onChange={handleChange} value={form.lastName} />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
              <div className="field field--full">
                <label htmlFor="committeeEmail">Correo institucional *</label>
                <input id="committeeEmail" name="email" onChange={handleChange} type="email" value={form.email} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="field field--full">
                <label htmlFor="committeeInstitution">Institución *</label>
                <input id="committeeInstitution" name="institution" onChange={handleChange} value={form.institution} />
              </div>
              <div className="field">
                <label htmlFor="committeePassword">Contraseña *</label>
                <input id="committeePassword" name="password" onChange={handleChange} type="password" value={form.password} />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <div className="field">
                <label htmlFor="committeeConfirmPassword">Confirmar contraseña *</label>
                <input id="committeeConfirmPassword" name="confirmPassword" onChange={handleChange} type="password" value={form.confirmPassword} />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-actions">
              <Link className="button button--secondary" to="/">Cancelar</Link>
              <button className="button button--primary" type="submit">Activar cuenta</button>
            </div>
          </form>
        </div>

        <aside className="registration-aside">
          <p className="eyebrow">Acceso institucional</p>
          <h2>Comité organizador</h2>
          <p>Esta modalidad de registro solo está disponible mediante una invitación vigente.</p>
          <ul>
            <li><strong>Gestión de la edición</strong><span>Configure fechas, ejes y criterios.</span></li>
            <li><strong>Gestión de revisiones</strong><span>Asigne revisores y controle los plazos.</span></li>
          </ul>
        </aside>
      </div>
    </section>
  )
}

export default CommitteeInvitationPage
