import CabinCalendar from './CabinCalendar'
import PageWrapper from '@/components/PageWrapper/PageWrapper'


export default function CabinBooking() {
    const bookingUntil = new Date()
    bookingUntil.setUTCMonth(bookingUntil.getUTCMonth() + 4)
    console.log(bookingUntil)
    return <PageWrapper
        title="Heutte Booking"
    >
        <CabinCalendar startDate={new Date()} bookingUntil={bookingUntil} />
    </PageWrapper>
}
