import { Search } from './Icons.jsx'

export default function SearchInput({ value, onChange, placeholder, label, className = '', autoFocus = false }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label ?? placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-sm border border-line bg-surface pl-9 pr-3 text-[13px] text-ink placeholder:text-muted hover:border-muted"
      />
    </label>
  )
}
