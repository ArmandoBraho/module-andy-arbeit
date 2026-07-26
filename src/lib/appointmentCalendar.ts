import { serviceThemes } from '../data/serviceIcons'
import { site } from '../data/content'

const DEFAULT_DURATION_MS = 60 * 60 * 1000

export type AppointmentCalendarInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceAddress: string
  serviceType: string
  serviceTitle: string
  preferredDate: string
  preferredTime: string
  problemDescription: string
  durationMs?: number
}

export type CalendarLinkPayload = {
  /** Google-style UTC UTC start: YYYYMMDDTHHMMSSZ */
  start: string
  /** Google-style UTC end */
  end: string
  /** Event title */
  title: string
  /** Location */
  location: string
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function toUtcIcsDateTime(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

function getAppointmentWindow(input: AppointmentCalendarInput): {
  start: Date
  end: Date
} | null {
  const start = new Date(`${input.preferredDate}T${input.preferredTime}`)
  if (Number.isNaN(start.getTime())) return null

  const end = new Date(start.getTime() + (input.durationMs ?? DEFAULT_DURATION_MS))
  return { start, end }
}

function getServiceTheme(serviceType: string) {
  return serviceThemes[serviceType]
}

function formatPreferredDateTime(date: string, time: string): string {
  const parsed = new Date(`${date}T${time}`)
  if (Number.isNaN(parsed.getTime())) return `${date} ${time}`

  return parsed.toLocaleString('de-DE', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

function formatTextTable(rows: Array<[string, string]>): string {
  const labelWidth = Math.max(...rows.map(([label]) => label.length))

  return rows
    .map(([label, value]) => `${label.padEnd(labelWidth)}  |  ${value}`)
    .join('\n')
}

const UTC_STAMP = /^\d{8}T\d{6}Z$/

export function buildAppointmentTitle(input: AppointmentCalendarInput): string {
  return `AndyArbeit – ${input.serviceTitle} (${input.firstName} ${input.lastName})`
}

export function buildAppointmentDetails(input: AppointmentCalendarInput): string {
  const theme = getServiceTheme(input.serviceType)

  return [
    `Leistung: ${input.serviceTitle}`,
    theme ? `Kalenderfarbe: ${theme.googleColorLabel}` : null,
    `Kunde: ${input.firstName} ${input.lastName}`,
    `E-Mail: ${input.email}`,
    `Telefon: ${input.phone}`,
    `Adresse: ${input.serviceAddress}`,
    '',
    'Problembeschreibung:',
    input.problemDescription,
    '',
    'Hinweis: Unverbindliche Terminanfrage – Termin erst nach Bestätigung verbindlich.',
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
}

function buildCalendarPayload(
  input: AppointmentCalendarInput,
): CalendarLinkPayload | null {
  const window = getAppointmentWindow(input)
  if (!window) return null

  return {
    start: toUtcIcsDateTime(window.start),
    end: toUtcIcsDateTime(window.end),
    title: buildAppointmentTitle(input),
    location: input.serviceAddress,
  }
}

/**
 * Ultra-short path-only URL so Outlook can auto-link it.
 * Long Google URLs and ?query / base64 paths often stay as plain text in Outlook.
 * Example: https://www.andyarbeit.info/k/20260728T172200Z/20260728T182200Z
 */
export function buildSiteCalendarRedirectUrl(
  input: AppointmentCalendarInput,
): string | null {
  const payload = buildCalendarPayload(input)
  if (!payload) return null
  return `${site.url}/k/${payload.start}/${payload.end}`
}

export function parseCalendarPathParams(
  start: string | undefined,
  end: string | undefined,
): CalendarLinkPayload | null {
  if (!start || !end || !UTC_STAMP.test(start) || !UTC_STAMP.test(end)) return null
  return {
    start,
    end,
    title: 'AndyArbeit Terminanfrage',
    location: '',
  }
}

export function buildGoogleCalendarUrlFromPayload(
  payload: CalendarLinkPayload,
): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: payload.title,
    dates: `${payload.start}/${payload.end}`,
    details:
      'Terminanfrage über die Website. Details siehe E-Mail-Benachrichtigung.',
    location: payload.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Plain-text body (Web3Forms escapes HTML – anchors would show as tags). */
export function buildAppointmentEmailBody(
  input: AppointmentCalendarInput,
  calendarLinkUrl: string | null,
): string {
  const theme = getServiceTheme(input.serviceType)

  const rows: Array<[string, string]> = [
    ['Leistung', input.serviceTitle],
    ['Wunschtermin', formatPreferredDateTime(input.preferredDate, input.preferredTime)],
    ['Kunde', `${input.firstName} ${input.lastName}`],
    ['E-Mail', input.email],
    ['Telefon', input.phone],
    ['Adresse', input.serviceAddress],
  ]

  if (theme) {
    rows.push(['Kalenderfarbe', theme.googleColorLabel])
  }

  const sections = [
    'Neue Terminanfrage über die Website',
    '',
    formatTextTable(rows),
    '',
    'Problembeschreibung',
    input.problemDescription,
  ]

  if (calendarLinkUrl) {
    sections.push(
      '',
      'Termin in den Kalender (Link antippen oder .ics-Anhang öffnen):',
      calendarLinkUrl,
    )
  }

  sections.push(
    '',
    'Hinweis: Unverbindliche Anfrage – der Termin wird erst nach Bestätigung verbindlich.',
  )

  return sections.join('\n')
}

export function buildGoogleCalendarUrl(input: AppointmentCalendarInput): string | null {
  const payload = buildCalendarPayload(input)
  if (!payload) return null
  return buildGoogleCalendarUrlFromPayload(payload)
}

/** Legacy query-string short links */
export function googleCalendarUrlFromRedirectParams(
  searchParams: URLSearchParams,
): string | null {
  const dates = searchParams.get('d')?.trim()
  if (!dates || !/^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/.test(dates)) return null
  const [start, end] = dates.split('/')

  return buildGoogleCalendarUrlFromPayload({
    start,
    end,
    title: searchParams.get('t')?.trim() || 'AndyArbeit Termin',
    location: searchParams.get('l')?.trim() || '',
  })
}

export function buildIcsContent(input: AppointmentCalendarInput): string | null {
  const window = getAppointmentWindow(input)
  if (!window) return null

  const theme = getServiceTheme(input.serviceType)
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@andyarbeit.info`
  const now = toUtcIcsDateTime(new Date())
  const title = escapeIcsText(buildAppointmentTitle(input))
  const description = escapeIcsText(buildAppointmentDetails(input))
  const location = escapeIcsText(input.serviceAddress)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AndyArbeit//Terminanfrage//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toUtcIcsDateTime(window.start)}`,
    `DTEND:${toUtcIcsDateTime(window.end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
  ]

  if (theme?.accent) {
    lines.push(`COLOR:${theme.accent}`)
    lines.push(`X-APPLE-CALENDAR-COLOR:${theme.accent}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
}

export function buildIcsContentFromPayload(payload: CalendarLinkPayload): string {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@andyarbeit.info`
  const now = toUtcIcsDateTime(new Date())

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AndyArbeit//Terminanfrage//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${payload.start}`,
    `DTEND:${payload.end}`,
    `SUMMARY:${escapeIcsText(payload.title)}`,
    `DESCRIPTION:${escapeIcsText('Terminanfrage über die Website. Details siehe E-Mail.')}`,
    `LOCATION:${escapeIcsText(payload.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcsFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
