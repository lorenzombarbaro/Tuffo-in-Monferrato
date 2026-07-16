'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ModuleCard from './ModuleCard'

export default function MessagesModule() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
      setMessages(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const unread = messages.filter((m) => !m.is_read).length

  return (
    <ModuleCard
      title="✉️ Messaggi e FAQ"
      summary={loading ? 'Caricamento...' : `${messages.length} messaggi ricevuti · ${unread} da leggere`}
    >
      {messages.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Nessun messaggio ancora — il form di contatto pubblico non è collegato al sito.
          Lo costruiamo nel prossimo passo, insieme alla gestione delle FAQ.
        </p>
      ) : (
        <div className="space-y-2">
          {messages.map((m) => (
            <div key={m.id} className="border border-black/5 rounded-md px-3 py-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-neutral-800">{m.name || m.email}</span>
                <span className="text-neutral-400 text-xs">{new Date(m.created_at).toLocaleDateString('it-IT')}</span>
              </div>
              <p className="text-neutral-600 mt-1">{m.body}</p>
              <a href={`mailto:${m.email}`} className="text-xs text-[#F2760E] mt-1 inline-block">Rispondi via email →</a>
            </div>
          ))}
        </div>
      )}
    </ModuleCard>
  )
}
