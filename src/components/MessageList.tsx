import { useEffect, useMemo, useRef } from 'react'

import { Bubble } from './Bubble'
import { daysBetween, formatDayDivider } from '../lib/format'
import type { Message } from '../lib/types'

interface MessageListProps {
  messages: Message[]
  preview?: Message
  now: number
  onRetry: (messageId: string) => void
}

export function MessageList({ messages, preview, now, onRetry }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // Лента прокручивается вниз при новом сообщении
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  const rows = useMemo(() => {
    const items: Array<
      | { kind: 'divider'; key: string; at: number }
      | { kind: 'message'; key: string; message: Message }
    > = []

    let lastDay = -1
    for (const message of messages) {
      const day = daysBetween(message.at, now)
      if (day !== lastDay) {
        items.push({ kind: 'divider', key: `d-${message.id}`, at: message.at })
        lastDay = day
      }
      items.push({ kind: 'message', key: message.id, message })
    }
    return items
  }, [messages, now])

  if (messages.length === 0) {
    return (
      <div className="thread__empty">
        <p className="thread__empty-title">
          {preview ? 'История не подгружается' : 'Сообщений пока нет'}
        </p>
        <p className="thread__empty-hint">
          {preview
            ? 'В списке видно последнее сообщение из журнала, а лента заполняется с момента подключения.'
            : 'Напишите первым — сообщение уйдёт получателю в мессенджер.'}
        </p>
      </div>
    )
  }

  return (
    <div className="thread__scroll">
      <div className="thread__inner">
        {rows.map((row) =>
          row.kind === 'divider' ? (
            <div className="thread__divider" key={row.key}>
              <span>{formatDayDivider(row.at, now)}</span>
            </div>
          ) : (
            <Bubble key={row.key} message={row.message} onRetry={onRetry} />
          ),
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
