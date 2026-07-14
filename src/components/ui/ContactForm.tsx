import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  problemDescription: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const initialData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  problemDescription: '',
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}

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
  if (data.problemDescription.trim().length < 10) {
    errors.problemDescription =
      'Bitte beschreiben Sie Ihr Anliegen (mindestens 10 Zeichen).'
  }

  return errors
}

type ContactFormProps = {
  title?: string
  subtitle?: string
}

export function ContactForm({
  title = 'Anfrage senden',
  subtitle = 'Wir melden uns schnellstmöglich bei Ihnen – kostenlos & unverbindlich.',
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const validationErrors = validate(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    // Backend integration will be added later (Formspree, API, etc.)
    await new Promise((resolve) => setTimeout(resolve, 600))

    setSubmitted(true)
    setFormData(initialData)
    setErrors({})
    setIsSubmitting(false)
  }

  return (
    <div className="contact-form">
      <h3 className="contact-form__title">{title}</h3>
      <p className="contact-form__subtitle">{subtitle}</p>

      {submitted && (
        <div className="contact-form__success" role="status">
          Vielen Dank! Ihre Anfrage wurde gesendet. Wir melden uns in Kürze bei
          Ihnen.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="contact-form__grid contact-form__grid--two">
          <FormField
            id="firstName"
            label="Vorname"
            value={formData.firstName}
            error={errors.firstName}
            onChange={(value) => handleChange('firstName', value)}
            required
          />
          <FormField
            id="lastName"
            label="Nachname"
            value={formData.lastName}
            error={errors.lastName}
            onChange={(value) => handleChange('lastName', value)}
            required
          />
        </div>

        <div className="contact-form__grid">
          <FormField
            id="email"
            label="E-Mail"
            type="email"
            value={formData.email}
            error={errors.email}
            onChange={(value) => handleChange('email', value)}
            required
          />
          <FormField
            id="phone"
            label="Telefon"
            type="tel"
            value={formData.phone}
            error={errors.phone}
            onChange={(value) => handleChange('phone', value)}
            required
          />
          <FormField
            id="problemDescription"
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
            {isSubmitting ? 'Wird gesendet…' : 'Anfrage senden'}
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

type FormFieldProps = {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
  as?: 'input' | 'textarea'
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
}: FormFieldProps) {
  const errorClass = error ? 'form-field__input--error' : ''

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
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={`form-field__input ${errorClass}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
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
