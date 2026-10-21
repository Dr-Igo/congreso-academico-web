import { useState } from 'react'
import Button from './Button.jsx'
import Modal from './Modal.jsx'
import { INTEREST_LINES } from '../data/seed.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const label = 'text-[10px] font-semibold uppercase tracking-[0.08em] text-muted'
const input = 'mt-1 block h-9 w-full rounded-sm border bg-surface px-3 text-[13px] text-ink'

export default function InviteModal({ institutions, onClose, onConfirm }) {
  const [form, setForm] = useState({ name: '', email: '', institution: '', lines: [] })
  const [touched, setTouched] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const errors = {
    name: form.name.trim().length < 5 ? 'Ingrese nombre y apellidos' : '',
    email: !EMAIL_RE.test(form.email.trim()) ? 'Ingrese un correo institucional válido' : '',
    institution: !form.institution.trim() ? 'Indique la institución' : '',
    lines: form.lines.length === 0 ? 'Elija al menos una línea de interés' : '',
  }
  const hasErrors = Object.values(errors).some(Boolean)
  const show = (k) => touched && errors[k]

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (hasErrors) return
    onConfirm({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), institution: form.institution.trim() })
  }

  const toggleLine = (l) =>
    setForm((f) => ({ ...f, lines: f.lines.includes(l) ? f.lines.filter((x) => x !== l) : [...f.lines, l] }))

  return (
    <Modal
      title="Invitar revisor"
      subtitle="Se enviará una invitación al correo indicado para que acepte su rol de revisor."
      maxWidth="max-w-[560px]"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="invite-form">
            Enviar invitación
          </Button>
        </div>
      }
    >
      <form id="invite-form" onSubmit={submit} noValidate className="space-y-3.5">
        <label className="block">
          <span className={label}>Nombre completo</span>
          <input data-autofocus value={form.name} onChange={set('name')} placeholder="Ej.: Dra. Rosa Quispe Mamani" className={`${input} ${show('name') ? 'border-danger' : 'border-line'}`} />
          {show('name') && <span className="mt-1 block text-[11px] text-danger">{errors.name}</span>}
        </label>
        <label className="block">
          <span className={label}>Correo institucional</span>
          <input type="email" value={form.email} onChange={set('email')} placeholder="nombre.apellido@ulima.edu.pe" className={`${input} ${show('email') ? 'border-danger' : 'border-line'}`} />
          {show('email') && <span className="mt-1 block text-[11px] text-danger">{errors.email}</span>}
        </label>
        <label className="block">
          <span className={label}>Institución</span>
          <input list="institutions" value={form.institution} onChange={set('institution')} placeholder="Universidad de Lima" className={`${input} ${show('institution') ? 'border-danger' : 'border-line'}`} />
          <datalist id="institutions">
            {institutions.map((i) => (
              <option key={i} value={i} />
            ))}
          </datalist>
          {show('institution') && <span className="mt-1 block text-[11px] text-danger">{errors.institution}</span>}
        </label>
        <fieldset>
          <legend className={label}>Líneas de interés</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {INTEREST_LINES.map((l) => {
              const on = form.lines.includes(l)
              return (
                <label
                  key={l}
                  className={`cursor-pointer rounded-sm border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                    on ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-surface text-ink hover:border-muted'
                  }`}
                >
                  <input type="checkbox" checked={on} onChange={() => toggleLine(l)} className="sr-only" />
                  {l}
                </label>
              )
            })}
          </div>
          {show('lines') && <span className="mt-1 block text-[11px] text-danger">{errors.lines}</span>}
        </fieldset>
      </form>
    </Modal>
  )
}
