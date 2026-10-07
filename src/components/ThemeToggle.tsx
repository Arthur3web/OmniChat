import { MoonIcon, SunIcon } from './Icons'
import type { Theme } from '../lib/theme'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const dark = theme === 'dark'

  return (
    <button
      className="icon-button"
      type="button"
      title={dark ? 'Светлая тема' : 'Тёмная тема'}
      aria-label={dark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      onClick={onToggle}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}