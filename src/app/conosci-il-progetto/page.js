import Link from 'next/link'
import { House } from 'lucide-react'

export default function ConosciIlProgetto() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="px-6 py-5 border-b border-black/5">
        <Link href="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors">
          <House size={19} strokeWidth={2} color="#404040" />
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="font-hero italic text-4xl md:text-5xl mb-6 text-center" style={{ color: '#F2760E' }}>
          Conosci il progetto
        </h1>
        <div className="text-neutral-600 leading-relaxed space-y-4">
          <p>
            Tuffo in Monferrato nasce dalla voglia di raccontare un territorio che merita più attenzione
            di quanta ne riceva di solito: borghi, cantine, punti panoramici e piccole scoperte che
            raramente finiscono sulle guide turistiche tradizionali.
          </p>
          <p>
            Il progetto è pensato come una mappa viva del Monferrato, che cresce nel tempo con nuovi
            luoghi, eventi e segnalazioni — costruita da chi il territorio lo conosce e lo vive davvero.
          </p>
          <p>
            È un progetto indipendente, in continua evoluzione. Se hai suggerimenti, luoghi da
            segnalare o vuoi collaborare, scrivici dalla pagina Contattaci.
          </p>
        </div>
      </div>
    </main>
  )
}
