'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import { offers } from '@/features/home/content';
import Reveal from '@/components/shared/Reveal';
import MediaPlaceholder from '@/components/shared/MediaPlaceholder';

export default function OfferSection({ backdrop = 'split' }: { backdrop?: 'split' | 'plain' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const pointerStart = useRef<{ id: number; x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const rotationActive =
    autoEnabled && !reducedMotion && !hovered && !focusWithin && pageVisible;

  useEffect(() => {
    if (!rotationActive) return;
    const timer = window.setTimeout(
      () => setActiveIndex((index) => (index + 1) % offers.length),
      6500,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, rotationActive]);

  const goTo = (index: number) =>
    setActiveIndex((index + offers.length) % offers.length);

  const positionFor = (index: number) => {
    if (index === activeIndex) return 'active';
    return index === (activeIndex + 1) % offers.length ? 'next' : 'previous';
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const destinations: Record<string, number> = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: offers.length - 1,
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    goTo(destinations[event.key]);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    pointerStart.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.25)
      goTo(activeIndex + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      id='offers'
      className={`offer-section${backdrop === 'plain' ? ' offer-section--plain' : ''}`}
      aria-labelledby='offer-title'
    >
      <div className='site-container'>
        <Reveal className='offer-carousel-shell'>
          <div
            className='offer-carousel'
            role='region'
            aria-roledescription='carousel'
            aria-label='Current and upcoming offers'
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocusWithin(true)}
            onBlurCapture={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              )
                setFocusWithin(false);
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
          >
            <div
              id='offer-carousel-stage'
              className='offer-carousel-stage'
              data-reduced-motion={reducedMotion || undefined}
            >
              {offers.map((offer, index) => {
                const active = index === activeIndex;
                return (
                  <article
                    key={`${offer.category}-${offer.name}`}
                    className='offer-frame'
                    data-position={positionFor(index)}
                    aria-roledescription='slide'
                    aria-label={`${index + 1} of ${offers.length}: ${offer.name}`}
                    aria-hidden={!active}
                  >
                    <MediaPlaceholder
                      media={offer.media}
                      label='Offer artwork'
                      sizes='(max-width: 960px) calc(100vw - 28px), 560px'
                    />
                    <div className='offer-copy'>
                      <div className='offer-heading'>
                        <p className='offer-eyebrow'>
                          <span aria-hidden='true' /> {offer.category}
                        </p>
                        <h2 id={active ? 'offer-title' : undefined}>
                          {offer.name}
                        </h2>
                        {offer.price ? (
                          <div
                            className='offer-price'
                            aria-label={`${offer.price} offer`}
                          >
                            {offer.price}
                          </div>
                        ) : (
                          <div className='offer-coming-soon'>
                            Details coming soon
                          </div>
                        )}
                      </div>
                      <div className='offer-details'>
                        <p>{offer.description}</p>
                        <p className='offer-terms'>{offer.availability}</p>
                        {!offer.placeholder && offer.href && (
                          <a
                            className='button button--primary'
                            href={offer.href}
                            tabIndex={active ? 0 : -1}
                          >
                            Ask about this offer{' '}
                            <ArrowRight size={18} aria-hidden='true' />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <p
              className='sr-only'
              role='status'
              aria-live={rotationActive ? 'off' : 'polite'}
              aria-atomic='true'
            >
              Offer {activeIndex + 1} of {offers.length}:{' '}
              {offers[activeIndex].name}
            </p>
            <div className='offer-carousel-footer'>
              <span className='offer-count' aria-hidden='true'>
                <strong>{String(activeIndex + 1).padStart(2, '0')}</strong> /{' '}
                {String(offers.length).padStart(2, '0')}
              </span>
              <div className='offer-controls'>
                <button
                  type='button'
                  className='offer-auto-toggle'
                  aria-label={
                    autoEnabled
                      ? 'Pause automatic offer rotation'
                      : 'Start automatic offer rotation'
                  }
                  aria-pressed={!autoEnabled}
                  onClick={() => setAutoEnabled((enabled) => !enabled)}
                >
                  {autoEnabled ? (
                    <Pause aria-hidden='true' />
                  ) : (
                    <Play aria-hidden='true' />
                  )}
                </button>
                <button
                  type='button'
                  className='offer-arrow'
                  aria-label='Previous offer'
                  aria-controls='offer-carousel-stage'
                  onClick={() => goTo(activeIndex - 1)}
                >
                  <ChevronLeft aria-hidden='true' />
                </button>
                <div
                  className='offer-pagination'
                  role='group'
                  aria-label='Choose an offer'
                >
                  {offers.map((offer, index) => (
                    <button
                      key={offer.category}
                      type='button'
                      aria-label={`Go to offer ${index + 1}: ${offer.name}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                      aria-controls='offer-carousel-stage'
                      onClick={() => goTo(index)}
                    >
                      <span />
                    </button>
                  ))}
                </div>
                <button
                  type='button'
                  className='offer-arrow'
                  aria-label='Next offer'
                  aria-controls='offer-carousel-stage'
                  onClick={() => goTo(activeIndex + 1)}
                >
                  <ChevronRight aria-hidden='true' />
                </button>
              </div>
              {/* <p className="offer-hint">Auto-rotates every 6.5 seconds</p> */}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
