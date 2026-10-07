import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { chatFromApi, mergeMessages, parseNotification } from '../lib/chatModel'
import type { Credentials, GreenApiChat, WebhookBody } from '../lib/greenApi'
import type { Chat, Message } from '../lib/types'

export interface ChatStore {
  chats: Chat[]
  activeId: string | null
  activeChat: Chat | null
  openChat: (chatId: string) => void
  closeChat: () => void
  addFromApi: (items: GreenApiChat[]) => void
  addChat: (chat: Chat) => void
  patchMessage: (chatId: string, messageId: string, patch: Partial<Message>) => void
  appendMessage: (chatId: string, message: Message) => void
  receive: (body: WebhookBody) => void
  applyPreviews: (previews: Map<string, Message>) => void
  addHistory: (chatId: string, messages: Message[]) => void
}

export function useChatStore(credentials: Credentials | null): ChatStore {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const [instance, setInstance] = useState(credentials)
  if (instance !== credentials) {
    setInstance(credentials)
    setChats([])
    setActiveId(null)
  }

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeId) ?? null,
    [chats, activeId],
  )

  const activeIdRef = useRef(activeId)
  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  const openChat = useCallback((chatId: string) => {
    setActiveId(chatId)
    setChats((current) =>
      current.map((chat) => (chat.id === chatId ? { ...chat, unread: 0 } : chat)),
    )
  }, [])

  const closeChat = useCallback(() => setActiveId(null), [])

  const addFromApi = useCallback((items: GreenApiChat[]) => {
    setChats((current) => {
      const known = new Set(current.map((chat) => chat.id))
      const added: Chat[] = []
      for (const item of items) {
        if (!item.chatId || known.has(item.chatId)) continue
        known.add(item.chatId)
        added.push(chatFromApi(item))
      }
      return added.length ? [...current, ...added] : current
    })
  }, [])

  const addChat = useCallback((chat: Chat) => {
    setChats((current) =>
      current.some((item) => item.id === chat.id) ? current : [chat, ...current],
    )
  }, [])

  const patchMessage = useCallback(
    (chatId: string, messageId: string, patch: Partial<Message>) => {
      setChats((current) =>
        current.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((message) =>
                  message.id === messageId ? { ...message, ...patch } : message,
                ),
              }
            : chat,
        ),
      )
    },
    [],
  )

  const appendMessage = useCallback((chatId: string, message: Message) => {
    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? { ...chat, unread: 0, messages: [...chat.messages, message] }
          : chat,
      ),
    )
  }, [])

  const receive = useCallback((body: WebhookBody) => {
    const parsed = parseNotification(body)
    if (!parsed) return

    setChats((current) => {
      const existing = current.find((chat) => chat.id === parsed.chatId)
      if (!existing) {
        return [
          {
            id: parsed.chatId,
            title: parsed.title ?? parsed.phone ?? parsed.chatId,
            phone: parsed.phone ?? parsed.chatId,
            hue: chatFromApi({ chatId: parsed.chatId }).hue,
            unread: activeIdRef.current === parsed.chatId ? 0 : 1,
            messages: [parsed.message],
          },
          ...current,
        ]
      }

      if (existing.messages.some((item) => item.id === parsed.message.id)) {
        return current
      }

      const isActive = activeIdRef.current === parsed.chatId
      return current.map((chat) =>
        chat.id === parsed.chatId
          ? {
              ...chat,
              title:
                parsed.title && chat.title === chat.phone ? parsed.title : chat.title,
              messages: [...chat.messages, parsed.message],
              unread: isActive ? 0 : chat.unread + 1,
            }
          : chat,
      )
    })
  }, [])

  const applyPreviews = useCallback((previews: Map<string, Message>) => {
    if (previews.size === 0) return
    setChats((current) =>
      current.map((chat) => {
        const preview = previews.get(chat.id)
        if (!preview || chat.messages.length > 0) return chat
        if (chat.preview && chat.preview.at >= preview.at) return chat
        return { ...chat, preview }
      }),
    )
  }, [])

  const addHistory = useCallback((chatId: string, messages: Message[]) => {
    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: mergeMessages(chat.messages, messages) }
          : chat,
      ),
    )
  }, [])

  return {
    chats,
    activeId,
    activeChat,
    openChat,
    closeChat,
    addFromApi,
    addChat,
    patchMessage,
    appendMessage,
    receive,
    applyPreviews,
    addHistory,
  }
}
