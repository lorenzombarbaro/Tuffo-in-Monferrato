'use client'

import { X } from 'lucide-react'

export default function ContentModal({ title, paragraphs, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
      style={{ background: 'rgba(20,15,10,0.75)' }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}
      >
        <X size={20} color="#ffffff" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full max-h-[80vh] overflow-y-auto"
      >
        <h2 className="font-hero italic text-2xl md:text-3xl text-white mb-6">{title}</h2>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-white/90 leading-relaxed text-[15px] text-justify [text-justify:inter-word] hyphens-auto">{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
