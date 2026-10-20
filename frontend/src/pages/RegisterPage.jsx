import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { saveAccount, saveSession } from '../lib/auth'

const initialForm = {
  firstName: 'Rosa María',
  lastName: 'Quispe Tito',
  email: 'rosa.quispe@aloe.ulima.edu.pe',
  institution: 'Universidad de Lima',
  career: 'Ingeniería de Sistemas',
  studentCode: '20211547',
  password: 'React2026',
  confirmPassword: 'React2026',
  role: 'autor',
  acceptedTerms: false,
}

const institutionalEmail = /^[^\s@]+@(aloe\.)?ulima\.edu\.pe$/i

function fieldError(name, form) {
  if (name === 'firstName' && !form.firstName.trim()) return 'Este campo es obligatorio.'
  if (name === 'lastName' && !form.lastName.trim()) return 'Este campo es obligatorio.'
  if (name === 'email' && !institutionalEmail.test(form.email)) {
    return 'Use un correo institucional válido (@aloe.ulima.edu.pe).'
  }
  if (name === 'career' && form.role !== 'revisor' && !form.career) {
    return 'Seleccione su carrera.'
  }
  if (
    name === 'password'
    && (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password))
  ) {
    return 'Use al menos 8 caracteres, una mayúscula y un número.'
  }
  if (name === 'confirmPassword' && form.confirmPassword !== form.password) {
    return 'Las contraseñas no coinciden.'
  }
  return ''
}

function validate(form) {
  const errors = {}
  const fields = ['firstName', 'lastName', 'email', 'career', 'password', 'confirmPassword']

  fields.forEach((name) => {
    const error = fieldError(name, form)
    if (error) errors[name] = error
  })

  return errors
}

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      if (name === 'role' && value === 'revisor') delete next.career
      return next
    })
  }

  const handleBlur = (event) => {
    const name = event.target.name
    const error = fieldError(name, form)

    setErrors((current) => {
      const next = { ...current }
      if (error) next[name] = error
      else delete next[name]
      return next
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    const account = {
      email: form.email.trim().toLowerCase(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      institution: form.institution,
      career: form.role === 'revisor' ? '' : form.career,
      studentCode: form.role === 'revisor' ? '' : form.studentCode.trim(),
      password: form.password,
      role: form.role,
      interests: [],
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

  const errorCount = Object.keys(errors).length
  const validPassword = !fieldError('password', form)
  const matchingPasswords = form.password === form.confirmPassword && form.confirmPassword !== ''

  return (
    <section className="hu1-register-page">
      <div className="hu1-register-layout">
        <div className="hu1-register-main">
          <h1 className="hu1-page-title">Registro de participante</h1>
          <p className="hu1-page-subtitle">Los campos marcados con asterisco son obligatorios.</p>

          {errorCount > 0 && (
            <div className="hu1-notice hu1-notice--error" role="alert">
              <span aria-hidden="true">!</span>
              <span>Revise {errorCount} {errorCount === 1 ? 'campo' : 'campos'} con errores antes de continuar.</span>
            </div>
          )}

          <form noValidate onSubmit={handleSubmit}>
            <div className="hu1-form-grid">
              <div className="hu1-field">
                <label htmlFor="firstName">Nombres *</label>
                <input
                  aria-invalid={Boolean(errors.firstName)}
                  id="firstName"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form.firstName}
                />
                {errors.firstName && <span className="hu1-field-error">{errors.firstName}</span>}
              </div>

              <div className="hu1-field">
                <label htmlFor="lastName">Apellidos *</label>
                <input
                  aria-invalid={Boolean(errors.lastName)}
                  id="lastName"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form.lastName}
                />
                {errors.lastName && <span className="hu1-field-error">{errors.lastName}</span>}
              </div>

              <div className="hu1-field">
                <label htmlFor="registerEmail">Correo institucional *</label>
                <input
                  aria-invalid={Boolean(errors.email)}
                  id="registerEmail"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={form.email}
                />
                {errors.email ? (
                  <span className="hu1-field-error">{errors.email}</span>
                ) : (
                  <span className="hu1-field-help">Se usará para todas las notificaciones.</span>
                )}
              </div>

              <div className="hu1-field">
                <label htmlFor="institution">Institución *</label>
                <select id="institution" name="institution" onChange={handleChange} value={form.institution}>
                  <option>Universidad de Lima</option>
                  <option>Pontificia Universidad Católica del Perú</option>
                  <option>Universidad Nacional de Ingeniería</option>
                </select>
              </div>

              <div className="hu1-field">
                <label htmlFor="registerPassword">Contraseña *</label>
                <div className="hu1-password-field">
                  <input
                    aria-invalid={Boolean(errors.password)}
                    className={errorCount > 0 && validPassword ? 'hu1-valid-field' : ''}
                    id="registerPassword"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                  />
                  <button
                    className="hu1-password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {errors.password ? (
                  <span className="hu1-field-error">{errors.password}</span>
                ) : errorCount > 0 ? (
                  <span className="hu1-valid-text">Contraseña segura.</span>
                ) : (
                  <span className="hu1-field-help">Mínimo 8 caracteres, una mayúscula y un número.</span>
                )}
              </div>

              <div className="hu1-field">
                <label htmlFor="confirmPassword">Confirmar contraseña *</label>
                <input
                  aria-invalid={Boolean(errors.confirmPassword)}
                  id="confirmPassword"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={form.confirmPassword}
                />
                {errors.confirmPassword && <span className="hu1-field-error">{errors.confirmPassword}</span>}
              </div>

              {form.role !== 'revisor' && (
                <>
                  <div className="hu1-field">
                    <label htmlFor="career">Carrera *</label>
                    <select
                      aria-invalid={Boolean(errors.career)}
                      id="career"
                      name="career"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={form.career}
                    >
                      <option value="">Seleccione una carrera</option>
                      <option>Ingeniería de Sistemas</option>
                      <option>Ingeniería Industrial</option>
                      <option>Comunicación</option>
                      <option>Economía</option>
                    </select>
                    {errors.career && <span className="hu1-field-error">{errors.career}</span>}
                  </div>

                  <div className="hu1-field">
                    <label htmlFor="studentCode">Código de alumno</label>
                    <input
                      id="studentCode"
                      inputMode="numeric"
                      name="studentCode"
                      onChange={handleChange}
                      value={form.studentCode}
                    />
                  </div>
                </>
              )}

              <fieldset className="hu1-fieldset">
                <legend>Deseo participar como *</legend>
                <div className="hu1-role-options">
                  {[
                    ['autor', 'Autor', 'Enviaré uno o más trabajos.'],
                    ['revisor', 'Revisor', 'Evaluaré trabajos asignados.'],
                    ['ambos', 'Ambos', 'Participaré como autor y revisor.'],
                  ].map(([value, title, description]) => (
                    <label
                      className={`hu1-role-option${form.role === value ? ' hu1-role-option--selected' : ''}`}
                      key={value}
                    >
                      <input
                        checked={form.role === value}
                        name="role"
                        onChange={handleChange}
                        type="radio"
                        value={value}
                      />
                      <span><strong>{title}</strong><small>{description}</small></span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="hu1-checkbox hu1-terms">
                <input
                  checked={form.acceptedTerms}
                  name="acceptedTerms"
                  onChange={handleChange}
                  type="checkbox"
                />
                Acepto las bases del congreso y el tratamiento de mis datos.
              </label>

              <div className="hu1-form-actions hu1-form-actions--full">
                <Link className="hu1-button hu1-button--outline" to="/">Cancelar</Link>
                <button className="hu1-button hu1-button--primary" type="submit">Crear mi cuenta</button>
              </div>
            </div>
          </form>
        </div>

        <aside className="hu1-register-aside">
          {errorCount > 0 ? (
            <>
              <h2>Requisitos de la contraseña</h2>
              <ul className="hu1-password-checks">
                <li className={form.password.length >= 8 ? '' : 'hu1-check--error'}>
                  {form.password.length >= 8 ? '✓' : '×'} Mínimo 8 caracteres
                </li>
                <li className={/[A-Z]/.test(form.password) ? '' : 'hu1-check--error'}>
                  {/[A-Z]/.test(form.password) ? '✓' : '×'} Al menos una mayúscula
                </li>
                <li className={/\d/.test(form.password) ? '' : 'hu1-check--error'}>
                  {/\d/.test(form.password) ? '✓' : '×'} Al menos un número
                </li>
                <li className={matchingPasswords ? '' : 'hu1-check--error'}>
                  {matchingPasswords ? '✓' : '×'} La confirmación debe coincidir
                </li>
              </ul>
            </>
          ) : (
            <>
              <h2>Antes de registrarse</h2>
              <p>
                La recepción de trabajos cierra el 30/09/2026 a las 23:59. Después de esa fecha
                no será posible editar los envíos.
              </p>
              <p>
                Si participa como revisor, deberá declarar sus líneas de interés para recibir
                asignaciones relacionadas con su experiencia.
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}

export default RegisterPage
