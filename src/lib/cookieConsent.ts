export type CookieConsentChoice = {
  /** Always true — needed to remember this choice */
  necessary: true
  /** Optional: session count / duration analytics after Statistik consent */
  statistics: boolean
  /**
   * Optional: load interactive map (OpenStreetMap tiles + marker assets).
   * Without this, no third-party map requests are made.
   */
  externalContent: boolean
  updatedAt: string
}

export const COOKIE_CONSENT_STORAGE_KEY = 'andyarbeit-cookie-consent'
export const COOKIE_CONSENT_EVENT = 'andyarbeit:cookie-consent'
export const COOKIE_CONSENT_OPEN_EVENT = 'andyarbeit:open-cookie-settings'

export function readCookieConsent(): CookieConsentChoice | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CookieConsentChoice>
    // Older saves without externalContent → treat as unset (show banner again)
    if (
      typeof parsed.statistics !== 'boolean' ||
      typeof parsed.externalContent !== 'boolean'
    ) {
      return null
    }
    return {
      necessary: true,
      statistics: parsed.statistics,
      externalContent: parsed.externalContent,
      updatedAt:
        typeof parsed.updatedAt === 'string'
          ? parsed.updatedAt
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function writeCookieConsent(options: {
  statistics: boolean
  externalContent: boolean
}): CookieConsentChoice {
  const choice: CookieConsentChoice = {
    necessary: true,
    statistics: options.statistics,
    externalContent: options.externalContent,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(choice))
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: choice }),
  )
  return choice
}

export function hasStatisticsConsent(): boolean {
  return readCookieConsent()?.statistics === true
}

export function hasExternalContentConsent(): boolean {
  return readCookieConsent()?.externalContent === true
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT))
}
