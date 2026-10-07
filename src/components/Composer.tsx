import { useEffect, useRef, useState } from 'react'

import { EmojiPicker } from './EmojiPicker'
import { SendIcon, SmileyIcon } from './Icons'

const MAX_LENGTH = 4096
const MAX_ROWS = 6

interface ComposerProps {
  disabled?: boolean
  placeholder: string
  onSend: (text: string) => void
}

export function Composer({ disabled, placeholder, onSend }: ComposerProps) {
  const [value, setValue] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${node.scrollHeight}px`
  }, [value])

  const send = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
  }

  const tooLong = value.length > MAX_LENGTH
  const canSend = value.trim().length > 0 && !tooLong && !disabled

  const insertEmoji = (emoji: string) => {
    const node = textareaRef.current
    if (!node) return

    const start = node.selectionStart ?? value.length
    const end = node.selectionEnd ?? start
    setValue(value.slice(0, start) + emoji + value.slice(end))

    window.requestAnimationFrame(() => {
      const caret = start + emoji.length
      node.focus()
      node.setSelectionRange(caret, caret)
    })
  }

  // Закрытие панели возвращает фокус в поле ввода
  const closeEmoji = () => {
    setEmojiOpen(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="composer">
      {emojiOpen ? (
        <EmojiPicker onSelect={insertEmoji} onClose={closeEmoji} />
      ) : null}

      <button
        type="button"
        className="composer__emoji"
        onClick={() => setEmojiOpen((open) => !open)}
        disabled={disabled}
        aria-label="Выбрать смайл"
        title="Смайлы"
        aria-expanded={emojiOpen}
      >
        <SmileyIcon />
      </button>

      <div className="composer__field">
        <textarea
          ref={textareaRef}
          className="composer__input"
          rows={1}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              send()
            }
          }}
          style={{ maxHeight: `calc(${MAX_ROWS} * 1.4em + 20px)` }}
          aria-label="Сообщение"
        />
      </div>

      <button
        type="button"
        className="composer__send"
        onClick={send}
        disabled={!canSend}
        aria-label="Отправить"
        title="Отправить"
      >
        <SendIcon />
      </button>

      {tooLong ? (
        <p className="composer__warning" role="alert">
          Сообщение длиннее {MAX_LENGTH} символов
        </p>
      ) : null}
    </div>
  )
}