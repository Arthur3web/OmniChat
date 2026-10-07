// Контракт данных приложения

// Состояние доставки
export type MessageStatus = 'sending' | 'sent' | 'failed'

// Обычный текст или системная пометка
export type MessageKind = 'text' | 'system'

export interface Message {
  id: string
  text: string
  at: number
  outgoing: boolean
  kind: MessageKind
  status: MessageStatus
  typeMessage?: string
}

export interface Chat {
  id: string
  title: string
  phone: string
  hue: number
  unread: number
  messages: Message[]
  preview?: Message
}