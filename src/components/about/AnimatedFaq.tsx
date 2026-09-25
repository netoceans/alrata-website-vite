'use client'

import { Plus, Phone } from 'lucide-react'
import type { AboutFaqItem } from '@/features/about/content'

interface AnimatedFaqProps {
  faqs: AboutFaqItem[]
  phoneDisplay: string
  phoneHref: string
}

const animationOptions: KeyframeAnimationOptions = {
  duration: 360,
  easing: 'cubic-bezier(.22,.72,.24,1)',
}

export default function AnimatedFaq({ faqs, phoneDisplay, phoneHref }: AnimatedFaqProps) {
  const toggleDetails = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    event.preventDefault()
    const summary = event.currentTarget
    const details = summary.parentElement as HTMLDetailsElement | null
    const answer = details?.querySelector<HTMLElement>('.about-faq-answer')
    if (!details || !answer) return

    details.getAnimations().forEach((animation) => animation.cancel())
    answer.getAnimations().forEach((animation) => animation.cancel())

    const startHeight = details.getBoundingClientRect().height
    const summaryHeight = summary.getBoundingClientRect().height
    const closing = details.open

    if (!closing) details.open = true
    const endHeight = closing ? summaryHeight : details.scrollHeight

    details.dataset.animating = 'true'
    details.style.overflow = 'hidden'

    const disclosureAnimation = details.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      animationOptions,
    )

    answer.animate(
      closing
        ? { opacity: [1, 0], transform: ['translateY(0)', 'translateY(-7px)'] }
        : { opacity: [0, 1], transform: ['translateY(-7px)', 'translateY(0)'] },
      { ...animationOptions, duration: closing ? 220 : 300 },
    )

    disclosureAnimation.onfinish = () => {
      if (closing) details.open = false
      details.style.removeProperty('height')
      details.style.removeProperty('overflow')
      delete details.dataset.animating
    }
  }

  return (
    <div className="about-faq">
      {faqs.map((faq) => (
        <details key={faq.id}>
          <summary onClick={toggleDetails}>
            <span>{faq.question}</span>
            <span className="about-faq-icon" aria-hidden="true"><Plus size={20} /></span>
          </summary>
          <div className="about-faq-answer">
            <p>{faq.answer}</p>
            {faq.phoneCta && (
              <a href={phoneHref}><Phone size={16} aria-hidden="true" /> Call {phoneDisplay}</a>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
