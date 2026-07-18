import Link from 'next/link'
import { House } from 'lucide-react'
import PageMenu from '@/components/PageMenu'

export default function Contatti() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="px-6 py-5 border-b border-black/5">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors">
            <House size={19} strokeWidth={2} color="#404040" />
          </Link>
          <PageMenu />
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="font-hero italic text-4xl md:text-5xl mb-4" style={{ color: '#F2760E' }}>Contattaci</h1>
        <p className="text-neutral-500 mb-8">
          Hai una domanda, una curiosita o vuoi segnalarci un luogo? Scrivici.
        </p>
        <a href="mailto:tuffoinmonferrato@gmail.com" className="inline-block bg-[#F2760E] text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
          tuffoinmonferrato@gmail.com
        </a>
        <p className="text-xs text-neutral-400 mt-6 italic">
          Il modulo di contatto diretto dal sito arriva a breve.
        </p>
      </div>
    </main>
  )
}
