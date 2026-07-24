'use client'

import Link from 'next/link'
import HeroMenu from '@/components/HeroMenu'
import UserMenu from '@/components/UserMenu'
import DesktopMapSection from '@/components/DesktopMapSection'

export default function Home() {
  return (
    <main>
      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
        <div className="hero-perspective absolute inset-0">
          <div className="hero-bg" style={{ backgroundImage: "url('/hero.jpg')" }} />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <div className="fixed top-6 left-6 right-6 z-20 flex items-center justify-between">
          <HeroMenu />
          <UserMenu light />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="font-hero italic text-white text-4xl sm:text-5xl md:text-7xl mb-4">
            Tuf<span className="accent-letter">f</span>o in Monferrato
          </h1>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mx-auto px-4">
            Vivi il Monferrato, una terra da scoprire<br className="sm:hidden" /> tutta d'un fiato.
          </p>
        </div>

        <a href="#mappa" className="hidden md:flex absolute bottom-8 z-10 text-white/80 text-sm flex-col items-center gap-2 animate-bounce">
          Visualizza la mappa
          <span>↓</span>
        </a>

        <Link href="/mappa" className="flex md:hidden absolute bottom-8 z-10 text-white/80 text-sm flex-col items-center gap-2 animate-bounce">
          Visualizza la mappa
          <span>↓</span>
        </Link>
      </section>

      <DesktopMapSection />
    </main>
  )
}
