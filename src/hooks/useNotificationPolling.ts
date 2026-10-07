import { useEffect, useState } from 'react'

import {
  deleteNotification,
  ensureNotifications,
  receiveNotification,
  type Credentials,
  type QueuedNotification,
  type WebhookBody,
} from '../lib/greenApi'

const POLL_TIMEOUT_S = 20
const POLL_PAUSE_MS = 3_000
const REPEAT_LIMIT = 5

export type Connection = 'connecting' | 'live' | 'reconnecting'

export function useNotificationPolling(
  credentials: Credentials | null,
  onNotification: (body: WebhookBody) => void,
): Connection {
  const [connection, setConnection] = useState<Connection>('connecting')

  const [instance, setInstance] = useState(credentials)
  if (instance !== credentials) {
    setInstance(credentials)
    setConnection('connecting')
  }

  useEffect(() => {
    if (!credentials) return

    let stopped = false
    const controller = new AbortController()

    const pause = () =>
      new Promise((resolve) => window.setTimeout(resolve, POLL_PAUSE_MS))

    const deleting = new Map<number, Promise<void>>()

    const run = async () => {
      void ensureNotifications(credentials).catch(() => {})

      let repeats = 0
      let failures = 0

      while (!stopped) {
        let queued: QueuedNotification | null = null
        try {
          queued = await receiveNotification(credentials, POLL_TIMEOUT_S, controller.signal)
        } catch (error) {
          if (stopped || (error as Error).name === 'AbortError') return
          setConnection('reconnecting')
          await pause()
          continue
        }
        if (stopped) return
        setConnection('live')
        if (!queued) continue

        const inFlight = deleting.get(queued.receiptId)
        if (inFlight) {
          repeats += 1
          if (repeats > REPEAT_LIMIT) {
            repeats = 0
            await pause()
          }
          await inFlight
          continue
        }
        repeats = 0

        try {
          onNotification(queued.body)
        } catch {
          // Разбор уведомления не должен прерывать цикл
        }

        const deletion = deleteNotification(credentials, queued.receiptId)
          .then(() => {
            failures = 0
          })
          .catch(() => {
            failures += 1
          })
          .finally(() => {
            deleting.delete(queued.receiptId)
          })
        deleting.set(queued.receiptId, deletion)

        if (failures > REPEAT_LIMIT) {
          failures = 0
          await pause()
        }
      }
    }

    void run()
    return () => {
      stopped = true
      controller.abort()
    }
  }, [credentials, onNotification])

  return connection
}
