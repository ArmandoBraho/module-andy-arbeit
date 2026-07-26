import { serviceThemes } from '../data/serviceIcons'

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

function toGoogleCalendarDateTime(date: Date): string {
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

/** German notification body for the Web3Forms email (single calendar link). */
export function buildAppointmentEmailBody(
  input: AppointmentCalendarInput,
  googleCalendarUrl: string | null,
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

  if (googleCalendarUrl) {
    sections.push('', 'In Google Kalender öffnen:', googleCalendarUrl)
  }

  sections.push(
    '',
    'Hinweis: Unverbindliche Anfrage – der Termin wird erst nach Bestätigung verbindlich.',
  )

  return sections.join('\n')
}

export function buildGoogleCalendarUrl(input: AppointmentCalendarInput): string | null {
  const window = getAppointmentWindow(input)
  if (!window) return null

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: buildAppointmentTitle(input),
    dates: `${toGoogleCalendarDateTime(window.start)}/${toGoogleCalendarDateTime(window.end)}`,
    details: buildAppointmentDetails(input),
    location: input.serviceAddress,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
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

export function downloadIcsFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
