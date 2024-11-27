import CabinCalendar from '@/app/_components/cabinCalendar/CabinCalendar'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import PopUp from '@/app/_components/PopUp/PopUp'
import styles from './page.module.scss'
import BookingPeriodForm from './BookingPeriodForm'


export default function CabinCalendarPage() {
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
    </PageWrapper>
}
