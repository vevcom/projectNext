'use client'
import styles from './page.module.scss'
import ReleasePeriodForm from './ReleasePeriodForm'
import CabinCalendar from '@/app/_components/cabinCalendar/CabinCalendar'
import PopUp from '@/app/_components/PopUp/PopUp'
import { displayDate } from '@/lib/dates/displayDate'
import { v4 as uuid } from 'uuid'
import type { ReleasePeriod } from '@prisma/client'


export default function PageStateWrapper({
    releasePeriods,
}: {
    releasePeriods: ReleasePeriod[],
}) {
    return <>

        <CabinCalendar date={new Date()} bookingPeriods={[]} />

        <PopUp
            PopUpKey="CreateNewReleasePeriod"
            showButtonContent="Ny Slipp Periode"
            showButtonClass={styles.button}
        >
            <ReleasePeriodForm />
        </PopUp>

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Slipptidspunkt</th>
                    <th>Slipp til dato</th>
                </tr>
            </thead>
            <tbody>
                {releasePeriods.map(period => <tr key={uuid()}>
                    <td>{displayDate(period.releaseTime, false)}</td>
                    <td>{displayDate(period.releaseUntil, false)}</td>
                </tr>)}
            </tbody>
        </table>

    </>
}
