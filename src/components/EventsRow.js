'use client'

import EventCard from './EventCard'

const ACCENT = '#F2760E'

export default function EventsRow({ label, events, onOpen }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-4 px-6">
        <div className="flex-1 h-px bg-black/5" />
        <p className="text-sm font-medium text-center" style={{ color: ACCENT }}>{label}</p>
        <div className="flex-1 h-px bg-black/5" />
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center px-6">
          Al momento non sono previsti appuntamenti in Monferrato per questa categoria, prova a cambiare mood.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2 snap-x">
          {events.map((ev) => <EventCard key={ev.id} event={ev} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  )
}
