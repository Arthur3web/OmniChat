import { call, type Credentials } from './client'

export type InstanceState =
  | 'authorized'
  | 'starting'
  | 'notAuthorized'
  | 'sleeping'
  | 'stopInstance'

// Состояние инстанса
export async function getStateInstance(credentials: Credentials): Promise<InstanceState> {
  const data = await call<{ stateInstance: InstanceState }>(credentials, 'getStateInstance')
  return data?.stateInstance ?? 'notAuthorized'
}

export interface InstanceSettings {
  typeInstance?: string
  webhookUrl?: string
  incomingWebhook?: string
  outgoingWebhook?: string
}

const checkedInstances = new Set<string>()

export async function getSettings(credentials: Credentials): Promise<InstanceSettings> {
  return (await call<InstanceSettings>(credentials, 'getSettings')) ?? {}
}

export async function ensureNotifications(credentials: Credentials): Promise<boolean> {
  if (checkedInstances.has(credentials.idInstance)) return false

  const current = await getSettings(credentials)
  const ready =
    !current.webhookUrl &&
    current.incomingWebhook === 'yes' &&
    current.outgoingWebhook !== 'yes'
  if (ready) {
    checkedInstances.add(credentials.idInstance)
    return false
  }

  await call(credentials, 'setSettings', {
    verb: 'POST',
    body: { webhookUrl: '', incomingWebhook: 'yes', outgoingWebhook: 'no' },
  })
  checkedInstances.add(credentials.idInstance)
  return true
}
