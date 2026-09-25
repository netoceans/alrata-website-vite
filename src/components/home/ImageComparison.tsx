'use client'

import { useId, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MediaAsset } from '@/types/content'
import Image from 'next/image'

export default function ImageComparison({ before, after, label = 'Before and after image comparison', placeholder = false }: { before: MediaAsset; after: MediaAsset; label?: string; placeholder?: boolean }) {
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
          <Image fill sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 640px" src={after.src ?? after.poster} alt={after.alt} loading="lazy" decoding="async" draggable={false} />
          <span className="comparison-label comparison-label--after">{placeholder ? 'After · preview' : 'After'}</span>
        </div>
        <div className="comparison-image comparison-image--before">
          <Image fill sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 640px" src={before.src ?? before.poster} alt={before.alt} loading="lazy" decoding="async" draggable={false} />
          <span className="comparison-label">{placeholder ? 'Before · preview' : 'Before'}</span>
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
          aria-label={label}
          aria-valuetext={`${position}% before image, ${100 - position}% after image`}
          aria-describedby={descriptionId}
        />
      </div>
      <figcaption className="comparison-caption" id={descriptionId}>
        <span className="comparison-instruction"><ChevronLeft size={14} aria-hidden="true" /><ChevronRight size={14} aria-hidden="true" /> Drag to compare</span>
        <span className="comparison-note">{placeholder ? 'Layout preview — not a patient result' : <>Illustrative comparison<span className="sr-only">—not a matched patient result.</span></>}</span>
        <span className="sr-only">Use the arrow keys to adjust. Home shows the after image; End shows the before image.</span>
      </figcaption>
    </figure>
  )
}
