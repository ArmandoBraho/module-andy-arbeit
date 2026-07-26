import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { services } from '../../data/content'
import { serviceThemes } from '../../data/serviceIcons'
import {
  buildAppointmentEmailBody,
  buildIcsContent,
  buildSiteCalendarRedirectUrl,
} from '../../lib/appointmentCalendar'
import { Button } from './Button'
import { ServiceIcon, hasServiceIcon } from './ServiceIcon'
import { Toast, type ToastVariant } from './Toast'

const MIN_LEAD_TIME_MS = 30 * 60 * 60 * 1000
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceAddress: string
  serviceType: string
  preferredDate: string
  preferredTime: string
  problemDescription: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const initialData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  serviceAddress: '',
  serviceType: '',
  preferredDate: '',
  preferredTime: '',
  problemDescription: '',
}

const serviceOptions = services.map((service) => ({
  value: service.id,
  label: service.title,
}))

function getServiceTitle(serviceType: string): string {
  const service = services.find((item) => item.id === serviceType)
  return service?.title ?? serviceType
}

function getMinimumAppointmentDate(): Date {
  return new Date(Date.now() + MIN_LEAD_TIME_MS)
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toTimeInputValue(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function parseAppointmentDateTime(date: string, time: string): Date | null {
  if (!date || !time) return null

  const parsed = new Date(`${date}T${time}`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isValidDateInput(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false

  const parsed = new Date(`${date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return false

  return toDateInputValue(parsed) === date
}

function isValidTimeInput(time: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) return false

  const [hours, minutes] = time.split(':').map(Number)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  const minimumAppointmentDate = getMinimumAppointmentDate()

  if (data.firstName.trim().length < 2) {
    errors.firstName = 'Bitte geben Sie Ihren Vornamen ein.'
  }
  if (data.lastName.trim().length < 2) {
    errors.lastName = 'Bitte geben Sie Ihren Nachnamen ein.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
  }
  if (data.phone.trim().length < 6) {
    errors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein.'
  }
  if (data.serviceAddress.trim().length < 5) {
    errors.serviceAddress = 'Bitte geben Sie die Adresse vom Einsatzort ein.'
  }
  if (!serviceOptions.some((option) => option.value === data.serviceType)) {
    errors.serviceType = 'Bitte wählen Sie eine Leistung aus.'
  }

  if (!data.preferredDate) {
    errors.preferredDate = 'Bitte wählen Sie ein Wunschdatum.'
  } else if (!isValidDateInput(data.preferredDate)) {
    errors.preferredDate = 'Bitte wählen Sie ein gültiges Datum.'
  }

  if (!data.preferredTime) {
    errors.preferredTime = 'Bitte wählen Sie eine Uhrzeit.'
  } else if (!isValidTimeInput(data.preferredTime)) {
    errors.preferredTime = 'Bitte wählen Sie eine gültige Uhrzeit.'
  }

  const appointmentDateTime = parseAppointmentDateTime(
    data.preferredDate,
    data.preferredTime,
  )

  if (
    !errors.preferredDate &&
    !errors.preferredTime &&
    data.preferredDate &&
    data.preferredTime
  ) {
    if (!appointmentDateTime) {
      errors.preferredDate = 'Bitte wählen Sie ein gültiges Datum.'
      errors.preferredTime = 'Bitte wählen Sie eine gültige Uhrzeit.'
    } else if (appointmentDateTime < minimumAppointmentDate) {
      const endOfSelectedDay = new Date(`${data.preferredDate}T23:59:59`)
      const leadTimeMessage =
        'Der gewünschte Zeitpunkt muss mindestens 30 Stunden ab jetzt liegen. Bitte wählen Sie ein späteres Datum oder eine spätere Uhrzeit.'

      if (endOfSelectedDay < minimumAppointmentDate) {
        errors.preferredDate = leadTimeMessage
      } else {
        errors.preferredTime = leadTimeMessage
      }
    }
  }

  if (data.problemDescription.trim().length < 10) {
    errors.problemDescription =
      'Bitte beschreiben Sie Ihr Anliegen (mindestens 10 Zeichen).'
  }

  return errors
}

type AppointmentFormProps = {
  title?: string
  subtitle?: string
  initialServiceType?: string
}

export function AppointmentForm({
  title = 'Terminanfrage senden',
  subtitle = 'Unverbindliche Anfrage – wir bestätigen Ihren Wunschtermin oder schlagen einen Alternativtermin vor.',
  initialServiceType = '',
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<FormData>(() => ({
    ...initialData,
    serviceType: serviceOptions.some((option) => option.value === initialServiceType)
      ? initialServiceType
      : '',
  }))
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{
    variant: ToastVariant
    message: string
  } | null>(null)

  const minimumAppointmentDate = getMinimumAppointmentDate()
  const minimumDate = toDateInputValue(minimumAppointmentDate)
  const minimumTime =
    formData.preferredDate === minimumDate
      ? toTimeInputValue(minimumAppointmentDate)
      : undefined

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDateChange = (value: string) => {
    setFormData((prev) => {
      const next = { ...prev, preferredDate: value }

      if (
        value === minimumDate &&
        prev.preferredTime &&
        prev.preferredTime < toTimeInputValue(minimumAppointmentDate)
      ) {
        next.preferredTime = ''
      }

      return next
    })

    if (errors.preferredDate || errors.preferredTime) {
      setErrors((prev) => ({
        ...prev,
        preferredDate: undefined,
        preferredTime: undefined,
      }))
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const validationErrors = validate(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setToast({
        variant: 'error',
        message:
          'Das Formular ist noch nicht konfiguriert. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.',
      })
      return
    }

    const serviceTitle = getServiceTitle(formData.serviceType)
    const calendarInput = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      serviceAddress: formData.serviceAddress,
      serviceType: formData.serviceType,
      serviceTitle,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      problemDescription: formData.problemDescription,
    }
    // Path-only short URL (Outlook often ignores URLs with ?query)
    const calendarLinkUrl = buildSiteCalendarRedirectUrl(calendarInput)
    const icsContent = buildIcsContent(calendarInput)

    setIsSubmitting(true)

    const buildPayload = (includeIcs: boolean) => {
      const body = new globalThis.FormData()
      body.append('access_key', accessKey)
      body.append(
        'subject',
        `Terminanfrage: ${serviceTitle} – ${formData.firstName} ${formData.lastName}`,
      )
      body.append('from_name', 'AndyArbeit Website')
      body.append('name', `${formData.firstName} ${formData.lastName}`)
      body.append('email', formData.email)
      body.append('replyto', formData.email)
      // Honeypot must stay empty – sending "false" is treated as filled/bot
      body.append('botcheck', '')
      body.append('message', buildAppointmentEmailBody(calendarInput, calendarLinkUrl))
      if (calendarLinkUrl) {
        body.append('Kalender-Link', calendarLinkUrl)
      }
      // .ics opens natively in Outlook (real attachment, not plain-text URL)
      if (includeIcs && icsContent) {
        body.append(
          'attachment',
          new Blob([icsContent], { type: 'text/calendar;charset=utf-8' }),
          'andyarbeit-terminanfrage.ics',
        )
      }
      return body
    }

    try {
      let response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: buildPayload(true),
      })
      let result = (await response.json()) as { success?: boolean; message?: string }

      // Free Web3Forms plans may reject attachments – retry without .ics
      if ((!response.ok || !result.success) && icsContent) {
        response = await fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          body: buildPayload(false),
        })
        result = (await response.json()) as { success?: boolean; message?: string }
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Senden fehlgeschlagen')
      }

      setFormData(initialData)
      setErrors({})
      setToast({
        variant: 'success',
        message:
          'Ihre Terminanfrage hat geklappt. Wir melden uns spätestens innerhalb von 24 Stunden mit einer Bestätigung oder einem Alternativtermin.',
      })
    } catch {
      setToast({
        variant: 'error',
        message:
          'Die Terminanfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedServiceTitle = formData.serviceType
    ? getServiceTitle(formData.serviceType)
    : null
  const showServiceIcon =
    Boolean(formData.serviceType) && hasServiceIcon(formData.serviceType)
  const selectedTheme = formData.serviceType
    ? serviceThemes[formData.serviceType]
    : null

  const formStyle = selectedTheme
    ? ({
        '--appointment-accent': selectedTheme.accent,
        '--appointment-accent-soft': selectedTheme.soft,
        '--appointment-accent-deep': selectedTheme.deep,
      } as CSSProperties)
    : undefined

  return (
    <div
      className={`contact-form${selectedTheme ? ' contact-form--themed' : ''}`}
      style={formStyle}
    >
      <h3 className="contact-form__title">
        {showServiceIcon && (
          <span className="contact-form__service-icon" aria-hidden="true">
            <ServiceIcon serviceId={formData.serviceType} size={18} />
          </span>
        )}
        <span className="contact-form__title-text">
          {title}
          {selectedServiceTitle && (
            <span className="contact-form__service-name">
              {' '}
              · {selectedServiceTitle}
            </span>
          )}
        </span>
      </h3>
      <p className="contact-form__subtitle">{subtitle}</p>

      {toast && (
        <Toast
          variant={toast.variant}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="contact-form__grid contact-form__grid--two">
          <FormField
            id="appointmentFirstName"
            label="Vorname"
            value={formData.firstName}
            error={errors.firstName}
            onChange={(value) => handleChange('firstName', value)}
            required
          />
          <FormField
            id="appointmentLastName"
            label="Nachname"
            value={formData.lastName}
            error={errors.lastName}
            onChange={(value) => handleChange('lastName', value)}
            required
          />
        </div>

        <div className="contact-form__grid">
          <FormField
            id="appointmentEmail"
            label="E-Mail"
            type="email"
            value={formData.email}
            error={errors.email}
            onChange={(value) => handleChange('email', value)}
            required
          />
          <FormField
            id="appointmentPhone"
            label="Telefon"
            type="tel"
            value={formData.phone}
            error={errors.phone}
            onChange={(value) => handleChange('phone', value)}
            required
          />
          <FormField
            id="appointmentServiceAddress"
            label="Adresse vom Einsatz"
            value={formData.serviceAddress}
            error={errors.serviceAddress}
            onChange={(value) => handleChange('serviceAddress', value)}
            required
          />
          <FormField
            id="appointmentServiceType"
            label="Leistung"
            as="select"
            value={formData.serviceType}
            error={errors.serviceType}
            onChange={(value) => handleChange('serviceType', value)}
            options={serviceOptions}
            placeholder="Bitte Leistung auswählen"
            required
          />
          <div className="contact-form__grid contact-form__grid--two">
            <FormField
              id="appointmentPreferredDate"
              label="Wunschdatum"
              type="date"
              value={formData.preferredDate}
              error={errors.preferredDate}
              onChange={handleDateChange}
              min={minimumDate}
              required
            />
            <FormField
              id="appointmentPreferredTime"
              label="Wunsch-Uhrzeit"
              type="time"
              value={formData.preferredTime}
              error={errors.preferredTime}
              onChange={(value) => handleChange('preferredTime', value)}
              min={minimumTime}
              required
            />
          </div>
          <p className="form-field__hint">
            Frühestmöglicher Wunschzeitpunkt: mindestens 30 Stunden ab jetzt (
            {minimumAppointmentDate.toLocaleString('de-DE', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
            ). Dies ist eine unverbindliche Anfrage – der Termin wird erst nach unserer
            Bestätigung verbindlich.
          </p>
          <FormField
            id="appointmentProblemDescription"
            label="Problembeschreibung"
            as="textarea"
            value={formData.problemDescription}
            error={errors.problemDescription}
            onChange={(value) => handleChange('problemDescription', value)}
            required
          />
        </div>

        <div className="contact-form__submit">
          <Button type="submit" variant="primary" block disabled={isSubmitting}>
            {isSubmitting ? 'Wird gesendet…' : 'Terminanfrage senden'}
          </Button>
        </div>

        <p className="contact-form__privacy">
          Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer{' '}
          <Link to="/datenschutz">Datenschutzerklärung</Link> zu.
        </p>
      </form>
    </div>
  )
}

type FormFieldOption = {
  value: string
  label: string
}

type FormFieldProps = {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
  as?: 'input' | 'textarea' | 'select'
  min?: string
  options?: FormFieldOption[]
  placeholder?: string
}

function FormField({
  id,
  label,
  value,
  error,
  onChange,
  required,
  type = 'text',
  as = 'input',
  min,
  options = [],
  placeholder,
}: FormFieldProps) {
  const errorClass = error ? 'form-field__input--error' : ''
  const describedBy = error ? `${id}-error` : undefined

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && <span className="form-field__required"> *</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          className={`form-field__textarea ${errorClass}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          className={`form-field__input form-field__select ${errorClass}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        >
          <option value="" disabled>
            {placeholder ?? 'Bitte auswählen'}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          className={`form-field__input ${errorClass}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          min={min}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
      )}
      {error && (
        <span id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
