'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/admin/login')
        return
      }
      const { data: adminRow } = await supabase
        .from('admins')
        .select('email')
        .eq('id', session.user.id)
        .single()

      if (!adminRow) {
        await supabase.auth.signOut()
        router.replace('/admin/login')
        return
      }

      setUserEmail(adminRow.email)
      setAuthorized(true)
      setChecking(false)
    }
    checkAccess()
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500 text-sm">
        Verifica accesso...
      </div>
    )
  }
  if (!authorized) return null

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-white border-b border-black/5 px-6 h-14 flex items-center justify-between">
        <span className="font-semibold text-neutral-800">Pannello admin — Tuffo in Monferrato</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">{userEmail}</span>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.replace('/admin/login')
            }}
            className="text-sm text-neutral-500 hover:text-neutral-800"
          >
            Esci
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
