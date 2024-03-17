import styles from './page.module.scss'
import readLockers from '@/actions/lockers/read'
import readLockerReservations from '@/actions/lockers/reservations/read'
import LockerTable from './LockerTable'
import prisma from '@/prisma'

export default async function Skapres() {
    
    const lockers = await readLockers()
    if (!lockers.success) {
        throw new Error("Kunne ikke hente skapdata")
    }

    const lockerReservations = await readLockerReservations()
    if (!lockerReservations.success) {
        throw new Error("Kunne ikke hente skapresorvasjoner")
    }

    for (const locker of lockers.data) {
        console.log(locker.LockerReservation)
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.header}>Skapreservasjon</h1>
            <LockerTable lockers={lockers.data}></LockerTable>
        </div>
    )
}