'use client'

import Link from 'next/link'
import { House } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageMenu from '@/components/PageMenu'
import UserMenu from '@/components/UserMenu'
import { SquareLock } from '@/components/icons/LockIcons'
import { supabase } from '@/lib/supabaseClient'

const SECTIONS = [
  { title: 'Eventi', desc: 'Partecipa agli eventi del territorio come un vero monferrino.', href: null },
  { title: 'Il Monferrato a carte scoperte', desc: 'Una selezione curiosa di storie da scoprire.', href: '/vivi-il-monferrato/carte-scoperte' },
]

export default function ViviIlMonferrato() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  function handleLockedClick() {
    window.dispatchEvent(new CustomEvent('open-user-menu'))
  }

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

      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-hero italic text-4xl md:text-5xl mb-4" style={{ color: '#F2760E' }}>Vivi il Monferrato</h1>
        <p className="text-neutral-500 max-w-lg mx-auto">
          Una selezione di eventi e contenuti curati da chi il Monferrato lo vive ogni giorno.
        </p>
      </div>

      <div className="max-w-md mx-auto px-6 pb-24 flex flex-col gap-4">
        {SECTIONS.map((s) => {
          const cellContent = (
            <div className="relative bg-white rounded-lg border border-black/5 p-6 hover:border-black/10 transition-colors">
              {!session && (
                <span className="absolute top-4 right-4">
                  <SquareLock size={16} color="#F2760E" strokeWidth={2} />
                </span>
              )}
              <h2 className="font-semibold text-neutral-800 mb-2">{s.title}</h2>
              <p className="text-sm text-neutral-500">{s.desc}</p>
            </div>
          )

          if (session && s.href) {
            return <Link key={s.title} href={s.href}>{cellContent}</Link>
          }
          return (
            <button key={s.title} onClick={handleLockedClick} className="text-left">
              {cellContent}
            </button>
          )
        })}
      </div>
    </main>
  )
}
