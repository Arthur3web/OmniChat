interface IconProps {
  className?: string
  size?: number
}

export function SearchIcon({ className, size }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="M9 3a6 6 0 104.2 10.3l3.3 3.2 1.4-1.4-3.2-3.3A6 6 0 009 3zm0 2a4 4 0 110 8 4 4 0 010-8z"
        fill="currentColor"
      />
    </svg>
  )
}

export function PlusIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="M12 5.5v13M5.5 12h13"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function LogoutIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="M10 4H5a2 2 0 00-2 2v12a2 2 0 002 2h5v-2H5V6h5V4zm5.6 3.6L14.2 9l2 2H9v2h7.2l-2 2 1.4 1.4L19.8 12l-4.2-4.4z"
        fill="currentColor"
      />
    </svg>
  )
}

export function BackIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="M15.5 4L7 12l8.5 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SmileyIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.3" fill="currentColor" />
      <circle cx="15" cy="10" r="1.3" fill="currentColor" />
      <path
        d="M8.5 14.2a4.2 4.2 0 007 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SendIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M3 20l18-8L3 4v6l12 2-12 2v6z" fill="currentColor" />
    </svg>
  )
}

export function CloseIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="M6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SunIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
      </g>
    </svg>
  )
}

export function MoonIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M12.4 3a9 9 0 108.6 11.4A7.4 7.4 0 0112.4 3z" fill="currentColor" />
    </svg>
  )
}
