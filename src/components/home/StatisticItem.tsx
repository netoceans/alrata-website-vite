'use client'

import { useEffect, useRef, useState } from 'react'
import type { Statistic } from '@/types/content'

export default function StatisticItem({ stat }: { stat: Statistic }) {
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
    if (reduceMotion) return

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
