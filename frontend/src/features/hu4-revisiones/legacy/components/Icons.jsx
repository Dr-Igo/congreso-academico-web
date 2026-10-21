const base = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const ChevronDown = (p) => (
  <svg {...base} {...p}><path d="M4 6l4 4 4-4" /></svg>
)
export const Close = (p) => (
  <svg {...base} {...p}><path d="M4 4l8 8M12 4l-8 8" /></svg>
)
export const AlertCircle = (p) => (
  <svg {...base} strokeWidth={1.8} {...p}><circle cx="8" cy="8" r="6.2" /><path d="M8 4.6v4M8 11.2v.1" /></svg>
)
export const Check = (p) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M3.5 8.5l3 3 6-7" /></svg>
)
export const Search = (p) => (
  <svg {...base} {...p}><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
)
export const InboxEmpty = (p) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M4 15l3.2-8.2A2 2 0 0 1 9.1 5.5h9.8a2 2 0 0 1 1.9 1.3L24 15" />
    <path d="M4 15v6a1.5 1.5 0 0 0 1.5 1.5h17A1.5 1.5 0 0 0 24 21v-6h-6.5a3.5 3.5 0 0 1-7 0H4z" />
  </svg>
)
export const Download = (p) => (
  <svg {...base} {...p}><path d="M8 2.5v8M4.7 7.5L8 10.8l3.3-3.3M3 13.5h10" /></svg>
)
