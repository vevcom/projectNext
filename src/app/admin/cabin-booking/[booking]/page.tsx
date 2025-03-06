import { readCabinBookingAction } from '@/actions/cabin'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayDate } from '@/lib/dates/displayDate'
import Link from 'next/link'
import React from 'react'

function trHelper(key: string, value: React.ReactNode) {
    return <tr>
        <th>{key}</th>
        <td>{value}</td>
    </tr>
}

export default async function CabinBooking({
    params
}: {
    params: {
        booking: string,
    }
}) {
    const booking = unwrapActionReturn(await readCabinBookingAction({
        id: Number(params.booking)
    }))

    return <PageWrapper
        title="Booking"
    >

        <table>
            <tbody>
                {trHelper('ID', booking.id)}
                {trHelper('Start', displayDate(booking.start, false))}
                {trHelper('Slutt', displayDate(booking.end, false))}
                {trHelper('Interne notater', booking.notes)}
                {trHelper('Notater fra leietaker', booking.tenantNotes)}
                {trHelper('Type', booking.type)}
                {booking.user &&
                    trHelper('Leietaker', <Link
                        href={`/users/${booking.user.username}`}
                    >
                        {booking.user.firstname} {booking.user.lastname}
                    </Link>)
                }
                {booking.event &&
                    trHelper('Arrangement', <Link
                        href={`/event/${booking.event.order}/${booking.event.name}`}
                    >
                        {booking.event.name}
                    </Link>)
                }
            </tbody>
        </table>
    </PageWrapper>
}
