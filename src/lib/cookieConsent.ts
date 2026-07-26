export type CookieConsentChoice = {
  /** Always true — needed to remember this choice */
  necessary: true
  /** Optional: session count / duration analytics after Statistik consent */
  statistics: boolean
  updatedAt: string
}

export const COOKIE_CONSENT_STORAGE_KEY = 'andyarbeit-cookie-consent'

export function readCookieConsent(): CookieConsentChoice | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CookieConsentChoice>
    if (typeof parsed.statistics !== 'boolean') return null
    return {
      necessary: true,
      statistics: parsed.statistics,
      updatedAt:
        typeof parsed.updatedAt === 'string'
          ? parsed.updatedAt
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function writeCookieConsent(
  statistics: boolean,
): CookieConsentChoice {
  const choice: CookieConsentChoice = {
    necessary: true,
    statistics,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(choice))
  window.dispatchEvent(
    new CustomEvent('andyarbeit:cookie-consent', { detail: choice }),
  )
  return choice
}

export function hasStatisticsConsent(): boolean {
  return readCookieConsent()?.statistics === true
}

export const COOKIE_CONSENT_OPEN_EVENT = 'andyarbeit:open-cookie-settings'
