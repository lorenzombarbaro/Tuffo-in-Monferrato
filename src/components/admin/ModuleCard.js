'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ModuleCard({ title, summary, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-lg shadow-sm border border-black/5 mb-4 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <h2 className="font-semibold text-neutral-800">{title}</h2>
          {summary && <div className="text-sm text-neutral-500 mt-0.5">{summary}</div>}
        </div>
        <ChevronDown size={18} className={`text-neutral-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="border-t border-black/5 px-5 py-5">{children}</div>}
    </div>
  )
}
