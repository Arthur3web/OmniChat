import { Avatar } from './Avatar'
import { formatListTime } from '../lib/format'
import type { Chat } from '../lib/types'

interface ChatRowProps {
  chat: Chat
  active: boolean
  now: number
  onSelect: (chatId: string) => void
}

export function ChatRow({ chat, active, now, onSelect }: ChatRowProps) {
  const last = chat.messages.at(-1) ?? chat.preview

  return (
    <button
      type="button"
      className={`chat-row${active ? ' chat-row--active' : ''}`}
      onClick={() => onSelect(chat.id)}
      aria-current={active}
    >
      <Avatar title={chat.title} hue={chat.hue} />
      <span className="chat-row__body">
        <span className="chat-row__top">
          <span className="chat-row__title">{chat.title}</span>
          <span className="chat-row__time">{last ? formatListTime(last.at, now) : ''}</span>
        </span>
        <span className="chat-row__bottom">
          <span
            className={`chat-row__preview${
              last?.kind === 'system' ? ' chat-row__preview--muted' : ''
            }`}
          >
            {last ? `${last.outgoing ? 'Вы: ' : ''}${last.text}` : 'Нет сообщений'}
          </span>
          {chat.unread > 0 ? (
            <span className="chat-row__badge">{chat.unread}</span>
          ) : null}
        </span>
      </span>
    </button>
  )
}
