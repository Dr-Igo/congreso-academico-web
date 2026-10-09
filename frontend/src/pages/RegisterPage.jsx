import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  institution: 'Universidad de Lima',
  career: '',
  studentCode: '',
  password: '',
  confirmPassword: '',
  role: 'autor',
  acceptedTerms: false,
}

function validate(form) {
  const errors = {}
  const institutionalEmail = /^[^\s@]+@(aloe\.)?ulima\.edu\.pe$/i

  if (!form.firstName.trim()) errors.firstName = 'Ingrese sus nombres.'
  if (!form.lastName.trim()) errors.lastName = 'Ingrese sus apellidos.'
  if (!form.email.trim()) errors.email = 'Ingrese su correo institucional.'
  else if (!institutionalEmail.test(form.email)) {
    errors.email = 'Use un correo institucional válido de la Universidad de Lima.'
  }
  if (!form.career) errors.career = 'Seleccione su carrera.'
  if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = 'Use al menos 8 caracteres, una mayúscula y un número.'
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
  }
  if (!form.acceptedTerms) errors.acceptedTerms = 'Debe aceptar las bases del congreso.'

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
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    localStorage.setItem(
      'congreso-account',
      JSON.stringify({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        role: form.role,
      }),
    )

    navigate('/iniciar-sesion', {
      state: {
        successMessage: `Cuenta creada correctamente para ${form.email}. Ya puede iniciar sesión.`,
      },
    })
  }

  const errorCount = Object.keys(errors).length

  return (
    <section className="auth-section auth-section--wide">
      <div className="auth-card">
        <div className="registration-form">
          <div className="auth-heading">
            <p className="eyebrow eyebrow--dark">Nuevo participante</p>
            <h1>Registro de participante</h1>
            <p>Los campos marcados con asterisco son obligatorios.</p>
          </div>

          {errorCount > 0 && (
            <div className="notification notification--error" role="alert">
              <span aria-hidden="true">!</span>
              Revise {errorCount} {errorCount === 1 ? 'campo' : 'campos'} antes de continuar.
            </div>
          )}

        <form noValidate onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="firstName">Nombres *</label>
              <input
                aria-invalid={Boolean(errors.firstName)}
                id="firstName"
                name="firstName"
                onChange={handleChange}
                value={form.firstName}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>

            <div className="field">
              <label htmlFor="lastName">Apellidos *</label>
              <input
                aria-invalid={Boolean(errors.lastName)}
                id="lastName"
                name="lastName"
                onChange={handleChange}
                value={form.lastName}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>

            <div className="field">
              <label htmlFor="registerEmail">Correo institucional *</label>
              <input
                aria-invalid={Boolean(errors.email)}
                id="registerEmail"
                name="email"
                onChange={handleChange}
                placeholder="nombre@aloe.ulima.edu.pe"
                type="email"
                value={form.email}
              />
              {errors.email ? (
                <span className="field-error">{errors.email}</span>
              ) : (
                <span className="field-help">Se usará para las comunicaciones del congreso.</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="institution">Institución *</label>
              <select id="institution" name="institution" onChange={handleChange} value={form.institution}>
                <option>Universidad de Lima</option>
                <option>Pontificia Universidad Católica del Perú</option>
                <option>Universidad Nacional de Ingeniería</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="career">Carrera *</label>
              <select
                aria-invalid={Boolean(errors.career)}
                id="career"
                name="career"
                onChange={handleChange}
                value={form.career}
              >
                <option value="">Seleccione una carrera</option>
                <option>Ingeniería de Sistemas</option>
                <option>Ingeniería Industrial</option>
                <option>Comunicación</option>
                <option>Economía</option>
              </select>
              {errors.career && <span className="field-error">{errors.career}</span>}
            </div>

            <div className="field">
              <label htmlFor="studentCode">Código de alumno</label>
              <input
                id="studentCode"
                inputMode="numeric"
                name="studentCode"
                onChange={handleChange}
                value={form.studentCode}
              />
            </div>

            <div className="field">
              <label htmlFor="registerPassword">Contraseña *</label>
              <div className="password-input">
                <input
                  aria-invalid={Boolean(errors.password)}
                  id="registerPassword"
                  name="password"
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                />
                <button
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {errors.password ? (
                <span className="field-error">{errors.password}</span>
              ) : (
                <span className="field-help">Mínimo 8 caracteres, una mayúscula y un número.</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirmar contraseña *</label>
              <input
                aria-invalid={Boolean(errors.confirmPassword)}
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleChange}
                type="password"
                value={form.confirmPassword}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <fieldset className="role-fieldset">
            <legend>Deseo participar como *</legend>
            <div className="role-options">
              {[
                ['autor', 'Autor', 'Enviaré uno o más trabajos.'],
                ['revisor', 'Revisor', 'Evaluaré trabajos asignados.'],
                ['ambos', 'Ambos', 'Participaré como autor y revisor.'],
              ].map(([value, title, description]) => (
                <label className="role-option" key={value}>
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

          <label className="checkbox-label terms-check">
            <input
              checked={form.acceptedTerms}
              name="acceptedTerms"
              onChange={handleChange}
              type="checkbox"
            />
            Acepto las bases del congreso y el tratamiento de mis datos.
          </label>
          {errors.acceptedTerms && <span className="field-error">{errors.acceptedTerms}</span>}

          <div className="form-actions">
            <Link className="button button--secondary" to="/">Cancelar</Link>
            <button className="button button--primary" type="submit">Crear mi cuenta</button>
          </div>
        </form>

          <p className="auth-footer-text">
            ¿Ya tiene una cuenta? <Link to="/iniciar-sesion">Iniciar sesión</Link>
          </p>
        </div>

        <aside className="registration-aside">
          <p className="eyebrow">Antes de registrarse</p>
          <h2>Prepare sus datos</h2>
          <p>
            La recepción de trabajos cierra el 30/09/2026 a las 23:59. Después de esa
            fecha no será posible editar los envíos.
          </p>
          <p>
            Si participa como revisor, deberá declarar sus líneas de interés para recibir
            asignaciones relacionadas con su experiencia.
          </p>
        </aside>
      </div>
    </section>
  )
}

export default RegisterPage
