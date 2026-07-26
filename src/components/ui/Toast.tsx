import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './CloseIcon'

const AUTO_DISMISS_MS = 8000
const EXIT_MS = 220

export type ToastVariant = 'success' | 'error'

type ToastProps = {
  variant: ToastVariant
  message: string
  onClose: () => void
  durationMs?: number
}

export function Toast({
  variant,
  message,
  onClose,
  durationMs = AUTO_DISMISS_MS,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const onCloseRef = useRef(onClose)
  const exitTimeoutRef = useRef<number | null>(null)

  onCloseRef.current = onClose

  const clearExitTimeout = () => {
    if (exitTimeoutRef.current !== null) {
      window.clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }
  }

  const beginExit = () => {
    setIsVisible(false)
    clearExitTimeout()
    exitTimeoutRef.current = window.setTimeout(() => {
      onCloseRef.current()
    }, EXIT_MS)
  }

  useEffect(() => {
    const showFrame = requestAnimationFrame(() => setIsVisible(true))
    const autoDismissId = window.setTimeout(beginExit, durationMs)

    return () => {
      cancelAnimationFrame(showFrame)
      window.clearTimeout(autoDismissId)
      clearExitTimeout()
    }
  }, [durationMs, message, variant])

  return createPortal(
    <div className="toast-region" aria-live="polite" aria-relevant="additions text">
      <div
        className={`toast toast--${variant}${isVisible ? ' toast--visible' : ''}`}
        role={variant === 'error' ? 'alert' : 'status'}
      >
        <p className="toast__message">{message}</p>
        <button
          type="button"
          className="toast__close"
          onClick={beginExit}
          aria-label="Meldung schließen"
        >
          <CloseIcon size={20} />
        </button>
      </div>
    </div>,
    document.body,
  )
}
