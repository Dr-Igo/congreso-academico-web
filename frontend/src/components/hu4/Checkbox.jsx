import { useEffect, useRef } from 'react'

export default function Checkbox({ checked, indeterminate = false, disabled = false, onChange, label, title, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked
  }, [indeterminate, checked])

  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      title={title}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className={`size-4 cursor-pointer rounded-sm accent-primary disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  )
}
