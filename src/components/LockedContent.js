'use client'

import { useEffect, useState } from 'react'
import { Lock, LockOpen } from 'lucide-react'
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

  const isUnlocked = !!session

  return (
    <div className="relative">
      <div className={isUnlocked ? '' : 'pointer-events-none select-none blur-sm opacity-50'}>{children}</div>

      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock size={22} color="#F2760E" strokeWidth={2} />
        </div>
      )}

      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <LockOpen size={16} color="#F2760E" strokeWidth={2} />
        </div>
      )}
    </div>
  )
}
