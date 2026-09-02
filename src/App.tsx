import { useEffect, useId, useReducer, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  Pause,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react'
import {
  aboutMedia,
  contact,
  educationVideos,
  heroVideo,
  journey,
  offer,
  patientStories,
  resultMedia,
  services,
  statistics,
  team,
  whyMedia,
  type MediaAsset,
  type Statistic,
  type VideoItem,
} from './content'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Our Team', href: '#team' },
  { label: 'Offers', href: '#offers' },
  { label: 'Contact', href: '#contact' },
]

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.visible = 'true'
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <a href="#home" className="logo" aria-label="Alrata Art of Dentistry home">
      <img
        src="https://alratadental.com/wp-content/uploads/2024/08/logo-svg.svg"
        alt="Alrata Art of Dentistry"
        width="228"
        height="78"
        data-inverse-context={inverse || undefined}
      />
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-container header-inner">
        <Logo inverse={!scrolled} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="button button--primary header-book" href={contact.bookingHref}>
          Book appointment
        </a>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>
        <nav aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
          ))}
        </nav>
        <a className="button button--primary" href={contact.bookingHref}>Book appointment</a>
        <a className="mobile-call" href={contact.phoneHref}><Phone size={18} /> {contact.phoneDisplay}</a>
      </div>
    </header>
  )
}

function MediaPlaceholder({ media, label, className = '' }: { media: MediaAsset; label: string; className?: string }) {
  const imageSrc = media.src ?? media.poster
  return (
    <figure className={`media-placeholder media-${media.aspectRatio} ${className}`}>
      <img src={imageSrc} alt={media.alt} loading="lazy" decoding="async" />
      {(media.credit || media.placeholder) && (
        <figcaption className="media-label">
          <span>{media.placeholder ? label : media.credit}</span>
        </figcaption>
      )}
    </figure>
  )
}

function VideoCard({ video, featured = false }: { video: VideoItem; featured?: boolean }) {
  return (
    <article className={`video-card ${featured ? 'video-card--featured' : ''}`}>
      {video.media.src ? (
        <div className="video-poster">
          <video controls playsInline preload="none" poster={video.media.poster} aria-label={video.media.alt}>
            <source src={video.media.src} type="video/mp4" />
          </video>
          {video.media.credit && <span className="media-credit">{video.media.credit}</span>}
        </div>
      ) : (
        <div className="video-poster">
          <MediaPlaceholder media={video.media} label="Video placeholder" />
          <span className="play-mark" aria-hidden="true"><Play fill="currentColor" size={18} /></span>
          <span className="sr-only">Video will be available when clinic media is supplied.</span>
        </div>
      )}
      <div className="video-copy">
        <h3>{video.title}</h3>
        <p className="video-meta">{video.meta}</p>
        <p>{video.description}</p>
      </div>
    </article>
  )
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    void video.play().catch(() => setIsPlaying(false))
  }, [])

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <section id="home" className="hero">
      <div className="hero-media">
        {heroVideo.src ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroVideo.poster}
            aria-label={heroVideo.alt}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={heroVideo.src} type="video/mp4" />
          </video>
        ) : (
          <MediaPlaceholder media={heroVideo} label="Cinematic clinic video" />
        )}
        <button className="hero-media-caption" type="button" onClick={toggleVideo} aria-label={`${isPlaying ? 'Pause' : 'Play'} dental care demonstration video`}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span>{isPlaying ? 'Playing dental care preview' : 'Play dental care preview'}</span>
          <span>Demonstration footage · Pexels</span>
        </button>
      </div>
      <svg className="hero-brush" viewBox="0 0 620 270" fill="none" aria-hidden="true">
        <path d="M15 230C148 91 275 295 392 130C456 40 519 58 605 18" stroke="currentColor" strokeWidth="2" />
        <path d="M36 248C155 126 279 303 414 151C479 79 531 66 612 42" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <h1>Dental care that makes room for confidence.</h1>
          <p>
            Modern dentistry in St. Louis, delivered with clear guidance, personal attention, and respect for your comfort.
          </p>
          <div className="hero-actions">
            <a className="button button--light" href={contact.bookingHref}>Book an appointment <ArrowRight size={18} /></a>
            <a className="text-link text-link--inverse" href="#services">Explore our services <ArrowDown size={17} /></a>
          </div>
          <div className="hero-trust" aria-label="Clinic details">
            <span><MapPin size={17} /> St. Louis, Missouri</span>
            <span><Phone size={17} /> {contact.phoneDisplay}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

type StoryNavigation = { step: -1 | 1 } | { index: number }
type StoryCarouselState = {
  index: number
  fromIndex: number | null
  pending: StoryNavigation | null
  transitionId: number
}
type StoryCarouselAction =
  | { type: 'navigate'; request: StoryNavigation; animate: boolean }
  | { type: 'finish'; transitionId: number; animate: boolean }

function moveStory(state: StoryCarouselState, request: StoryNavigation, animate: boolean): StoryCarouselState {
  const count = patientStories.length
  const target = 'index' in request ? request.index : state.index + request.step
  const index = (target + count) % count
  if (index === state.index) return { ...state, fromIndex: null, pending: null }
  return { index, fromIndex: animate ? state.index : null, pending: null, transitionId: state.transitionId + 1 }
}

function storyCarouselReducer(state: StoryCarouselState, action: StoryCarouselAction): StoryCarouselState {
  if (action.type === 'navigate') {
    // Only the latest request waits behind the current animation.
    if (state.fromIndex !== null) return { ...state, pending: action.request }
    return moveStory(state, action.request, action.animate)
  }
  if (action.transitionId !== state.transitionId || state.fromIndex === null) return state
  return state.pending
    ? moveStory(state, state.pending, action.animate)
    : { ...state, fromIndex: null }
}

function storyPosition(index: number, activeIndex: number) {
  if (index === activeIndex) return 'center'
  return index === (activeIndex + 1) % patientStories.length ? 'right' : 'left'
}

function PatientStories() {
  const [carousel, dispatch] = useReducer(storyCarouselReducer, {
    index: 1, fromIndex: null, pending: null, transitionId: 0,
  })
  const [playerIndex, setPlayerIndex] = useState<number | null>(null)
  const [playbackError, setPlaybackError] = useState('')
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const carouselRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const pointerStart = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null)
  const suppressClickUntil = useRef(0)
  const playRequest = useRef(0)
  const moving = carousel.fromIndex !== null

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!moving) return
    const finish = () => dispatch({ type: 'finish', transitionId: carousel.transitionId, animate: !reducedMotion })
    if (reducedMotion) {
      finish()
      return
    }
    // Fallback for interrupted animations, including background-tab throttling.
    const timer = window.setTimeout(finish, 620)
    return () => window.clearTimeout(timer)
  }, [moving, carousel.transitionId, reducedMotion])

  useEffect(() => {
    const videos = videoRefs.current
    return () => {
      playRequest.current += 1
      videos.forEach((video) => video?.pause())
    }
  }, [])

  const navigate = (request: StoryNavigation) => {
    if (!moving && 'index' in request && request.index === carousel.index) return
    playRequest.current += 1
    videoRefs.current.forEach((video) => {
      if (video === document.activeElement) carouselRef.current?.focus({ preventScroll: true })
      video?.pause()
    })
    setPlayerIndex(null)
    setPlaybackError('')
    dispatch({ type: 'navigate', request, animate: !reducedMotion })
  }

  const playStory = (index: number) => {
    const video = videoRefs.current[index]
    if (!video || moving) return
    const request = ++playRequest.current
    setPlayerIndex(index)
    setPlaybackError('')
    void video.play().catch(() => {
      if (request !== playRequest.current) return
      setPlayerIndex(null)
      setPlaybackError('This preview could not play. Please try again.')
    })
    // The play button becomes hidden; move its keyboard focus into the player.
    video.tabIndex = 0
    video.focus({ preventScroll: true })
  }

  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('video, input, select, textarea, [contenteditable="true"]')) return
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const requests: Record<string, StoryNavigation> = {
      ArrowLeft: { step: -1 }, ArrowRight: { step: 1 }, Home: { index: 0 }, End: { index: patientStories.length - 1 },
    }
    const request = requests[event.key]
    if (!request) return
    event.preventDefault()
    navigate(request)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('video')) return
    pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current
    if (!start || start.id !== event.pointerId) return
    const dx = Math.abs(event.clientX - start.x)
    const dy = Math.abs(event.clientY - start.y)
    if (!start.dragging && dy > 10 && dy >= dx) {
      pointerStart.current = null
      return
    }
    if (dx > 10 && dx > dy * 1.25) {
      start.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current
    pointerStart.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!start || start.id !== event.pointerId || !start.dragging) return
    suppressClickUntil.current = performance.now() + 350
    const dx = event.clientX - start.x
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.25) {
      navigate({ step: dx < 0 ? 1 : -1 })
    }
  }

  return (
    <section id="stories" className="section stories" aria-labelledby="stories-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="stories-title">Patient stories, brought to life.</h2>
          <p>These working dental video previews show the intended experience. They are stock demonstrations, not Alrata patient testimonials.</p>
        </Reveal>
        <div
          ref={carouselRef}
          className="story-carousel-wrap"
          role="region"
          aria-roledescription="carousel"
          aria-label="Patient story previews"
          tabIndex={0}
          onKeyDown={handleCarouselKeyDown}
        >
          <div
            id="story-carousel-stage"
            className="story-carousel"
            data-moving={moving || undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { pointerStart.current = null }}
            onLostPointerCapture={() => { pointerStart.current = null }}
            onClickCapture={(event) => {
              if (event.detail !== 0 && performance.now() < suppressClickUntil.current) {
                event.preventDefault()
                event.stopPropagation()
              }
            }}
          >
            {patientStories.map((video, index) => {
              const isActive = index === carousel.index
              const showPlayer = isActive && playerIndex === index && !moving
              const position = storyPosition(index, carousel.index)
              const from = carousel.fromIndex === null ? undefined : storyPosition(index, carousel.fromIndex)
              return (
                <article
                  key={video.title}
                  className="story-slide"
                  data-position={position}
                  data-from={from}
                  data-animation={moving ? carousel.transitionId % 2 : undefined}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${patientStories.length}: ${video.title}`}
                  aria-current={isActive ? 'true' : undefined}
                  onAnimationEnd={(event) => {
                    if (event.target === event.currentTarget && isActive) {
                      dispatch({ type: 'finish', transitionId: carousel.transitionId, animate: !reducedMotion })
                    }
                  }}
                >
                  <div className="story-slide-media">
                    {video.media.src ? (
                      <video
                        ref={(node) => { videoRefs.current[index] = node }}
                        controls={showPlayer}
                        playsInline
                        preload={isActive ? 'metadata' : 'none'}
                        poster={video.media.poster}
                        aria-label={video.media.alt}
                        aria-hidden={!showPlayer}
                        tabIndex={showPlayer ? 0 : -1}
                        onPlay={(event) => {
                          if (!isActive || moving) event.currentTarget.pause()
                        }}
                      >
                        <source src={video.media.src} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={video.media.poster} alt={video.media.alt} loading="lazy" decoding="async" />
                    )}
                    <button
                      className="story-preview"
                      type="button"
                      hidden={showPlayer}
                      aria-label={`${isActive ? 'Play' : 'Center'} ${video.title}`}
                      aria-disabled={isActive && !video.media.src || undefined}
                      onClick={() => isActive && !moving ? playStory(index) : navigate({ index })}
                    >
                      <span className="story-slide-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <span className="story-play" aria-hidden="true"><Play fill="currentColor" size={23} /></span>
                      <span className="story-preview-label" aria-hidden="true">{isActive ? 'Watch story' : 'Explore story'}</span>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="story-captions">
            {patientStories.map((video, index) => (
              <div key={video.title} className="story-slide-copy" data-active={index === carousel.index} aria-hidden={index !== carousel.index}>
                <div>
                  <h3>{video.title}</h3>
                  <p className="video-meta">{video.meta}</p>
                </div>
                <p className="story-description">{video.description}</p>
                {video.media.credit && <p className="story-credit">{video.media.credit}</p>}
              </div>
            ))}
          </div>
          <p className="sr-only" role="status" aria-atomic="true">
            {!moving && `Story ${carousel.index + 1} of ${patientStories.length}: ${patientStories[carousel.index].title}`}
          </p>
          {playbackError && <p className="story-playback-error" role="alert">{playbackError}</p>}
          <div className="story-carousel-actions">
            <div className="story-carousel-controls">
              <button className="story-arrow" type="button" onClick={() => navigate({ step: -1 })} aria-label="Previous patient story" aria-controls="story-carousel-stage">
                <ChevronLeft />
              </button>
              <div className="story-pagination" role="group" aria-label="Choose patient story">
                {patientStories.map((video, index) => (
                  <button
                    key={video.title}
                    type="button"
                    aria-label={`Go to story ${index + 1}: ${video.title}`}
                    aria-current={index === carousel.index ? 'true' : undefined}
                    aria-controls="story-carousel-stage"
                    onClick={() => navigate({ index })}
                  ><span /></button>
                ))}
              </div>
              <button className="story-arrow" type="button" onClick={() => navigate({ step: 1 })} aria-label="Next patient story" aria-controls="story-carousel-stage">
                <ChevronRight />
              </button>
            </div>
            <span className="story-count" aria-hidden="true"><strong>{String(carousel.index + 1).padStart(2, '0')}</strong> / {String(patientStories.length).padStart(2, '0')}</span>
            <a className="text-link story-more" href="#">View more patient stories <ArrowRight size={17} /></a>
          </div>
        </div>
        <p className="placeholder-note">Production launch requires clinic-approved, consented patient stories in place of this demonstration footage.</p>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section section--platinum" aria-labelledby="about-title">
      <div className="site-container about-grid">
        <Reveal className="about-copy">
          <h2 id="about-title">Care is personal here.</h2>
          <p className="lead">Alrata Art of Dentistry combines modern dental care with a thoughtful, patient-first approach.</p>
          <p>
            The team takes time to explain treatment options and create an environment where questions are welcome. From preventive visits to restorative and cosmetic care, each plan starts with the person in the chair.
          </p>
          <a className="text-link" href="https://alratadental.com/about-us/">Learn about the clinic <ArrowRight size={17} /></a>
        </Reveal>
        <Reveal className="about-media">
          <MediaPlaceholder media={aboutMedia} label="Dental care" />
        </Reveal>
      </div>
      <div className="site-container stats" aria-label="Clinic statistics placeholders">
        {statistics.map((stat) => <StatisticItem key={stat.label} stat={stat} />)}
      </div>
    </section>
  )
}

function StatisticItem({ stat }: { stat: Statistic }) {
  const { ref, displayValue } = useCountUp(stat.value)
  return (
    <div className="stat-item">
      <span ref={ref} className="stat-value">{stat.value === null ? '—' : `${displayValue}${stat.suffix}`}</span>
      <span className="stat-label">{stat.label}</span>
      {stat.value === null && <span className="stat-placeholder">{stat.placeholder}</span>}
    </div>
  )
}

function useCountUp(value: number | null) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(value ?? 0)

  useEffect(() => {
    if (value === null) return
    const node = ref.current
    if (!node) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setDisplayValue(value)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const startedAt = performance.now()
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / 900, 1)
        setDisplayValue(Math.round(value * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) frame = requestAnimationFrame(animate)
      }
      frame = requestAnimationFrame(animate)
      observer.disconnect()
    }, { threshold: 0.5 })
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return { ref, displayValue }
}

function Services() {
  const photoCredits = [...new Set(services.map(({ media }) => media.credit).filter(Boolean))].join(' · ')
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="services-title">Find the care you need.</h2>
          <p>Explore treatment options, then talk with the clinic about what is appropriate for your health and goals.</p>
        </Reveal>
        <div className="services-grid">
          {services.map((service, index) => (
            <a
              key={service.name}
              className="service-card"
              href={service.href}
              aria-labelledby={`service-title-${index}`}
            >
              <div className="service-card-image">
                <img
                  src={service.media.src ?? service.media.poster}
                  alt={service.media.alt}
                  loading="lazy"
                  decoding="async"
                />
                <span className="service-card-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
              </div>
              <div className="service-card-copy">
                <h3 id={`service-title-${index}`}>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="services-footer">
          {photoCredits && <p className="services-credit">Photography: {photoCredits}</p>}
          <a className="button button--outline services-all" href="https://alratadental.com/services/">View all services</a>
        </div>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section className="section education education--gradient" aria-labelledby="education-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split section-heading--inverse">
          <h2 id="education-title">Answers from the dental chair.</h2>
          <p>Short, practical videos can help patients understand common treatments before they arrive.</p>
        </Reveal>
        <div className="education-grid horizontal-mobile">
          {educationVideos.map((video) => <VideoCard key={video.title} video={video} />)}
        </div>
      </div>
    </section>
  )
}

const reasons = [
  { icon: Stethoscope, title: 'Comprehensive dental services', text: 'Preventive, restorative, surgical, orthodontic, and cosmetic options are available through one clinic.' },
  { icon: Sparkles, title: 'A modern clinical setting', text: 'Care is delivered in a clean, contemporary environment designed to help patients feel at ease.' },
  { icon: ShieldCheck, title: 'Personalized care', text: 'Treatment conversations begin with your needs, your questions, and a plan you understand.' },
  { icon: Check, title: 'A skilled and caring team', text: 'The clinic emphasizes professional care, clear communication, and a personal touch.' },
]

function WhyChoose() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="site-container why-grid">
        <Reveal className="why-media">
          <MediaPlaceholder media={whyMedia} label="Dentist and patient" />
        </Reveal>
        <Reveal className="why-copy">
          <h2 id="why-title">Why patients choose Alrata.</h2>
          <div className="reason-list">
            {reasons.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon aria-hidden="true" />
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
          <a className="button button--primary" href={contact.bookingHref}>Schedule a visit</a>
        </Reveal>
      </div>
    </section>
  )
}

function ImageComparison({ before, after }: { before: MediaAsset; after: MediaAsset }) {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const rangeRef = useRef<HTMLInputElement>(null)
  const pointer = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null)
  const descriptionId = useId()

  const updatePosition = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (bounds.width === 0) return
    setPosition(Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))))
  }

  const clearPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointer.current?.id !== event.pointerId) return
    pointer.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <figure className="comparison">
      <div
        className="comparison-frame"
        style={{ '--comparison-position': `${position}%` } as React.CSSProperties}
        data-dragging={dragging || undefined}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0 || pointer.current) return
          const isMouse = event.pointerType === 'mouse'
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: isMouse }
          if (isMouse) {
            event.currentTarget.setPointerCapture(event.pointerId)
            rangeRef.current?.focus({ preventScroll: true })
            setDragging(true)
            updatePosition(event)
          }
        }}
        onPointerMove={(event) => {
          const start = pointer.current
          if (!start || start.id !== event.pointerId) return
          if (!start.dragging) {
            const dx = Math.abs(event.clientX - start.x)
            const dy = Math.abs(event.clientY - start.y)
            // Let vertical gestures scroll the page without moving the divider.
            if (dy > 8 && dy >= dx) {
              clearPointer(event)
              return
            }
            if (dx <= 8 || dx <= dy * 1.25) return
            start.dragging = true
            event.currentTarget.setPointerCapture(event.pointerId)
            rangeRef.current?.focus({ preventScroll: true })
            setDragging(true)
          }
          updatePosition(event)
        }}
        onPointerUp={(event) => {
          const start = pointer.current
          if (!start || start.id !== event.pointerId) return
          const isTap = Math.abs(event.clientX - start.x) <= 8 && Math.abs(event.clientY - start.y) <= 8
          if (start.dragging || isTap) {
            rangeRef.current?.focus({ preventScroll: true })
            updatePosition(event)
          }
          clearPointer(event)
        }}
        onPointerCancel={clearPointer}
        onLostPointerCapture={clearPointer}
      >
        <div className="comparison-image comparison-image--after">
          <img src={after.src ?? after.poster} alt={after.alt} loading="lazy" decoding="async" draggable={false} />
          <span className="comparison-label comparison-label--after">After</span>
        </div>
        <div className="comparison-image comparison-image--before">
          <img src={before.src ?? before.poster} alt={before.alt} loading="lazy" decoding="async" draggable={false} />
          <span className="comparison-label">Before</span>
        </div>
        <span className="comparison-divider" aria-hidden="true" />
        <span className="comparison-handle" aria-hidden="true">
          <ChevronLeft size={20} /><ChevronRight size={20} />
        </span>
        <input
          ref={rangeRef}
          className="comparison-range sr-only"
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(event.currentTarget.valueAsNumber)}
          aria-label="Before and after image comparison"
          aria-valuetext={`${position}% before image, ${100 - position}% after image`}
          aria-describedby={descriptionId}
        />
      </div>
      <figcaption className="comparison-caption" id={descriptionId}>
        <span className="comparison-instruction"><ChevronLeft size={14} aria-hidden="true" /><ChevronRight size={14} aria-hidden="true" /> Drag to compare</span>
        <span className="comparison-note">Illustrative comparison<span className="sr-only">—not a matched patient result.</span></span>
        <span className="sr-only">Use the arrow keys to adjust. Home shows the after image; End shows the before image.</span>
      </figcaption>
    </figure>
  )
}

function Results() {
  return (
    <section className="section results" aria-labelledby="results-title">
      <div className="site-container results-grid">
        <Reveal className="results-copy">
          <h2 id="results-title">Treatment results, shown responsibly.</h2>
          <p>Approved before-and-after photography can help patients understand potential changes while keeping expectations clear and clinical.</p>
          <nav className="result-categories" aria-label="Result categories">
            <span>Veneers</span><span>Whitening</span><span>Clear aligners</span>
          </nav>
          <p className="disclaimer">Illustrative dental imagery only—not a matched patient result. Individual outcomes vary. Final before-and-after imagery requires patient consent and clinical review.</p>
        </Reveal>
        <Reveal className="results-comparison">
          <ImageComparison before={resultMedia[0]} after={resultMedia[1]} />
        </Reveal>
      </div>
    </section>
  )
}

function OfferSection() {
  return (
    <section id="offers" className="offer-section" aria-labelledby="offer-title">
      <div className="site-container offer-frame">
        <MediaPlaceholder media={offer.media} label="Offer treatment image" />
        <Reveal className="offer-copy">
          <div className="offer-heading">
            <p className="offer-eyebrow"><span aria-hidden="true" /> Your first visit</p>
            <h2 id="offer-title">{offer.name}</h2>
            <div className="offer-price" aria-label={`${offer.price} offer`}>{offer.price}</div>
          </div>
          <div className="offer-details">
            <p>{offer.description}</p>
            <p className="offer-terms">{offer.availability}</p>
            <a className="button button--primary" href={offer.href}>Ask about this offer <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Team() {
  return (
    <section id="team" className="section" aria-labelledby="team-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="team-title">Meet the people caring for you.</h2>
          <p>A familiar, approachable team helps make every visit feel more comfortable.</p>
        </Reveal>
        <div className="team-grid horizontal-mobile">
          {team.map((member) => (
            <article key={member.name} className="team-member">
              <MediaPlaceholder media={member.media} label="Team portrait" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.href}>View profile <ArrowRight size={15} /></a>
            </article>
          ))}
        </div>
        <a className="text-link team-all" href="https://alratadental.com/our-team/">Meet the full team <ArrowRight size={17} /></a>
      </div>
    </section>
  )
}

function Journey() {
  return (
    <section className="section journey" aria-labelledby="journey-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="journey-title">Know what comes next.</h2>
          <p>A clear process can take some of the uncertainty out of starting dental care.</p>
        </Reveal>
        <ol className="journey-list">
          {journey.map((step, index) => (
            <li key={step.title}>
              <span className="journey-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="site-container final-cta-grid">
        <div>
          <h2 id="final-cta-title">Your next visit can start with a conversation.</h2>
          <p>Book online or call the clinic. The team will help you understand the next step.</p>
        </div>
        <div className="final-actions">
          <a className="button button--primary" href={contact.bookingHref}><CalendarDays size={18} /> Book your appointment</a>
          <a className="text-link" href={contact.phoneHref}><Phone size={17} /> {contact.phoneDisplay}</a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <Logo inverse />
          <p>Personalized dental care in a welcoming, modern setting in St. Louis, Missouri.</p>
          <a className="button button--light" href={contact.bookingHref}>Book appointment</a>
        </div>
        <div>
          <h2>Services</h2>
          <ul>
            {services.slice(0, 5).map((service) => <li key={service.name}><a href={service.href}>{service.name}</a></li>)}
          </ul>
        </div>
        <div>
          <h2>Clinic</h2>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#team">Our team</a></li>
            <li><a href="#offers">Offers</a></li>
            <li><a href="https://alratadental.com/privacy-policy/">Privacy policy</a></li>
            <li><a href="https://alratadental.com/terms-of-service/">Terms of service</a></li>
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <address>
            <a href={contact.mapHref}><MapPin size={17} /> {contact.address}</a>
            <a href={contact.phoneHref}><Phone size={17} /> {contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}><Mail size={17} /> {contact.email}</a>
          </address>
          <p className="hours-placeholder">Opening hours: confirm with clinic</p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>© {new Date().getFullYear()} Alrata Art of Dentistry</span>
        <span>10038 Manchester Rd #226, St. Louis, MO 63122</span>
      </div>
    </footer>
  )
}

function MobileBookingBar() {
  return (
    <div className="mobile-booking" aria-label="Quick contact">
      <a href={contact.phoneHref}><Phone size={18} /> Call</a>
      <a href={contact.bookingHref}><CalendarDays size={18} /> Book appointment</a>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <PatientStories />
        <About />
        <Services />
        <Education />
        <WhyChoose />
        <Results />
        <OfferSection />
        <Team />
        <Journey />
        <FinalCTA />
      </main>
      <Footer />
      <MobileBookingBar />
    </>
  )
}
