'use client'

import Image from 'next/image'
import { ArrowUpRight, ChevronLeft, ChevronRight, MessageSquareQuote, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { contact } from '@/data/clinic'
import type { GoogleReviewsResponse } from '@/types/google-reviews'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="google-review-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => <Star key={index} size={18} fill={index < Math.round(rating) ? 'currentColor' : 'none'} aria-hidden="true" />)}
    </span>
  )
}

export default function GoogleReviews() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<GoogleReviewsResponse>({ status: 'unavailable' })
  const [edges, setEdges] = useState({ start: true, end: true })
  const available = data.status === 'available'

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const controller = new AbortController()
    let started = false
    const load = async () => {
      if (started) return
      started = true
      try {
        const response = await fetch('/api/google-reviews', { cache: 'no-store', signal: controller.signal })
        if (!response.ok) return
        const result: GoogleReviewsResponse = await response.json()
        if (!controller.signal.aborted && result.status === 'available') setData(result)
      } catch { /* The static invitation remains usable, including with JavaScript disabled. */ }
    }
    if (!('IntersectionObserver' in window)) {
      void load()
      return () => controller.abort()
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { observer.disconnect(); void load() }
    }, { rootMargin: '160px' })
    observer.observe(section)
    return () => { observer.disconnect(); controller.abort() }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !available) return
    const update = () => setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2 })
    update()
    track.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => { track.removeEventListener('scroll', update); observer.disconnect() }
  }, [available])

  const move = (direction: number) => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!track || !card) return
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return (
    <section ref={sectionRef} className="google-reviews" aria-labelledby="google-reviews-title">
      <div className="site-container">
        <div className="google-reviews-shell">
          <div className="google-reviews-heading">
            <div>
              <h2 id="google-reviews-title">A little reassurance. A real experience.</h2>
              <div className="google-reviews-summary">
                {available ? <><strong>{data.rating.toFixed(1)}</strong><Stars rating={data.rating} /><span>{data.reviewCount.toLocaleString('en-US')} reviews on</span></> : <span>Discover patient experiences on</span>}
                <span className="google-maps-attribution" translate="no">Google Maps</span>
              </div>
            </div>
            <a className="google-reviews-all" href={available ? data.url : contact.mapHref} target="_blank" rel="noopener noreferrer">Read reviews on Google <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>

          {available ? (
            <div id="google-reviews-track" className="google-reviews-track" ref={trackRef} tabIndex={0}
              role="region" aria-label="Google patient reviews" onKeyDown={(event) => {
                if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                  event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1)
                }
              }}>
              {data.reviews.map((review) => (
                <article className="google-review-card" key={review.id}>
                  <div className="google-review-author">
                    <div className="google-review-avatar">
                      {review.avatarUrl ? <Image unoptimized src={review.avatarUrl} alt="" width={64} height={64} loading="lazy" referrerPolicy="no-referrer" /> : <span className="google-review-initial" aria-hidden="true">{review.author.charAt(0)}</span>}
                      <span className="google-review-badge" aria-hidden="true">G</span>
                    </div>
                    <div>
                      {review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer">{review.author}</a> : <strong>{review.author}</strong>}
                      <time dateTime={review.publishedAt} title={review.relativeDate}>{new Date(review.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' })}</time>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                  <p className="google-review-excerpt" dir="auto">{review.text || 'This patient shared a star rating.'}</p>
                  <a className="google-review-source" href={review.url} target="_blank" rel="noopener noreferrer" aria-label={`Read ${review.author}'s full review on Google Maps`}>Read full review <ArrowUpRight size={13} aria-hidden="true" /></a>
                </article>
              ))}
            </div>
          ) : (
            <div className="google-reviews-invitation">
              <span className="google-reviews-invitation-icon"><MessageSquareQuote size={28} strokeWidth={1.25} aria-hidden="true" /></span>
              <div><p>Good care starts with feeling comfortable.</p><span>Hear from people who have visited our practice.</span></div>
              <a href={contact.mapHref} target="_blank" rel="noopener noreferrer">Explore patient reviews <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          )}

          <div className="google-reviews-footer">
            <p>{available ? <>Selected by Google, ordered by relevance. <a href="https://support.google.com/maps/answer/6230175" target="_blank" rel="noopener noreferrer">About reviews</a></> : 'Your confidence matters to us.'}</p>
            {available && <div className="google-reviews-controls">
              <button type="button" aria-label="Previous reviews" aria-controls="google-reviews-track" disabled={edges.start} onClick={() => move(-1)}><ChevronLeft size={18} aria-hidden="true" /></button>
              <button type="button" aria-label="Next reviews" aria-controls="google-reviews-track" disabled={edges.end} onClick={() => move(1)}><ChevronRight size={18} aria-hidden="true" /></button>
            </div>}
          </div>
          {available && data.attributions.length > 0 && <p className="google-reviews-providers">{data.attributions.map((item, index) => <span key={`${item.name}-${index}`}>{item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a> : item.name}{index < data.attributions.length - 1 ? ' · ' : ''}</span>)}</p>}
        </div>
      </div>
    </section>
  )
}
