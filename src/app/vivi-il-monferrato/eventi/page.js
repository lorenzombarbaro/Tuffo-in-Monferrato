'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { House, Search } from 'lucide-react'
import PageMenu from '@/components/PageMenu'
import UserMenu from '@/components/UserMenu'
import DatePickerPopover from '@/components/DatePickerPopover'
import EventsRow from '@/components/EventsRow'
import EventModal from '@/components/EventModal'
import { supabase } from '@/lib/supabaseClient'

const CATEGORIES = [
  { key: 'stanco-silenzio', label: "Quando il silenzio delle colline inizia a stancarti un po'." },
  { key: 'rinvia-dieta', label: 'Se non ti senti pronto e vuoi rinviare la dieta a lunedì.' },
  { key: 'uscita-coppia', label: "Quando l'alternativa migliore ti sembra rinviare la vostra uscita di coppia." },
  { key: 'scarponi-nuovi', label: "Se non hai ancora avuto l'occasione di provare i tuoi scarponi nuovi." },
]

export default function EventiPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)
  const [openEvent, setOpenEvent] = useState(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('events').select('*').order('starts_at', { ascending: true })
      const today = new Date().toISOString().slice(0, 10)
      const visible = (data || []).filter((e) => (e.ends_at || e.starts_at) >= today)
      setEvents(visible)
      setLoading(false)
    }
    load()
  }, [])

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.trim().toLowerCase()
    return events.filter((e) => e.title.toLowerCase().includes(q) || (e.location_name || '').toLowerCase().includes(q))
  }, [search, events])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const q = search.trim().toLowerCase()
      const matchSearch = !q || e.title.toLowerCase().includes(q) || (e.location_name || '').toLowerCase().includes(q)
      const end = e.ends_at || e.starts_at
      const matchFrom = !dateFrom || end >= dateFrom
      const matchTo = !dateTo || e.starts_at <= dateTo
      return matchSearch && matchFrom && matchTo
    })
  }, [events, search, dateFrom, dateTo])

  // Verifichiamo se ci sono categorie che hanno almeno un evento visibile
  const visibleCategories = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catEvents = filtered.filter((e) => e.category_key === cat.key)
      return { ...cat, events: catEvents }
    }).filter((cat) => cat.events.length > 0)
  }, [filtered])

  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white px-6 py-5 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors">
            <House size={19} strokeWidth={2} color="#404040" />
          </Link>
          <PageMenu />
        </div>
        <UserMenu />
      </header>

      {/* Barra filtri centrata */}
      <div className="sticky top-[68px] z-20 bg-white/90 backdrop-blur-md border-b border-black/5 px-6 py-3 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-3xl">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => { setSearch(e.target.value); setSearchOpen(true) }}
              placeholder="Cerca evento o luogo..."
              className="w-full text-sm bg-neutral-50 rounded-full pl-9 pr-4 py-2 outline-none border border-black/5 focus:border-[#F2760E]/40"
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-black/5 py-1.5 min-w-[220px] max-h-64 overflow-y-auto z-40">
                {searchResults.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => { setOpenEvent(ev); setSearchOpen(false) }}
                    className="w-full text-left text-sm px-4 py-2.5 hover:bg-black/5 text-neutral-700"
                  >
                    {ev.title} <span className="text-neutral-400">— {ev.location_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>Dal</span>
            <DatePickerPopover value={dateFrom} onChange={setDateFrom} placeholder="—" />
            <span>al</span>
            <DatePickerPopover value={dateTo} onChange={setDateTo} placeholder="—" />
          </div>
        </div>
      </div>

      <div className="py-8">
        {loading ? (
          <p className="text-center text-sm text-neutral-400 py-16">Caricamento eventi...</p>
        ) : visibleCategories.length > 0 ? (
          visibleCategories.map((cat) => (
            <div key={cat.key} className="mb-10">
              <EventsRow
                label={<span className="text-[#F2760E] font-semibold">{cat.label}</span>}
                events={cat.events}
                onOpen={setOpenEvent}
              />
            </div>
          ))
        ) : (
          /* Messaggio mostrato solo se NESSUNA categoria ha eventi */
          <div className="text-center py-16 px-6">
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              Al momento non sono previsti eventi nei pressi del Monferrato, prova a espandere i tuoi orizzonti.
            </p>
          </div>
        )}
      </div>

      <EventModal event={openEvent} onClose={() => setOpenEvent(null)} />
    </main>
  )
}
