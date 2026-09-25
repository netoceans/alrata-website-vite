'use client'

import { useEffect, useRef } from 'react'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (node.getBoundingClientRect().top <= window.innerHeight) return
    node.dataset.pending = 'true'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          delete node.dataset.pending
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

export default function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
