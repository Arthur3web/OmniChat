import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './styles.css'
import App from './App.tsx'
import { applyTheme, readInitialTheme } from './lib/theme'

// Тема ставится до первой отрисовки, чтобы не мигал фон
applyTheme(readInitialTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
