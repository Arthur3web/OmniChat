import { useCallback } from 'react'

import { sendMessage, type Credentials } from '../lib/greenApi'
import type { Chat, Message } from '../lib/types'

export function useSendMessage(
  credentials: Credentials | null,
  chats: Chat[],
  appendMessage: (chatId: string, message: Message) => void,
  patchMessage: (chatId: string, messageId: string, patch: Partial<Message>) => void,
): {
  send: (chatId: string, text: string) => Promise<void>
  retry: (chatId: string, messageId: string) => Promise<void>
} {
  const send = useCallback(
    async (chatId: string, text: string) => {
      if (!credentials) return

      const localId = `local-${chatId}-${Date.now()}`
      appendMessage(chatId, {
        id: localId,
        text,
        at: Date.now(),
        outgoing: true,
        kind: 'text',
        status: 'sending',
      })

      try {
        const { idMessage } = await sendMessage(credentials, chatId, text)
        patchMessage(chatId, localId, { id: idMessage, status: 'sent' })
      } catch {
        patchMessage(chatId, localId, { status: 'failed' })
      }
    },
    [credentials, appendMessage, patchMessage],
  )

  const retry = useCallback(
    async (chatId: string, messageId: string) => {
      if (!credentials) return
      const message = chats
        .find((chat) => chat.id === chatId)
        ?.messages.find((item) => item.id === messageId)
      if (!message) return

      patchMessage(chatId, messageId, { status: 'sending' })
      try {
        const { idMessage } = await sendMessage(credentials, chatId, message.text)
        patchMessage(chatId, messageId, { id: idMessage, status: 'sent' })
      } catch {
        patchMessage(chatId, messageId, { status: 'failed' })
      }
    },
    [credentials, chats, patchMessage],
  )

  return { send, retry }
}
