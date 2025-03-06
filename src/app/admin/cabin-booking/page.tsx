import { readCabinBookingsAction } from '@/actions/cabin'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import SimpleTable from '@/app/_components/Table/SimpleTable'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayDate } from '@/lib/dates/displayDate'


export default async function CabinBooking() {
    const bookings = unwrapActionReturn(await readCabinBookingsAction())

    return <PageWrapper
        title="Hytte bookinger"
    >
        <SimpleTable
            header={['Type', 'Start', 'Slutt', 'Notater']}
            body={bookings.map(booking => [
                booking.type,
                displayDate(booking.start, false),
                displayDate(booking.end, false),
                booking.notes ?? ''
            ])}
            links={bookings.map(booking => `/admin/cabin-booking/${booking.id}`)}
        />
    </PageWrapper>
}
