'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { House, ChevronDown, Search, Binoculars } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { SquareLock } from '@/components/icons/LockIcons'
import UserMenu from '@/components/UserMenu'

const ACCENT = '#F2760E'

function TowerIcon({ size = 16, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22V9" />
      <path d="M19 22V9" />
      <path d="M5 22H19" />
      <path d="M5 9V6H8V4H10V6H14V4H16V6H19V9" />
      <path d="M10 22v-4a2 2 0 0 1 4 0v4" />
    </svg>
  )
}

function ColumnCapitalIcon({ size = 16, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4H20" />
      <path d="M4 7H20" />
      <path d="M6 7L9 11H15L18 7" />
      <path d="M9 11V21" />
      <path d="M15 11V21" />
      <path d="M6 21H18" />
    </svg>
  )
}

const HEART_OUTLINE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
const HEART_FILLED = `<svg width="18" height="18" viewBox="0 0 24 24" fill="${ACCENT}" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`

const MONFERRATO_BOUNDS = [[7.85, 44.55], [8.75, 45.25]]

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
  { key: 'realistico', label: 'Satellitare', locked: false },
  { key: 'acquerello', label: 'Topografica', locked: true },
  { key: 'pianta', label: 'Amministrativa', locked: true },
]

const CATEGORY_LABEL = { borgo: 'Borghi', cultura: 'Attrazioni', panorama: 'Punti panoramici' }
const CATEGORY_ICON = { borgo: TowerIcon, cultura: ColumnCapitalIcon, panorama: Binoculars }
const SHOW_BUSINESS_FILTER = false

function buildPinElement(category) {
  const Icon = CATEGORY_ICON[category] || TowerIcon
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

function ViewDropdown({ layer, viewDropdownOpen, setViewDropdownOpen, switchLayer, session }) {
  function handleClick(opt) {
    if (opt.locked && !session) {
      setViewDropdownOpen(false)
      window.dispatchEvent(new CustomEvent('open-user-menu'))
      return
    }
    switchLayer(opt.key)
  }

  return (
    <div className="relative flex items-center gap-2 shrink-0">
      <span className="hidden sm:inline text-xs uppercase tracking-wide font-semibold" style={{ color: ACCENT }}>Vista</span>
      <button
        onClick={() => setViewDropdownOpen((v) => !v)}
        className="text-sm font-medium text-neutral-800 flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md hover:bg-black/5 transition-colors"
      >
        {LAYER_OPTIONS.find((o) => o.key === layer)?.label}
        <ChevronDown size={14} className={`text-neutral-400 transition-transform ${viewDropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      {viewDropdownOpen && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-black/5 py-1.5 min-w-[190px] overflow-hidden z-40">
          {LAYER_OPTIONS.map((opt) => {
            const isLockedForUser = opt.locked && !session
            return (
              <button
                key={opt.key}
                onClick={() => handleClick(opt)}
                className="w-full flex items-center justify-between text-left text-sm px-4 py-2.5 hover:bg-black/5 transition-colors"
                style={{ color: layer === opt.key ? ACCENT : isLockedForUser ? '#b0b0b0' : '#404040', fontWeight: layer === opt.key ? 600 : 400 }}
              >
                {opt.label}
                {isLockedForUser && <SquareLock size={14} color="#b0b0b0" strokeWidth={2} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SearchBox({ searchQuery, setSearchQuery, searchOpen, setSearchOpen, searchResults, goToPoi }) {
  return (
    <div className="relative flex items-center shrink-0 flex-1 sm:flex-none">
      <Search size={15} className="absolute left-3 text-neutral-400 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onFocus={() => setSearchOpen(true)}
        onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
        placeholder="Cerca..."
        className="text-sm bg-white/70 rounded-full pl-9 pr-4 py-2 outline-none border border-black/5 w-full sm:w-44 sm:focus:w-56 transition-all"
      />
      {searchOpen && searchResults.length > 0 && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-black/5 py-1.5 min-w-[220px] overflow-hidden z-40">
          {searchResults.map((poi) => {
            const Icon = CATEGORY_ICON[poi.category_id] || TowerIcon
            return (
              <button key={poi.id} onClick={() => goToPoi(poi)}
                className="w-full text-left text-sm px-4 py-2.5 hover:bg-black/5 flex items-center gap-2 text-neutral-700">
                <Icon size={14} color={ACCENT} />
                {poi.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CategoryPills({ activeCats, toggleCategory, compact }) {
  return (
    <>
      {Object.entries(CATEGORY_LABEL).map(([cat, label]) => {
        const Icon = CATEGORY_ICON[cat]
        const active = activeCats.has(cat)
        return (
          <button key={cat} onClick={() => toggleCategory(cat)}
            className={`flex items-center gap-1.5 rounded-full font-medium text-neutral-700 transition-all shrink-0 ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`}
            style={{ background: active ? `${ACCENT}18` : 'transparent' }}>
            <Icon size={compact ? 15 : 17} strokeWidth={2} color={active ? ACCENT : '#9a9a9a'} />
            {label}
          </button>
        )
      })}
    </>
  )
}

export default function MapMonferrato() {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const barRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()

  const [layer, setLayer] = useState('realistico')
  const [pois, setPois] = useState([])
  const [activeCats, setActiveCats] = useState(new Set(Object.keys(CATEGORY_LABEL)))
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    window.openPhotoLightbox = function (url) {
      let overlay = document.getElementById('tim-lightbox')
      if (!overlay) {
        overlay = document.createElement('div')
        overlay.id = 'tim-lightbox'
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;cursor:zoom-out;'
        overlay.onclick = function (e) {
          if (e.target === overlay) overlay.style.display = 'none'
        }
        document.body.appendChild(overlay)
      }
      overlay.innerHTML =
        '<img src="' + url + '" style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:6px;" />' +
        '<button onclick="document.getElementById(\'tim-lightbox\').style.display=\'none\'" ' +
        'style="position:fixed;top:20px;left:20px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.25);' +
        'backdrop-filter:blur(6px);border:none;color:white;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>'
      overlay.style.display = 'flex'
    }
    return () => { delete window.openPhotoLightbox }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function loadPois() {
      const { data, error } = await supabase.from('poi').select('id, name, category_id, lat, lng, short_desc, cover_image_url').eq('is_published', true)
      if (error) { console.error('Errore caricamento POI:', error.message); return }
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
      setTimeout(() => map.resize(), 50)
      setMapReady(true)
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(mapContainer.current)

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) map.resize() })
    }, { threshold: 0.1 })
    intersectionObserver.observe(mapContainer.current)

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
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

  useEffect(() => { applyCanvasFilter(layer) }, [layer])

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

  async function checkFavorite(poiId) {
    if (!session) return false
    const { data } = await supabase.from('favorites').select('id').eq('poi_id', poiId).eq('user_id', session.user.id).maybeSingle()
    return !!data
  }

  async function toggleFavorite(poiId, btnEl) {
    if (!session) {
      window.dispatchEvent(new CustomEvent('open-user-menu'))
      return
    }
    const isFav = btnEl.dataset.fav === 'true'
    if (isFav) {
      await supabase.from('favorites').delete().eq('poi_id', poiId).eq('user_id', session.user.id)
      btnEl.dataset.fav = 'false'
      btnEl.innerHTML = HEART_OUTLINE
    } else {
      await supabase.from('favorites').insert({ poi_id: poiId, user_id: session.user.id })
      btnEl.dataset.fav = 'true'
      btnEl.innerHTML = HEART_FILLED
    }
  }

  function renderMarkers() {
    const map = mapRef.current
    if (!map) return
    Object.values(markersRef.current).forEach((m) => m.remove())
    markersRef.current = {}
    pois.filter((p) => activeCats.has(p.category_id)).forEach((poi) => {
      const el = buildPinElement(poi.category_id)
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}`

      const photoInner = poi.cover_image_url
        ? `<img src="${poi.cover_image_url}" alt="${poi.name}" onclick="window.openPhotoLightbox && window.openPhotoLightbox('${poi.cover_image_url}')" style="width:100%;height:100%;object-fit:cover;border-radius:6px;display:block;cursor:zoom-in;" />`
        : `<div style="width:100%;height:100%;background:#e5e1d8;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;">foto in arrivo</div>`

      const popupHtml = `
        <div style="width:220px;font-family:sans-serif;">
          <div style="height:36px;position:relative;">
            <div id="fav-btn-${poi.id}" style="position:absolute;top:7px;right:8px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;"></div>
          </div>
          <div style="padding:0 12px;">
            <div style="width:100%;height:104px;">
              ${photoInner}
            </div>
          </div>
          <div style="padding:10px 12px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:${ACCENT};font-weight:600;margin-bottom:2px;">${CATEGORY_LABEL[poi.category_id] || ''}</div>
            <div style="font-weight:700;font-size:15px;margin-bottom:4px;">${poi.name}</div>
            <div style="font-size:12.5px;color:#555;line-height:1.4;margin-bottom:10px;">${poi.short_desc || ''}</div>
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer"
               style="display:block;text-align:center;background:${ACCENT};color:white;font-size:12.5px;font-weight:600;padding:8px;border-radius:6px;text-decoration:none;">
              Portami qui
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

        const btn = document.getElementById(`fav-btn-${poi.id}`)
        if (btn) {
          btn.innerHTML = HEART_OUTLINE
          checkFavorite(poi.id).then((isFav) => {
            btn.dataset.fav = isFav ? 'true' : 'false'
            btn.innerHTML = isFav ? HEART_FILLED : HEART_OUTLINE
          })
          btn.onclick = () => toggleFavorite(poi.id, btn)
        }
      })
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([poi.lng, poi.lat]).setPopup(popup).addTo(map)
      markersRef.current[poi.id] = marker
    })
  }

  useEffect(() => {
    if (!mapReady) return
    renderMarkers()
  }, [activeCats, pois, mapReady, session])

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
    if (!activeCats.has(poi.category_id)) setActiveCats((prev) => new Set(prev).add(poi.category_id))
    map.flyTo({ center: [poi.lng, poi.lat], zoom: 14, pitch: 55, duration: 1400 })
    setTimeout(() => { markersRef.current[poi.id]?.togglePopup() }, 1450)
    setSearchQuery('')
    setSearchOpen(false)
  }

  function goHome() {
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
    else router.push('/')
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />

      <div ref={barRef} className="fixed md:absolute top-0 left-0 right-0 z-30 bg-white/65 backdrop-blur-lg">
        <div className="hidden md:flex items-center px-4 h-16 gap-4">
          <button onClick={goHome} title="Torna alla home" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors shrink-0">
            <House size={19} strokeWidth={2} color="#404040" />
          </button>
          <div className="flex-1 flex items-center justify-evenly gap-4">
            <ViewDropdown layer={layer} viewDropdownOpen={viewDropdownOpen} setViewDropdownOpen={setViewDropdownOpen} switchLayer={switchLayer} session={session} />
            <CategoryPills activeCats={activeCats} toggleCategory={toggleCategory} />
            {SHOW_BUSINESS_FILTER && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-neutral-500 hover:bg-black/5 transition-colors">Aziende</button>
            )}
            <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchOpen={searchOpen} setSearchOpen={setSearchOpen} searchResults={searchResults} goToPoi={goToPoi} />
          </div>
          <UserMenu />
        </div>

        <div className="flex md:hidden items-center px-3 h-14 gap-2">
          <button onClick={goHome} title="Torna alla home" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors shrink-0">
            <House size={18} strokeWidth={2} color="#404040" />
          </button>
          <ViewDropdown layer={layer} viewDropdownOpen={viewDropdownOpen} setViewDropdownOpen={setViewDropdownOpen} switchLayer={switchLayer} session={session} />
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchOpen={searchOpen} setSearchOpen={setSearchOpen} searchResults={searchResults} goToPoi={goToPoi} />
          <UserMenu />
        </div>
      </div>

      <div className="flex md:hidden justify-evenly gap-2 absolute left-3 right-3 top-[70px] z-20">
        {Object.entries(CATEGORY_LABEL).map(([cat, label]) => {
          const Icon = CATEGORY_ICON[cat]
          const active = activeCats.has(cat)
          return (
            <button key={cat} onClick={() => toggleCategory(cat)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium shadow-md bg-white/65 backdrop-blur-lg transition-all flex-1"
              style={{ background: active ? `${ACCENT}CC` : 'rgba(255,255,255,0.65)' }}>
              <Icon size={14} strokeWidth={2} color={active ? '#ffffff' : '#9a9a9a'} />
              <span className="text-center" style={{ color: active ? '#ffffff' : '#404040' }}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
