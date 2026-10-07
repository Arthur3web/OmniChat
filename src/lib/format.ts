const DAY = 24 * 60 * 60 * 1000

export function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function startOfDay(at: number): number {
  const date = new Date(at)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function daysBetween(at: number, now: number): number {
  return Math.round((startOfDay(now) - startOfDay(at)) / DAY)
}

export function formatDayDivider(at: number, now: number): string {
  const days = daysBetween(at, now)
  if (days === 0) return 'Сегодня'
  if (days === 1) return 'Вчера'

  const date = new Date(at)
  const sameYear = date.getFullYear() === new Date(now).getFullYear()
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

export function formatListTime(at: number, now: number): string {
  const days = daysBetween(at, now)
  if (days === 0) return formatTime(at)
  if (days === 1) return 'вчера'

  const date = new Date(at)
  if (days < 7) {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' }).replace('.', '')
  }
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    ...(date.getFullYear() === new Date(now).getFullYear() ? {} : { year: '2-digit' }),
  })
}