'use client'
import styles from './page.module.scss'
import ReleasePeriodForm from './ReleasePeriodForm'
import CabinCalendar from '@/app/_components/cabinCalendar/CabinCalendar'
import PopUp from '@/app/_components/PopUp/PopUp'
import { displayDate } from '@/lib/dates/displayDate'
import { v4 as uuid } from 'uuid'
import type { PricePeriod, ReleasePeriod } from '@prisma/client'
import PricePeriodForm from './PricePeriodForm'


export default function PageStateWrapper({
    releasePeriods,
    pricePeriods,
}: {
    releasePeriods: ReleasePeriod[],
    pricePeriods: PricePeriod[],
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

        <PopUp
            PopUpKey="CreateNewPricePeriod"
            showButtonContent="Ny Pris Periode"
            showButtonClass={styles.button}
        >
            <PricePeriodForm />
        </PopUp>

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Start dato</th>
                </tr>
            </thead>
            <tbody>
                {pricePeriods.map(period => <tr key={uuid()}>
                    <td>{displayDate(period.validFrom, false)}</td>
                </tr>)}
            </tbody>
        </table>

    </>
}
