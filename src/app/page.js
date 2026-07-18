'use client'

import MapMonferrato from '@/components/MapMonferrato'
import HeroMenu from '@/components/HeroMenu'

export default function Home() {
  return (
    <main>
      <section className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: 'calc(var(--app-height, 100dvh) + 6px)' }}>
        <div className="hero-perspective absolute inset-0">
          <div
            className="hero-bg"
            style={{ backgroundImage: "url('/hero.jpg')" }}
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <HeroMenu />

        <div className="relative z-10 text-center px-6">
          <h1 className="font-hero italic text-white text-4xl sm:text-5xl md:text-7xl mb-4">
            Tuf<span className="accent-letter">f</span>o in Monferrato
          </h1>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mx-auto px-4">
            Vivi il Monferrato, una terra da scoprire<br className="sm:hidden" /> tutta d'un fiato.
          </p>
        </div>

        <a href="#mappa" className="absolute bottom-8 z-10 text-white/80 text-sm flex flex-col items-center gap-2 animate-bounce">
          Scorri per esplorare
          <span>↓</span>
        </a>
      </section>

      <section id="mappa" className="relative w-full bg-[#14110f] overflow-hidden" style={{ height: 'calc(var(--app-height, 100dvh) + 6px)', marginTop: '-6px' }}>
        <MapMonferrato />
      </section>
    </main>
  )
}
