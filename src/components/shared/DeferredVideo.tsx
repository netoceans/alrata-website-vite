'use client'

import { useEffect, useRef, useState } from 'react'
import { getImageProps } from 'next/image'
import type { MediaAsset } from '@/types/content'

// Native video posters load eagerly; attach them only near the viewport.
export default function DeferredVideo({ media }: { media: MediaAsset }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setNearViewport(true)
      observer.disconnect()
    }, { rootMargin: '200px' })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  const { props } = getImageProps({ src: media.poster, alt: media.alt, width: 640, height: 360 })
  return (
    <video ref={ref} controls playsInline preload="none" poster={nearViewport ? props.src : undefined} aria-label={media.alt}>
      {media.src && <source src={media.src} type="video/mp4" />}
    </video>
  )
}
