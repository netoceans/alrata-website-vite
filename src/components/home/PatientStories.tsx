'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { patientStories } from '@/features/home/content'
import Image from 'next/image'
import Reveal from '@/components/shared/Reveal'

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

export default function PatientStories() {
  const [carousel, dispatch] = useReducer(storyCarouselReducer, {
    index: 1, fromIndex: null, pending: null, transitionId: 0,
  })
  const [playerIndex, setPlayerIndex] = useState<number | null>(null)
  const [playbackError, setPlaybackError] = useState('')
  const [reducedMotion, setReducedMotion] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const pointerStart = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null)
  const suppressClickUntil = useRef(0)
  const playRequest = useRef(0)
  const moving = carousel.fromIndex !== null

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
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
    suppressClickUntil.current = event.timeStamp + 350
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
              if (event.detail !== 0 && event.timeStamp < suppressClickUntil.current) {
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
                <div
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
                    <Image fill sizes="(max-width: 767px) 78vw, 640px" src={video.media.poster} alt={video.media.alt} />
                    {video.media.src ? (
                      <video
                        ref={(node) => { videoRefs.current[index] = node }}
                        controls={showPlayer}
                        playsInline
                        preload="none"
                        style={{ opacity: showPlayer ? 1 : 0, pointerEvents: showPlayer ? 'auto' : 'none' }}
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
                      <Image fill sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 640px" src={video.media.poster} alt={video.media.alt} loading="lazy" decoding="async" />
                    )}
                    <button
                      className="story-preview"
                      type="button"
                      hidden={showPlayer}
                      aria-label={`${String(index + 1).padStart(2, '0')} ${isActive ? 'Watch story' : 'Explore story'}: ${video.title}`}
                      aria-disabled={isActive && !video.media.src || undefined}
                      onClick={() => isActive && !moving ? playStory(index) : navigate({ index })}
                    >
                      <span className="story-slide-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <span className="story-play" aria-hidden="true"><Play fill="currentColor" size={23} /></span>
                      <span className="story-preview-label" aria-hidden="true">{isActive ? 'Watch story' : 'Explore story'}</span>
                    </button>
                  </div>
                </div>
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
