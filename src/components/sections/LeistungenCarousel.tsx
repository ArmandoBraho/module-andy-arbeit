import { useCallback, useEffect, useRef, useState, type TransitionEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { services } from '../../data/content'
import { ServiceIcon } from '../ui/ServiceIcon'

const AUTO_PLAY_MS = 7000
const USER_PAUSE_MS = 10000
const SLIDE_LOCK_MS = 1500

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
    // Explicit horizontal % keeps the subject fixed in the media column
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

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function realIndexFromTrack(trackIndex: number, galleryLength: number) {
  if (galleryLength <= 1) return 0
  if (trackIndex === 0) return galleryLength - 1
  if (trackIndex === galleryLength + 1) return 0
  return trackIndex - 1
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
  const slideLockRef = useRef(false)
  const slideFailsafeRef = useRef<number | undefined>(undefined)
  const trackIndexRef = useRef(1)
  const [autoPlay, setAutoPlay] = useState(true)
  const [activeIndex, setActiveIndex] = useState(() =>
    getIndexForId(getServiceIdFromHash(location.hash) ?? services[0].id),
  )
  const [trackIndex, setTrackIndex] = useState(1)
  const [animateTrack, setAnimateTrack] = useState(true)
  const [isSliding, setIsSliding] = useState(false)

  trackIndexRef.current = trackIndex

  const activeService = services[activeIndex]
  const gallery = activeService.gallery
  const galleryLength = gallery.length
  const hasMultipleImages = galleryLength > 1
  const activeImageIndex = realIndexFromTrack(trackIndex, galleryLength)

  const trackSlides =
    galleryLength > 1
      ? [gallery[galleryLength - 1], ...gallery, gallery[0]]
      : [...gallery]

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

  const clearSlideFailsafe = useCallback(() => {
    if (slideFailsafeRef.current) {
      window.clearTimeout(slideFailsafeRef.current)
      slideFailsafeRef.current = undefined
    }
  }, [])

  const unlockSlide = useCallback(() => {
    clearSlideFailsafe()
    slideLockRef.current = false
    setIsSliding(false)
  }, [clearSlideFailsafe])

  const enableTrackAnimationAfterPaint = useCallback((onDone?: () => void) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setAnimateTrack(true)
        onDone?.()
      })
    })
  }, [])

  const jumpTrackWithoutAnimation = useCallback(
    (nextIndex: number, onDone?: () => void) => {
      setAnimateTrack(false)
      setTrackIndex(nextIndex)
      trackIndexRef.current = nextIndex
      enableTrackAnimationAfterPaint(onDone)
    },
    [enableTrackAnimationAfterPaint],
  )

  const resetTrackForCategory = useCallback(() => {
    clearSlideFailsafe()
    slideLockRef.current = false
    setIsSliding(false)
    const nextIndex = galleryLength > 1 ? 1 : 0
    jumpTrackWithoutAnimation(nextIndex)
  }, [clearSlideFailsafe, galleryLength, jumpTrackWithoutAnimation])

  const goToCategory = useCallback(
    (index: number) => {
      if (slideLockRef.current || isSliding) return
      pauseThenResume()
      const normalized = (index + services.length) % services.length
      setActiveIndex(normalized)
      syncHash(normalized)
    },
    [isSliding, pauseThenResume, syncHash],
  )

  const goToTrackIndex = useCallback(
    (nextTrackIndex: number) => {
      if (!hasMultipleImages || slideLockRef.current) return

      if (prefersReducedMotion()) {
        let normalized = nextTrackIndex
        if (normalized > galleryLength) normalized = 1
        if (normalized < 1) normalized = galleryLength
        jumpTrackWithoutAnimation(normalized)
        return
      }

      slideLockRef.current = true
      setIsSliding(true)
      setAnimateTrack(true)
      setTrackIndex(nextTrackIndex)
      trackIndexRef.current = nextTrackIndex
      clearSlideFailsafe()
      slideFailsafeRef.current = window.setTimeout(() => {
        const idx = trackIndexRef.current
        if (idx === galleryLength + 1) {
          jumpTrackWithoutAnimation(1, unlockSlide)
        } else if (idx === 0) {
          jumpTrackWithoutAnimation(galleryLength, unlockSlide)
        } else {
          unlockSlide()
        }
      }, SLIDE_LOCK_MS)
    },
    [
      clearSlideFailsafe,
      galleryLength,
      hasMultipleImages,
      jumpTrackWithoutAnimation,
      unlockSlide,
    ],
  )

  const goToPreviousImage = useCallback(() => {
    if (slideLockRef.current || isSliding) return
    pauseThenResume()
    goToTrackIndex(trackIndex - 1)
  }, [goToTrackIndex, isSliding, pauseThenResume, trackIndex])

  const goToNextImage = useCallback(() => {
    if (slideLockRef.current || isSliding) return
    pauseThenResume()
    goToTrackIndex(trackIndex + 1)
  }, [goToTrackIndex, isSliding, pauseThenResume, trackIndex])

  const goToImage = useCallback(
    (imageIndex: number) => {
      if (slideLockRef.current || isSliding) return
      pauseThenResume()
      const normalized = (imageIndex + galleryLength) % galleryLength
      if (normalized === activeImageIndex) return
      goToTrackIndex(normalized + 1)
    },
    [activeImageIndex, galleryLength, goToTrackIndex, isSliding, pauseThenResume],
  )

  const handleTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return
      if (event.propertyName !== 'transform') return
      if (!hasMultipleImages) return

      const idx = trackIndexRef.current

      if (idx === galleryLength + 1) {
        jumpTrackWithoutAnimation(1, unlockSlide)
        return
      }

      if (idx === 0) {
        jumpTrackWithoutAnimation(galleryLength, unlockSlide)
        return
      }

      unlockSlide()
    },
    [galleryLength, hasMultipleImages, jumpTrackWithoutAnimation, unlockSlide],
  )

  useEffect(() => {
    setActiveIndex(getIndexForId(getServiceIdFromHash(location.hash) ?? services[0].id))
  }, [location.hash])

  useEffect(() => {
    resetTrackForCategory()
  }, [activeService.id, resetTrackForCategory])

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current)
      }
      if (slideFailsafeRef.current) {
        window.clearTimeout(slideFailsafeRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!autoPlay || !hasMultipleImages || isSliding) return

    const timer = window.setInterval(() => {
      goToTrackIndex(trackIndex + 1)
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(timer)
  }, [autoPlay, goToTrackIndex, hasMultipleImages, isSliding, trackIndex])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!hasMultipleImages || isSliding) return

      if (event.key === 'ArrowLeft') {
        goToPreviousImage()
      } else if (event.key === 'ArrowRight') {
        goToNextImage()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goToNextImage, goToPreviousImage, hasMultipleImages, isSliding])

  return (
    <div
      className={`leistungen-carousel leistungen-carousel--viewport${
        isSliding ? ' leistungen-carousel--sliding' : ''
      }`}
      aria-busy={isSliding}
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
              disabled={isSliding}
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
        <div
          key={activeService.id}
          className={`leistungen-carousel__track${
            animateTrack ? '' : ' leistungen-carousel__track--no-anim'
          }`}
          style={{
            width: `${trackSlides.length * 100}%`,
            transform: `translate3d(-${(trackIndex * 100) / trackSlides.length}%, 0, 0)`,
          }}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {trackSlides.map((image, index) => {
            const photoIndex = realIndexFromTrack(index, galleryLength)
            const mediaSide = photoIndex % 2 === 0 ? 'right' : 'left'
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
              key={`${activeService.id}-${image.src}-${index}`}
              className={[
                'leistungen-carousel__slide',
                'service-card',
                'service-card--expanded',
                layoutClass,
              ].join(' ')}
              style={{ width: `${100 / trackSlides.length}%` }}
              aria-hidden={photoIndex !== activeImageIndex}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="leistungen-carousel__slide-image leistungen-carousel__slide-image--media"
                style={imageStyle}
                draggable={false}
              />
              <div className="leistungen-carousel__slide-text-bg" aria-hidden="true">
                <img
                  src={image.src}
                  alt=""
                  className="leistungen-carousel__slide-image leistungen-carousel__slide-image--text"
                  style={textBgStyle}
                  draggable={false}
                />
              </div>

              <div className="leistungen-carousel__media" aria-hidden="true" />

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
                    disabled={isSliding}
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
              disabled={isSliding}
            >
              <ChevronIcon direction="left" />
            </button>

            <button
              type="button"
              className="leistungen-carousel__arrow leistungen-carousel__arrow--next"
              onClick={goToNextImage}
              aria-label="Nächstes Bild"
              disabled={isSliding}
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
