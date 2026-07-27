export function formatEventDate(event) {
  if (!event.starts_at) return ''
  const start = new Date(event.starts_at)
  const startStr = start.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
  if (!event.ends_at) return startStr
  const end = new Date(event.ends_at)
  if (start.toDateString() === end.toDateString()) return startStr
  const startShort = start.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })
  const endStr = end.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `dal ${startShort} al ${endStr}`
}
