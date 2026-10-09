import { useState } from 'react'
import {
  getAccountByEmail,
  getSession,
  REVIEW_INTERESTS,
  ROLE_LABELS,
  saveAccount,
  saveSession,
} from '../lib/auth'

function createProfile(session) {
  const storedAccount = getAccountByEmail(session.email)
  const nameParts = session.name?.trim().split(/\s+/) ?? []

  return {
    firstName: storedAccount?.firstName || nameParts[0] || '',
    lastName: storedAccount?.lastName || nameParts.slice(1).join(' ') || '',
    email: storedAccount?.email || session.email,
    institution: storedAccount?.institution || 'Universidad de Lima',
    career: storedAccount?.career || 'Ingeniería de Sistemas',
    studentCode: storedAccount?.studentCode || '',
    interests: storedAccount?.interests || [],
    password: storedAccount?.password || '',
    role: session.role,
  }
}

function AccountPage() {
  const session = getSession()
  const [profile, setProfile] = useState(() => createProfile(session))
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [profileMessage, setProfileMessage] = useState(null)
  const [passwordMessage, setPasswordMessage] = useState(null)
  const [errors, setErrors] = useState({})
  const canReview = profile.role === 'revisor' || profile.role === 'ambos'

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setProfileMessage(null)
  }

  const toggleInterest = (interest) => {
    setProfile((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }))
    setErrors((current) => ({ ...current, interests: undefined }))
    setProfileMessage(null)
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!profile.firstName.trim()) nextErrors.firstName = 'Ingrese sus nombres.'
    if (!profile.lastName.trim()) nextErrors.lastName = 'Ingrese sus apellidos.'
    if (!/^[^\s@]+@(aloe\.)?ulima\.edu\.pe$/i.test(profile.email)) {
      nextErrors.email = 'Ingrese un correo institucional válido.'
    }
    if (canReview && profile.interests.length === 0) {
      nextErrors.interests = 'Seleccione al menos una línea de interés.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setProfileMessage({ type: 'error', text: 'Revise los campos marcados.' })
      return
    }

    const normalizedProfile = {
      ...profile,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email: profile.email.trim().toLowerCase(),
    }
    const nextSession = {
      ...session,
      email: normalizedProfile.email,
      name: `${normalizedProfile.firstName} ${normalizedProfile.lastName}`,
    }

    saveAccount(normalizedProfile)
    saveSession(nextSession)
    setProfile(normalizedProfile)
    setProfileMessage({ type: 'success', text: 'Los datos de su cuenta se guardaron correctamente.' })
  }

  const changePassword = (event) => {
    event.preventDefault()
    const nextErrors = {}
    const storedPassword = getAccountByEmail(session.email)?.password

    if (!passwordForm.current) nextErrors.current = 'Ingrese su contraseña actual.'
    else if (storedPassword && passwordForm.current !== storedPassword) {
      nextErrors.current = 'La contraseña actual no es correcta.'
    }
    if (passwordForm.next.length < 8 || !/[A-Z]/.test(passwordForm.next) || !/\d/.test(passwordForm.next)) {
      nextErrors.next = 'Use al menos 8 caracteres, una mayúscula y un número.'
    }
    if (passwordForm.next !== passwordForm.confirm) {
      nextErrors.confirm = 'Las contraseñas no coinciden.'
    }

    setErrors((current) => ({ ...current, ...nextErrors }))
    if (Object.keys(nextErrors).length > 0) {
      setPasswordMessage({ type: 'error', text: 'No se pudo cambiar la contraseña.' })
      return
    }

    const updatedProfile = { ...profile, password: passwordForm.next }
    saveAccount(updatedProfile)
    setProfile(updatedProfile)
    setPasswordForm({ current: '', next: '', confirm: '' })
    setPasswordMessage({ type: 'success', text: 'La contraseña se actualizó correctamente.' })
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswordForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setPasswordMessage(null)
  }

  return (
    <section className="account-page">
      <div className="content-container">
        <div className="account-heading">
          <div>
            <p className="eyebrow eyebrow--dark">Cuenta y acceso</p>
            <h1>Mi cuenta</h1>
            <p>Actualice sus datos personales, preferencias y contraseña.</p>
          </div>
          <span className="role-badge">{ROLE_LABELS[profile.role]}</span>
        </div>

        <div className="account-layout">
          <div className="account-main">
            <form className="account-panel" noValidate onSubmit={saveProfile}>
              <div className="panel-title">
                <div><h2>Datos personales</h2><p>Información utilizada en las comunicaciones del congreso.</p></div>
              </div>

              {profileMessage && (
                <div className={`notification notification--${profileMessage.type}`} role="status">
                  {profileMessage.text}
                </div>
              )}

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="accountFirstName">Nombres *</label>
                  <input id="accountFirstName" name="firstName" onChange={handleProfileChange} value={profile.firstName} />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="field">
                  <label htmlFor="accountLastName">Apellidos *</label>
                  <input id="accountLastName" name="lastName" onChange={handleProfileChange} value={profile.lastName} />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
                <div className="field field--full">
                  <label htmlFor="accountEmail">Correo institucional *</label>
                  <input id="accountEmail" name="email" onChange={handleProfileChange} type="email" value={profile.email} />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="accountInstitution">Institución</label>
                  <input id="accountInstitution" name="institution" onChange={handleProfileChange} value={profile.institution} />
                </div>
                {profile.role !== 'comite' && (
                  <>
                    <div className="field">
                      <label htmlFor="accountCareer">Carrera</label>
                      <input id="accountCareer" name="career" onChange={handleProfileChange} value={profile.career} />
                    </div>
                    <div className="field">
                      <label htmlFor="accountStudentCode">Código de alumno</label>
                      <input id="accountStudentCode" name="studentCode" onChange={handleProfileChange} value={profile.studentCode} />
                    </div>
                  </>
                )}
              </div>

              {canReview && (
                <fieldset className="interest-fieldset">
                  <legend>Líneas de interés para revisión *</legend>
                  <p>Estas preferencias ayudan al comité a asignarle trabajos relacionados con su experiencia.</p>
                  <div className="interest-grid">
                    {REVIEW_INTERESTS.map((interest) => (
                      <label className="interest-option" key={interest}>
                        <input
                          checked={profile.interests.includes(interest)}
                          onChange={() => toggleInterest(interest)}
                          type="checkbox"
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                  {errors.interests && <span className="field-error">{errors.interests}</span>}
                </fieldset>
              )}

              <div className="form-actions">
                <button className="button button--primary" type="submit">Guardar cambios</button>
              </div>
            </form>

            <form className="account-panel" noValidate onSubmit={changePassword}>
              <div className="panel-title">
                <div><h2>Cambiar contraseña</h2><p>Utilice una contraseña distinta a la anterior.</p></div>
              </div>

              {passwordMessage && (
                <div className={`notification notification--${passwordMessage.type}`} role="status">
                  {passwordMessage.text}
                </div>
              )}

              <div className="form-grid">
                <div className="field field--full">
                  <label htmlFor="currentPassword">Contraseña actual</label>
                  <input id="currentPassword" name="current" onChange={handlePasswordChange} type="password" value={passwordForm.current} />
                  {errors.current && <span className="field-error">{errors.current}</span>}
                </div>
                <div className="field">
                  <label htmlFor="nextPassword">Nueva contraseña</label>
                  <input id="nextPassword" name="next" onChange={handlePasswordChange} type="password" value={passwordForm.next} />
                  {errors.next && <span className="field-error">{errors.next}</span>}
                </div>
                <div className="field">
                  <label htmlFor="confirmAccountPassword">Confirmar contraseña</label>
                  <input id="confirmAccountPassword" name="confirm" onChange={handlePasswordChange} type="password" value={passwordForm.confirm} />
                  {errors.confirm && <span className="field-error">{errors.confirm}</span>}
                </div>
              </div>
              <div className="form-actions">
                <button className="button button--secondary" type="submit">Actualizar contraseña</button>
              </div>
            </form>
          </div>

          <aside className="account-sidebar">
            <div className="account-panel account-summary">
              <span className="account-avatar" aria-hidden="true">
                {profile.firstName.slice(0, 1)}{profile.lastName.slice(0, 1)}
              </span>
              <h2>{profile.firstName} {profile.lastName}</h2>
              <p>{profile.email}</p>
              <span className="role-badge">{ROLE_LABELS[profile.role]}</span>
            </div>
            <div className="account-panel activity-summary">
              <h2>Actividad de la cuenta</h2>
              <dl>
                <div><dt>Edición vigente</dt><dd>2026</dd></div>
                <div><dt>Estado</dt><dd className="status-active">Activa</dd></div>
                {canReview && <div><dt>Líneas seleccionadas</dt><dd>{profile.interests.length}</dd></div>}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default AccountPage
