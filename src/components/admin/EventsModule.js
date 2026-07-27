'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { supabase } from '@/lib/supabaseClient'
import ModuleCard from './ModuleCard'
import DatePickerPopover from '@/components/DatePickerPopover'

const ACCENT = '#F2760E'

const CATEGORIES = [
  { key: 'stanco-silenzio', label: "Quando il silenzio delle colline inizia a stancarti un po'." },
  { key: 'rinvia-dieta', label: 'Se non ti senti pronto e vuoi rinviare la dieta al lunedì.' },
  { key: 'uscita-coppia', label: "Quando l'alternativa migliore ti sembra rinviare la vostra uscita di coppia." },
  { key: 'guida-qualcun-altro', label: "Se chiedi a qualcun'altro di guidare al posto tuo." },
  { key: 'scarponi-nuovi', label: 'Se non hai ancora avuto occasione di usare i tuoi scarponi nuovi.' },
]

const EMPTY_FORM = {
  id: null,
  title: '',
  category_key: CATEGORIES[0].key,
  description: '',
  location_name: '',
  lat: 45.0,
  lng: 8.3,
  starts_at: null,
  ends_at: null,
  cover_image_url: null,
}

export default function EventsModule() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  const miniMapContainer = useRef(null)
  const miniMapRef = useRef(null)

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    const { data } = await supabase.from('events').select('*').order('starts_at', { ascending: true })
    setEvents(data || [])
  }

  function selectEvent(ev) {
    setForm({ ...ev })
    setMessage(null)
  }

  function newEvent() {
    setForm({ ...EMPTY_FORM })
    setMessage(null)
  }

  useEffect(() => {
    if (!form || !miniMapContainer.current) return
    if (miniMapRef.current) { miniMapRef.current.remove(); miniMapRef.current = null }

    const map = new maplibregl.Map({
      container: miniMapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [form.lng, form.lat],
      zoom: 12,
    })
    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    const marker = new maplibregl.Marker({ color: ACCENT, draggable: true }).setLngLat([form.lng, form.lat]).addTo(map)
    marker.on('dragend', () => {
      const pos = marker.getLngLat()
      setForm((prev) => ({ ...prev, lat: pos.lat, lng: pos.lng }))
    })
    miniMapRef.current = map
    return () => { map.remove(); miniMapRef.current = null }
  }, [form?.id])

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !form) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${form.id || 'new'}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('event-photos').upload(path, file, { upsert: true })
    if (uploadError) {
      setMessage({ type: 'error', text: 'Errore caricamento foto: ' + uploadError.message })
      setUploading(false)
      return
    }
    const { data: urlData } = supabase.storage.from('event-photos').getPublicUrl(path)
    setForm((prev) => ({ ...prev, cover_image_url: urlData.publicUrl }))
    setUploading(false)
  }

  function handleRemovePhoto() {
    setForm((prev) => ({ ...prev, cover_image_url: null }))
  }

  async function handleSave() {
    if (!form.title.trim() || !form.starts_at) {
      setMessage({ type: 'error', text: 'Titolo e data "Dal" sono obbligatori.' })
      return
    }
    setSaving(true)
    setMessage(null)
    const payload = {
      title: form.title,
      category_key: form.category_key,
      description: form.description,
      location_name: form.location_name,
      lat: form.lat,
      lng: form.lng,
      starts_at: form.starts_at,
      ends_at: form.ends_at,
      cover_image_url: form.cover_image_url,
    }
    let error
    if (form.id) {
      ;({ error } = await supabase.from('events').update(payload).eq('id', form.id))
    } else {
      ;({ error } = await supabase.from('events').insert(payload))
    }
    setSaving(false)
    if (error) {
      setMessage({ type: 'error', text: 'Errore salvataggio: ' + error.message })
      return
    }
    setMessage({ type: 'success', text: 'Salvato correttamente.' })
    setForm(null)
    loadEvents()
  }

  async function handleDelete() {
    if (!form?.id) return
    if (!confirm('Eliminare questo evento?')) return
    await supabase.from('events').delete().eq('id', form.id)
    setForm(null)
    loadEvents()
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <ModuleCard
      title="🎉 Eventi"
      summary={`${events.filter((e) => (e.ends_at || e.starts_at) >= today).length} eventi attivi — clicca per gestirli`}
    >
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <div className="max-h-[500px] overflow-y-auto md:border-r border-black/5 pr-3">
          <button onClick={newEvent} className="w-full text-left text-sm font-medium px-2 py-1.5 rounded mb-3" style={{ color: ACCENT }}>
            + Nuovo evento
          </button>
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="mb-3">
              <div className="text-[11px] text-neutral-400 font-medium mb-1 leading-snug">{cat.label}</div>
              {events.filter((e) => e.category_key === cat.key).map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => selectEvent(ev)}
                  className={`block w-full text-left text-sm px-2 py-1.5 rounded ${form?.id === ev.id ? 'bg-[#F2760E]/10 text-[#F2760E] font-medium' : 'text-neutral-700 hover:bg-black/5'}`}
                >
                  {(ev.ends_at || ev.starts_at) < today && '⏳ '}{ev.title}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div>
          {!form ? (
            <p className="text-sm text-neutral-400">Seleziona un evento dalla lista o creane uno nuovo.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Titolo</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Categoria</label>
                <select
                  value={form.category_key}
                  onChange={(e) => setForm({ ...form, category_key: e.target.value })}
                  className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E]"
                >
                  {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Descrizione (visualizzata nell'anteprima)</label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Immagine di copertina</label>
                <div className="flex items-center gap-3">
                  {form.cover_image_url ? (
                    <img src={form.cover_image_url} alt="" className="w-16 h-16 object-cover rounded-md border border-black/10" />
                  ) : (
                    <div className="w-16 h-16 rounded-md border border-black/10 bg-neutral-100 flex items-center justify-center text-[9px] text-neutral-400 text-center px-1">
                      nessuna immagine
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
                </div>
                {uploading && <p className="text-xs text-neutral-400 mt-1">Caricamento in corso...</p>}
                {form.cover_image_url && (
                  <button type="button" onClick={handleRemovePhoto} className="text-xs text-red-600 hover:underline mt-1.5">
                    Rimuovi foto
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Luogo (nome da mostrare)</label>
                <input
                  type="text"
                  value={form.location_name || ''}
                  onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                  placeholder="Es. Piazza Castello, Moncalvo"
                  className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E] mb-2"
                />
                <p className="text-xs text-neutral-400 mb-2">
                  Trascina il marker per impostare la posizione esatta (usata dal pulsante "Portami qui")
                </p>
                <div ref={miniMapContainer} className="w-full h-56 rounded-md overflow-hidden border border-black/10" />
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Dal</label>
                  <DatePickerPopover value={form.starts_at} onChange={(d) => setForm({ ...form, starts_at: d })} />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Al</label>
                  <DatePickerPopover value={form.ends_at} onChange={(d) => setForm({ ...form, ends_at: d })} />
                </div>
              </div>
              <p className="text-xs text-neutral-400">
                L'evento sparisce automaticamente dal sito il giorno successivo alla data "Al" (o "Dal" se non imposti una fine).
              </p>

              {message && <p className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</p>}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#F2760E] text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Salvataggio...' : 'Salva evento'}
                </button>
                {form.id && (
                  <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">Elimina</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModuleCard>
  )
}
