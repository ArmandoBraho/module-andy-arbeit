import { Button } from '../ui/Button'
import { googleReviewsHref, reviews, reviewsIntro } from '../../data/content'

const HOME_REVIEW_COUNT = 3

function Stars({ rating }: { rating: number }) {
  return (
    <span className="review-card__stars" aria-label={`${rating} von 5 Sternen`}>
      {'★'.repeat(rating)}
      <span aria-hidden="true">{'☆'.repeat(5 - rating)}</span>
    </span>
  )
}

type ReviewsSectionProps = {
  compact?: boolean
}

export function ReviewsSection({ compact = false }: ReviewsSectionProps) {
  const displayedReviews = compact ? reviews.slice(0, HOME_REVIEW_COUNT) : reviews

  return (
    <section
      className={`section${compact ? '' : ' section--alt'}`}
      aria-labelledby={compact ? 'reviews-home-heading' : 'reviews-heading'}
    >
      <div className="container">
        <div className="section__header">
          <h2
            id={compact ? 'reviews-home-heading' : 'reviews-heading'}
            className="section__title"
          >
            {reviewsIntro.title}
          </h2>
          <p className="section__subtitle">
            {compact
              ? 'Ausgewählte Stimmen aus München und Umgebung.'
              : reviewsIntro.subtitle}
          </p>
        </div>

        <div
          className={`reviews-grid${compact ? ' reviews-grid--compact' : ''}`}
        >
          {displayedReviews.map((review) => (
            <article key={review.name} className="review-card">
              <Stars rating={review.rating} />
              <p className="review-card__text">„{review.text}“</p>
              <p className="review-card__author">{review.name}</p>
            </article>
          ))}
        </div>

        <div className="reviews-section__cta">
          <Button
            href={googleReviewsHref}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alle Bewertungen auf Google ansehen
          </Button>
        </div>
      </div>
    </section>
  )
}
