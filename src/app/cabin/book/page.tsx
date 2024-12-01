import CabinCalendar from './CabinCalendar'
import PageWrapper from '@/components/PageWrapper/PageWrapper'


export default function CabinBooking() {
    return <PageWrapper
        title="Heutte Booking"
    >
        <CabinCalendar startDate={new Date()} bookingUntil={new Date()} />
    </PageWrapper>
}
