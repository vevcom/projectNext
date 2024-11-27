'use server'
import styles from './page.module.scss'
import BookingPeriodForm from './BookingPeriodForm'
import CabinCalendar from '@/app/_components/cabinCalendar/CabinCalendar'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import PopUp from '@/app/_components/PopUp/PopUp'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readAllBookingPeriodsAction } from '@/actions/cabin'
import { v4 as uuid } from 'uuid'
import { displayDate } from '@/lib/dates/displayDate'


export default async function CabinCalendarPage() {
    const bookingPeriods = unwrapActionReturn(await readAllBookingPeriodsAction(null))
    return <PageWrapper
        title="Heutte Kalender"
    >
        <h4>Ulike release group kan være her kanskje?</h4>

        <CabinCalendar date={new Date()} />

        <PopUp
            PopUpKey="CreateBookingPeriod"
            showButtonContent="Ny Booking Periode"
            showButtonClass={styles.button}
        >
            <BookingPeriodForm />
        </PopUp>

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Startdato</th>
                    <th>Sluttdato</th>
                    <th>Notater</th>
                </tr>
            </thead>
            <tbody>
                {bookingPeriods.map(bookingPeriod => <tr key={uuid()}>
                    <td>{bookingPeriod.type}</td>
                    <td>{displayDate(bookingPeriod.start, false)}</td>
                    <td>{displayDate(bookingPeriod.end, false)}</td>
                    <td>{bookingPeriod.notes}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
