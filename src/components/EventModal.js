'use client'

import { X } from 'lucide-react'
import { formatEventDate } from '@/lib/eventUtils'

const ACCENT = '#F2760E'

export default function EventModal({ event, onClose }) {
  if (!event) return null
  const directionsUrl = event.lat && event.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
      style={{ background: 'rgba(20,15,10,0.85)' }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}
      >
        <X size={20} color="#ffffff" />
      </button>

      <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full max-h-[85vh] overflow-y-auto bg-white rounded-xl overflow-hidden">
        <div className="w-full h-48 bg-neutral-100">
          {event.cover_image_url ? (
            <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-neutral-400 text-center px-6">
              Immagine di copertina non disponibile
            </div>
          )}
        </div>
        <div className="p-6">
          <h2 className="font-hero italic text-2xl mb-2" style={{ color: ACCENT }}>{event.title}</h2>
          <p className="text-sm text-neutral-500 mb-1">{event.location_name}</p>
          <p className="text-xs text-neutral-400 mb-4">{formatEventDate(event)}</p>
          <p className="text-neutral-600 leading-relaxed mb-6">{event.description}</p>
          {directionsUrl && (
            
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-white text-sm font-semibold py-3 rounded-full"
              style={{ background: ACCENT }}
            >
              Portami qui
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
