import { useState } from 'react'

import { CloseIcon } from './Icons'

export type NewChatPhase = 'form' | 'checking' | 'ready' | 'error'

interface NewChatDialogProps {
  phase: NewChatPhase
  pendingPhone: string
  pendingChatId: string | null
  error: string | null
  onCreate: (phone: string) => void
  onOpenChat: (chatId: string) => void
  onReset: () => void
  onClose: () => void
}

export function NewChatDialog({
  phase,
  pendingPhone,
  pendingChatId,
  error,
  onCreate,
  onOpenChat,
  onReset,
  onClose,
}: NewChatDialogProps) {
  const [phone, setPhone] = useState('')

  const normalisePhone = (value: string) => value.replace(/\D/g, '')

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const value = normalisePhone(phone)
    if (value.length < 10) return
    onCreate(value)
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Новый чат">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__card">
        <header className="modal__header">
          <h2 className="modal__title">Новый чат</h2>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
        </header>

        {phase === 'form' ? (
          <form className="modal__body" onSubmit={submit}>
            <label className="login__label" htmlFor="phone">
              Номер телефона получателя
            </label>
            <input
              id="phone"
              className="login__input"
              type="tel"
              inputMode="tel"
              autoComplete="off"
              placeholder="+7 999 123-45-67"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <button
              className="primary-button"
              type="submit"
              disabled={normalisePhone(phone).length < 10}
            >
              Создать чат
            </button>
            <p className="login__hint">
              GREEN-API проверит номер методом CheckAccount и вернёт chatId —
              по нему чат и будет создан.
            </p>
          </form>
        ) : (
          <div className="modal__body">
            {phase === 'checking' ? (
              <>
                <p className="modal__lead">Проверяем номер {pendingPhone}…</p>
                <p className="modal__hint">
                  Запрос ушёл в GREEN-API, ответ придёт за доли секунды.
                </p>
                <div className="status status--waiting" role="status">
                  <span className="status__dot" aria-hidden="true" />
                  Проверка номера
                </div>
              </>
            ) : null}

            {phase === 'ready' ? (
              <>
                <p className="modal__lead">Чат {pendingPhone} создан</p>
                <p className="modal__hint">
                  Номер подтверждён, чат открыт по идентификатору из ответа
                  CheckAccount. Пишите — сообщение уйдёт получателю.
                </p>
                <div className="status status--ready" role="status">
                  <span className="status__dot" aria-hidden="true" />
                  Готов к переписке
                </div>
                <div className="modal__actions">
                  <button
                    className="primary-button"
                    type="button"
                    disabled={!pendingChatId}
                    onClick={() => {
                      if (pendingChatId) onOpenChat(pendingChatId)
                    }}
                  >
                    Перейти в чат
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={onClose}
                  >
                    Закрыть
                  </button>
                </div>
              </>
            ) : null}

            {phase === 'error' ? (
              <>
                <p className="modal__lead">Не удалось создать чат</p>
                <p className="modal__hint">{error}</p>
                <div className="status status--timeout" role="status">
                  <span className="status__dot" aria-hidden="true" />
                  {pendingPhone}
                </div>
                <div className="modal__actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={onReset}
                  >
                    Попробовать снова
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={onClose}
                  >
                    Закрыть
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
