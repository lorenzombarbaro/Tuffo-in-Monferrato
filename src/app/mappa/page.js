import MapMonferrato from '@/components/MapMonferrato'

export default function MappaPage() {
  return (
    <main className="mobile-page-bleed relative w-full bg-[#14110f]" style={{ minHeight: 'var(--app-height, 100dvh)' }}>
      <MapMonferrato />
    </main>
  )
}
