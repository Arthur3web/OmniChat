import { useEffect, useMemo, useRef, useState } from 'react'

import { SearchIcon } from './Icons'
import {
  categoryEmojis,
  EMOJI_CATEGORIES,
  EMOJI_PAGE_SIZE,
  findEmojis,
  type EmojiCategory,
} from '../lib/emoji'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

const TAB_ICONS: Record<string, string> = {
  smileys: '😀',
  gestures: '👋',
  hearts: '❤️',
  animals: '🐱',
  food: '🍏',
  activity: '⚽',
  travel: '🚗',
  symbols: '✅',
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState(EMOJI_CATEGORIES[0].id)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) onClose()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [onClose])

  const matches = useMemo(() => findEmojis(query), [query])

  const category = EMOJI_CATEGORIES.find((item) => item.id === tab)
  const list = query
    ? matches.slice(0, EMOJI_PAGE_SIZE)
    : category
      ? categoryEmojis(category).slice(0, EMOJI_PAGE_SIZE)
      : []

  return (
    <div className="emoji" ref={panelRef} role="dialog" aria-label="Смайлы">
      <div className="emoji__search">
        <SearchIcon className="emoji__search-icon" />
        <input
          ref={inputRef}
          className="emoji__search-input"
          type="search"
          placeholder="Поиск смайла"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Поиск смайла"
        />
      </div>

      <div className="emoji__body">
        {list.length === 0 ? (
          <p className="emoji__empty">Ничего не найдено</p>
        ) : (
          <div className="emoji__grid">
            {list.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                type="button"
                className="emoji__item"
                onClick={() => onSelect(emoji)}
                aria-label={`Вставить ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="emoji__tabs" role="tablist" aria-label="Категории смайлов">
        {EMOJI_CATEGORIES.map((item: EmojiCategory) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={`emoji__tab${item.id === tab && !query ? ' emoji__tab--active' : ''}`}
            title={item.label}
            aria-label={item.label}
            aria-selected={item.id === tab && !query}
            onClick={() => {
              setQuery('')
              setTab(item.id)
            }}
          >
            {TAB_ICONS[item.id] ?? item.label.slice(0, 1)}
          </button>
        ))}
      </div>
    </div>
  )
}

