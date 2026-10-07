import type { Chat } from './types'

export const CHAT_FOLDERS = [
  { id: 'all', label: 'Все' },
  { id: 'new', label: 'Новые' },
] as const

export type ChatFolder = (typeof CHAT_FOLDERS)[number]['id']

export function countUnreadChats(chats: Chat[]): number {
  return chats.filter((chat) => chat.unread > 0).length
}

export function filterChats(chats: Chat[], folder: ChatFolder, query: string): Chat[] {
  const needle = query.trim().toLowerCase()
  const digits = needle.replace(/\D/g, '')

  return chats.filter((chat) => {
    if (folder === 'new' && chat.unread === 0) return false
    if (!needle) return true
    if (chat.title.toLowerCase().includes(needle)) return true
    if (chat.phone.toLowerCase().includes(needle)) return true
    if (digits && chat.phone.replace(/\D/g, '').includes(digits)) return true
    return false
  })
}
