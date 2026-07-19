'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ContactForm() {
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await supabase.from('messages').insert({
      email,
      body,
      subject: 'Segnalazione dalla mappa',
    })
    if (error) {
      setStatus('error')
      return
    }
    setStatus('sent')
    setEmail('')
    setBody('')
  }

  if (status === 'sent') {
    return (
      <div className="bg-neutral-50 rounded-lg border border-black/5 px-6 py-8 text-center">
        <p className="text-neutral-700 font-medium">Grazie per la segnalazione!</p>
        <p className="text-sm text-neutral-500 mt-1">Ti risponderemo il prima possibile.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-neutral-500 mb-1">La tua email (per ricevere risposta)</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@esempio.com"
          className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E]"
        />
      </div>

      <div>
        <label className="block text-xs text-neutral-500 mb-1">La tua segnalazione</label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder="Scrivi qui il tuo suggerimento..."
          className="w-full border border-black/10 rounded-md px-3 py-2 text-sm outline-none focus:border-[#F2760E] resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">Qualcosa è andato storto, riprova tra poco.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-[#F2760E] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === 'sending' ? 'Invio in corso...' : 'Invia segnalazione'}
      </button>
    </form>
  )
}
