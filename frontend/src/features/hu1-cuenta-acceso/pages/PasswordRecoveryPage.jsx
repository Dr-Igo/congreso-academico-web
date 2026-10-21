import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updateStoredPassword } from '../../../lib/auth'

const initialForm = {
  email: 'rosa.quispe@aloe.ulima.edu.pe',
  password: 'React2026',
  confirmPassword: 'React2026',
}

function PasswordRecoveryPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const handleEmailSubmit = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@(aloe\.)?ulima\.edu\.pe$/i.test(form.email)) {
      setError('Ingrese un correo institucional válido.')
      return
    }
    setStep(2)
  }

  const handlePasswordSubmit = (event) => {
    event.preventDefault()
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
      setError('Use al menos 8 caracteres, una mayúscula y un número.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    updateStoredPassword(form.email, form.password)
    navigate('/iniciar-sesion', {
      replace: true,
      state: { successMessage: 'Contraseña actualizada correctamente. Ya puede iniciar sesión.' },
    })
  }

  return (
    <section className="hu1-auth-page">
      <div className="hu1-recovery-card">
        <div className="hu1-recovery-progress" aria-label={`Paso ${step} de 3`}>
          {[
            [1, '1. Correo'],
            [2, '2. Envío'],
            [3, '3. Nueva contraseña'],
          ].map(([number, label]) => (
            <button
              className={`hu1-recovery-step${number === step ? ' hu1-recovery-step--active' : ''}${number < step ? ' hu1-recovery-step--complete' : ''}`}
              key={number}
              onClick={() => setStep(number)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {step === 1 && (
          <>
            <h1>Recuperar contraseña</h1>
            <p className="hu1-page-subtitle">
              Ingrese el correo con el que se registró. Le enviaremos un enlace para crear una nueva contraseña.
            </p>
            <form noValidate onSubmit={handleEmailSubmit}>
              <div className="hu1-field">
                <label htmlFor="recoveryEmail">Correo institucional</label>
                <input
                  aria-invalid={Boolean(error)}
                  id="recoveryEmail"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  value={form.email}
                />
                {error ? (
                  <span className="hu1-field-error">{error}</span>
                ) : (
                  <span className="hu1-field-help">El enlace vence en 30 minutos.</span>
                )}
              </div>
              <div className="hu1-recovery-actions">
                <button className="hu1-button hu1-button--primary" type="submit">Enviar enlace</button>
                <Link className="hu1-button hu1-button--outline" to="/iniciar-sesion">Volver</Link>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="hu1-notice hu1-notice--success" role="status">
              <span aria-hidden="true">✓</span>
              <span>
                {resent ? 'Reenviamos' : 'Enviamos'} el enlace de recuperación a <strong>{form.email}</strong>.
              </span>
            </div>
            <h1>Revise su correo</h1>
            <p className="hu1-page-subtitle">
              El enlace vence en 30 minutos. Si no lo encuentra, revise la carpeta de correo no deseado antes de solicitar uno nuevo.
            </p>
            <div className="hu1-recovery-inline">
              <button className="hu1-button hu1-button--outline" onClick={() => setResent(true)} type="button">
                Reenviar enlace
              </button>
              <span>Podrá reenviar en 02:00 min</span>
            </div>
            <p className="hu1-recovery-return">
              <Link className="hu1-text-link" to="/iniciar-sesion">Volver al inicio de sesión</Link>
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h1>Cree su nueva contraseña</h1>
            <p className="hu1-page-subtitle">
              La nueva contraseña reemplaza a la anterior en todos sus dispositivos.
            </p>
            <form noValidate onSubmit={handlePasswordSubmit}>
              <div className="hu1-field">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <div className="hu1-password-field">
                  <input
                    id="newPassword"
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
                <span className="hu1-field-help">Mínimo 8 caracteres, una mayúscula y un número.</span>
              </div>
              <div className="hu1-field">
                <label htmlFor="confirmNewPassword">Confirmar nueva contraseña</label>
                <input
                  aria-invalid={Boolean(error)}
                  className={!error && form.confirmPassword === form.password ? 'hu1-valid-field' : ''}
                  id="confirmNewPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  type="password"
                  value={form.confirmPassword}
                />
                {error ? (
                  <span className="hu1-field-error">{error}</span>
                ) : (
                  <span className="hu1-valid-text">Las contraseñas coinciden.</span>
                )}
              </div>
              <button className="hu1-button hu1-button--primary hu1-button--full" type="submit">
                Guardar y entrar
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

export default PasswordRecoveryPage
