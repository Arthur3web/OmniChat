// Служебные ответы API — на язык, понятный пользователю

import { GreenApiError } from './client'

export function friendlyGreenApiError(error: unknown): string {
  if (error instanceof GreenApiError && error.status === 401) {
    return 'Неверные idInstance или apiTokenInstance'
  }
  if (error instanceof GreenApiError && error.status === 429) {
    return 'GREEN-API ограничил частоту запросов — подождите минуту и попробуйте снова'
  }
  if (error instanceof GreenApiError && error.status >= 500) {
    return `Сервис GREEN-API временно недоступен (HTTP ${error.status}) — попробуйте ещё раз через минуту`
  }

  const text = (error instanceof Error ? error.message : String(error)).trim()
  const lower = text.toLowerCase()

  if (lower.includes('not authorized') || lower.includes('starting')) {
    return 'Инстанс не авторизован — завершите авторизацию в личном кабинете GREEN-API'
  }
  if (lower.includes('limit reached') || lower.includes('rate_limit')) {
    return 'Лимит проверок номеров исчерпан — попробуйте позже'
  }
  if (lower.includes('custom webhook url')) {
    return 'У инстанса задан свой webhook — очистите его в личном кабинете GREEN-API'
  }

  return text || 'Неизвестная ошибка GREEN-API'
}
