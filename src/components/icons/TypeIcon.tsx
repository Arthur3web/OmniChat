import type { ReactNode } from 'react'

interface IconProps {
  className?: string
  size?: number
}

// Значки типов вложения. Неизвестный тип остаётся без значка
const TYPE_SHAPES: Record<string, ReactNode> = {
  imageMessage: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.4" cy="9.6" r="1.5" />
      <path d="M4.5 17.5l5-4.5 3.8 3.4 2.8-2.4 4.4 3.5" />
    </>
  ),
  videoMessage: (
    <>
      <rect x="3" y="5.5" width="12.5" height="13" rx="2.5" />
      <path d="M16.5 11.2l4.5-2.9v7.4l-4.5-2.9z" />
    </>
  ),
  audioMessage: (
    <>
      <rect x="9" y="3" width="6" height="10.5" rx="3" />
      <path d="M6 11.5a6 6 0 0012 0M12 17.5V21M9 21h6" />
    </>
  ),
  documentMessage: (
    <>
      <path d="M6.5 3h7l4.5 4.5V21h-11.5z" />
      <path d="M13 3v5h5" />
    </>
  ),
  stickerMessage: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.2 10.1v.6M14.8 10.1v.6M8.9 14a4.4 4.4 0 006.2 0" />
    </>
  ),
  locationMessage: (
    <>
      <path d="M12 21c4.4-4.6 6.5-8 6.5-10.6A6.5 6.5 0 005.5 10.4C5.5 13 7.6 16.4 12 21z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  contactMessage: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c0-3.3 3.1-5.4 7-5.4s7 2.1 7 5.4" />
    </>
  ),
  pollMessage: <path d="M7 20V11M12 20V4.5M17 20v-6" />,
}

/** Значок типа вложения; null — когда тип незнаком. */
export function TypeIcon({ type, className, size = 14 }: IconProps & { type: string }) {
  const shape = TYPE_SHAPES[type]
  if (!shape) return null

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shape}
    </svg>
  )
}
