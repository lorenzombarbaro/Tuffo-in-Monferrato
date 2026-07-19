import Link from 'next/link'
import { House } from 'lucide-react'
import PageMenu from '@/components/PageMenu'
import ContactForm from '@/components/ContactForm'

export default function Contatti() {
  return (
    <main className="min-h-screen bg-white">
      <header className="px-6 py-5 border-b border-black/5">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors">
            <House size={19} strokeWidth={2} color="#404040" />
          </Link>
          <PageMenu />
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 md:px-[29px] py-16 sm:py-20">
        <h1 className="font-hero italic text-4xl md:text-5xl mb-10 text-center" style={{ color: '#F2760E' }}>
          Contattaci
        </h1>

        <p className="text-neutral-600 leading-relaxed text-center">
          Hai una domanda, una curiosità o vuoi collaborare con noi? Scrivici.
        </p>

        <h2 className="font-hero italic text-2xl mt-12 mb-3 text-center" style={{ color: '#F2760E' }}>
          Segnalazioni
        </h2>
        <p className="text-neutral-600 leading-relaxed text-center mb-8">
          Se sulla mappa non hai trovato quello che cercavi, indica il tuo suggerimento nella casella sottostante.
        </p>

        <ContactForm />
      </div>
    </main>
  )
}
