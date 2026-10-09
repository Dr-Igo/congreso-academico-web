import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAccountByEmail, getRoleHome, saveSession } from '../lib/auth'

const DEMO_ACCOUNTS = [
  {
    email: 'rosa.quispe@aloe.ulima.edu.pe',
    password: 'React2026',
    name: 'Rosa Quispe',
    role: 'autor',
    label: 'Autor',
  },
  {
    email: 'luis.ramirez@ulima.edu.pe',
    password: 'Revisar2026',
    name: 'Luis Ramírez',
    role: 'revisor',
    label: 'Revisor',
  },
  {
    email: 'comite@ulima.edu.pe',
    password: 'Comite2026',
    name: 'Ana Salazar',
    role: 'comite',
    label: 'Comité',
  },
]

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
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
        'El correo o la contraseña no son correctos. Verifique los datos e intente nuevamente.'
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
    <section className="auth-section">
      <div className="auth-card auth-card--compact">
        <div className="auth-heading">
          <p className="eyebrow eyebrow--dark">Acceso de participantes</p>
          <h1>Inicio de sesión</h1>
          <p>Ingrese con su correo institucional para enviar o revisar trabajos.</p>
        </div>

        {location.state?.successMessage && (
          <div className="notification notification--success" role="status">
            <span aria-hidden="true">✓</span>
            {location.state.successMessage}
          </div>
        )}
        {errors.general && (
          <div className="notification notification--error" role="alert">
            <span aria-hidden="true">!</span>
            {errors.general}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Correo institucional</label>
            <input
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={Boolean(errors.email)}
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="nombre@aloe.ulima.edu.pe"
              type="email"
              value={form.email}
            />
            {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input">
              <input
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={Boolean(errors.password)}
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
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
            {errors.password && (
              <span className="field-error" id="password-error">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                checked={form.remember}
                name="remember"
                onChange={handleChange}
                type="checkbox"
              />
              Recordarme en este equipo
            </label>
            <Link className="text-link" to="/recuperar-contrasena">¿Olvidó su contraseña?</Link>
          </div>

          <button className="button button--primary button--full" type="submit">Ingresar</button>
        </form>

        <div className="demo-credentials">
          <strong>Credenciales para la demostración</strong>
          {DEMO_ACCOUNTS.map((account) => (
            <button
              className="demo-account"
              key={account.role}
              onClick={() => setForm({ email: account.email, password: account.password, remember: false })}
              type="button"
            >
              <strong>{account.label}</strong>
              <span>{account.email}</span>
              <span>{account.password}</span>
            </button>
          ))}
        </div>

        <p className="auth-footer-text">
          ¿No tiene cuenta? <Link to="/registro">Registrarse como participante</Link>
        </p>
        <p className="auth-footer-text auth-footer-text--secondary">
          ¿Recibió una invitación? <Link to="/registro-comite">Activar cuenta del comité</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
