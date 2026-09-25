'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Expand, Pause, Play, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import type { MediaAsset } from '@/types/content'
import './treatment-gallery.css'

export interface GalleryImage {
  id: string
  media: MediaAsset
  caption: string
}

export default function TreatmentGallery(props: { images: readonly GalleryImage[]; treatmentName: string }) {
  return props.images.length ? <Gallery key={props.images.map(image => image.id).join('|')} {...props} /> : null
}

function Gallery({ images, treatmentName }: { images: readonly GalleryImage[]; treatmentName: string }) {
  const count = images.length
  const [active, setActive] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [modal, setModal] = useState<'grid' | 'viewer' | null>(null)
  const [selected, setSelected] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const back = useRef<HTMLButtonElement>(null)
  const gridButtons = useRef<Array<HTMLButtonElement | null>>([])
  const pointer = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null)
  const suppressClick = useRef(0)
  const wrap = (index: number) => (index + count) % count
  const rotating = autoplay && !reducedMotion && count > 1

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(query.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updateMotion()
    updateVisibility()
    query.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 })
    if (carousel.current) observer.observe(carousel.current)
    return () => {
      query.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!rotating || !visible || !pageVisible || hovered || focused || modal) return
    const timer = window.setInterval(() => setActive(index => (index + 1) % count), 6000)
    return () => window.clearInterval(timer)
  }, [rotating, visible, pageVisible, hovered, focused, modal, count])

  const modalOpen = modal !== null
  useEffect(() => {
    if (!modalOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [modalOpen])

  function navigate(index: number) {
    setAutoplay(false)
    setActive(wrap(index))
  }

  function open(mode: 'grid' | 'viewer') {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setSelected(active)
    setModal(mode)
    dialog.current?.showModal()
  }

  function close() {
    dialog.current?.close()
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const targets: Record<string, number> = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: count - 1 }
    if (event.key in targets) {
      event.preventDefault()
      navigate(targets[event.key])
    }
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current
    if (!start || start.id !== event.pointerId) return
    const dx = Math.abs(event.clientX - start.x)
    const dy = Math.abs(event.clientY - start.y)
    if (!start.dragging && dy > 10 && dy >= dx) { pointer.current = null; return }
    if (dx > 10 && dx > dy * 1.25) {
      start.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current
    pointer.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!start || !start.dragging) return
    suppressClick.current = event.timeStamp + 350
    const dx = event.clientX - start.x
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.25) navigate(active + (dx < 0 ? 1 : -1))
  }

  const previewStart = Math.min(Math.max(active - 1, 0), Math.max(count - 3, 0))
  const selectedImage = images[selected]

  return (
    <section className="section treatment-gallery" aria-labelledby="gallery-title">
      <div className="site-container">
        <div className="section-heading section-heading--split">
          <div><p className="care-eyebrow">A closer look</p><h2 id="gallery-title">Care in focus.</h2></div>
          <p>Explore {treatmentName.toLowerCase()} imagery and a glimpse of our practice. A little closer, from every angle.</p>
        </div>
        <div ref={carousel} className="treatment-carousel" role="region" aria-roledescription="carousel" aria-label={`${treatmentName} photo gallery`} tabIndex={0}
          onKeyDown={keyboard} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
          <div className="treatment-gallery-stage" onPointerDown={event => {
            if (event.isPrimary && event.button === 0) pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false }
          }} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { pointer.current = null }} onLostPointerCapture={() => { pointer.current = null }}
            onClickCapture={event => { if (event.detail !== 0 && event.timeStamp < suppressClick.current) { event.preventDefault(); event.stopPropagation() } }}>
            {images.map((image, index) => {
              const position = index === active ? 'center' : index === wrap(active + 1) ? 'right' : index === wrap(active - 1) ? 'left' : 'hidden'
              return (
                <div key={image.id} className="treatment-gallery-item" data-position={position} aria-hidden={position === 'hidden'} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`}>
                  <button className="treatment-gallery-photo" type="button" tabIndex={position === 'hidden' ? -1 : 0}
                    onClick={() => index === active ? open('viewer') : navigate(index)} aria-label={`${index === active ? 'Enlarge' : 'Show'}: ${image.caption}`} aria-haspopup={index === active ? 'dialog' : undefined}>
                    <Image fill src={image.media.src ?? image.media.poster} alt={image.media.alt} loading="lazy" draggable={false} sizes="(max-width: 700px) 85vw, (max-width: 1280px) 67vw, 830px" />
                    <span className="gallery-slide-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    {index === active && <span className="gallery-expand" aria-hidden="true"><Expand size={19} /></span>}
                  </button>
                </div>
              )
            })}
          </div>
          <div className="gallery-caption-row">
            <p className="gallery-caption">{images[active].caption}</p>
            {count > 1 && <div className="gallery-controls">
              <button className="gallery-round" type="button" aria-label="Previous gallery image" onClick={() => navigate(active - 1)}><ChevronLeft size={20} /></button>
              <span className="gallery-count"><strong>{String(active + 1).padStart(2, '0')}</strong> / {String(count).padStart(2, '0')}</span>
              <button className="gallery-round" type="button" aria-label="Next gallery image" onClick={() => navigate(active + 1)}><ChevronRight size={20} /></button>
              {!reducedMotion && <button className="gallery-round gallery-autoplay" type="button" aria-label={autoplay ? 'Pause automatic gallery rotation' : 'Start automatic gallery rotation'} onClick={() => setAutoplay(value => !value)}>{autoplay ? <Pause size={16} /> : <Play size={16} />}</button>}
            </div>}
          </div>
          <div className="gallery-preview-row">
            <div className="gallery-previews" role="group" aria-label="Choose gallery image">
              {images.slice(previewStart, previewStart + 3).map((image, offset) => {
                const index = previewStart + offset
                return <button key={image.id} type="button" className="gallery-thumbnail" aria-label={`Show photo ${index + 1}: ${image.caption}`} aria-current={index === active ? 'true' : undefined} onClick={() => navigate(index)}>
                  <Image fill src={image.media.src ?? image.media.poster} alt="" sizes="140px" loading="eager" /><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </button>
              })}
            </div>
            <button className="gallery-view-more" type="button" onClick={() => open('grid')} aria-haspopup="dialog"><span>View more<small>Explore the gallery</small></span><ArrowUpRight size={22} /></button>
          </div>
          <p className="sr-only" role="status" aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">Photo {active + 1} of {count}: {images[active].caption}</p>
        </div>
        <p className="gallery-note">Treatment and practice imagery; these photographs do not represent before-and-after patient results.</p>
      </div>
      <dialog ref={dialog} className="gallery-dialog" aria-labelledby="gallery-dialog-title" onClose={() => {
        setModal(null)
        opener.current?.focus({ preventScroll: true })
      }} onClick={event => { if (event.target === event.currentTarget) close() }} onKeyDown={event => {
        if (modal !== 'viewer' || event.altKey || event.ctrlKey || event.metaKey) return
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setSelected(index => wrap(index + (event.key === 'ArrowLeft' ? -1 : 1))) }
      }}>
        <div className="gallery-dialog-shell">
          <header className="gallery-dialog-header"><div><p className="care-eyebrow">A closer look · {count} photographs</p><h2 id="gallery-dialog-title">{treatmentName} gallery</h2></div><button autoFocus type="button" className="gallery-round gallery-close" aria-label="Close gallery" onClick={close}><X size={22} /></button></header>
          <div className="gallery-dialog-content">
            {modal === 'grid' && <div className="gallery-dialog-grid">{images.map((image, index) => <button key={image.id} ref={node => { gridButtons.current[index] = node }} type="button" className="gallery-grid-photo" onClick={() => {
              setSelected(index); setModal('viewer'); requestAnimationFrame(() => back.current?.focus())
            }} aria-label={`Enlarge: ${image.caption}`}><span className="gallery-grid-image"><Image fill src={image.media.src ?? image.media.poster} alt={image.media.alt} sizes="(max-width: 600px) 85vw, (max-width: 900px) 43vw, 340px" loading="lazy" /><span className="gallery-expand" aria-hidden="true"><Expand size={18} /></span></span><span className="gallery-grid-caption"><small>{String(index + 1).padStart(2, '0')}</small>{image.caption}</span></button>)}</div>}
            {modal === 'viewer' && <div className="gallery-viewer">
              <button ref={back} className="gallery-back" type="button" onClick={() => { setModal('grid'); requestAnimationFrame(() => gridButtons.current[selected]?.focus()) }}><ArrowLeft size={17} />Back to gallery</button>
              <div className="gallery-dialog-image"><Image fill src={selectedImage.media.src ?? selectedImage.media.poster} alt={selectedImage.media.alt} sizes="(max-width: 1100px) 90vw, 1050px" /></div>
              <div className="gallery-viewer-footer"><p>{selectedImage.caption}</p><div className="gallery-controls">
                {count > 1 && <button type="button" className="gallery-round" aria-label="Previous enlarged image" onClick={() => setSelected(index => wrap(index - 1))}><ChevronLeft size={20} /></button>}
                <span className="gallery-count">{selected + 1} / {count}</span>
                {count > 1 && <button type="button" className="gallery-round" aria-label="Next enlarged image" onClick={() => setSelected(index => wrap(index + 1))}><ChevronRight size={20} /></button>}
              </div></div>
              <p className="sr-only" role="status">Photo {selected + 1} of {count}: {selectedImage.caption}</p>
            </div>}
          </div>
        </div>
      </dialog>
    </section>
  )
}
