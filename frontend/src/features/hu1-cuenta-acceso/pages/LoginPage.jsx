import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAccountByEmail, getRoleHome, saveSession } from '../../../lib/auth'

const DEMO_ACCOUNTS = [
  {
    email: 'rosa.quispe@aloe.ulima.edu.pe',
    password: 'React2026',
    name: 'Rosa María Quispe Tito',
    role: 'autor',
  },
  {
    email: 'luis.ramirez@ulima.edu.pe',
    password: 'Revisar2026',
    name: 'Mg. Luis Ramírez Cárdenas',
    role: 'revisor',
  },
  {
    email: 'comite@ulima.edu.pe',
    password: 'Comite2026',
    name: 'Dra. Ana Salazar Bermúdez',
    role: 'comite',
  },
]

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({
    email: 'rosa.quispe@aloe.ulima.edu.pe',
    password: 'React2026',
    remember: false,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: undefined, general: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.email.trim()) nextErrors.email = 'Ingrese su correo institucional.'
    if (!form.password) nextErrors.password = 'Ingrese su contraseña.'

    const normalizedEmail = form.email.trim().toLowerCase()
    const registeredAccount = getAccountByEmail(normalizedEmail)
    const demoAccount = DEMO_ACCOUNTS.find(
      (account) => account.email === normalizedEmail && account.password === form.password,
    )
    const isRegisteredAccount = registeredAccount?.password === form.password

    if (Object.keys(nextErrors).length === 0 && !demoAccount && !isRegisteredAccount) {
      nextErrors.general =
        'El correo o la contraseña no son correctos. Le quedan 3 intentos antes del bloqueo temporal.'
      nextErrors.password = 'Verifique su contraseña.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const session = isRegisteredAccount
      ? {
          email: registeredAccount.email,
          name: `${registeredAccount.firstName} ${registeredAccount.lastName}`.trim(),
          role: registeredAccount.role,
          remember: form.remember,
        }
      : {
          email: demoAccount.email,
          name: demoAccount.name,
          role: demoAccount.role,
          remember: form.remember,
        }

    saveSession(session)
    navigate(location.state?.from || getRoleHome(session.role), {
      replace: true,
      state: { successMessage: `Sesión iniciada correctamente. Bienvenido(a), ${session.name}.` },
    })
  }

  return (
    <section className="hu1-auth-page">
      <div className="hu1-login-card">
        <h1>Inicio de sesión</h1>

        {location.state?.successMessage && (
          <div className="hu1-notice hu1-notice--success" role="status">
            <span aria-hidden="true">✓</span>
            <span>{location.state.successMessage}</span>
          </div>
        )}

        {errors.general && (
          <div className="hu1-notice hu1-notice--error" role="alert">
            <span aria-hidden="true">!</span>
            <span>{errors.general}</span>
          </div>
        )}

        <form noValidate onSubmit={handleSubmit}>
          <div className="hu1-field">
            <label htmlFor="email">Correo institucional</label>
            <input
              aria-invalid={Boolean(errors.email || errors.general)}
              id="email"
              name="email"
              onChange={handleChange}
              type="email"
              value={form.email}
            />
            {errors.email && <span className="hu1-field-error">{errors.email}</span>}
          </div>

          <div className="hu1-field">
            <label htmlFor="password">Contraseña</label>
            <div className="hu1-password-field">
              <input
                aria-invalid={Boolean(errors.password)}
                id="password"
                name="password"
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
            {errors.password && <span className="hu1-field-error">{errors.password}</span>}
          </div>

          <div className="hu1-form-options">
            <label className="hu1-checkbox">
              <input
                checked={form.remember}
                name="remember"
                onChange={handleChange}
                type="checkbox"
              />
              Recordarme en este equipo
            </label>
            <Link className="hu1-text-link" to="/recuperar-contrasena">¿Olvidó su contraseña?</Link>
          </div>

          <button className="hu1-button hu1-button--primary hu1-button--full" type="submit">
            Ingresar
          </button>
        </form>

        <p className="hu1-auth-bottom">
          ¿No tiene una cuenta? <Link className="hu1-text-link" to="/registro">Registrarse como participante</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
