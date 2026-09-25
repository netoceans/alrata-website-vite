'use client'

import Image from 'next/image'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { heroVideo } from '@/features/home/content'

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!video) return
    const stop = () => { if (motion.matches) video.pause() }
    motion.addEventListener('change', stop)
    // Let the prioritized poster paint before downloading decorative footage.
    const timer = window.setTimeout(() => {
      if (!motion.matches && !connection?.saveData && heroVideo.src) {
        video.src = heroVideo.src
        void video.play().catch(() => setIsPlaying(false))
      }
    }, 1500)
    return () => { window.clearTimeout(timer); motion.removeEventListener('change', stop); video.pause() }
  }, [])

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video || !heroVideo.src) return
    if (video.paused) {
      if (!video.getAttribute('src')) video.src = heroVideo.src
      void video.play().catch(() => setIsPlaying(false))
    } else video.pause()
  }

  return (
    <div className="hero-media">
      <Image className="hero-poster" src={heroVideo.poster} alt={heroVideo.alt} fill sizes="100vw" preload />
      <video ref={videoRef} muted loop playsInline preload="none" aria-label={heroVideo.alt}
        style={{ opacity: isPlaying ? 1 : 0 }}
        onPlaying={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onError={() => setIsPlaying(false)} />
      <button className="hero-media-caption" type="button" onClick={toggleVideo} aria-label={`${isPlaying ? 'Pause' : 'Play'} dental care demonstration video`}>
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        <span>{isPlaying ? 'Playing dental care preview' : 'Play dental care preview'}</span>
        <span>Demonstration footage · Pexels</span>
      </button>
    </div>
  )
}
