import { useState } from 'react'

import { ThemeToggle } from './ThemeToggle'
import {
  friendlyGreenApiError,
  getStateInstance,
  type Credentials,
} from '../lib/greenApi'
import type { Theme } from '../lib/theme'

interface LoginScreenProps {
  theme: Theme
  onToggleTheme: () => void
  onConnect: (credentials: Credentials) => void
}

// Состояния инстанса
const NOT_READY_HINT: Record<string, string> = {
  notAuthorized: 'Инстанс не авторизован — завершите авторизацию в личном кабинете GREEN-API',
  starting: 'Инстанс запускается — подождите пару секунд и попробуйте снова',
  sleeping: 'Инстанс спит — разбудите его в личном кабинете GREEN-API',
  stopInstance: 'Инстанс остановлен — запустите его в личном кабинете GREEN-API',
}

export function LoginScreen({ theme, onToggleTheme, onConnect }: LoginScreenProps) {
  const [idInstance, setIdInstance] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const ready = /^\d+$/.test(idInstance.trim()) && token.trim().length > 0

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready || checking) return

    const credentials: Credentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: token.trim(),
    }

    setChecking(true)
    setError(null)
    try {
      const state = await getStateInstance(credentials)
      if (state !== 'authorized') {
        setError(NOT_READY_HINT[state] ?? `Инстанс в состоянии «${state}»`)
        return
      }
      onConnect(credentials)
    } catch (caught) {
      setError(friendlyGreenApiError(caught))
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <div className="login__theme">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <div className="login__logo" aria-hidden="true">
          M
        </div>
        <h1 className="login__title">Omni Chat</h1>
        <p className="login__subtitle">
          Введите учётные данные инстанса GREEN-API из личного кабинета
        </p>

        <label className="login__label" htmlFor="idInstance">
          idInstance
        </label>
        <input
          id="idInstance"
          className="login__input"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          placeholder="410022755693"
          value={idInstance}
          onChange={(event) => setIdInstance(event.target.value)}
        />

        <label className="login__label" htmlFor="apiTokenInstance">
          apiTokenInstance
        </label>
        <input
          id="apiTokenInstance"
          className="login__input"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="e00a27d6..."
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />

        {error ? (
          <p className="login__error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="primary-button"
          type="submit"
          disabled={!ready || checking}
        >
          {checking ? 'Проверяем…' : 'Подключиться'}
        </button>

        <p className="login__hint">
          Данные уходят только в api.green-api.com и хранятся в этой вкладке:
          после перезагрузки их нужно ввести заново.
        </p>
      </form>
    </div>
  )
}
