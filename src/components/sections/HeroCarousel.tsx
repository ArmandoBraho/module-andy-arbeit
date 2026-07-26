import { useCallback, useEffect, useRef, useState } from 'react'
import { heroCarouselSlides, site } from '../../data/content'
import { Button } from '../ui/Button'

const AUTO_PLAY_MS = 5500
const USER_PAUSE_MS = 10000

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="hero-carousel__arrow-icon"
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

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const resumeTimeoutRef = useRef<number | undefined>(undefined)
  const slideCount = heroCarouselSlides.length

  const pauseThenResume = useCallback(() => {
    setAutoPlay(false)

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setAutoPlay(true)
    }, USER_PAUSE_MS)
  }, [])

  const goToSlide = useCallback(
    (index: number) => {
      pauseThenResume()
      setActiveIndex((index + slideCount) % slideCount)
    },
    [pauseThenResume, slideCount],
  )

  const goToPrevious = useCallback(() => {
    goToSlide(activeIndex - 1)
  }, [activeIndex, goToSlide])

  const goToNext = useCallback(() => {
    goToSlide(activeIndex + 1)
  }, [activeIndex, goToSlide])

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!autoPlay) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(timer)
  }, [autoPlay, slideCount])

  return (
    <section
      className="hero-carousel"
      aria-label="AndyArbeit München – Service rund um Ihr Haus"
      aria-roledescription="Karussell"
    >
      {/* Always exposed to AT/SEO — slide articles use aria-hidden when inactive */}
      <h1 className="visually-hidden">
        AndyArbeit München – Service rund um Ihr Haus
      </h1>
      <div className="hero-carousel__slides">
        {heroCarouselSlides.map((slide, index) => {
          const isActive = index === activeIndex
          const contentPosition =
            'contentPosition' in slide ? slide.contentPosition : undefined
          const slideClassName = [
            'hero-carousel__slide',
            isActive ? 'hero-carousel__slide--active' : '',
            contentPosition === 'right' ? 'hero-carousel__slide--content-right' : '',
            contentPosition === 'bottom' ? 'hero-carousel__slide--content-bottom' : '',
            `hero-carousel__slide--focus-${slide.focus}`,
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <article
              key={slide.title}
              className={slideClassName}
              aria-hidden={!isActive}
            >
              <div className="hero-carousel__media">
                <picture>
                  <source media="(max-width: 767px)" srcSet={slide.srcMobile} />
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="hero-carousel__image"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />
                </picture>
                <div className="hero-carousel__overlay" aria-hidden="true" />
                {isActive && (
                  <>
                    <button
                      type="button"
                      className="hero-carousel__arrow hero-carousel__arrow--prev"
                      onClick={goToPrevious}
                      aria-label="Vorheriges Bild"
                    >
                      <ChevronIcon direction="left" />
                    </button>

                    <button
                      type="button"
                      className="hero-carousel__arrow hero-carousel__arrow--next"
                      onClick={goToNext}
                      aria-label="Nächstes Bild"
                    >
                      <ChevronIcon direction="right" />
                    </button>

                    <div
                      className="hero-carousel__indicators"
                      role="tablist"
                      aria-label="Karussell-Folien"
                    >
                      {heroCarouselSlides.map((indicatorSlide, indicatorIndex) => {
                        const indicatorActive = indicatorIndex === activeIndex

                        return (
                          <button
                            key={indicatorSlide.title}
                            type="button"
                            role="tab"
                            className={`hero-carousel__indicator${
                              indicatorActive ? ' hero-carousel__indicator--active' : ''
                            }`}
                            aria-label={`Folie ${indicatorIndex + 1}: ${indicatorSlide.title}`}
                            aria-selected={indicatorActive}
                            tabIndex={indicatorActive ? 0 : -1}
                            onClick={() => goToSlide(indicatorIndex)}
                          />
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
              <div className="hero-carousel__content">
                <h2 className="hero-carousel__title">{slide.title}</h2>
                <p className="hero-carousel__subtitle">{slide.subtitle}</p>
                <Button href={site.phoneHref} variant="white" className="hero-carousel__cta">
                  Jetzt anrufen
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
