import { call, type Credentials } from './client'

export interface GreenApiChat {
  chatId: string
  name?: string
  type?: string
  phoneNumber?: number
  username?: string
}

export async function getChats(credentials: Credentials): Promise<GreenApiChat[]> {
  const chats = await call<GreenApiChat[]>(credentials, 'getChats')
  return Array.isArray(chats) ? chats : []
}

// Сообщение чата в ответе сервиса: общий вид для журнала и истории
export interface JournalMessage {
  type?: 'incoming' | 'outgoing'
  idMessage?: string
  timestamp?: number
  typeMessage?: string
  chatId: string
  textMessage?: string
  caption?: string
  isDeleted?: boolean
}

const JOURNAL_MINUTES = 1440
const HISTORY_COUNT = 50

async function journal(
  credentials: Credentials,
  method: string,
  minutes: number,
): Promise<JournalMessage[]> {
  const list = await call<JournalMessage[]>(credentials, method, { query: { minutes } })
  return Array.isArray(list) ? list : []
}

// Крайние входящие сообщения всех чатов сразу — журнал за сутки
export async function lastIncomingMessages(
  credentials: Credentials,
  minutes = JOURNAL_MINUTES,
): Promise<JournalMessage[]> {
  return journal(credentials, 'lastIncomingMessages', minutes)
}

export async function lastOutgoingMessages(
  credentials: Credentials,
  minutes = JOURNAL_MINUTES,
): Promise<JournalMessage[]> {
  return journal(credentials, 'lastOutgoingMessages', minutes)
}

// Переписка одного чата, приходит от новых сообщений к старым
export async function getChatHistory(
  credentials: Credentials,
  chatId: string,
  count = HISTORY_COUNT,
): Promise<JournalMessage[]> {
  const list = await call<JournalMessage[]>(credentials, 'getChatHistory', {
    verb: 'POST',
    body: { chatId, count },
  })
  return Array.isArray(list) ? list : []
}
