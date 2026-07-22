import MapMonferrato from '@/components/MapMonferrato'
import UserMenu from '@/components/UserMenu'

export default function MappaPage() {
  return (
    <main className="relative w-full bg-[#14110f] min-h-screen">
      <MapMonferrato />
      <UserMenu hideButton />
    </main>
  )
}
