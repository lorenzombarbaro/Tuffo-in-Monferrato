import StatsModule from '@/components/admin/StatsModule'
import PoiEditorModule from '@/components/admin/PoiEditorModule'
import EventsModule from '@/components/admin/EventsModule'
import MessagesModule from '@/components/admin/MessagesModule'

export default function AdminHome() {
  return (
    <div className="max-w-4xl mx-auto">
      <StatsModule />
      <PoiEditorModule />
      <EventsModule />
      <MessagesModule />
    </div>
  )
}
