import { call, GreenApiError, type Credentials } from './client'

export interface WebhookSenderData {
  chatId: string
  chatName?: string
  senderName?: string
  senderContactName?: string
  senderPhoneNumber?: number
}

export interface WebhookBody {
  typeWebhook: string
  timestamp?: number
  idMessage?: string
  senderData?: WebhookSenderData
  messageData?: {
    typeMessage: string
    textMessageData?: { textMessage: string }
    reactionMessageData?: { emoji: string }
  }
}

export interface QueuedNotification {
  receiptId: number
  body: WebhookBody
}

// Long polling: ждёт уведомление receiveTimeout секунд (5–60)
export async function receiveNotification(
  credentials: Credentials,
  receiveTimeout = 5,
  signal?: AbortSignal,
): Promise<QueuedNotification | null> {
  try {
    return await call<QueuedNotification | null>(credentials, 'receiveNotification', {
      query: { receiveTimeout },
      signal,
    })
  } catch (error) {
    // Пустая очередь отдаётся кодом 408/504: это не сбой связи
    if (error instanceof GreenApiError && (error.status === 408 || error.status === 504)) {
      return null
    }
    throw error
  }
}

// Подтверждение: без него уведомление придёт повторно. receiptId
// передаётся частью адреса, а не строкой запроса

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
): Promise<void> {
  await call(credentials, 'deleteNotification', {
    verb: 'DELETE',
    path: receiptId,
  })
}
