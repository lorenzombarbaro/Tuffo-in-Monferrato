import Link from 'next/link'
import { House } from 'lucide-react'
import PageMenu from '@/components/PageMenu'

export default function ConosciIlProgetto() {
  return (
    <main className="min-h-screen bg-white">
      <header className="px-6 py-5 border-b border-black/5">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-neutral-100 transition-colors">
            <House size={19} strokeWidth={2} color="#404040" />
          </Link>
          <PageMenu />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 md:px-[29px] py-16 sm:py-20">
        <h1 className="font-hero italic text-4xl md:text-5xl mb-10 text-center" style={{ color: '#F2760E' }}>
          Conosci il progetto
        </h1>
            
        <div className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word]">
          <p>
            &ldquo;Tuffo in Monferrato&rdquo; nasce dall&apos;incontro tra l&apos;amore per questo territorio
            e la curiosità per la tecnologia.
            <br /><br />
            Chi è monferrino per nascita o per vocazione conosce bene il
            valore di questa terra: i paesaggi sconfinati, il buon vino e le parole calde dei
            nostri borghi ci fanno sentire vivi. Per questo abbiamo deciso di unire le nostre competenze
            digitali e offrirvi un nuovo modo di esplorare il Monferrato.
            <br /><br />
            Il turismo 4.0 pensato per
            raccontare gli scorci più veri già dal vostro schermo e conquistarvi. Troverete tour
            virtuali, riprese con il drone ma soprattutto la mappa, il cuore pulsante del sito.
          </p>
        </div>
        
        <h2 className="font-hero italic text-2xl mt-12 mb-3" style={{ color: '#F2760E' }}>
          La Mappa
        </h2>
        <p className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word]">
          Viva e accessibile fin dal primo clic, rappresenta la nostra interpretazione del territorio.
          Raccoglie borghi, punti panoramici, attrazioni e luoghi caratteristici, facili da
          scoprire grazie alle categorie e alla barra di ricerca con cui orientarsi, creare
          itinerari o ritrovare i vostri luoghi del cuore.
        </p>
                  
        <h2 className="font-hero italic text-2xl mt-12 mb-3" style={{ color: '#F2760E' }}>
          Il Nostro Obiettivo
        </h2>
        <p className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word]">
          Vogliamo raccontare il Monferrato con un linguaggio contemporaneo, senza dimenticare
          le sue tradizioni. Crediamo che la tecnologia possa valorizzare il territorio in modo
          immediato e stimolando la curiosità di chi ancora non lo conosce.
          <br /><br />
          Se poi questo tuffo digitale vi porterà qui sulle colline, allora avremo raggiunto il nostro obiettivo.
        </p>

        <h2 className="font-hero italic text-2xl mt-12 mb-6" style={{ color: '#F2760E' }}>
          Il Team
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="flex flex-col items-center text-center w-32">
            <div className="w-24 h-24 rounded-full bg-neutral-200 mb-3 flex items-center justify-center text-xs text-neutral-400">
              foto
            </div>
            <p className="font-semibold text-neutral-800 text-sm">Lorenzo</p>
            <p className="text-xs text-neutral-500">Founder</p>
          </div>
          <div className="flex flex-col items-center text-center w-32">
            <div className="w-24 h-24 rounded-full bg-neutral-200 mb-3 flex items-center justify-center text-xs text-neutral-400">
              foto
            </div>
            <p className="font-semibold text-neutral-800 text-sm">Emanuele</p>
            <p className="text-xs text-neutral-500">Co-founder</p>
          </div>
        </div>

        <h2 className="font-hero italic text-2xl mt-12 mb-3" style={{ color: '#F2760E' }}>
          Sostieni il progetto
        </h2>
        <p className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word] mb-6">
          Tuffo in Monferrato è un progetto indipendente che vive grazie al supporto di chi ama questo territorio. Ogni donazione, anche piccola, ci aiuta a continuare a raccontare e valorizzare le storie, la cultura e la bellezza del Monferrato.
        </p>
        <div className="text-center mt-6">
          <a
            href="https://donate.stripe.com/28E4gA16gbSSfZl24S1ck00"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#F2760E] text-white text-sm font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-semibold"
          >
            Sostieni Tuffo in Monferrato con una donazione
          </a>
        </div>
      </div>
    </main>
  )
}
