'use client'

import { useEffect, useState } from 'react'
import MapMonferrato from './MapMonferrato'

export default function DesktopMapSection() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (!isDesktop) return null

  return (
    <section id="mappa" className="relative w-full bg-[#14110f]" style={{ minHeight: 'var(--app-height, 100dvh)' }}>
      <MapMonferrato />
    </section>
  )
}
