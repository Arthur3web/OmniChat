interface IconProps {
  className?: string
}

export function StatusSendingIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-label="отправляется">
      <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3a5 5 0 015 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function StatusFailedIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-label="ошибка">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 4.5v4.2M8 11.2v.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StatusSentIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-label="доставлено">
      <path
        d="M3 8.6l3.2 3.2L13 4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
