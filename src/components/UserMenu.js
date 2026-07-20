'use client'

import { useEffect, useRef, useState } from 'react'
import { User, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const ACCENT = '#F2760E'

const CATEGORY_LABEL = {
  borgo: 'Borghi',
  cultura: 'Attrazioni',
  panorama: 'Punti panoramici',
}
const CATEGORY_ORDER = ['borgo', 'cultura', 'panorama']

export default function UserMenu({ light = false }) {
  const [session, setSession] = useState(null)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [favLoading, setFavLoading] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    function handleOpenRequest() { setOpen(true) }
    window.addEventListener('open-user-menu', handleOpenRequest)
    return () => window.removeEventListener('open-user-menu', handleOpenRequest)
  }, [])

  useEffect(() => {
    if (open && session) loadFavorites()
  }, [open, session])

  async function loadFavorites() {
    setFavLoading(true)
    const { data } = await supabase
      .from('favorites')
      .select('poi_id, poi(name, category_id)')
      .eq('user_id', session.user.id)
    setFavorites(data || [])
    setFavLoading(false)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email o password non corrette.')
      return
    }
    setEmail('')
    setPassword('')
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setInfo('Controlla la tua email per confermare la registrazione.')
    setEmail('')
    setPassword('')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setOpen(false)
  }

  const isLoggedIn = !!session

  const grouped = {}
  favorites.forEach((f) => {
    const cat = f.poi?.category_id
    const name = f.poi?.name
    if (!cat || !name) return
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(name)
  })
  Object.keys(grouped).forEach((cat) => grouped[cat].sort((a, b) => a.localeCompare(b)))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${light ? 'hover:bg-white/15' : 'hover:bg-black/5'}`}
        style={{ background: open ? (light ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)') : 'transparent' }}
        title="Il tuo profilo"
      >
        <User size={19} color={light ? '#ffffff' : '#404040'} strokeWidth={2} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/30">
          <div ref={panelRef} className="absolute top-0 right-0 h-full w-full max-w-[340px] bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="font-hero italic text-lg text-neutral-800">Il tuo profilo</span>
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X size={20} />
              </button>
            </div>

            {isLoggedIn ? (
              <div>
                <p className="text-sm text-neutral-500 mb-1">Hai effettuato l'accesso come</p>
                <p className="text-sm font-medium text-neutral-800 mb-6">{session.user.email}</p>

                <h3 className="text-sm font-semibold text-neutral-700 mb-3">🧡 Luoghi del cuore</h3>
                {favLoading ? (
                  <p className="text-xs text-neutral-400 mb-6">Caricamento...</p>
                ) : Object.keys(grouped).length === 0 ? (
                  <p className="text-xs text-neutral-400 mb-6">
                    Nessun luogo salvato ancora — clicca il cuoricino su un POI della mappa per aggiungerlo qui.
                  </p>
                ) : (
                  <div className="mb-6 space-y-4">
                    {CATEGORY_ORDER.filter((cat) => grouped[cat]).map((cat) => (
                      <div key={cat}>
                        <div className="text-xs uppercase tracking-wide text-neutral-400 font-medium mb-1">
                          {CATEGORY_LABEL[cat]}
                        </div>
                        <ul className="text-sm text-neutral-700 space-y-0.5">
                          {grouped[cat].map((name) => (
                            <li key={name}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-sm font-medium text-neutral-600 border border-black/10 rounded-full py-2.5 hover:bg-black/5 transition-colors"
                >
                  Esci
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => { setMode('login'); setError(null); setInfo(null) }}
                    className="flex-1 text-sm font-medium py-2 rounded-full transition-colors"
                    style={{ background: mode === 'login' ? `${ACCENT}18` : 'transparent', color: mode === 'login' ? ACCENT : '#8a8a8a' }}
                  >
                    Accedi
                  </button>
                  <button
                    onClick={() => { setMode('signup'); setError(null); setInfo(null) }}
                    className="flex-1 text-sm font-medium py-2 rounded-full transition-colors"
                    style={{ background: mode === 'signup' ? `${ACCENT}18` : 'transparent', color: mode === 'signup' ? ACCENT : '#8a8a8a' }}
                  >
                    Registrati
                  </button>
                </div>

                <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E]" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Password</label>
                    <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E]" />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {info && <p className="text-sm text-green-600">{info}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full bg-[#F2760E] text-white text-sm font-medium py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50">
                    {loading ? 'Attendere...' : mode === 'login' ? 'Accedi' : 'Crea account'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
