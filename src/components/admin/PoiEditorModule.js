'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { supabase } from '@/lib/supabaseClient'
import ModuleCard from './ModuleCard'

const CATEGORY_LABEL = {
  borgo: 'Borghi',
  cultura: 'Attrazioni',
  panorama: 'Punti panoramici',
}

export default function PoiEditorModule() {
  const [pois, setPois] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const miniMapContainer = useRef(null)
  const miniMapRef = useRef(null)

  useEffect(() => {
    loadPois()
  }, [])

  async function loadPois() {
    const { data } = await supabase
      .from('poi')
      .select('id, name, category_id, lat, lng, short_desc, cover_image_url, is_published')
      .order('category_id')
      .order('name')
    setPois(data || [])
  }

  function selectPoi(poi) {
    setSelectedId(poi.id)
    setForm({ ...poi })
    setMessage(null)
  }

  useEffect(() => {
    if (!form || !miniMapContainer.current) return
    if (miniMapRef.current) {
      miniMapRef.current.remove()
      miniMapRef.current = null
    }

    const map = new maplibregl.Map({
      container: miniMapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [form.lng, form.lat],
      zoom: 14,
    })
    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    const marker = new maplibregl.Marker({ color: '#F2760E', draggable: true })
      .setLngLat([form.lng, form.lat])
      .addTo(map)

    marker.on('dragend', () => {
      const pos = marker.getLngLat()
      setForm((prev) => ({ ...prev, lat: pos.lat, lng: pos.lng }))
    })

    miniMapRef.current = map
    return () => {
      map.remove()
      miniMapRef.current = null
    }
  }, [selectedId])

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !form) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${form.id}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('poi-photos')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      setMessage({ type: 'error', text: 'Errore caricamento foto: ' + uploadError.message })
      setUploading(false)
      return
    }
    const { data: urlData } = supabase.storage.from('poi-photos').getPublicUrl(path)
    setForm((prev) => ({ ...prev, cover_image_url: urlData.publicUrl }))
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    const { error } = await supabase
      .from('poi')
      .update({
        name: form.name,
        short_desc: form.short_desc,
        lat: form.lat,
        lng: form.lng,
        cover_image_url: form.cover_image_url,
        is_published: form.is_published,
      })
      .eq('id', form.id)
    setSaving(false)
    if (error) {
      setMessage({ type: 'error', text: 'Errore salvataggio: ' + error.message })
      return
    }
    setMessage({ type: 'success', text: 'Salvato correttamente.' })
    loadPois()
  }

  return (
    <ModuleCard
      title="✏️ Modifica punti di interesse"
      summary={`${pois.length} POI nel database — clicca per modificarne uno`}
    >
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <div className="max-h-[500px] overflow-y-auto md:border-r border-black/5 pr-3">

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca un luogo..."
            className="w-full text-sm border border-black/10 rounded-full px-3 py-1.5 outline-none focus:border-[#F2760E] mb-3"
          />

          <div className="flex flex-wrap gap-1.5 mb-4">
            {['all', ...Object.keys(CATEGORY_LABEL)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: categoryFilter === cat ? '#F2760E18' : 'transparent',
                  color: categoryFilter === cat ? '#F2760E' : '#8a8a8a',
                  border: '1px solid',
                  borderColor: categoryFilter === cat ? '#F2760E40' : '#00000014',
                }}
              >
                {cat === 'all' ? 'Tutti' : CATEGORY_LABEL[cat]}
              </button>
            ))}
          </div>

          {Object.entries(CATEGORY_LABEL)
            .filter(([cat]) => categoryFilter === 'all' || categoryFilter === cat)
            .map(([cat, label]) => (
            <div key={cat} className="mb-3">
              <div className="text-xs uppercase tracking-wide text-neutral-400 font-medium mb-1">{label}</div>
              {pois
                .filter((p) => p.category_id === cat)
                .filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                .map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPoi(p)}
                  className={`block w-full text-left text-sm px-2 py-1.5 rounded ${
                    selectedId === p.id ? 'bg-[#F2760E]/10 text-[#F2760E] font-medium' : 'text-neutral-700 hover:bg-black/5'
                  }`}
                >
                  {!p.is_published && '🚫 '}{p.name}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div>
          {!form ? (
            <p className="text-sm text-neutral-400">Seleziona un luogo dalla lista per modificarlo.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Descrizione popup</label>
                <textarea
                  value={form.short_desc || ''}
                  onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
                  rows={4}
                  className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Foto del popup</label>
                <div className="flex items-center gap-3">
                  {form.cover_image_url && (
                    <img src={form.cover_image_url} alt="" className="w-16 h-16 object-cover rounded-md border border-black/10" />
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
                </div>
                {uploading && <p className="text-xs text-neutral-400 mt-1">Caricamento in corso...</p>}
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">
                  Posizione esatta — trascina il marker per correggerla
                </label>
                <div ref={miniMapContainer} className="w-full h-64 rounded-md overflow-hidden border border-black/10" />
                <p className="text-xs text-neutral-400 mt-1">
                  Lat: {form.lat.toFixed(5)} · Lng: {form.lng.toFixed(5)}
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                />
                Visibile sul sito pubblico
              </label>

              {message && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {message.text}
                </p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#F2760E] text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Salvataggio...' : 'Salva modifiche'}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModuleCard>
  )
}
