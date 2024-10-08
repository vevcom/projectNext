import EventArchiveList from './EventArchiveList'
import EventsLandingLayout from '@/app/events/EventsLandingLayout'
import EventArchivePagingProvider from '@/contexts/paging/EventArchivePaging'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default async function EventArchive() {
    return (
        <EventsLandingLayout title="Hvad Der Har Hendt" headerLinks={[
            {
                href: '/events',
                icon: faArrowLeft
            }
        ]} headerItem={<></>}>
            <EventArchivePagingProvider serverRenderedData={[]} startPage={{
                page: 0,
                pageSize: 12
            }} details={{}}>
                <EventArchiveList />
            </EventArchivePagingProvider>
        </EventsLandingLayout>
    )
}
