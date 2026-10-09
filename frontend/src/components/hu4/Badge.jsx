
import { STATUS_TONE } from './badgeConstants.js'

const TONES = {
  info: 'text-info border-info bg-info-soft',
  warning: 'text-warning border-warning bg-warning-soft',
  success: 'text-success border-success bg-success-soft',
  danger: 'text-danger border-danger bg-surface',
  neutral: 'text-muted border-line bg-surface',
}

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-sm border px-2 py-0.5 text-[11px] font-semibold leading-4 ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ estado }) {
  return <Badge tone={STATUS_TONE[estado] ?? 'neutral'}>{estado}</Badge>
}
