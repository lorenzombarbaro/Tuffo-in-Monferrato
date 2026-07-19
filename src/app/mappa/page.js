import MapMonferrato from '@/components/MapMonferrato'

export default function MappaPage() {
  return (
    <main className="relative w-full bg-[#14110f] min-h-screen" style={{ minHeight: 'var(--app-height, 100dvh)' }}>
      <MapMonferrato />
    </main>
  )
}
