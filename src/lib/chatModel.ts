import type { GreenApiChat, JournalMessage, WebhookBody } from './greenApi'
import type { Chat, Message } from './types'

export function hueOf(seed: string): number {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 360
  }
  return hash
}

// Оформление номера для показа: 79991234567 → +7 999 123-45-67
export function formatPhone(digits: string): string {
  const plain = digits.replace(/\D/g, '')
  if (plain.length === 11 && (plain.startsWith('7') || plain.startsWith('8'))) {
    return `+7 ${plain.slice(1, 4)} ${plain.slice(4, 7)}-${plain.slice(7, 9)}-${plain.slice(9)}`
  }
  if (plain.length === 12 && plain.startsWith('375')) {
    return `+375 ${plain.slice(3, 5)} ${plain.slice(5, 8)}-${plain.slice(8, 10)}-${plain.slice(10)}`
  }
  return `+${plain}`
}

export function chatFromApi(item: GreenApiChat): Chat {
  const phone = item.phoneNumber ? formatPhone(String(item.phoneNumber)) : item.chatId
  return {
    id: item.chatId,
    title: item.name?.trim() || phone,
    phone,
    hue: hueOf(item.chatId),
    unread: 0,
    messages: [],
  }
}

export function messageFromJournal(item: JournalMessage): Message | null {
  if (!item.chatId || !item.timestamp) return null

  const text = item.textMessage?.trim() || item.caption?.trim() || ''
  const deleted = Boolean(item.isDeleted)
  const isReaction = item.typeMessage === 'reactionMessage'

  if (deleted) {
    return {
      id: item.idMessage ?? `${item.chatId}-${item.timestamp}`,
      text: 'Сообщение удалено',
      at: item.timestamp * 1000,
      outgoing: item.type === 'outgoing',
      kind: 'system',
      typeMessage: undefined,
      status: 'sent',
    }
  }

  if (text) {
    return {
      id: item.idMessage ?? `${item.chatId}-${item.timestamp}`,
      text,
      at: item.timestamp * 1000,
      outgoing: item.type === 'outgoing',
      kind: 'text',
      typeMessage: undefined,
      status: 'sent',
    }
  }

  // Реакция или другой тип — системная пометка
  return {
    id: item.idMessage ?? `${item.chatId}-${item.timestamp}`,
    text: isReaction
      ? 'Реакция'
      : item.typeMessage || 'Сообщение без текста',
    at: item.timestamp * 1000,
    outgoing: item.type === 'outgoing',
    kind: 'system',
    typeMessage: isReaction ? undefined : item.typeMessage,
    status: 'sent',
  }
}

// Последнее сообщение каждого чата из журнала — для превью в списке
export function latestPerChat(items: JournalMessage[]): Map<string, Message> {
  const previews = new Map<string, Message>()
  for (const item of items) {
    const preview = messageFromJournal(item)
    if (!preview) continue
    const known = previews.get(item.chatId)
    if (!known || preview.at > known.at) previews.set(item.chatId, preview)
  }
  return previews
}

// История и живые сообщения в одну ленту
export function mergeMessages(current: Message[], loaded: Message[]): Message[] {
  if (loaded.length === 0) return current
  const known = new Set(current.map((message) => message.id))
  const added = loaded.filter((message) => !known.has(message.id))
  if (added.length === 0) return current
  return [...current, ...added].sort((left, right) => left.at - right.at)
}

export interface ParsedNotification {
  chatId: string
  message: Message
  // Имя собеседника, если его прислал мессенджер
  title?: string
  phone?: string
}

export function parseNotification(body: WebhookBody): ParsedNotification | null {
  const sender = body.senderData
  if (!sender?.chatId) return null
  if (body.typeWebhook !== 'incomingMessageReceived') return null

  const type = body.messageData?.typeMessage
  if (type !== 'textMessage') return null

  const text = body.messageData?.textMessageData?.textMessage ?? ''
  if (!text.trim()) return null

  return {
    chatId: sender.chatId,
    message: {
      id: body.idMessage ?? `${sender.chatId}-${body.timestamp ?? Date.now()}`,
      text,
      at: (body.timestamp ?? Math.floor(Date.now() / 1000)) * 1000,
      outgoing: false,
      kind: 'text',
      typeMessage: undefined,
      status: 'sent',
    },
    title:
      sender.senderContactName ||
      sender.senderName ||
      sender.chatName ||
      undefined,
    phone: sender.senderPhoneNumber
      ? formatPhone(String(sender.senderPhoneNumber))
      : undefined,
  }
}
