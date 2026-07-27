'use client'

import { formatEventDate } from '@/lib/eventUtils'

const ACCENT = '#F2760E'

export default function EventCard({ event, onOpen }) {
  return (
    <button onClick={() => onOpen(event)} className="w-56 shrink-0 text-left snap-start">
      <div className="w-full h-32 rounded-lg overflow-hidden bg-neutral-100 mb-2">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 text-center px-3">
            Immagine di copertina non disponibile
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-neutral-800 truncate">{event.title}</p>
      <p className="text-xs text-neutral-500 truncate">{event.location_name}</p>
      <p className="text-xs text-neutral-400 mb-1">{formatEventDate(event)}</p>
      <span className="text-xs font-medium" style={{ color: ACCENT }}>Scopri di più →</span>
    </button>
  )
}
