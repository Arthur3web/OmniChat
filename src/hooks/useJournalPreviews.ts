import { useEffect } from 'react'

import { latestPerChat } from '../lib/chatModel'
import {
  lastIncomingMessages,
  lastOutgoingMessages,
  type Credentials,
  type JournalMessage,
} from '../lib/greenApi'
import type { Message } from '../lib/types'

export function useJournalPreviews(
  credentials: Credentials | null,
  onPreviews: (previews: Map<string, Message>) => void,
): void {
  useEffect(() => {
    if (!credentials) return
    let cancelled = false

    const apply = (items: JournalMessage[]) => {
      if (!cancelled) onPreviews(latestPerChat(items))
    }

    void lastIncomingMessages(credentials).then(apply).catch(() => {})
    void lastOutgoingMessages(credentials).then(apply).catch(() => {})

    return () => {
      cancelled = true
    }
  }, [credentials, onPreviews])
}
