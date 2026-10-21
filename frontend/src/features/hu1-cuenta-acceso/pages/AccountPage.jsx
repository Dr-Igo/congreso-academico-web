import { useState } from 'react'
import {
  getAccountByEmail,
  getSession,
  REVIEW_INTERESTS,
  saveAccount,
  saveSession,
} from '../../../lib/auth'

function createProfile(session) {
  const storedAccount = getAccountByEmail(session.email)
  const reviewerDemo = session.email === 'luis.ramirez@ulima.edu.pe'
  const authorDemo = session.email === 'rosa.quispe@aloe.ulima.edu.pe'
  const nameParts = session.name?.trim().split(/\s+/) ?? []

  return {
    firstName: storedAccount?.firstName || (reviewerDemo ? 'Luis Fernando' : authorDemo ? 'Rosa María' : nameParts[0] || ''),
    lastName: storedAccount?.lastName || (reviewerDemo ? 'Ramírez Cárdenas' : authorDemo ? 'Quispe Tito' : nameParts.slice(1).join(' ') || ''),
    email: storedAccount?.email || session.email,
    institution: storedAccount?.institution || 'Universidad de Lima',
    career: storedAccount?.career || 'Ingeniería de Sistemas',
    studentCode: storedAccount?.studentCode || (authorDemo ? '20211547' : ''),
    interests: storedAccount?.interests?.length
      ? storedAccount.interests
      : reviewerDemo
        ? [REVIEW_INTERESTS[0], REVIEW_INTERESTS[1], REVIEW_INTERESTS[3]]
        : [],
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
    }
    const nextSession = {
      ...session,
      name: `${normalizedProfile.firstName} ${normalizedProfile.lastName}`,
    }

    saveAccount(normalizedProfile)
    saveSession(nextSession)
    setProfile(normalizedProfile)
    setProfileMessage({ type: 'success', text: 'Los datos de su cuenta se guardaron correctamente.' })
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswordForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setPasswordMessage(null)
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

  return (
    <section className="hu1-account-page">
      <div className="hu1-account-content">
        <div className="hu1-account-heading">
          <div>
            <h1 className="hu1-page-title">Mi cuenta</h1>
            <p className="hu1-page-subtitle">Datos personales, líneas de interés y seguridad.</p>
          </div>
          <button className="hu1-button hu1-button--primary" form="profile-form" type="submit">
            Guardar cambios
          </button>
        </div>

        <div className="hu1-account-layout">
          <div className="hu1-account-column">
            <form className="hu1-account-panel" id="profile-form" noValidate onSubmit={saveProfile}>
              <h2>Datos personales</h2>

              {profileMessage && (
                <div className={`hu1-notice hu1-notice--${profileMessage.type}`} role="status">
                  <span aria-hidden="true">{profileMessage.type === 'success' ? '✓' : '!'}</span>
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <div className="hu1-form-grid">
                <div className="hu1-field">
                  <label htmlFor="accountFirstName">Nombres</label>
                  <input
                    aria-invalid={Boolean(errors.firstName)}
                    id="accountFirstName"
                    name="firstName"
                    onChange={handleProfileChange}
                    value={profile.firstName}
                  />
                  {errors.firstName && <span className="hu1-field-error">{errors.firstName}</span>}
                </div>
                <div className="hu1-field">
                  <label htmlFor="accountLastName">Apellidos</label>
                  <input
                    aria-invalid={Boolean(errors.lastName)}
                    id="accountLastName"
                    name="lastName"
                    onChange={handleProfileChange}
                    value={profile.lastName}
                  />
                  {errors.lastName && <span className="hu1-field-error">{errors.lastName}</span>}
                </div>
                <div className="hu1-field">
                  <label htmlFor="accountEmail">Correo institucional</label>
                  <input
                    className="hu1-account-email"
                    id="accountEmail"
                    readOnly
                    type="email"
                    value={profile.email}
                  />
                </div>
                <div className="hu1-field">
                  <label htmlFor="accountInstitution">Institución</label>
                  <input
                    id="accountInstitution"
                    name="institution"
                    onChange={handleProfileChange}
                    value={profile.institution}
                  />
                </div>
                <p className="hu1-account-help">Para cambiarlo, escriba al comité organizador.</p>
              </div>
            </form>

            {canReview && (
              <section className="hu1-account-panel">
                <div className="hu1-interest-heading">
                  <div>
                    <h2>Líneas de interés como revisor</h2>
                  </div>
                  <span>{profile.interests.length} de {REVIEW_INTERESTS.length} seleccionadas</span>
                </div>
                <p className="hu1-interest-description">Las asignaciones priorizan sus líneas declaradas.</p>
                <div className="hu1-interest-options">
                  {REVIEW_INTERESTS.map((interest) => {
                    const selected = profile.interests.includes(interest)
                    return (
                      <button
                        className={`hu1-interest-option${selected ? ' hu1-interest-option--selected' : ''}`}
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        type="button"
                      >
                        {interest}{selected ? ' ✓' : ''}
                      </button>
                    )
                  })}
                </div>
                {errors.interests && <p className="hu1-field-error">{errors.interests}</p>}
              </section>
            )}
          </div>

          <div className="hu1-account-column">
            <form className="hu1-account-panel hu1-account-password" noValidate onSubmit={changePassword}>
              <h2>Cambiar contraseña</h2>

              {passwordMessage && (
                <div className={`hu1-notice hu1-notice--${passwordMessage.type}`} role="status">
                  <span aria-hidden="true">{passwordMessage.type === 'success' ? '✓' : '!'}</span>
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <div className="hu1-field">
                <label htmlFor="currentPassword">Contraseña actual</label>
                <input
                  aria-invalid={Boolean(errors.current)}
                  id="currentPassword"
                  name="current"
                  onChange={handlePasswordChange}
                  type="password"
                  value={passwordForm.current}
                />
                {errors.current && <span className="hu1-field-error">{errors.current}</span>}
              </div>
              <div className="hu1-field">
                <label htmlFor="nextPassword">Nueva contraseña</label>
                <input
                  aria-invalid={Boolean(errors.next)}
                  id="nextPassword"
                  name="next"
                  onChange={handlePasswordChange}
                  type="password"
                  value={passwordForm.next}
                />
                {errors.next ? (
                  <span className="hu1-field-error">{errors.next}</span>
                ) : (
                  <span className="hu1-field-help">Mínimo 8 caracteres, una mayúscula y un número.</span>
                )}
              </div>
              <div className="hu1-field">
                <label htmlFor="confirmAccountPassword">Confirmar nueva contraseña</label>
                <input
                  aria-invalid={Boolean(errors.confirm)}
                  id="confirmAccountPassword"
                  name="confirm"
                  onChange={handlePasswordChange}
                  type="password"
                  value={passwordForm.confirm}
                />
                {errors.confirm && <span className="hu1-field-error">{errors.confirm}</span>}
              </div>
              <button className="hu1-button hu1-button--outline hu1-button--full" type="submit">
                Actualizar contraseña
              </button>
            </form>

            {canReview && (
              <section className="hu1-account-panel">
                <span className="hu1-activity-title">Mi actividad</span>
                <dl className="hu1-activity-list">
                  <div><dt>Revisiones asignadas</dt><dd>6</dd></div>
                  <div><dt>Revisiones entregadas</dt><dd className="hu1-activity-success">4</dd></div>
                  <div><dt>Pendientes</dt><dd className="hu1-activity-warning">2</dd></div>
                </dl>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccountPage
