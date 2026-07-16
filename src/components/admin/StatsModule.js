'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ModuleCard from './ModuleCard'

const CATEGORY_LABEL = {
  borgo: 'Borghi',
  cultura: 'Attrazioni',
  panorama: 'Punti panoramici',
}

export default function StatsModule() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [compareAId, setCompareAId] = useState('')
  const [compareBId, setCompareBId] = useState('')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('poi_stats')
        .select('*')
        .order('total_clicks', { ascending: false })
      if (!error) setStats(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const totalPoi = stats.length
  const totalClicks = stats.reduce((sum, s) => sum + (s.total_clicks || 0), 0)
  const clicks30d = stats.reduce((sum, s) => sum + (s.clicks_last_30d || 0), 0)

  const summary = loading
    ? 'Caricamento...'
    : `${totalPoi} POI · ${totalClicks} click totali · ${clicks30d} negli ultimi 30 giorni`

  const filtered = stats.filter((s) => {
    const matchCat = categoryFilter === 'all' || s.category_id === categoryFilter
    const matchSearch = s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    return matchCat && matchSearch
  })

  const compareA = stats.find((s) => s.id === compareAId)
  const compareB = stats.find((s) => s.id === compareBId)

  return (
    <ModuleCard title="📊 Statistiche" summary={summary} defaultOpen>
      {loading ? (
        <p className="text-sm text-neutral-400">Caricamento statistiche...</p>
      ) : (
        <div className="space-y-6">

          {/* FILTRO CATEGORIA + RICERCA */}
          <div className="flex flex-wrap items-center gap-2">
            {['all', ...Object.keys(CATEGORY_LABEL)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: categoryFilter === cat ? '#F2760E18' : 'transparent',
                  color: categoryFilter === cat ? '#F2760E' : '#8a8a8a',
                  border: '1px solid',
                  borderColor: categoryFilter === cat ? '#F2760E40' : 'transparent',
                }}
              >
                {cat === 'all' ? 'Tutti' : CATEGORY_LABEL[cat]}
              </button>
            ))}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca un luogo..."
              className="ml-auto text-sm border border-black/10 rounded-full px-3 py-1.5 outline-none focus:border-[#F2760E] w-48"
            />
          </div>

          {/* TABELLA GENERALE */}
          {filtered.length === 0 ? (
            <p className="text-sm text-neutral-400">Nessun luogo trovato con questi filtri.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-400 border-b border-black/5">
                  <th className="py-2 font-medium">Luogo</th>
                  <th className="py-2 font-medium">Categoria</th>
                  <th className="py-2 font-medium text-right">Click totali</th>
                  <th className="py-2 font-medium text-right">Ultimi 30gg</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-black/5 last:border-0">
                    <td className="py-2 text-neutral-800">{s.name}</td>
                    <td className="py-2 text-neutral-500">{CATEGORY_LABEL[s.category_id] || s.category_id}</td>
                    <td className="py-2 text-right text-neutral-800">{s.total_clicks}</td>
                    <td className="py-2 text-right text-neutral-500">{s.clicks_last_30d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* CONFRONTO TRA DUE SOGGETTI */}
          <div className="pt-4 border-t border-black/5">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Confronta due luoghi</h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={compareAId}
                onChange={(e) => setCompareAId(e.target.value)}
                className="text-sm border border-black/10 rounded-md px-3 py-2 outline-none focus:border-[#F2760E]"
              >
                <option value="">Seleziona il primo luogo...</option>
                {Object.entries(CATEGORY_LABEL).map(([cat, label]) => (
                  <optgroup key={cat} label={label}>
                    {stats.filter((s) => s.category_id === cat).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <select
                value={compareBId}
                onChange={(e) => setCompareBId(e.target.value)}
                className="text-sm border border-black/10 rounded-md px-3 py-2 outline-none focus:border-[#F2760E]"
              >
                <option value="">Seleziona il secondo luogo...</option>
                {Object.entries(CATEGORY_LABEL).map(([cat, label]) => (
                  <optgroup key={cat} label={label}>
                    {stats.filter((s) => s.category_id === cat).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {compareA && compareB && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[compareA, compareB].map((s, i) => {
                  const other = i === 0 ? compareB : compareA
                  return (
                    <div key={s.id} className="bg-neutral-50 rounded-lg p-4 border border-black/5">
                      <div className="text-xs uppercase tracking-wide text-neutral-400 font-medium mb-1">
                        {CATEGORY_LABEL[s.category_id]}
                      </div>
                      <div className="font-semibold text-neutral-800 mb-3">{s.name}</div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-500">Click totali</span>
                        <span
                          className="font-semibold"
                          style={{ color: s.total_clicks > other.total_clicks ? '#F2760E' : '#404040' }}
                        >
                          {s.total_clicks}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Ultimi 30 giorni</span>
                        <span
                          className="font-semibold"
                          style={{ color: s.clicks_last_30d > other.clicks_last_30d ? '#F2760E' : '#404040' }}
                        >
                          {s.clicks_last_30d}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </ModuleCard>
  )
}
