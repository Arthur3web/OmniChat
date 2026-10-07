import { Avatar } from './Avatar'
import { Composer } from './Composer'
import { BackIcon } from './Icons'
import { MessageList } from './MessageList'
import type { Chat } from '../lib/types'

interface ChatViewProps {
  chat: Chat | null
  now: number
  onSend: (chatId: string, text: string) => void
  onRetry: (chatId: string, messageId: string) => void
  onBack: () => void
}

export function ChatView({
  chat,
  now,
  onSend,
  onRetry,
  onBack,
}: ChatViewProps) {
  if (!chat) {
    return (
      <section className="app__chat thread thread--idle">
        <div className="thread__idle">
          <p className="thread__idle-title">Выберите чат</p>
          <p className="thread__idle-hint">
            Слева список диалогов. Отправленное сообщение уходит получателю,
            а его ответ появляется здесь.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="app__chat thread">
      <header className="thread__header">
        <button
          className="icon-button thread__back"
          type="button"
          onClick={onBack}
          aria-label="Назад к списку"
        >
          <BackIcon />
        </button>

        <Avatar title={chat.title} hue={chat.hue} />

        <div className="thread__identity">
          <h2 className="thread__title">{chat.title}</h2>
          <p className="thread__subtitle">{chat.phone}</p>
        </div>
      </header>

      <MessageList
        messages={chat.messages}
        preview={chat.preview}
        now={now}
        onRetry={(messageId) => onRetry(chat.id, messageId)}
      />

      <Composer
        placeholder="Написать сообщение"
        onSend={(text: string) => onSend(chat.id, text)}
      />
    </section>
  )
}