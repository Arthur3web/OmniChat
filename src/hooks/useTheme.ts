import { useCallback, useEffect, useState } from 'react'

import { applyTheme, readInitialTheme, saveTheme, type Theme } from '../lib/theme'

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      saveTheme(next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
