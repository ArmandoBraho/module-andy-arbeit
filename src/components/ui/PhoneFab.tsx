import { useEffect, useState } from 'react'
import { site } from '../../data/content'
import { PhoneIcon } from './PhoneIcon'

export function PhoneFab() {
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

  return (
    <a
      href={site.phoneHref}
      className={`phone-fab${jumping ? ' phone-fab--jump' : ''}`}
      aria-label={`Anrufen: ${site.phone}`}
      title={site.phone}
    >
      <span className="phone-fab__icon-wrap" aria-hidden="true">
        <PhoneIcon className="phone-fab__icon" size={26} />
      </span>
      <span className="phone-fab__number">{site.phone}</span>
    </a>
  )
}
