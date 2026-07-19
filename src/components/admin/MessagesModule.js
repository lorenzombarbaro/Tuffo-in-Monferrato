'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ModuleCard from './ModuleCard'

export default function MessagesModule() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('desc') // 'desc' = più recenti prima

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  async function toggleRead(msg) {
    const newValue = !msg.is_read
    // aggiornamento ottimistico: cambia subito in UI, poi conferma sul database
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: newValue } : m)))
    const { error } = await supabase.from('messages').update({ is_read: newValue }).eq('id', msg.id)
    if (error) {
      // se fallisce, ripristina lo stato precedente
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: !newValue } : m)))
    }
  }

  const unread = messages.filter((m) => !m.is_read).length

  const sorted = [...messages].sort((a, b) => {
    const diff = new Date(a.created_at) - new Date(b.created_at)
    return sortOrder === 'asc' ? diff : -diff
  })

  return (
    <ModuleCard
      title="✉️ Messaggi e FAQ"
      summary={loading ? 'Caricamento...' : `${messages.length} messaggi ricevuti · ${unread} da leggere`}
    >
      {messages.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Nessun messaggio ancora — appena qualcuno scrive dal form di contatto, comparirà qui.
        </p>
      ) : (
        <div>
          <div className="flex items-center justify-end gap-2 mb-4">
            <span className="text-xs text-neutral-400">Ordina per data</span>
            <button
              onClick={() => setSortOrder('desc')}
              className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
              style={{
                background: sortOrder === 'desc' ? '#F2760E18' : 'transparent',
                color: sortOrder === 'desc' ? '#F2760E' : '#8a8a8a',
                border: '1px solid',
                borderColor: sortOrder === 'desc' ? '#F2760E40' : '#00000014',
              }}
            >
              Più recenti
            </button>
            <button
              onClick={() => setSortOrder('asc')}
              className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
              style={{
                background: sortOrder === 'asc' ? '#F2760E18' : 'transparent',
                color: sortOrder === 'asc' ? '#F2760E' : '#8a8a8a',
                border: '1px solid',
                borderColor: sortOrder === 'asc' ? '#F2760E40' : '#00000014',
              }}
            >
              Meno recenti
            </button>
          </div>

          <div className="space-y-2">
            {sorted.map((m) => (
              <div
                key={m.id}
                className="border rounded-md px-3 py-2 text-sm flex gap-3"
                style={{ borderColor: m.is_read ? 'rgba(0,0,0,0.05)' : '#F2760E40', background: m.is_read ? 'transparent' : '#F2760E08' }}
              >
                <button
                  onClick={() => toggleRead(m)}
                  title={m.is_read ? 'Segna come da leggere' : 'Segna come letto'}
                  className="shrink-0 mt-1"
                >
                  <span
                    className="block w-2.5 h-2.5 rounded-full"
                    style={{ background: m.is_read ? '#d4d4d4' : '#F2760E' }}
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-medium text-neutral-800">{m.name || m.email}</span>
                    <span className="text-neutral-400 text-xs shrink-0">
                      {new Date(m.created_at).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <p className="text-neutral-600 mt-1">{m.body}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-[#F2760E] mt-1 inline-block">
                    Rispondi via email →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ModuleCard>
  )
}
