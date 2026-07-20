import Link from 'next/link'
import { House } from 'lucide-react'
import PageMenu from '@/components/PageMenu'

export default function ConosciIlProgetto() {
  return (
    <main className="min-h-screen bg-white">
      <header className="px-6 py-5 border-b border-black/5">
        <div cla<a
            href="https://donate.stripe.com/28E4gA16gbSSfZl24S1ck00"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#F2760E] text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Sostieni Tuffo in Monferrato con una donazione</a>
        </div>

        <h2 className="font-hero italic text-2xl mt-12 mb-3" style={{ color: '#F2760E' }}>Sostieni il progetto</h2>
        <p className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word] hyphens-auto mb-6">
          &ldquo;Tuffo in Monferrato&rdquo; nasce come iniziativa a costo zero.
          Senza l&apos;impiego di capitali, siamo riusciti a creare una piattaforma grazie agli strumenti di ultima generazione.
          Tuttavia la gestione dei dati, la ricerca e lo sviluppo di nuovi contenuti richiedono uno sforzo fisico ed economico.
          Se anche tu credi che il Monferrato meriti visibilità, aiutaci a portare avanti questa missione, ogni contributo è prezioso.
        </p>
        <div className="text-center">
          
            <a
            href="https://donate.stripe.com/28E4gA16gbSSfZl24S1ck00"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#F2760E] text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Sostieni Tuffo in Monferrato con una donazione
          </a>
        </div>
      </div>
    </main>
  )
}
