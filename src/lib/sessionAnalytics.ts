import { hasStatisticsConsent } from './cookieConsent'

const STORAGE_KEY = 'andyarbeit-session-analytics'
const ACTIVE_KEY = 'andyarbeit-session-active'
const SESSION_GAP_MS = 30 * 60 * 1000
const HEARTBEAT_MS = 15_000
const MAX_STORED_SESSIONS = 100

export type CompletedSession = {
  id: string
  startedAt: string
  endedAt: string
  durationMs: number
}

export type SessionAnalyticsSummary = {
  sessionCount: number
  totalDurationMs: number
  averageDurationMs: number
  sessions: CompletedSession[]
}

type ActiveSession = {
  id: string
  startedAt: number
  lastSeenAt: number
}

type AnalyticsStore = {
  sessionCount: number
  totalDurationMs: number
  sessions: CompletedSession[]
}

type TrackerHandles = {
  heartbeatId: number
  onVisibility: () => void
  onPageHide: () => void
  onConsent: (event: Event) => void
}

let handles: TrackerHandles | null = null

function now() {
  return Date.now()
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `s-${now()}-${Math.random().toString(36).slice(2, 9)}`
}

function readStore(): AnalyticsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { sessionCount: 0, totalDurationMs: 0, sessions: [] }
    }
    const parsed = JSON.parse(raw) as Partial<AnalyticsStore>
    return {
      sessionCount: Number(parsed.sessionCount) || 0,
      totalDurationMs: Number(parsed.totalDurationMs) || 0,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    }
  } catch {
    return { sessionCount: 0, totalDurationMs: 0, sessions: [] }
  }
}

function writeStore(store: AnalyticsStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function readActive(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ActiveSession>
    if (
      typeof parsed.id !== 'string' ||
      typeof parsed.startedAt !== 'number' ||
      typeof parsed.lastSeenAt !== 'number'
    ) {
      return null
    }
    return {
      id: parsed.id,
      startedAt: parsed.startedAt,
      lastSeenAt: parsed.lastSeenAt,
    }
  } catch {
    return null
  }
}

function writeActive(session: ActiveSession | null) {
  if (!session) {
    localStorage.removeItem(ACTIVE_KEY)
    return
  }
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(session))
}

function sendSessionBeacon(session: CompletedSession) {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT
  if (!endpoint || typeof navigator.sendBeacon !== 'function') return

  const body = JSON.stringify({
    type: 'session_end',
    ...session,
    path: window.location.pathname,
  })
  try {
    navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }))
  } catch {
    // Ignore network failures — local store remains source of truth in-browser
  }
}

function completeSession(active: ActiveSession, endedAt = now()) {
  const durationMs = Math.max(0, endedAt - active.startedAt)
  if (durationMs < 1000) {
    writeActive(null)
    return
  }

  const completed: CompletedSession = {
    id: active.id,
    startedAt: new Date(active.startedAt).toISOString(),
    endedAt: new Date(endedAt).toISOString(),
    durationMs,
  }

  const store = readStore()
  store.sessionCount += 1
  store.totalDurationMs += durationMs
  store.sessions = [completed, ...store.sessions].slice(0, MAX_STORED_SESSIONS)
  writeStore(store)
  writeActive(null)
  sendSessionBeacon(completed)
}

function touchActive() {
  if (!hasStatisticsConsent()) return
  const active = readActive()
  if (!active) return
  writeActive({ ...active, lastSeenAt: now() })
}

function ensureSession() {
  if (!hasStatisticsConsent()) return

  const t = now()
  const active = readActive()

  if (active && t - active.lastSeenAt <= SESSION_GAP_MS) {
    writeActive({ ...active, lastSeenAt: t })
    return
  }

  if (active) {
    completeSession(active, active.lastSeenAt)
  }

  writeActive({
    id: createId(),
    startedAt: t,
    lastSeenAt: t,
  })
}

function stopTracking(endCurrent: boolean) {
  if (!handles) return

  window.clearInterval(handles.heartbeatId)
  document.removeEventListener('visibilitychange', handles.onVisibility)
  window.removeEventListener('pagehide', handles.onPageHide)
  window.removeEventListener('andyarbeit:cookie-consent', handles.onConsent)
  handles = null

  if (endCurrent) {
    const active = readActive()
    if (active) completeSession(active)
  }
}

function startTracking() {
  if (handles || !hasStatisticsConsent()) return

  ensureSession()

  const onVisibility = () => {
    if (!hasStatisticsConsent()) return
    if (document.visibilityState === 'visible') {
      ensureSession()
    } else {
      touchActive()
    }
  }

  const onPageHide = () => {
    if (!hasStatisticsConsent()) return
    const active = readActive()
    if (active) {
      // Keep session resumable within SESSION_GAP_MS (tab close / refresh)
      writeActive({ ...active, lastSeenAt: now() })
    }
  }

  const onConsent = (event: Event) => {
    const detail = (event as CustomEvent<{ statistics?: boolean }>).detail
    if (detail?.statistics === true) {
      ensureSession()
      return
    }
    stopTracking(true)
  }

  const heartbeatId = window.setInterval(() => {
    if (!hasStatisticsConsent()) {
      stopTracking(true)
      return
    }
    if (document.visibilityState === 'visible') {
      touchActive()
    }
  }, HEARTBEAT_MS)

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pagehide', onPageHide)
  window.addEventListener('andyarbeit:cookie-consent', onConsent)

  handles = { heartbeatId, onVisibility, onPageHide, onConsent }
}

/** Start or stop analytics based on current Statistik consent. */
export function syncSessionAnalyticsWithConsent() {
  if (hasStatisticsConsent()) {
    startTracking()
  } else {
    stopTracking(true)
  }
}

export function getSessionAnalyticsSummary(): SessionAnalyticsSummary {
  const store = readStore()
  const active = hasStatisticsConsent() ? readActive() : null
  const liveDuration =
    active && document.visibilityState === 'visible'
      ? Math.max(0, now() - active.startedAt)
      : 0

  const sessionCount = store.sessionCount + (active ? 1 : 0)
  const totalDurationMs = store.totalDurationMs + liveDuration

  return {
    sessionCount,
    totalDurationMs,
    averageDurationMs:
      sessionCount > 0 ? Math.round(totalDurationMs / sessionCount) : 0,
    sessions: store.sessions,
  }
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
