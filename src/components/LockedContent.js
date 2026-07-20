'use client'

import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function LockedContent({ children }) {
  const [session, setSession] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecked(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!checked) return null

  if (session) return children

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-50">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/40">
        <Lock size={20} color="#F2760E" />
        <p className="text-xs text-neutral-600 font-medium">Accedi per sbloccare</p>
      </div>
    </div>
  )
}
