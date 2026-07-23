import Link from 'next/link'
import { House } from 'lucide-react'
import PageMenu from '@/components/PageMenu'
import UserMenu from '@/components/UserMenu'

export default function ConosciIlProgetto() {
  return (
    <main className="min-h-screen bg-white">
      <header className="px-6 py-5 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors">
            <House size={19} strokeWidth={2} color="#404040" />
          </Link>
          <PageMenu />
        </div>
        <UserMenu />
      </header>

      <div className="max-w-2xl mx-auto px-6 md:px-[29px] py-16 sm:py-20">
        <h1 className="font-hero italic text-4xl md:text-5xl mb-10 text-center" style={{ color: '#F2760E' }}>
          Conosci il progetto
        </h1>

        <div className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word] hyphens-auto">
          <p>
            &ldquo;Tuffo in Monferrato&rdquo; nasce dall&apos;incontro tra l&apos;amore per le nostre colline
            e la curiosità per la tecnologia.
            <br /><br />
            Chi è monferrino per nascita o per vocazione conosce bene il
            valore di questa terra: i paesaggi sconfinati, il buon vino e le passeggiate tra i vicoli dei
            nostri borghi ci fanno sentire vivi. Così abbiamo deciso di sfruttare le nuove possibilità
            digitali per offrirvi un modo alternativo di esplorare il Monferrato.
            <br /><br />
            Il turismo 4.0 pensato per
            raccontare gli scorci più veri e conquistarvi già dallo schermo attraverso la narrazione della mappa, il cuore pulsante del nostro progetto.
          </p>
        </div>

        <h2 className="font-hero italic text-2xl mt-12 mb-3" style={{ color: '#F2760E' }}>La mappa</h2>
        <p className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word] hyphens-auto">
          Viva e accessibile fin dal primo clic, rappresenta la nostra interpretazione del territorio.
          Raccoglie borghi, punti panoramici, attrazioni e luoghi caratteristici che potrete facilmente
          scoprire grazie ai filtri e alla barra di ricerca con cui orientarvi per pianificare nuovi
          itinerari o ritrovare i vostri luoghi del cuore.
        </p>

        <h2 className="font-hero italic text-2xl mt-12 mb-3" style={{ color: '#F2760E' }}>Il nostro obiettivo</h2>
        <p className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word] hyphens-auto">
          Vogliamo raccontare il Monferrato con un linguaggio contemporaneo, senza perdere il legame con
          le sue tradizioni. Crediamo che la tecnologia possa valorizzare il territorio, rendendolo più
          immediato e stimolando la curiosità di chi ancora non lo conosce.
          <br /><br />
          Se poi questo tuffo digitale vi porterà qui sulle colline, avremo raggiunto il nostro vero obiettivo.
        </p>

        <h2 className="font-hero italic text-2xl mt-12 mb-6" style={{ color: '#F2760E' }}>La squadra</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="flex flex-col items-center text-center w-32">
            <div className="w-24 h-24 rounded-full bg-neutral-200 mb-3 flex items-center justify-center text-neutral-400 text-xs">foto</div>
            <p className="font-semibold text-neutral-800 text-sm">Lorenzo</p>
            <p className="text-xs text-neutral-500">Founder</p>
          </div>
          <div className="flex flex-col items-center text-center w-32">
            <div className="w-24 h-24 rounded-full bg-neutral-200 mb-3 flex items-center justify-center text-neutral-400 text-xs">foto</div>
            <p className="font-semibold text-neutral-800 text-sm">Emanuele</p>
            <p className="text-xs text-neutral-500">Co-founder</p>
          </div>
        </div>

        <h2 className="font-hero italic text-2xl mt-12 mb-3" style={{ color: '#F2760E' }}>Sostieni il progetto</h2>
        <p className="text-neutral-600 leading-relaxed text-justify [text-justify:inter-word] hyphens-auto mb-6">
          &ldquo;Tuffo in Monferrato&rdquo; nasce come iniziativa a costo zero. Grazie agli strumenti di ultima generazione siamo riusciti a creare una piattaforma senza l&apos uso di capitali,
	tuttavia la gestione dei dati, la ricerca e lo sviluppo dei nuovi contenuti richiedono uno sforzo fisico ed economico considerevole.
          Se anche tu credi che il Monferrato meriti visibilità, aiutaci a portare avanti quest&apos iniziativa, ogni contributo è prezioso.
        </p>
        <div className="text-center">
          <a href="https://donate.stripe.com/28E4gA16gbSSfZl24S1ck00" target="_blank" rel="noopener noreferrer"
            className="inline-block bg-[#F2760E] text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
            Sostieni Tuffo in Monferrato con una donazione
          </a>
        </div>
      </div>
    </main>
  )
}
