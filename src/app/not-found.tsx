import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="site-container not-found-inner">
        <div className="not-found-copy">
          <p className="not-found-eyebrow">404 / Page not found</p>
          <h1 id="not-found-title">We can’t find that page.</h1>
          <p className="not-found-lead">
            The page may have moved, or the address might be incorrect. Let’s help you find your way back.
          </p>
          <div className="not-found-actions">
            <Link className="button button--light" href="/">
              Back to home <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="text-link text-link--inverse" href="/services">
              Explore services <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <p className="not-found-help">
            Looking for something specific? <Link href="/contacts-us">Contact us</Link>
          </p>
        </div>

        <div className="not-found-art" aria-hidden="true">
          <span className="not-found-number">404</span>
          <svg viewBox="0 0 620 270" fill="none" focusable="false">
            <path d="M15 230C148 91 275 295 392 130C456 40 519 58 605 18" stroke="currentColor" strokeWidth="2" />
            <path d="M36 248C155 126 279 303 414 151C479 79 531 66 612 42" stroke="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  )
}
