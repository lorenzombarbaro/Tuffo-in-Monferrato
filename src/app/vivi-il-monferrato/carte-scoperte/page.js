'use client'

import { useState } from 'react'
import Link from 'next/link'
import { House } from 'lucide-react'
import PageMenu from '@/components/PageMenu'
import UserMenu from '@/components/UserMenu'
import FlipCard from '@/components/FlipCard'
import ContentModal from '@/components/ContentModal'

const CARDS = [
  {
    title: 'La Pietra da Cantoni',
    summary: 'Un antico mare preistorico rimasto intrappolato tra le colline: qui la roccia dorata del Monferrato nasconde cassaforti sotterranee nate per custodire i vini più preziosi.',
    fullTitle: 'La Pietra da Cantoni: il mare nascosto tra le colline',
    paragraphs: [
      'Molto prima che il Monferrato diventasse un ricamo di vigne e colline, qui c\'era... il mare. Un antico oceano, popolato da conchiglie, coralli e creature preistoriche. Quando le acque si ritirarono, oltre venti milioni di anni fa, lasciarono in eredità un tesoro speciale: la Pietra da Cantoni, meglio conosciuta come "Tufo".',
      'Morbida appena estratta dalla terra, ma capace di indurirsi al sole fino a diventare indistruttibile, questa pietra dorata è la vera spina dorsale dell\'architettura locale. Gli antichi costruttori ne scoprirono presto il segreto più affascinante: la sua straordinaria capacità di isolare dal freddo e dal caldo.',
      'Fu così che, scavando sotto le case, i vignaioli diedero vita agli infernot: vere e proprie cassaforti sotterranee nate dalla roccia, senza l\'uso di calce per assemblarle. Ambienti suggestivi dove la temperatura e l\'umidità rimangono perfette 365 giorni all\'anno, guardiani silenziosi delle bottiglie di vino più preziose.',
      'Camminare oggi per i borghi del Monferrato significa passeggiare su un antico fondale marino rimasto imprigionato nella pietra.',
    ],
  },
  {
    title: 'I confini del Monferrato',
    summary: 'Una cavalcata inarrestabile, un mattone per ferro di cavallo e un territorio senza confini da conquistare, così la leggenda di Aleramo dà vita alle storie sui confini del Monferrato.',
    fullTitle: 'I confini del Monferrato: l\'enigma di una terra impossibile da disegnare',
    paragraphs: [
      'Provate a prendere una mappa del Piemonte e a tracciare i confini esatti del Monferrato. Un\'impresa quasi impossibile! A differenza di altre regioni storiche delimitate da grandi fiumi o vette insuperabili, il Monferrato è un territorio sfuggente, nato dalla storia più che dalla geografia.',
      'La leggenda racconta che il marchese Aleramo ottenne queste terre cavalcando per tre giorni e tre notti senza sosta, tracciando il suo percorso con un mattone ("mun" in dialetto) usato come ferro per il cavallo ("ferrat"). Da qui il nome!',
      'Nella realtà, tra guerre, eredità e nobili rivali, i suoi confini sono mutati centinaia di volte nel corso dei secoli. Storicamente diviso tra Alto e Basso Monferrato, spaziando tra le province di Alessandria e Asti, è arrivato persino a sfiorare la Liguria.',
      'È proprio questo suo "essere sfuggente" ad averlo reso unico: un mosaico di paesaggi dove ogni collina ha una storia a sé e dove l\'unico vero confine è quello segnato dallo sguardo di chi guarda i suoi orizzonti infiniti.',
    ],
  },
  {
    title: 'Il Tartufo',
    summary: 'Il segreto dell\'oro sotterraneo del Monferrato e delle misteriose ricerche notturne guidate solo dall\'olfatto dei cani e dalla luce delle stelle. Ecco come il respiro della terra finisce sulla nostra tavola.',
    fullTitle: 'Il Tartufo: la corsa all\'oro sotterraneo guidata dalle stelle',
    paragraphs: [
      'Nelle notti più fredde dell\'autunno, quando la nebbia avvolge i boschi come un mantello, un piccolo miracolo si compie sotto le radici di querce e pioppi. Non ha foglie, non ha fiori e non ha bisogno di luce: è il tartufo, il fungo ipogeo più misterioso del pianeta.',
      'Per secoli gli uomini hanno creduto che nascesse dai fulmini scagliati da Giove sugli alberi. Oggi sappiamo invece che si tratta di una complessa e affascinante simbiosi tra la pianta e la terra, ma la sua ricerca conserva immutata la magia.',
      'I trifolau (cercatori di "trifola", cioè tartufo in dialetto) uscivano ed escono tuttora nel silenzio della notte per due motivi: la tranquillità del bosco e l\'olfatto infallibile dei loro cani addestrati, che lavorano meglio al fresco e senza distrazioni. L\'estrazione deve avvenire con la delicatezza di un chirurgo, usando uno zappetto speciale, per non danneggiare la "spia" e permettere alla terra di generarne ancora.',
      'Un profumo inconfondibile, prezioso e selvaggio, che trasforma pochi grammi di terra in pura poesia della tavola.',
    ],
  },
]

export default function CarteScoperte() {
  const [openCard, setOpenCard] = useState(null)

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

      <div className="max-w-2xl mx-auto px-6 md:px-[29px] py-16">
        <h1 className="font-hero italic text-3xl sm:text-4xl md:text-5xl mb-4 text-center" style={{ color: '#F2760E' }}>
          Il Monferrato<br className="sm:hidden" /> a carte scoperte
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto text-justify [text-justify:inter-word] hyphens-auto">
          Gira le carte e scopri i tesori nascosti di un territorio unico con una raccolta di racconti brevi e curiosi.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24 flex flex-wrap justify-center gap-10">
        {CARDS.map((card, i) => (
          <FlipCard
            key={card.title}
            title={card.title}
            summary={card.summary}
            onReadMore={() => setOpenCard(i)}
          />
        ))}
      </div>

      {openCard !== null && (
        <ContentModal
          title={CARDS[openCard].fullTitle}
          paragraphs={CARDS[openCard].paragraphs}
          onClose={() => setOpenCard(null)}
        />
      )}
    </main>
  )
}
