import {
  StatusFailedIcon,
  StatusSendingIcon,
  StatusSentIcon,
  TypeIcon,
} from './Icons'
import { formatTime } from '../lib/format'
import type { Message } from '../lib/types'

interface BubbleProps {
  message: Message
  onRetry: (messageId: string) => void
}

export function Bubble({ message, onRetry }: BubbleProps) {
  if (message.kind === 'system' && !message.typeMessage) {
    return (
      <div className="bubble-system" role="status">
        {message.text}
      </div>
    )
  }

  const classes = [
    'bubble',
    message.outgoing ? 'bubble--out' : 'bubble--in',
    message.status === 'failed' ? 'bubble--failed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <div className="bubble__text">
        {message.typeMessage ? (
          <span className="bubble__media">
            <TypeIcon type={message.typeMessage} className="bubble__media-icon" />
            {message.text}
          </span>
        ) : (
          message.text
        )}
      </div>
      <span className="bubble__meta">
        {formatTime(message.at)}
        {message.outgoing ? <StatusMark status={message.status} /> : null}
      </span>
      {message.status === 'failed' ? (
        <button
          type="button"
          className="bubble__retry"
          onClick={() => onRetry(message.id)}
        >
          Не отправлено — повторить
        </button>
      ) : null}
    </div>
  )
}

function StatusMark({ status }: { status: Message['status'] }) {
  if (status === 'sending') {
    return <StatusSendingIcon className="bubble__mark bubble__mark--sending" />
  }

  if (status === 'failed') {
    return <StatusFailedIcon className="bubble__mark bubble__mark--failed" />
  }

  return <StatusSentIcon className="bubble__mark" />
}
