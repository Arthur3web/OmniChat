import { useEffect, useRef } from 'react'

import { messageFromJournal } from '../lib/chatModel'
import { getChatHistory, type Credentials } from '../lib/greenApi'
import type { Message } from '../lib/types'

export function useChatHistory(
  credentials: Credentials | null,
  activeId: string | null,
  onLoaded: (chatId: string, messages: Message[]) => void,
): void {
  const loaded = useRef<Set<string>>(new Set())

  useEffect(() => {
    loaded.current.clear()
  }, [credentials])

  useEffect(() => {
    if (!credentials || !activeId) return
    if (loaded.current.has(activeId)) return
    const chatId = activeId
    let cancelled = false

    void (async () => {
      try {
        const items = await getChatHistory(credentials, chatId)
        if (cancelled) return
        loaded.current.add(chatId)
        const messages = items
          .map(messageFromJournal)
          .filter((message): message is Message => message !== null)
        if (messages.length > 0) onLoaded(chatId, messages)
      } catch {
        // История не обязательна: без неё лента остаётся пустой
      }
    })()

    return () => {
      cancelled = true
    }
  }, [credentials, activeId, onLoaded])
}
