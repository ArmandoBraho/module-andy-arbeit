import { useEffect } from 'react'
import {
  getSessionAnalyticsSummary,
  syncSessionAnalyticsWithConsent,
} from '../../lib/sessionAnalytics'

/**
 * Runs session analytics only when Statistik cookie consent is granted.
 * Renders nothing.
 */
export function SessionAnalytics() {
  useEffect(() => {
    syncSessionAnalyticsWithConsent()

    if (import.meta.env.DEV) {
      ;(window as Window & {
        __andyArbeitAnalytics?: typeof getSessionAnalyticsSummary
      }).__andyArbeitAnalytics = getSessionAnalyticsSummary
    }

    const onConsent = () => {
      syncSessionAnalyticsWithConsent()
    }

    window.addEventListener('andyarbeit:cookie-consent', onConsent)
    return () => {
      window.removeEventListener('andyarbeit:cookie-consent', onConsent)
    }
  }, [])

  return null
}
