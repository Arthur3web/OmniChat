import { useState } from 'react'

import { ChatRow } from './ChatRow'
import { LogoutIcon, PlusIcon, SearchIcon } from './Icons'
import { ThemeToggle } from './ThemeToggle'
import { CHAT_FOLDERS, countUnreadChats, filterChats, type ChatFolder } from '../lib/chatFilter'
import type { Theme } from '../lib/theme'
import type { Chat } from '../lib/types'

interface SidebarProps {
  chats: Chat[]
  activeId: string | null
  query: string
  now: number
  connection: 'connecting' | 'live' | 'reconnecting'
  onQueryChange: (value: string) => void
  onSelect: (chatId: string) => void
  onNewChat: () => void
  onDisconnect: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function Sidebar({
  chats,
  activeId,
  query,
  now,
  connection,
  onQueryChange,
  onSelect,
  onNewChat,
  onDisconnect,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const [folder, setFolder] = useState<ChatFolder>('all')

  const unreadChats = countUnreadChats(chats)
  const visible = filterChats(chats, folder, query)

  return (
    <aside className="app__sidebar sidebar">
      <header className="sidebar__header">
        <div className="sidebar__search">
          <SearchIcon className="sidebar__search-icon" />
          <input
            className="sidebar__search-input"
            type="search"
            placeholder="Поиск по чатам"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <button
          className="icon-button icon-button--accent"
          type="button"
          title="Новый чат"
          aria-label="Новый чат"
          onClick={onNewChat}
        >
          <PlusIcon />
        </button>

        <button
          className="icon-button"
          type="button"
          title="Отключиться"
          aria-label="Отключиться"
          onClick={onDisconnect}
        >
          <LogoutIcon />
        </button>
      </header>

      {connection !== 'live' ? (
        <p className={`sidebar__notice sidebar__notice--${connection}`} role="status">
          {connection === 'connecting'
            ? 'Подключаемся к GREEN-API…'
            : 'Нет связи с GREEN-API — переподключаемся…'}
        </p>
      ) : null}

      <div className="sidebar__tabs" role="tablist" aria-label="Папки чатов">
        {CHAT_FOLDERS.map((item) => {
          const active = item.id === folder
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              className={`sidebar__tab${active ? ' sidebar__tab--active' : ''}`}
              aria-selected={active}
              onClick={() => setFolder(item.id)}
            >
              {item.label}
              {item.id === 'new' && unreadChats > 0 ? (
                <span className="sidebar__tab-count">{unreadChats}</span>
              ) : null}
            </button>
          )
        })}
      </div>

      <nav className="sidebar__list" aria-label="Чаты">
        {visible.length === 0 ? (
          <p className="sidebar__empty">
            {query.trim()
              ? `Ничего не найдено по запросу «${query.trim()}»`
              : folder === 'new'
                ? 'Нет новых сообщений'
                : 'Чатов пока нет — нажмите «Новый чат», чтобы начать переписку'}
          </p>
        ) : (
          visible.map((chat) => (
            <ChatRow
              key={chat.id}
              chat={chat}
              active={chat.id === activeId}
              now={now}
              onSelect={onSelect}
            />
          ))
        )}
      </nav>
    </aside>
  )
}
