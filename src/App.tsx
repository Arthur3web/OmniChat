import { useState } from 'react'

import { ChatView } from './components/ChatView'
import { LoginScreen } from './components/LoginScreen'
import { NewChatDialog } from './components/NewChatDialog'
import { Sidebar } from './components/Sidebar'
import { useChatDirectory } from './hooks/useChatDirectory'
import { useChatHistory } from './hooks/useChatHistory'
import { useChatStore } from './hooks/useChatStore'
import { useJournalPreviews } from './hooks/useJournalPreviews'
import { useNewChat } from './hooks/useNewChat'
import { useNotificationPolling } from './hooks/useNotificationPolling'
import { useNow } from './hooks/useNow'
import { useSendMessage } from './hooks/useSendMessage'
import { useTheme } from './hooks/useTheme'
import type { Credentials } from './lib/greenApi'

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [query, setQuery] = useState('')

  const { theme, toggleTheme } = useTheme()
  const now = useNow()
  const store = useChatStore(credentials)
  const connection = useNotificationPolling(credentials, store.receive)
  const { send, retry } = useSendMessage(
    credentials,
    store.chats,
    store.appendMessage,
    store.patchMessage,
  )
  const newChat = useNewChat(credentials, store.addChat)

  useChatDirectory(credentials, store.addFromApi)
  useJournalPreviews(credentials, store.applyPreviews)
  useChatHistory(credentials, store.activeId, store.addHistory)

  if (!credentials) {
    return (
      <LoginScreen
        theme={theme}
        onToggleTheme={toggleTheme}
        onConnect={setCredentials}
      />
    )
  }

  const disconnect = () => {
    setCredentials(null)
    setQuery('')
    newChat.close()
  }

  return (
    <div className="app" data-view={store.activeChat ? 'thread' : 'list'}>
      <Sidebar
        chats={store.chats}
        activeId={store.activeId}
        query={query}
        now={now}
        connection={connection}
        onQueryChange={setQuery}
        onSelect={store.openChat}
        onNewChat={newChat.open}
        theme={theme}
        onToggleTheme={toggleTheme}
        onDisconnect={disconnect}
      />

      <ChatView
        chat={store.activeChat}
        now={now}
        onSend={send}
        onRetry={retry}
        onBack={store.closeChat}
      />

      {newChat.dialog ? (
        <NewChatDialog
          phase={newChat.dialog.phase}
          pendingPhone={newChat.dialog.phone}
          pendingChatId={newChat.dialog.chatId}
          error={newChat.dialog.error}
          onCreate={newChat.create}
          onOpenChat={(chatId) => {
            newChat.close()
            store.openChat(chatId)
          }}
          onReset={newChat.reset}
          onClose={newChat.close}
        />
      ) : null}
    </div>
  )
}
