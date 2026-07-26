import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { appointmentRequest, services } from '../data/content'
import { AppointmentForm } from '../components/ui/AppointmentForm'
import { InfoIcon } from '../components/ui/InfoIcon'
import { NotfallIcon } from '../components/ui/NotfallIcon'

type Choice = 'appointment' | null

function getServiceIdFromParams(params: URLSearchParams): string | null {
  const raw = params.get('service') ?? params.get('leistung')
  if (!raw) return null
  return services.some((service) => service.id === raw) ? raw : null
}

export function TerminAnfragenPage() {
  const [searchParams] = useSearchParams()
  const preselectedService = getServiceIdFromParams(searchParams)
  const [choice, setChoice] = useState<Choice>(() =>
    preselectedService ? 'appointment' : null,
  )
  const [openTip, setOpenTip] = useState<number | null>(null)
  const stepsRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (preselectedService) {
      setChoice('appointment')
    }
  }, [preselectedService])

  useEffect(() => {
    if (openTip === null) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!stepsRef.current?.contains(event.target as Node)) {
        setOpenTip(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenTip(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openTip])

  return (
    <div className="page page--termin-anfragen">
      <div className="container">
        {choice === null && (
          <section className="appointment-triage" aria-labelledby="triage-question">
            <h1 id="triage-question" className="appointment-triage__question">
              {appointmentRequest.triageQuestion}
            </h1>

            <div className="appointment-triage__help">
              <p className="appointment-triage__help-heading">{appointmentRequest.triageHint}</p>
              <div className="appointment-triage__help-body">
                <p className="appointment-triage__help-title">
                  {appointmentRequest.notfallExamplesTitle}
                </p>
                <ul className="appointment-triage__examples">
                  {appointmentRequest.notfallExamples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
                <p className="appointment-triage__help-title">
                  {appointmentRequest.notfallNoExamplesTitle}
                </p>
                <ul className="appointment-triage__examples">
                  {appointmentRequest.notfallNoExamples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="appointment-triage__choices">
              <Link
                to="/notfall"
                className="appointment-triage__choice appointment-triage__choice--emergency"
              >
                <span className="appointment-triage__choice-badge" aria-hidden="true">
                  <NotfallIcon size={18} />
                </span>
                <span className="appointment-triage__choice-label">
                  {appointmentRequest.choiceYes}
                </span>
              </Link>
              <button
                type="button"
                className="appointment-triage__choice appointment-triage__choice--appointment"
                onClick={() => setChoice('appointment')}
              >
                <span className="appointment-triage__choice-label">
                  {appointmentRequest.choiceNo}
                </span>
              </button>
            </div>
          </section>
        )}

        {choice === 'appointment' && (
          <div className="appointment-page-grid">
            <div className="appointment-page__info">
              <div className="appointment-flow-header">
                <h2 className="appointment-steps__title">{appointmentRequest.stepsTitle}</h2>
                <button
                  type="button"
                  className="appointment-triage__back"
                  onClick={() => {
                    setChoice(null)
                    setOpenTip(null)
                  }}
                >
                  {appointmentRequest.changeChoice}
                </button>
              </div>

              <ol ref={stepsRef} className="appointment-steps appointment-steps--compact">
                {appointmentRequest.steps.map((step, index) => {
                  const isOpen = openTip === index

                  return (
                    <li key={step.title} className="appointment-step appointment-step--compact">
                      <span className="appointment-step__number" aria-hidden="true">
                        {index + 1}
                      </span>
                      <div className="appointment-step__body">
                        <div className="appointment-step__row">
                          <h3 className="appointment-step__title">{step.title}</h3>
                          <div className="appointment-step__tip">
                            <button
                              type="button"
                              className={`appointment-step__info${
                                isOpen ? ' appointment-step__info--open' : ''
                              }`}
                              aria-expanded={isOpen}
                              aria-controls={`appointment-step-tip-${index}`}
                              title={appointmentRequest.stepsInfoLabel}
                              onClick={() => setOpenTip(isOpen ? null : index)}
                            >
                              <InfoIcon size={13} />
                            </button>
                            {isOpen && (
                              <div
                                id={`appointment-step-tip-${index}`}
                                className="appointment-step__tooltip"
                                role="tooltip"
                              >
                                {step.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="appointment-step__short">{step.short}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            <AppointmentForm
              key={preselectedService ?? 'default'}
              title={appointmentRequest.formTitle}
              subtitle={appointmentRequest.formSubtitle}
              initialServiceType={preselectedService ?? undefined}
            />
          </div>
        )}
      </div>
    </div>
  )
}
