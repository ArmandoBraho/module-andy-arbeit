import { useState } from 'react'
import { faqIntro, faqs } from '../../data/content'

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button
        type="button"
        className="faq-item__question"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {question}
      </button>
      <div className="faq-item__content" aria-hidden={!open}>
        <div className="faq-item__content-inner">
          <p className="faq-item__answer">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container">
        <div className="section__header">
          <h2 id="faq-title" className="section__title">
            {faqIntro.title}
          </h2>
          <p className="section__subtitle faq-section__subtitle">{faqIntro.subtitle}</p>
        </div>

        <div className="faq-list">
          {faqs.map((item) => (
            <FaqItem key={item.id} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
