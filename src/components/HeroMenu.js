'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const LINKS = [
  { href: '/vivi-il-monferrato', label: 'Vivi il Monferrato' },
  { href: '/contatti', label: 'Contatti' },
  { href: '/chi-siamo', label: 'Chi siamo' },
]

export default function HeroMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="absolute top-6 left-6 z-20 text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-white text-sm font-medium tracking-wide flex items-center gap-1.5 bg-transparent"
      >
        Menu
        <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl py-2 min-w-[190px]">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-black/5 hover:text-[#F2760E] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
