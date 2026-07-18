import Link from 'next/link'

export default function Contatti() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="px-6 py-5 border-b border-black/5">
        <Link href="/" className="text-sm text-neutral-500 hover:text-[#F2760E]">← Torna alla mappa</Link>
      </header>

      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="font-hero italic text-4xl md:text-5xl text-neutral-900 mb-4">Contattaci</h1>
        <p className="text-neutral-500 mb-8">
          Hai una domanda, una curiosità o vuoi segnalarci un luogo? Scrivici.
        </p>
        
          href="mailto:tuffoinmonferrato@gmail.com"
          className="inline-block bg-[#F2760E] text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          tuffoinmonferrato@gmail.com
        </a>
        <p className="text-xs text-neutral-400 mt-6 italic">
          Il modulo di contatto diretto dal sito arriva a breve.
        </p>
      </div>
    </main>
  )
}
