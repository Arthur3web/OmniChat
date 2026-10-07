export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'omni-chat.theme'

function systemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function readInitialTheme(): Theme {
  const stored = window.localStorage?.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : systemTheme()
}

export function saveTheme(theme: Theme): void {
  try {
    window.localStorage?.setItem(STORAGE_KEY, theme)
  } catch {
    // В приватном режиме тема просто не сохранится
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}