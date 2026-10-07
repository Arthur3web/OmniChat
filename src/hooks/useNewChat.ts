import { useCallback, useState } from 'react'

import type { NewChatPhase } from '../components/NewChatDialog'
import { formatPhone, hueOf } from '../lib/chatModel'
import { checkAccount, friendlyGreenApiError, type Credentials } from '../lib/greenApi'
import type { Chat } from '../lib/types'

export interface NewChatDialogState {
  phase: NewChatPhase
  phone: string
  chatId: string | null
  error: string | null
}

export function useNewChat(
  credentials: Credentials | null,
  addChat: (chat: Chat) => void,
): {
  dialog: NewChatDialogState | null
  open: () => void
  close: () => void
  reset: () => void
  create: (rawPhone: string) => Promise<void>
} {
  const [dialog, setDialog] = useState<NewChatDialogState | null>(null)

  const open = useCallback(
    () => setDialog({ phase: 'form', phone: '', chatId: null, error: null }),
    [],
  )
  const close = useCallback(() => setDialog(null), [])
  const reset = useCallback(
    () => setDialog((current) => (current ? { ...current, phase: 'form', error: null } : current)),
    [],
  )

  const create = useCallback(
    async (rawPhone: string) => {
      if (!credentials) return
      const digits = rawPhone.replace(/\D/g, '')
      const shown = formatPhone(digits)
      setDialog({ phase: 'checking', phone: shown, chatId: null, error: null })

      try {
        const result = await checkAccount(credentials, digits)
        if ('status' in result) {
          const reason = result.data?.reason ?? result.reason ?? 'Ошибка проверки номера'
          setDialog({
            phase: 'error',
            phone: shown,
            chatId: null,
            error: friendlyGreenApiError(new Error(reason)),
          })
          return
        }
        if (!result.exist) {
          setDialog({
            phase: 'error',
            phone: shown,
            chatId: null,
            error: `У номера ${shown} нет аккаунта — написать ему нельзя.`,
          })
          return
        }

        addChat({
          id: result.chatId,
          title: shown,
          phone: shown,
          hue: hueOf(result.chatId),
          unread: 0,
          messages: [],
        })
        setDialog({ phase: 'ready', phone: shown, chatId: result.chatId, error: null })
      } catch (caught) {
        setDialog({
          phase: 'error',
          phone: shown,
          chatId: null,
          error: friendlyGreenApiError(caught),
        })
      }
    },
    [credentials, addChat],
  )

  return { dialog, open, close, reset, create }
}
