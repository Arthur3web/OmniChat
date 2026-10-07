import type { CSSProperties } from 'react'

interface AvatarProps {
  title: string
  hue: number
  size?: 'md' | 'lg'
}
export function Avatar({ title, hue, size = 'md' }: AvatarProps) {
  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

  const style = {
    background: `linear-gradient(135deg, hsl(${hue} 68% 58%), hsl(${(hue + 24) % 360} 68% 48%))`,
  } as CSSProperties

  return (
    <div className="avatar-wrap">
      <div
        className={`avatar${size === 'lg' ? ' avatar--sm' : ''}`}
        style={style}
        aria-hidden="true"
      >
        {initials}
      </div>
    </div>
  )
}