import CabinCalendar from '@/app/_components/cabinCalendar/CabinCalendar'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'


export default function CabinCalendarPage() {
    return <PageWrapper
        title="Heutte Kalender"
    >
        <h4>Ulike release group kan være her kanskje?</h4>

        <CabinCalendar date={new Date()} />
    </PageWrapper>
}
