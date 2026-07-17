'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { House, ChevronDown, Search } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const ACCENT = '#F2760E'

// Bandiera a punta (pennant) — disegno originale
function FlagIcon({ size = 16, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V3" />
      <path d="M6 4L17.5 8.5L6 13Z" />
    </svg>
  )
}

// Ruota panoramica — disegno originale
function FerrisWheelIcon({ size = 16, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="7" />
      <path d="M12 3V17" />
      <path d="M5 10H19" />
      <path d="M9 16.5L6.5 22" />
      <path d="M15 16.5L17.5 22" />
      <path d="M5 22H19" />
    </svg>
  )
}

// Binocolo semplificato — due lenti e un ponte, senza dettagli extra
function SimpleBinocularsIcon({ size = 16, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="15" r="4" />
      <circle cx="17" cy="15" r="4" />
      <path d="M7 11V8a2 2 0 0 1 2-2h1" />
      <path d="M17 11V8a2 2 0 0 0-2-2h-1" />
      <path d="M11 15h2" />
    </svg>
  )
}

const MONFERRATO_BOUNDS = [
  [7.85, 44.55],
  [8.75, 45.25],
]

const STYLES = {
  realistico: {
    version: 8,
    sources: {
      esriImagery: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Esri, Maxar, Earthstar Geographics',
      },
    },
    layers: [{ id: 'esriImagery', type: 'raster', source: 'esriImagery' }],
  },
  pianta: 'https://tiles.openfreemap.org/styles/positron',
  acquerello: 'https://tiles.openfreemap.org/styles/liberty',
}

const LAYER_FILTERS = {
  realistico: 'none',
  pianta: 'grayscale(1) contrast(1.3) brightness(1.05)',
  acquerello: 'saturate(1.6) sepia(0.15) contrast(0.9) brightness(1.05) blur(0.4px)',
}

const LAYER_OPTIONS = [
  { key: 'realistico', label: 'Satellitare' },
  { key: 'pianta', label: 'Essenziale' },
  { key: 'acquerello', label: 'Pittografica' },
]

const CATEGORY_LABEL = {
  borgo: 'Borghi',
  cultura: 'Attrazioni',
  panorama: 'Punti panoramici',
}

const CATEGORY_ICON = {
  borgo: FlagIcon,
  cultura: FerrisWheelIcon,
  panorama: SimpleBinocularsIcon,
}

const SHOW_BUSINESS_FILTER = false

function buildPinElement(category) {
  const Icon = CATEGORY_ICON[category] || FlagIcon
  const iconSvg = renderToStaticMarkup(<Icon size={17} color="#ffffff" strokeWidth={2.2} />)
  const el = document.createElement('div')
  el.style.cursor = 'pointer'
  el.innerHTML = `
    <div style="width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
                background:${ACCENT};display:flex;align-items:center;justify-content:center;
                box-shadow:0 3px 8px rgba(0,0,0,0.35);border:2px solid white;">
      <div style="transform:rotate(45deg);">${iconSvg}</div>
    </div>
  `
  return el
}

export default function MapMonferrato() {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const barRef = useRef(null)

  const [layer, setLayer] = useState('realistico')
  const [pois, setPois] = useState([])
  const [activeCats, setActiveCats] = useState(new Set(Object.keys(CATEGORY_LABEL)))
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    async function loadPois() {
      const { data, error } = await supabase
        .from('poi')
        .select('id, name, category_id, lat, lng, short_desc')
        .eq('is_published', true)
      if (error) {
        console.error('Errore caricamento POI:', error.message)
        return
      }
      setPois(data || [])
    }
    loadPois()
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLES.realistico,
      center: [8.3, 44.95],
      zoom: 10,
      pitch: 50,
      bearing: -10,
      maxBounds: MONFERRATO_BOUNDS,
      minZoom: 9,
      maxZoom: 17,
    })
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right')
    mapRef.current = map
    map.on('load', () => {
      applyCanvasFilter(layer)
      renderMarkers()
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(mapContainer.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
    }
  }, [])

  function applyCanvasFilter(layerKey) {
    const map = mapRef.current
    if (!map) return
    const canvas = map.getCanvas()
    if (canvas) {
      canvas.style.filter = LAYER_FILTERS[layerKey]
      canvas.style.transition = 'filter 0.4s ease'
    }
  }

  useEffect(() => {
    applyCanvasFilter(layer)
  }, [layer])

  useEffect(() => {
    function handleClickOutside(e) {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setViewDropdownOpen(false)
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function renderMarkers() {
    const map = mapRef.current
    if (!map) return
    Object.values(markersRef.current).forEach((m) => m.remove())
    markersRef.current = {}
    pois.filter((p) => activeCats.has(p.category_id)).forEach((poi) => {
      const el = buildPinElement(poi.category_id)

      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}`

      const popupHtml = `
        <div style="width:220px;font-family:sans-serif;">
          <div style="height:110px;background:#e5e1d8;border-radius:4px 4px 0 0;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;">
            foto in arrivo
          </div>
          <div style="padding:10px 12px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:${ACCENT};font-weight:600;margin-bottom:2px;">${CATEGORY_LABEL[poi.category_id] || ''}</div>
            <div style="font-weight:700;font-size:15px;margin-bottom:4px;">${poi.name}</div>
            <div style="font-size:12.5px;color:#555;line-height:1.4;margin-bottom:10px;">${poi.short_desc || ''}</div>
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer"
               style="display:block;text-align:center;background:${ACCENT};color:white;font-size:12.5px;
                      font-weight:600;padding:8px;border-radius:6px;text-decoration:none;">
              Portami qui →
            </a>
          </div>
        </div>
      `
      const popup = new maplibregl.Popup({ offset: 22, closeButton: true }).setHTML(popupHtml)
      popup.on('open', () => {
        let sessionId = sessionStorage.getItem('tim_session')
        if (!sessionId) {
          sessionId = Math.random().toString(36).slice(2)
          sessionStorage.setItem('tim_session', sessionId)
        }
        supabase.from('poi_clicks').insert({ poi_id: poi.id, source: 'map', session_id: sessionId })
      })
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([poi.lng, poi.lat])
        .setPopup(popup)
        .addTo(map)
      markersRef.current[poi.id] = marker
    })
  }

  useEffect(() => {
    renderMarkers()
  }, [activeCats, pois])

  function switchLayer(key) {
    setLayer(key)
    setViewDropdownOpen(false)
    const map = mapRef.current
    if (!map) return
    const center = map.getCenter()
    const zoom = map.getZoom()
    const pitch = map.getPitch()
    const bearing = map.getBearing()
    map.setStyle(STYLES[key])
    map.once('styledata', () => {
      map.jumpTo({ center, zoom, pitch, bearing })
      applyCanvasFilter(key)
      renderMarkers()
    })
  }

  function toggleCategory(cat) {
    setActiveCats((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.trim().toLowerCase()
    return pois.filter((p) => p.name.toLowerCase().includes(q))
  }, [searchQuery, pois])

  function goToPoi(poi) {
    const map = mapRef.current
    if (!map) return
    if (!activeCats.has(poi.category_id)) {
      setActiveCats((prev) => new Set(prev).add(poi.category_id))
    }
    map.flyTo({ center: [poi.lng, poi.lat], zoom: 14, pitch: 55, duration: 1400 })
    setTimeout(() => {
      markersRef.current[poi.id]?.togglePopup()
    }, 1450)
    setSearchQuery('')
    setSearchOpen(false)
  }

  function goHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

      <div ref={barRef} className="absolute top-0 left-0 right-0 z-20 bg-white/65 backdrop-blur-lg">
        <div className="flex items-center px-4 h-16 gap-4">

          <button
            onClick={goHome}
            title="Torna alla home"
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors shrink-0"
          >
            <House size={19} strokeWidth={2} color="#404040" />
          </button>

          <div className="flex-1 flex items-center justify-evenly gap-4">

            <div className="relative flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: ACCENT }}>Vista</span>
              <button
                onClick={() => setViewDropdownOpen((v) => !v)}
                className="text-sm font-medium text-neutral-800 flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-black/5 transition-colors"
              >
                {LAYER_OPTIONS.find((o) => o.key === layer)?.label}
                <ChevronDown size={14} className={`text-neutral-400 transition-transform ${viewDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {viewDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-black/5 py-1.5 min-w-[160px] overflow-hidden">
                  {LAYER_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => switchLayer(opt.key)}
                      className="w-full text-left text-sm px-4 py-2.5 hover:bg-black/5 transition-colors"
                      style={{ color: layer === opt.key ? ACCENT : '#404040', fontWeight: layer === opt.key ? 600 : 400 }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {Object.entries(CATEGORY_LABEL).map(([cat, label]) => {
              const Icon = CATEGORY_ICON[cat]
              const active = activeCats.has(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-neutral-700 transition-all"
                  style={{ background: active ? `${ACCENT}18` : 'transparent' }}
                >
                  <Icon size={17} strokeWidth={2} color={active ? ACCENT : '#9a9a9a'} />
                  {label}
                </button>
              )
            })}

            {SHOW_BUSINESS_FILTER && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-neutral-500 hover:bg-black/5 transition-colors">
                Aziende
              </button>
            )}

            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchOpen(true)
                }}
                placeholder="Cerca un luogo..."
                className="text-sm bg-white/70 rounded-full pl-9 pr-4 py-2 w-44 focus:w-56 transition-all outline-none border border-black/5"
              />
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-black/5 py-1.5 min-w-[220px] overflow-hidden">
                  {searchResults.map((poi) => {
                    const Icon = CATEGORY_ICON[poi.category_id] || FlagIcon
                    return (
                      <button
                        key={poi.id}
                        onClick={() => goToPoi(poi)}
                        className="w-full text-left text-sm px-4 py-2.5 hover:bg-black/5 flex items-center gap-2 text-neutral-700"
                      >
                        <Icon size={14} color={ACCENT} />
                        {poi.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
