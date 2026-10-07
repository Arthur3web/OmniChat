// Общий шлюз: отвечает не для всех инстансов
const SHARED_API_URL = 'https://api.green-api.com'

function clusterApiUrl(idInstance: string): string {
  const cluster = /^(\d{4})/.exec(idInstance)?.[1]
  return cluster ? `https://${cluster}.api.green-api.com` : SHARED_API_URL
}

const apiUrls = new Map<string, string>()

function hostsFor(credentials: Credentials): string[] {
  const known = apiUrls.get(credentials.idInstance)
  if (known) return [known]
  const cluster = clusterApiUrl(credentials.idInstance)
  return cluster === SHARED_API_URL ? [SHARED_API_URL] : [cluster, SHARED_API_URL]
}

export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

// Ошибка API: код HTTP и текст, который вернул сервер
export class GreenApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}

interface CallOptions {
  verb?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | undefined>
  path?: string | number
  signal?: AbortSignal
}
const inFlight = new Map<string, Promise<unknown>>()

export async function call<T>(
  credentials: Credentials,
  method: string,
  options: CallOptions = {},
): Promise<T> {
  const { verb = 'GET', body, query, path, signal } = options
  const suffix = path === undefined ? '' : `/${encodeURIComponent(String(path))}`
  const search = new URLSearchParams()
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) search.set(key, String(value))
    }
  }

  const shareable = verb === 'GET' && signal === undefined
  const key = `${credentials.idInstance}/${credentials.apiTokenInstance}/${method}${suffix}?${search}`
  if (shareable) {
    const pending = inFlight.get(key)
    if (pending) return pending as Promise<T>
  }

  const request = perform<T>(credentials, method, suffix, search.toString(), verb, body, signal)
  if (!shareable) return request

  inFlight.set(key, request)
  try {
    return await request
  } finally {
    if (inFlight.get(key) === request) inFlight.delete(key)
  }
}

// Единственное место, где собирается адрес запроса
async function perform<T>(
  credentials: Credentials,
  method: string,
  suffix: string,
  search: string,
  verb: NonNullable<CallOptions['verb']>,
  body: unknown,
  signal: AbortSignal | undefined,
): Promise<T> {
  let answer: { status: number; ok: boolean; text: string } | null = null
  const hosts = hostsFor(credentials)
  for (let index = 0; index < hosts.length; index += 1) {
    const host = hosts[index]
    const url = new URL(
      `${host}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}${suffix}`,
    )
    url.search = search

    let response: Response
    try {
      response = await fetch(url, {
        method: verb,
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
      })
    } catch (error) {
      if ((error as Error).name === 'AbortError') throw error
      throw new GreenApiError('Нет связи с GREEN-API — проверьте сеть', 0)
    }

    const text = await response.text()
    answer = { status: response.status, ok: response.ok, text }

    // Чужой адрес отвечает страницей nginx, а не JSON
    const isUnknownCluster = response.status === 404 && /<html/i.test(text)
    const hasFallback = index < hosts.length - 1
    if (isUnknownCluster && hasFallback) continue
    if (!isUnknownCluster) apiUrls.set(credentials.idInstance, host)
    break
  }

  if (!answer) {
    throw new GreenApiError('Нет связи с GREEN-API — проверьте сеть', 0)
  }
  const { status, ok, text } = answer

  if (!ok) {
    throw new GreenApiError(text.trim() || `Ошибка GREEN-API (HTTP ${status})`, status)
  }

  if (!text.trim()) return null as T

  try {
    return JSON.parse(text) as T
  } catch {
    // Часть ошибок сервис отдаёт простым текстом
    throw new GreenApiError(text.trim() || 'GREEN-API вернул ответ, который не разобрать', status)
  }
}
