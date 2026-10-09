import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialForm = {
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
}

function PasswordRecoveryPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

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

  const handleCodeSubmit = (event) => {
    event.preventDefault()
    if (form.code !== '123456') {
      setError('El código no es correcto. Para la demostración use 123456.')
      return
    }
    setStep(3)
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

    try {
      const account = JSON.parse(localStorage.getItem('congreso-account'))
      if (account?.email === form.email) {
        localStorage.setItem(
          'congreso-account',
          JSON.stringify({ ...account, password: form.password }),
        )
      }
    } catch {
      // La recuperación continúa en modo demostración aunque no exista una cuenta local.
    }

    setStep(4)
  }

  return (
    <section className="auth-section">
      <div className="auth-card auth-card--compact">
        <div className="recovery-progress" aria-label={`Paso ${Math.min(step, 3)} de 3`}>
          {[1, 2, 3].map((number) => (
            <span className={number <= step ? 'step-indicator step-indicator--active' : 'step-indicator'} key={number}>
              {number}
            </span>
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="auth-heading">
              <p className="eyebrow eyebrow--dark">Recuperación de acceso</p>
              <h1>Recupere su contraseña</h1>
              <p>Enviaremos un código de verificación a su correo institucional.</p>
            </div>
            <form noValidate onSubmit={handleEmailSubmit}>
              <div className="field">
                <label htmlFor="recoveryEmail">Correo institucional</label>
                <input
                  aria-invalid={Boolean(error)}
                  id="recoveryEmail"
                  name="email"
                  onChange={handleChange}
                  placeholder="nombre@aloe.ulima.edu.pe"
                  type="email"
                  value={form.email}
                />
                {error && <span className="field-error">{error}</span>}
              </div>
              <button className="button button--primary button--full" type="submit">Enviar código</button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-heading">
              <p className="eyebrow eyebrow--dark">Verificación</p>
              <h1>Ingrese el código</h1>
              <p>Se envió un código de seis dígitos a {form.email}.</p>
            </div>
            <form noValidate onSubmit={handleCodeSubmit}>
              <div className="field">
                <label htmlFor="verificationCode">Código de verificación</label>
                <input
                  aria-invalid={Boolean(error)}
                  autoComplete="one-time-code"
                  id="verificationCode"
                  inputMode="numeric"
                  maxLength="6"
                  name="code"
                  onChange={handleChange}
                  placeholder="000000"
                  value={form.code}
                />
                {error ? (
                  <span className="field-error">{error}</span>
                ) : (
                  <span className="field-help">Código de demostración: 123456</span>
                )}
              </div>
              <button className="button button--primary button--full" type="submit">Verificar código</button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div className="auth-heading">
              <p className="eyebrow eyebrow--dark">Nueva contraseña</p>
              <h1>Cree una contraseña</h1>
              <p>Use una combinación segura que no haya utilizado anteriormente.</p>
            </div>
            <form noValidate onSubmit={handlePasswordSubmit}>
              <div className="field">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input id="newPassword" name="password" onChange={handleChange} type="password" value={form.password} />
              </div>
              <div className="field">
                <label htmlFor="confirmNewPassword">Confirmar contraseña</label>
                <input id="confirmNewPassword" name="confirmPassword" onChange={handleChange} type="password" value={form.confirmPassword} />
                {error && <span className="field-error">{error}</span>}
              </div>
              <button className="button button--primary button--full" type="submit">Actualizar contraseña</button>
            </form>
          </>
        )}

        {step === 4 && (
          <div className="recovery-success">
            <span aria-hidden="true">✓</span>
            <div className="auth-heading">
              <p className="eyebrow eyebrow--dark">Proceso completado</p>
              <h1>Contraseña actualizada</h1>
              <p>Ya puede ingresar nuevamente con sus credenciales.</p>
            </div>
            <Link className="button button--primary button--full" to="/iniciar-sesion">Volver al inicio de sesión</Link>
          </div>
        )}

        {step < 4 && (
          <p className="auth-footer-text">
            <Link to="/iniciar-sesion">Volver al inicio de sesión</Link>
          </p>
        )}
      </div>
    </section>
  )
}

export default PasswordRecoveryPage
