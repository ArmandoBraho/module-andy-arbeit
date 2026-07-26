import { useEffect, useState, type MouseEvent } from 'react'
import { whatsappQuickHref } from '../../data/content'

export function WhatsAppButton() {
  const [jumping, setJumping] = useState(false)

  useEffect(() => {
    let intervalId: number | undefined
    const timeoutId = window.setTimeout(() => {
      setJumping(true)
      window.setTimeout(() => setJumping(false), 650)

      intervalId = window.setInterval(() => {
        setJumping(true)
        window.setTimeout(() => setJumping(false), 650)
      }, 10000)
    }, 2000)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.open(whatsappQuickHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <a
      href={whatsappQuickHref}
      onClick={handleClick}
      className={`whatsapp-fab${jumping ? ' whatsapp-fab--jump' : ''}`}
      aria-label="WhatsApp-Chat öffnen"
      title="WhatsApp-Chat öffnen"
    >
      <img
        src="/whatsapp.svg"
        alt=""
        className="whatsapp-fab__icon"
        width={58}
        height={58}
        decoding="async"
      />
    </a>
  )
}
