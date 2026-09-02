import { useEffect, useRef, useState } from 'react'
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

function PatientStories() {
  const carouselSlides = [
    { video: patientStories[patientStories.length - 1], logicalIndex: patientStories.length - 1, key: 'clone-last' },
    ...patientStories.map((video, logicalIndex) => ({ video, logicalIndex, key: `story-${logicalIndex}` })),
    { video: patientStories[0], logicalIndex: 0, key: 'clone-first' },
  ]
  const [activeIndex, setActiveIndex] = useState(2)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLElement | null>>([])
  const scrollFrame = useRef(0)
  const animationFrame = useRef(0)
  const settleTimer = useRef(0)

  const slideTarget = (index: number) => {
    const slide = slideRefs.current[index]
    const track = trackRef.current
    if (!slide || !track) return null
    return slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2
  }

  const centerSlide = (index: number, animate = true) => {
    const boundedIndex = Math.max(0, Math.min(carouselSlides.length - 1, index))
    const track = trackRef.current
    const target = slideTarget(boundedIndex)
    if (!track || target === null) return
    cancelAnimationFrame(animationFrame.current)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setActiveIndex(boundedIndex)
    if (!animate || reduceMotion) {
      track.scrollLeft = target
      return
    }

    const start = track.scrollLeft
    const distance = target - start
    const duration = 720
    const startedAt = performance.now()
    const move = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2
      track.scrollLeft = start + distance * eased
      if (progress < 1) animationFrame.current = requestAnimationFrame(move)
    }
    animationFrame.current = requestAnimationFrame(move)
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => centerSlide(2, false))
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(animationFrame.current)
      window.clearTimeout(settleTimer.current)
    }
  }, [])

  const updateActiveSlide = () => {
    cancelAnimationFrame(scrollFrame.current)
    scrollFrame.current = requestAnimationFrame(() => {
      const track = trackRef.current
      if (!track) return
      const trackCenter = track.scrollLeft + track.clientWidth / 2
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2
        const distance = Math.abs(trackCenter - slideCenter)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })
      setActiveIndex(nearestIndex)
      window.clearTimeout(settleTimer.current)
      settleTimer.current = window.setTimeout(() => {
        if (nearestIndex === 0) centerSlide(carouselSlides.length - 2, false)
        if (nearestIndex === carouselSlides.length - 1) centerSlide(1, false)
      }, 180)
    })
  }

  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      centerSlide(activeIndex - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      centerSlide(activeIndex + 1)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      centerSlide(1)
    }
    if (event.key === 'End') {
      event.preventDefault()
      centerSlide(carouselSlides.length - 2)
    }
  }

  return (
    <section id="stories" className="section stories" aria-labelledby="stories-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="stories-title">Patient stories, brought to life.</h2>
          <p>These working dental video previews show the intended experience. They are stock demonstrations, not Alrata patient testimonials.</p>
        </Reveal>
        <div className="story-carousel-wrap">
          <div
            ref={trackRef}
            className="story-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Patient story previews"
            tabIndex={0}
            onScroll={updateActiveSlide}
            onKeyDown={handleCarouselKeyDown}
          >
            {carouselSlides.map(({ video, logicalIndex, key }, index) => {
              const isActive = index === activeIndex
              const isClone = key.startsWith('clone-')
              return (
                <article
                  key={key}
                  ref={(node) => { slideRefs.current[index] = node }}
                  className={`story-slide ${isActive ? 'story-slide--active' : ''}`}
                  data-position={isActive ? 'center' : index < activeIndex ? 'left' : 'right'}
                  aria-label={isClone ? undefined : `${logicalIndex + 1} of ${patientStories.length}: ${video.title}`}
                  aria-current={isActive && !isClone ? 'true' : undefined}
                  aria-hidden={isClone || undefined}
                >
                  <div className="story-slide-media">
                    {isActive && !isClone && video.media.src ? (
                      <video controls playsInline preload="metadata" poster={video.media.poster} aria-label={video.media.alt}>
                        <source src={video.media.src} type="video/mp4" />
                      </video>
                    ) : (
                      <button type="button" tabIndex={isClone ? -1 : 0} onClick={() => centerSlide(index)} aria-label={`Center ${video.title}`}>
                        <img src={video.media.poster} alt={video.media.alt} loading="lazy" decoding="async" />
                        <span className="story-play" aria-hidden="true"><Play fill="currentColor" size={19} /></span>
                      </button>
                    )}
                    <span className="media-credit">{video.media.credit}</span>
                  </div>
                  <div className="story-slide-copy">
                    <h3>{video.title}</h3>
                    <p className="video-meta">{video.meta}</p>
                    <p>{video.description}</p>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="story-carousel-actions">
            <div className="story-carousel-controls">
              <button type="button" onClick={() => centerSlide(activeIndex - 1)} aria-label="Previous patient story">
                <ChevronLeft />
              </button>
              <span aria-live="polite"><strong>{String(carouselSlides[activeIndex].logicalIndex + 1).padStart(2, '0')}</strong> / {String(patientStories.length).padStart(2, '0')}</span>
              <button type="button" onClick={() => centerSlide(activeIndex + 1)} aria-label="Next patient story">
                <ChevronRight />
              </button>
            </div>
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
  const [featured, ...rest] = services
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="services-title">Find the care you need.</h2>
          <p>Explore treatment options, then talk with the clinic about what is appropriate for your health and goals.</p>
        </Reveal>
        <div className="services-layout">
          <article className="service-feature">
            <MediaPlaceholder media={featured.media} label="Treatment image" />
            <div>
              <h3>{featured.name}</h3>
              <p>{featured.description}</p>
              <a className="text-link" href={featured.href}>View treatment <ArrowRight size={17} /></a>
            </div>
          </article>
          <div className="service-list">
            {rest.map((service) => (
              <article key={service.name} className="service-row">
                <div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
                <a href={service.href} aria-label={`Learn more about ${service.name}`}><ChevronRight /></a>
              </article>
            ))}
          </div>
        </div>
        <a className="button button--outline services-all" href="https://alratadental.com/services/">View all services</a>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section className="section education" aria-labelledby="education-title">
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
        <Reveal className="comparison-placeholder">
          <div><MediaPlaceholder media={resultMedia[0]} label="Illustrative treatment image" /></div>
          <div><MediaPlaceholder media={resultMedia[1]} label="Illustrative smile image" /></div>
          <span className="comparison-line" aria-hidden="true" />
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
            <h2 id="offer-title">{offer.name}</h2>
            <div className="offer-price" aria-label={`${offer.price} offer`}>{offer.price}</div>
          </div>
          <div className="offer-details">
            <p>{offer.description}</p>
            <p className="offer-terms">{offer.availability}</p>
            <a className="button button--primary" href={offer.href}>Ask about this offer <ArrowRight size={18} /></a>
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
