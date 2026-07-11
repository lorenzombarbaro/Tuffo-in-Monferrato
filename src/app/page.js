'use client'

export default function Home() {
  return (
    <main>
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="hero-perspective absolute inset-0">
          <div
            className="hero-bg"
            style={{ backgroundImage: "url('/hero.jpg')" }}
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-6">
          <h1 className="font-hero italic text-white text-5xl md:text-7xl mb-4">
            Tu<span className="shadow-f">f</span>o in Monferrato
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl mx-auto">
            Vivi il Monferrato, una terra da scoprire tutta d'un fiato
          </p>
        </div>

        <a href="#mappa" className="absolute bottom-8 z-10 text-white/80 text-sm flex flex-col items-center gap-2 animate-bounce">
          Scorri per esplorare
          <span>↓</span>
        </a>
      </section>

      <section id="mappa" className="h-screen w-full flex items-center justify-center bg-neutral-900">
        <p className="text-white text-xl">Qui arriverà la mappa 3D fly-over</p>
      </section>
    </main>
  )
}
