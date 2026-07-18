'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const LINKS = [
  { href: '/vivi-il-monferrato', label: 'Vivi il Monferrato' },
  { href: '/conosci-il-progetto', label: 'Conosci il progetto' },
  { href: '/contatti', label: 'Contattaci' },
]

export default function PageMenu() {
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
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
        Menu
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-black/5 py-2 min-w-[190px] z-30">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-black/5 hover:text-[#F2760E] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
