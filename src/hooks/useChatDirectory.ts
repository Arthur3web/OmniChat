import { useEffect } from 'react'

import { getChats, type Credentials, type GreenApiChat } from '../lib/greenApi'

export function useChatDirectory(
  credentials: Credentials | null,
  onLoaded: (items: GreenApiChat[]) => void,
): void {
  useEffect(() => {
    if (!credentials) return
    let cancelled = false

    void (async () => {
      try {
        const list = await getChats(credentials)
        if (!cancelled) onLoaded(list)
      } catch {
        // Список чатов не критичен: переписка работает и без него
      }
    })()

    return () => {
      cancelled = true
    }
  }, [credentials, onLoaded])
}
