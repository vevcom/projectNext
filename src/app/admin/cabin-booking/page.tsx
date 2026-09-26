import { readCabinBookingsAction } from '@/services/cabin/actions'
import { cabinBookingAuth } from '@/services/cabin/booking/auth'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import SimpleTable from '@/app/_components/Table/SimpleTable'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayDate } from '@/lib/dates/displayDate'
import { ServerSession } from '@/auth/session/ServerSession'


export default async function CabinBooking() {
    cabinBookingAuth.readMany.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/cabin-booking' })

    const bookings = unwrapActionReturn(await readCabinBookingsAction())

    const displayNames = bookings.map(booking => {
        if (booking.user) {
            return `${booking.user.firstname} ${booking.user.lastname}`
        }

        if (booking.guestUser) {
            return `${booking.guestUser.firstname} ${booking.guestUser.lastname}`
        }

        return 'Ukjent'
    })

    return <PageWrapper
        title="Hytte bookinger"
    >
        <SimpleTable
            header={['Navn', 'Type', 'Start', 'Slutt', 'Notater']}
            body={bookings.map((booking, i) => [
                displayNames[i],
                booking.type,
                displayDate(booking.start, false),
                displayDate(booking.end, false),
                booking.notes ?? ''
            ])}
            links={bookings.map(booking => `/admin/cabin-booking/${booking.id}`)}
        />
    </PageWrapper>
}
