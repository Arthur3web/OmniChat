import { call, type Credentials } from './client'

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<{ idMessage: string }> {
  return call(credentials, 'sendMessage', {
    verb: 'POST',
    body: { chatId, message },
  })
}

// Ошибки приходят двумя видами: с `reason` сверху или с вложенным `data`
export type CheckAccountResult =
  | { exist: true; chatId: string; fromCache?: boolean }
  | { exist: false; chatId: string }
  | {
      status: false
      reason?: string
      data?: { status?: string; reason?: string; retryAfter?: number }
    }

export async function checkAccount(
  credentials: Credentials,
  phoneNumber: string,
): Promise<CheckAccountResult> {
  const digits = phoneNumber.replace(/\D/g, '')
  return call(credentials, 'checkAccount', {
    verb: 'POST',
    body: { phoneNumber: Number(digits) },
  })
}
