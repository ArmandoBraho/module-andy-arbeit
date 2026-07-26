import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { services } from '../../data/content'
import { ServiceIcon } from '../ui/ServiceIcon'

const AUTO_PLAY_MS = 7000
const USER_PAUSE_MS = 10000

type ServiceId = (typeof services)[number]['id']
type GalleryItem = (typeof services)[number]['gallery'][number]

function getServiceIdFromHash(hash: string): ServiceId | null {
  const id = hash.replace(/^#/, '')
  return services.some((service) => service.id === id) ? (id as ServiceId) : null
}

function getIndexForId(id: ServiceId): number {
  const index = services.findIndex((service) => service.id === id)
  return index >= 0 ? index : 0
}

function getImageStyle(image: GalleryItem, mediaSide: 'left' | 'right') {
  const raw =
    'objectPosition' in image && typeof image.objectPosition === 'string'
      ? image.objectPosition.trim()
      : null

  if (raw) {
    const [x, y = 'center'] = raw.split(/\s+/)
    if (x.includes('%')) {
      return {
        objectFit: 'cover' as const,
        objectPosition: `${x} ${y}`,
      }
    }

    return {
      objectFit: 'cover' as const,
      objectPosition: `${mediaSide} ${y}`,
    }
  }

  return {
    objectFit: 'cover' as const,
    objectPosition: `${mediaSide} center`,
  }
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="leistungen-carousel__arrow-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LeistungenCarousel() {
  const location = useLocation()
  const navigate = useNavigate()
  const resumeTimeoutRef = useRef<number | undefined>(undefined)
  const [autoPlay, setAutoPlay] = useState(true)
  const [activeIndex, setActiveIndex] = useState(() =>
    getIndexForId(getServiceIdFromHash(location.hash) ?? services[0].id),
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const activeService = services[activeIndex]
  const gallery = activeService.gallery
  const galleryLength = gallery.length
  const hasMultipleImages = galleryLength > 1

  const pauseThenResume = useCallback(() => {
    setAutoPlay(false)

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setAutoPlay(true)
    }, USER_PAUSE_MS)
  }, [])

  const syncHash = useCallback(
    (index: number) => {
      const service = services[index]
      navigate(`/leistungen#${service.id}`, { replace: true })
    },
    [navigate],
  )

  const goToCategory = useCallback(
    (index: number) => {
      pauseThenResume()
      const normalized = (index + services.length) % services.length
      setActiveIndex(normalized)
      setActiveImageIndex(0)
      syncHash(normalized)
    },
    [pauseThenResume, syncHash],
  )

  const goToImage = useCallback(
    (imageIndex: number) => {
      if (!hasMultipleImages) return
      pauseThenResume()
      setActiveImageIndex((imageIndex + galleryLength) % galleryLength)
    },
    [galleryLength, hasMultipleImages, pauseThenResume],
  )

  const goToPreviousImage = useCallback(() => {
    goToImage(activeImageIndex - 1)
  }, [activeImageIndex, goToImage])

  const goToNextImage = useCallback(() => {
    goToImage(activeImageIndex + 1)
  }, [activeImageIndex, goToImage])

  useEffect(() => {
    setActiveIndex(getIndexForId(getServiceIdFromHash(location.hash) ?? services[0].id))
    setActiveImageIndex(0)
  }, [location.hash])

  useEffect(() => {
    setActiveImageIndex(0)
  }, [activeService.id])

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(min-width: 768px)').matches) {
      return
    }

    const activeTab = document.querySelector<HTMLElement>(
      '.leistungen-carousel__indicator--active',
    )
    activeTab?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeIndex])

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!autoPlay || !hasMultipleImages) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % galleryLength)
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(timer)
  }, [autoPlay, galleryLength, hasMultipleImages])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!hasMultipleImages) return

      if (event.key === 'ArrowLeft') {
        goToPreviousImage()
      } else if (event.key === 'ArrowRight') {
        goToNextImage()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goToNextImage, goToPreviousImage, hasMultipleImages])

  return (
    <div
      className="leistungen-carousel leistungen-carousel--viewport"
      aria-label="Leistungsübersicht"
      aria-roledescription="Karussell"
    >
      <div
        className="leistungen-carousel__indicators"
        role="tablist"
        aria-label="Leistungskategorien"
      >
        {services.map((service, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              className={`leistungen-carousel__indicator${
                isActive ? ' leistungen-carousel__indicator--active' : ''
              }`}
              aria-label={`${service.title}${isActive ? ' (aktiv)' : ''}`}
              aria-selected={isActive}
              title={service.title}
              onClick={() => goToCategory(index)}
            >
              <span className="leistungen-carousel__indicator-icon" aria-hidden="true">
                <ServiceIcon serviceId={service.id} size={18} />
              </span>
              <span className="leistungen-carousel__indicator-label">{service.title}</span>
            </button>
          )
        })}
      </div>

      <div className="leistungen-carousel__stage">
        <div className="leistungen-carousel__slides" key={activeService.id}>
          {gallery.map((image, index) => {
            const isActive = index === activeImageIndex
            const mediaSide = index % 2 === 0 ? 'right' : 'left'
            const layoutClass =
              mediaSide === 'left'
                ? 'leistungen-carousel__slide--media-left'
                : 'leistungen-carousel__slide--media-right'
            const imageStyle = getImageStyle(image, mediaSide)
            const textBgStyle = getImageStyle(
              image,
              mediaSide === 'left' ? 'right' : 'left',
            )

            return (
              <article
                key={`${activeService.id}-${image.src}`}
                className={[
                  'leistungen-carousel__slide',
                  'service-card',
                  'service-card--expanded',
                  layoutClass,
                  isActive ? 'leistungen-carousel__slide--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden={!isActive}
              >
                <div className="leistungen-carousel__media">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="leistungen-carousel__slide-image leistungen-carousel__slide-image--media"
                    style={imageStyle}
                    draggable={false}
                  />
                </div>

                <div className="leistungen-carousel__slide-text-bg" aria-hidden="true">
                  <img
                    src={image.src}
                    alt=""
                    className="leistungen-carousel__slide-image leistungen-carousel__slide-image--text"
                    style={textBgStyle}
                    draggable={false}
                  />
                </div>

                <div className="leistungen-carousel__text">
                  <div className="leistungen-carousel__copy">
                    <div className="service-card__heading">
                      <div className="service-card__icon" aria-hidden="true">
                        <ServiceIcon serviceId={activeService.id} size={24} />
                      </div>
                      <h2 className="service-card__title">{activeService.title}</h2>
                    </div>
                    <p className="leistungen-carousel__lead">{image.caption}</p>
                    <p className="leistungen-carousel__body">{image.body}</p>
                    <Link
                      to={`/termin-anfragen?service=${activeService.id}`}
                      className="btn btn--primary leistungen-carousel__cta"
                      tabIndex={isActive ? 0 : -1}
                    >
                      Jetzt anfragen
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {hasMultipleImages && (
          <>
            <div
              className="leistungen-carousel__image-dots"
              role="tablist"
              aria-label={`Bilder: ${activeService.title}`}
            >
              {gallery.map((item, index) => {
                const isActive = index === activeImageIndex

                return (
                  <button
                    key={item.src}
                    type="button"
                    role="tab"
                    className={`leistungen-carousel__image-dot${
                      isActive ? ' leistungen-carousel__image-dot--active' : ''
                    }`}
                    aria-label={`Bild ${index + 1}: ${item.alt}`}
                    aria-selected={isActive}
                    onClick={() => goToImage(index)}
                  />
                )
              })}
            </div>

            <button
              type="button"
              className="leistungen-carousel__arrow leistungen-carousel__arrow--prev"
              onClick={goToPreviousImage}
              aria-label="Vorheriges Bild"
            >
              <ChevronIcon direction="left" />
            </button>

            <button
              type="button"
              className="leistungen-carousel__arrow leistungen-carousel__arrow--next"
              onClick={goToNextImage}
              aria-label="Nächstes Bild"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
