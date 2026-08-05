import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { appointmentRequest, services } from '../data/content'
import { AppointmentForm } from '../components/ui/AppointmentForm'
import { InfoIcon } from '../components/ui/InfoIcon'
import { NotfallIcon } from '../components/ui/NotfallIcon'

type Choice = 'appointment' | null

const TOOLTIP_VIEWPORT_MARGIN = 12
const TOOLTIP_MAX_WIDTH_PX = 18 * 16

function getServiceIdFromParams(params: URLSearchParams): string | null {
  const raw = params.get('service') ?? params.get('leistung')
  if (!raw) return null
  return services.some((service) => service.id === raw) ? raw : null
}

function AppointmentStepTip({
  tipId,
  label,
  description,
  isOpen,
  onToggle,
}: {
  tipId: string
  label: string
  description: string
  isOpen: boolean
  onToggle: () => void
}) {
  const tipRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; arrowLeft: number; width: number } | null>(
    null,
  )

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const tip = tipRef.current
      const tooltip = tooltipRef.current
      if (!tip || !tooltip) return

      const tipRect = tip.getBoundingClientRect()
      const availableWidth = Math.max(
        160,
        window.innerWidth - TOOLTIP_VIEWPORT_MARGIN * 2,
      )
      const width = Math.min(TOOLTIP_MAX_WIDTH_PX, availableWidth)

      // Prefer left-aligning with the info button, then clamp into the viewport.
      let viewportLeft = tipRect.left
      if (viewportLeft + width > window.innerWidth - TOOLTIP_VIEWPORT_MARGIN) {
        viewportLeft = window.innerWidth - TOOLTIP_VIEWPORT_MARGIN - width
      }
      if (viewportLeft < TOOLTIP_VIEWPORT_MARGIN) {
        viewportLeft = TOOLTIP_VIEWPORT_MARGIN
      }

      const left = viewportLeft - tipRect.left
      const buttonCenter = tipRect.width / 2
      const arrowLeft = Math.min(
        Math.max(buttonCenter - left - 4, 10),
        width - 18,
      )

      setPosition({ left, arrowLeft, width })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, description])

  return (
    <div className="appointment-step__tip" ref={tipRef}>
      <button
        type="button"
        className={`appointment-step__info${isOpen ? ' appointment-step__info--open' : ''}`}
        aria-expanded={isOpen}
        aria-controls={tipId}
        title={label}
        onClick={onToggle}
      >
        <InfoIcon size={13} />
      </button>
      {isOpen && (
        <div
          id={tipId}
          ref={tooltipRef}
          className="appointment-step__tooltip"
          role="tooltip"
          style={
            position
              ? {
                  left: position.left,
                  width: position.width,
                  ['--tooltip-arrow-left' as string]: `${position.arrowLeft}px`,
                }
              : undefined
          }
        >
          {description}
        </div>
      )}
    </div>
  )
}

export function TerminAnfragenPage() {
  const [searchParams] = useSearchParams()
  const preselectedService = getServiceIdFromParams(searchParams)
  const [choice, setChoice] = useState<Choice>(() =>
    preselectedService ? 'appointment' : null,
  )
  const [openTip, setOpenTip] = useState<number | null>(null)

  useEffect(() => {
    if (preselectedService) {
      setChoice('appointment')
    }
  }, [preselectedService])

  useEffect(() => {
    if (openTip === null) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return

      const tooltip = document.getElementById(`appointment-step-tip-${openTip}`)
      const tipWrap = tooltip?.closest('.appointment-step__tip')
      if (tipWrap && !tipWrap.contains(target)) {
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

              <ol className="appointment-steps appointment-steps--compact">
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
                          <AppointmentStepTip
                            tipId={`appointment-step-tip-${index}`}
                            label={appointmentRequest.stepsInfoLabel}
                            description={step.description}
                            isOpen={isOpen}
                            onToggle={() => setOpenTip(isOpen ? null : index)}
                          />
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
