import Link from 'next/link'
import { House } from 'lucide-react'
import PageMenu from '@/components/PageMenu'

export default function ViviIlMonferrato() {
  const sections = [
    { title: 'Eventi', desc: 'Sagre, mercati e appuntamenti nel territorio.' },
    { title: 'Dove dormire', desc: 'Agriturismi e B&B che consigliamo.' },
    { title: 'Dove mangiare', desc: 'Ristoranti e trattorie del territorio.' },
  ]

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

      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-hero italic text-4xl md:text-5xl mb-4" style={{ color: '#F2760E' }}>Vivi il Monferrato</h1>
        <p className="text-neutral-500 max-w-lg mx-auto">
          Eventi, luoghi dove dormire e dove mangiare, scelti da chi il Monferrato lo vive ogni giorno.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24 grid sm:grid-cols-3 gap-6">
        {sections.map((s) => (
          <div key={s.title} className="bg-white rounded-lg border border-black/5 p-6">
            <h2 className="font-semibold text-neutral-800 mb-2">{s.title}</h2>
            <p className="text-sm text-neutral-500 mb-4">{s.desc}</p>
            <p className="text-xs text-neutral-400 italic">Contenuti in arrivo</p>
          </div>
        ))}
      </div>
    </main>
  )
}
